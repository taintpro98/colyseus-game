import { Command } from '@colyseus/command';
import { BattleRoom } from '../rooms/BattleRoom';

type Payload = {
}
export default class EndRoundCommand extends Command<BattleRoom, number> {
    async execute(data: Payload) {
        this.room.broadcast("EndRound", "end-round");

    }
}
