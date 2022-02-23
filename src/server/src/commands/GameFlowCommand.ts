import { Command } from '@colyseus/command';
import StartBattleCommand from './StartBattleCommand';
import CalculateRequest from './CalculateQueueCommand';
import EndTurnCommand from './EndTurnCommand';
import StartRoundCommand from './StartRoundCommand';
import StartTurnCommand from './StartTurnCommand';
import EndRoundCommand from './EndRoundCommand';
import EndGameCommand from './EndGameCommand';
import { BattleRoom } from '../rooms/BattleRoom';

type Payload = {
}
export default class GameFlowCommand extends Command<BattleRoom, Payload> {
    async execute(data: Payload) {
        //Command to send start-round signal after 5s
        this.room.delayedInterval = this.clock.setTimeout(() => {
            this.room.dispatcher.dispatch(new StartRoundCommand(), {});
        }, 5000);
        this.room.delayedInterval.clear();

        // Calculate request to return queue
        await this.room.dispatcher.dispatch(new CalculateRequest(), {
        });

        //Command to send start-turn signal after 5s
        this.room.delayedInterval = this.clock.setTimeout(() => {
            this.room.dispatcher.dispatch(new StartTurnCommand(), {});
        }, 5000);
        this.room.delayedInterval.clear();

        //Command to send battle result after 15s
        this.room.delayedInterval = this.clock.setTimeout(() => {
            this.room.dispatcher.dispatch(new StartBattleCommand());
        }, 15000);
        this.room.delayedInterval.clear();

        //Command to send end-battle signal after 5s
        this.room.delayedInterval = this.clock.setTimeout(() => {
            this.room.dispatcher.dispatch(new EndTurnCommand(), {});
        }, 5000);
        this.room.delayedInterval.clear();

        //TODO: Check endround condition

        this.room.dispatcher.dispatch(new EndRoundCommand());
        //TODO: Check endgame condition


        this.room.dispatcher.dispatch(new EndGameCommand());
    }
}
