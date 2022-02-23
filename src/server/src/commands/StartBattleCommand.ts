import { Command } from '@colyseus/command';
import { BattleRoom } from '../rooms/BattleRoom';

type Payload = {
}
export default class StartBattleCommand extends Command<BattleRoom, number> {


    async execute(data: Payload) {
        //TODO: Send start turn signal to client
        this.room.broadcast("Battle", "battle");

    }
}
