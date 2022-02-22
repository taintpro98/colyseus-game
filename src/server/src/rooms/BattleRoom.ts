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
    maxClients = 2;

    async onCreate() {
        this.setState(new BattleState());
        
        this.onMessage("StartTurn", (client, action: number) => {
            console.log(action);
        });
        this.onMessage("Battle", (client, action: number) => {
            this.broadcast("Battle", "end turn");
        });
        this.onMessage("EndTurn", (client, action: number) => {
            this.broadcast("EndTurn", "end turn");
        });
    }

    async onJoin(client: Client, options: { playerId: number }) {
        // const player = new PlayerSchema();
        // player.name = `Player ${this.clients.length}`;
        // this.state.players.set(client.sessionId, player);
        // this.state.sessionId = client.sessionId;
        await this.broadcast("Ready", "ready");
        setTimeout(() => {
            this.broadcast("StartRound", "start round");
        }, 5000);
        // while(true){
        //     this.broadcast("CalculateQueue", "queue");
        // }
    }

    // onLeave(client: Client) {
    //     this.state.players.delete(client.sessionId);
    // }

    async onLeave(client: Client, consented: boolean) {
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