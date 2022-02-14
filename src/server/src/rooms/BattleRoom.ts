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
@injectable()
export class BattleRoom extends Room<BattleState> {
    // @inject(TYPES.PlayerService) private playerService!: IPlayerService;
    // @inject(TYPES.BossService) private bossService!: IBossService;
    private dispatcher = new Dispatcher(this);
    private playerService = container.get<IPlayerService>(TYPES.PlayerService);
    private bossService = container.get<IBossService>(TYPES.BossService);


    onCreate() {
        this.setState(new BattleState());

        this.onMessage(Message.PlayerSelection, (client, message: { index: number }) => {
            this.dispatcher.dispatch(new PlayerSelectionCommand(), {
                client,
                index: message.index
            });
        });
    }

    async onJoin(client: Client, options: { playerId: number }) {
        const player = new PlayerSchema();
        let boss = await this.bossService.getBossDataById(1);
        player.name = `Player ${this.clients.length}`;
        player.position.x = Math.random();
        player.position.y = Math.random();

        this.state.players.set(client.sessionId, player);
        this.state.bosses.set("", new BossSchema(boss));
        // console.log("sessionId", client.sessionId);
        // console.log("id", client.id);
        // console.log("playerName", options.playerName);
    }

    onLeave(client: Client) {
        this.state.players.delete(client.sessionId);
    }
}