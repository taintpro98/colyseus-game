import "reflect-metadata";
import { Room, Client } from "colyseus";
import { injectable, inject } from "inversify";
import { PlayerSchema } from "../entities/PlayerSchema";
import { BossSchema } from "../entities/BossSchema";
import { BattleState } from "../schemas/BattleState";
import { TYPES } from "../types";
import IPlayerService from "../services/interfaces/IPlayerService";
import IBossService from "../services/interfaces/IBossService";
import { container } from "../inversify.config";
import { Message } from "../../../types/messages";
import { Dispatcher } from "@colyseus/command";
import PlayerSelectionCommand from "../commands/PlayerSelectionCommand";
import { Skill } from "../../../types/IBattleState";
@injectable()
export class BattleRoom extends Room<BattleState> {
    // @inject(TYPES.PlayerService) private playerService!: IPlayerService;
    // @inject(TYPES.BossService) private bossService!: IBossService;
    private dispatcher = new Dispatcher(this);
    private playerService = container.get<IPlayerService>(TYPES.PlayerService);
    private bossService = container.get<IBossService>(TYPES.BossService);
    maxClients = 1;

    async onCreate() {
        this.setState(new BattleState());
        let boss = await this.bossService.getBossDataById(1);
        this.state.bosses.push(new BossSchema(boss));

        this.onMessage(Message.PlayerSelection, (client, message: { skill_info: { [key: string]: Skill} }) => {
            this.dispatcher.dispatch(new PlayerSelectionCommand(), {
                client,
                skill_info: message.skill_info
            });
            this.broadcast("action-taken", this.state);
        });
    }

    onJoin(client: Client, options: { playerId: number }) {
        const player = new PlayerSchema();
        // this.broadcast("action-taken", "onJoinnnnnnn");
        player.name = `Player ${this.clients.length}`;
        this.state.players.set(client.sessionId, player);
        this.state.sessionId = client.sessionId;
    }

    // onLeave(client: Client) {
    //     this.state.players.delete(client.sessionId);
    // }

    async onLeave (client: Client, consented: boolean) {
        // flag client as inactive for other users
        // this.state.players.get(client.sessionId).connected = false;
      
        try {
          if (consented) {
              throw new Error("consented leave");
          }
      
          // allow disconnected client to reconnect into this room until 20 seconds
          await this.allowReconnection(client, 20);
      
          // client returned! let's re-activate it.
        //   this.state.players.get(client.sessionId).connected = true;
      
        } catch (e) {
      
          // 20 seconds expired. let's remove the client.
          this.state.players.delete(client.sessionId);
        }
      }
}