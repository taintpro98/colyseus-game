import "reflect-metadata";
import { Room, Client } from "colyseus";
import { injectable, inject } from "inversify";
import { PlayerSchema } from "../entities/PlayerSchema";
import { BattleState } from "../schemas/BattleState";
import { TYPES } from "../types";
import IPlayerService from "../services/interfaces/IPlayerService";
import IBossService from "../services/interfaces/IBossService";
import { container } from "../inversify.config";
@injectable()
export class BattleRoom extends Room<BattleState> {
    // @inject(TYPES.PlayerService) private playerService!: IPlayerService;
    // @inject(TYPES.BossService) private bossService!: IBossService;
    private playerService = container.get<IPlayerService>(TYPES.PlayerService);
    private bossService = container.get<IBossService>(TYPES.BossService);


    async onCreate() {
        let boss = await this.bossService.getBossDataById(1);
        this.setState(new BattleState(boss));

        this.onMessage("action", (client, message) => {
            console.log("dammmmmm");
            console.log(client.sessionId, "sent 'action' message: ", message);
        });
    }

    onJoin(client: Client, options: { playerId: number }) {
        const player = new PlayerSchema();
        player.name = `Player ${this.clients.length}`;
        player.position.x = Math.random();
        player.position.y = Math.random();

        this.state.players.set(client.sessionId, player);
        // console.log("sessionId", client.sessionId);
        // console.log("id", client.id);
        // console.log("playerName", options.playerName);
    }

    onLeave(client: Client) {
        this.state.players.delete(client.sessionId);
    }
}