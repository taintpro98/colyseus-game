import { Client } from 'colyseus.js';
import Phaser from 'phaser';
import IBattleState from "../../../types/IBattleState";

export default class Server {
    private client: Client;
    private events: Phaser.Events.EventEmitter;

    constructor() {
        this.client = new Client('ws://localhost:2567');
        this.events = new Phaser.Events.EventEmitter;
    }

    async join() {
        const room = await this.client.joinOrCreate<IBattleState>('game', {
            playerName: "bruno"
        });

        console.log(room.state);
        room.onStateChange.once(state => {
            this.events.emit('once-state-changed', state);
        });

        // room.onMessage("action", (message) => {
        //     console.log("received on", room.name, message);
        // });
    }

    onceStateChanged(cb: (state: IBattleState) => void, context?: any) {
        this.events.once('once-state-changed', cb, context);
    }
}