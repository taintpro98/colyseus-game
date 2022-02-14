import { Client, Room } from 'colyseus.js';
import { Schema } from '@colyseus/schema';
import Phaser from 'phaser';
import IBattleState from "../../../types/IBattleState";
import { Message } from "../../../types/messages";

export default class Server {
    private client: Client;
    private room?: Room;
    // private room?: Room<IBattleState & Schema>;
    private events: Phaser.Events.EventEmitter;

    constructor() {
        this.client = new Client('ws://localhost:2567');
        this.events = new Phaser.Events.EventEmitter;
    }

    async join() {
        this.room = await this.client.joinOrCreate<IBattleState & Schema>('game', {
            playerId: 1
        });
        // console.log("state", room.state.bosses);

        this.room.onStateChange.once(state => {
            this.events.emit('once-state-changed', state);
        });
        

        // this.room.state.onChange = (changes) => {
        //     console.log("join");
        //     console.log("sdhjfbsfhs");
        //     changes.forEach(change => {
        //         console.log(change);
        //     })
        // }

        this.room.onStateChange((state) => {
            // console.log("New room state:", state.toJSON());
        });

        this.room.state.board.onChange = (board, sessionId) => {
            this.events.emit('board-changed', board);
        }

        // room.onStateChange((state) => {
        //     console.log(room.name, "has new state:", state);
        // });

        // room.onMessage("action", (message) => {
        //     console.log("received on", room.name, message);
        // });
    }

    makeSelection(idx: number){
        if(!this.room) return;
        this.room.send(Message.PlayerSelection, { index: idx});
    }

    onceStateChanged(cb: (state: IBattleState) => void, context?: any) {
        this.events.once('once-state-changed', cb, context);
    }

    onBoardChanged(cb: (board: number[]) => void, context?: any){
        this.events.on('board-changed', cb, context);
    }
}