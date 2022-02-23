import { Command } from '@colyseus/command';
import { BattleRoom } from '../rooms/BattleRoom';

type Payload = {
}
export default class EndTurnCommand extends Command<BattleRoom, Payload> {
    async execute(data: Payload) {
        //TODO: Send start turn signal to client
        this.room.broadcast("EndTurn", "end-turn");
    }
}
