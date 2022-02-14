import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import IBattleState, { Cell } from '../../../types/IBattleState';
import { BattleRoom } from '../rooms/BattleRoom';

type Payload = {
    client: Client,
    index: number
}

export default class PlayerSelectionCommand extends Command<BattleRoom, Payload> {
    execute(data: Payload){
        const { client, index } = data;
        const clientIndex = this.room.clients.findIndex(c => c.id === client.id);
        const cellValue = clientIndex === 0 ? Cell.X : Cell.O;
        this.room.state.board[index] = cellValue;
    }
}