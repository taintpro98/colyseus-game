import { Command } from '@colyseus/command';
import { BattleRoom } from '../rooms/BattleRoom';

type Payload = {
}
export default class StartRoundCommand extends Command<BattleRoom, Payload> {
    async execute(data: Payload) {
        //TODO: Send start turn signal to client
        this.room.broadcast("StartRound", "start-round");
    }
}
