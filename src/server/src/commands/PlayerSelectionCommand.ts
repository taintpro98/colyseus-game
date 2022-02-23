import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import { BattleRoom } from '../rooms/BattleRoom';
import { Skill } from '../../../types/IBattleState';
import { Action } from '../../../types/IBattleState';
import { ActionSchema } from '../entities/ActionSchema';

type Payload = {
    client: Client,
    action: number 
}

export default class PlayerSelectionCommand extends Command<BattleRoom, Payload> {
    async execute(data: Payload) {
        this.room.broadcast("StartTurn", "xxx");
    }
}