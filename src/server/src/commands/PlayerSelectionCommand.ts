import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import { BattleRoom } from '../rooms/BattleRoom';
import { Skill } from '../../../types/IBattleState';
import { Action } from '../../../types/IBattleState';
import { ActionSchema } from '../entities/ActionSchema';

type Payload = {
    client: Client,
    skill_info: { [key: string]: Skill }
}

export default class PlayerSelectionCommand extends Command<BattleRoom, Payload> {
    async execute(data: Payload) {
        const { client, skill_info } = data;
        let inter_queue: Action[] = [];
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
        await this.room.state.addQueue(inter_queue);
        this.runBattlePhase();
    }

    runBattlePhase(){
        this.room.state.queue.forEach((value, idx) => {
            if(value.character_type === 0) this.runBossSkill(value);
            else this.runNekoSkill(value);
        })
    }

    runBossSkill(action: ActionSchema){
        let metaskill = JSON.parse(action.metadata);
        this.room.state.bosses[0].blood += metaskill.blood;
        let target_index = Math.floor(Math.random() * 3);
        let target = this.room.state.players.get(this.room.state.sessionId)?.nekoes[target_index];
        if(target){
            target.blood = target.blood - this.room.state.bosses[0].damage - metaskill.damage; 
        }        
    }

    runNekoSkill(action: ActionSchema){
        let metaskill = JSON.parse(action.metadata);
        let neko = this.room.state.players.get(this.room.state.sessionId)?.nekoes.filter((value, idx) => {
            return value.name === action.character_name
        })[0];
        let target = this.room.state.bosses[0];
        target.blood = target.blood - neko.damage - metaskill.damage;
    }
}