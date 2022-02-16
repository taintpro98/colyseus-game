import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import { BattleRoom } from '../rooms/BattleRoom';
import { Skill } from '../../../types/IBattleState';
import { Action } from '../../../types/IBattleState';

type Payload = {
    client: Client,
    skill_info: { [key: string]: Skill }
}

export default class PlayerSelectionCommand extends Command<BattleRoom, Payload> {
    // execute(data: Payload){
    //     const { client, index } = data;
    // const clientIndex = this.room.clients.findIndex(c => c.id === client.id);
    // const cellValue = clientIndex === 0 ? Cell.X : Cell.O;
    // this.room.state.board[index] = cellValue;
    // }
    execute(data: Payload) {
        const { client, skill_info } = data;
        let inter_queue: Action[] = [];
        console.log("skill_info", skill_info);
        for (let key in skill_info) {
            let value = skill_info[key];
            inter_queue.push({
                character_name: key,
                character_type: 1,
                skill_id: value.skill_id,
                speed: value.speed,
                metadata: value.metadata
            });
        }
        this.room.state.bosses.forEach((boss, idx) => {
            console.log("boss", boss);
            inter_queue.push({
                character_name: boss.name,
                character_type: 0,
                skill_id: 0,
                speed: boss.speed,
                metadata: boss.metadata
            });
        })
        inter_queue = inter_queue.sort((obj1, obj2) => {
            if (obj1.speed < obj2.speed) {
                return 1;
            }
            if (obj1.speed > obj2.speed) {
                return -1;
            }
            return 0;
        });
        this.room.state.addQueue(inter_queue);
        console.log("inter_queue", inter_queue);
    }
}