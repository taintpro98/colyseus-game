import { Command } from '@colyseus/command';
import { BattleRoom } from '../rooms/BattleRoom';

type Payload = {
}
export default class EndGameCommand extends Command<BattleRoom, number> {
    async execute(data: Payload) {
        this.room.broadcast("EndGame", "end-game");
    }
}
