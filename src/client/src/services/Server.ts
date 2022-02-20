import { Client, Room } from 'colyseus.js';
import { Schema } from '@colyseus/schema';
import Phaser from 'phaser';
import IBattleState, { Skill } from "../../../types/IBattleState";
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
        this.room.onStateChange.once(state => {
            this.events.emit('once-state-changed', state, this.room?.sessionId);
            console.log("room", this.room?.sessionId);
        });


        // this.room.state.onChange = (changes) => {
        //     console.log("xxxxxxxxxx", changes);
        //     changes.forEach(change => {
        //         const { field, value } = change;
        //         switch(field){
        //             case 'queue':
        //                 this.events.emit('queue-changed', value);
        //                 break;
        //             case 'bosses':
        //                 break;
        //         }
        //     })
        // }

        this.room.onStateChange((state) => {
            this.events.emit('queue-changed', state.queue);
            this.events.emit('blood-changed', state, this.room?.sessionId);
        });

        // this.room.state.queue.onChange = (boss, sessionId) => {
        //     console.log("boss", boss);
        // }

        // this.room.state.board.onChange = (board, sessionId) => {
        //     console.log(this.room?.state.board);
        //     this.events.emit('board-changed', this.room?.state.board);
        // }

        // room.onMessage("action", (message) => {
        //     console.log("received on", room.name, message);
        // });
    }

    // makeSelection(idx: number){
    //     if(!this.room) return;
    //     this.room.send(Message.PlayerSelection, { index: idx});
    // }

    sendSkillInformation(skill_info: { [key: string]: Skill }) {
        console.log("skill_info", skill_info);
        if (!this.room) return;
        this.room.send(Message.PlayerSelection, { skill_info: skill_info });
    }

    onceStateChanged(cb: (state: IBattleState, sessionId: string) => void, context?: any) {
        this.events.once('once-state-changed', cb, context);
    }

    onQueueChanged(cb: (queue: any[]) => void, context?: any){
        this.events.on('queue-changed', cb, context);
    }

    onBoardChanged(cb: (board: number[]) => void, context?: any) {
        this.events.on('board-changed', cb, context);
    }

    onBloodChanged(cb: (state: IBattleState, sessionId: string) => void, context?: any){
        this.events.on('blood-changed', cb, context);
    }
}