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


    onCreate() {
        this.setState(new BattleState());

        this.onMessage(Message.PlayerSelection, (client, message: { skill_info: { [key: string]: Skill} }) => {
            this.dispatcher.dispatch(new PlayerSelectionCommand(), {
                client,
                skill_info: message.skill_info
            });
        });
    }

    async onJoin(client: Client, options: { playerId: number }) {
        const player = new PlayerSchema();
        player.name = `Player ${this.clients.length}`;
        this.state.players.set(client.sessionId, player);

        let boss = await this.bossService.getBossDataById(1);
        this.state.bosses.push(new BossSchema(boss));

    }

    onLeave(client: Client) {
        this.state.players.delete(client.sessionId);
    }
}