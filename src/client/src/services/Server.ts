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
            console.log("state", state);
        });


        // this.room.state.onChange = (changes) => {
        //     console.log("join");
        //     console.log("sdhjfbsfhs");
        //     changes.forEach(change => {
        //         console.log("fuck", change);
        //         const { field, value } = change;
        //         switch(field){
        //             case 'board':
        //                 console.log("value", value);
        //                 this.events.emit('board-changed', value);
        //                 break;
        //         }

        //     })
        // }

        this.room.onStateChange((state) => {
            console.log("New room state:", state.queue[0]);
            this.events.emit('queue-changed', state);
        });

        // this.room.state.queue.onChange = (boss, sessionId) => {
        //     console.log("boss", boss);
        // }

        // this.room.state.board.onChange = (board, sessionId) => {
        //     console.log(this.room?.state.board);
        //     this.events.emit('board-changed', this.room?.state.board);
        // }

        // room.onStateChange((state) => {
        //     console.log(room.name, "has new state:", state);
        // });

        // room.onMessage("action", (message) => {
        //     console.log("received on", room.name, message);
        // });
    }

    // makeSelection(idx: number){
    //     if(!this.room) return;
    //     this.room.send(Message.PlayerSelection, { index: idx});
    // }

    sendSkillInformation(skill_info: { [key: string]: Skill }) {
        if (!this.room) return;
        console.log("sendSkillInformation", skill_info);
        this.room.send(Message.PlayerSelection, { skill_info: skill_info });
    }

    onceStateChanged(cb: (state: IBattleState, sessionId: string) => void, context?: any) {
        this.events.once('once-state-changed', cb, context);
    }

    onQueueChanged(cb: (state: IBattleState) => void, context?: any){
        this.events.on('queue-changed', cb, context);
    }

    onBoardChanged(cb: (board: number[]) => void, context?: any) {
        this.events.on('board-changed', cb, context);
    }
}