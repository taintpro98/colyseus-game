import "reflect-metadata";
import { Room, Client, Delayed } from "colyseus";
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
import StartTurnCommand from "../commands/StartTurnCommand";
import StartBattleCommand from "../commands/StartBattleCommand";
import EndTurnCommand from "../commands/EndTurnCommand";
import InitializeMapCommand from "../commands/InitializeMapCommand";
import PlayerJoinCommand from "../commands/PlayerJoinCommand";
import GameFlowCommand from "../commands/GameFlowCommand";

@injectable()
export class BattleRoom extends Room<BattleState> {
    // @inject(TYPES.PlayerService) private playerService!: IPlayerService;
    // @inject(TYPES.BossService) private bossService!: IBossService;
    // private playerService = container.get<IPlayerService>(TYPES.PlayerService);
    // private bossService = container.get<IBossService>(TYPES.BossService);
    maxClients = 1;
    public delayedInterval!: Delayed;
    public dispatcher = new Dispatcher(this);

    async onCreate() {
        this.clock.start();
        this.setState(new BattleState());

        this.onMessage("StartTurn", async (client: Client,) => {
            this.delayedInterval.clear();
            this.dispatcher.dispatch(new StartTurnCommand(), {});
        });

        this.onMessage("Battle", async (client: Client, action: number) => {
            this.delayedInterval.clear();
            this.dispatcher.dispatch(new StartBattleCommand(), action);
        });

        this.onMessage("EndTurn", async (client: Client,) => {
            this.delayedInterval.clear();
            this.dispatcher.dispatch(new EndTurnCommand(), {});
        });
    }

    async onJoin(client: Client) {
        // console.log("init map");
        // await this.broadcast("Ready", "ready");
        // setTimeout(() => {
        //     this.broadcast("StartRound", "start round");
        //     let x = false;
        //     while (x) {
        //         this.broadcast("CalculateQueue", "queue");
        //     }
        // }, 5000);
        await this.dispatcher.dispatch(new InitializeMapCommand(), {});
        await this.dispatcher.dispatch(new PlayerJoinCommand(), {
            client,
        });
        await this.dispatcher.dispatch(new GameFlowCommand(), {});

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

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}