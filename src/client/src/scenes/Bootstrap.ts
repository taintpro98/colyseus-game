import Server from "../services/Server";
import Phaser from "phaser";

export default class Bootstrap extends Phaser.Scene {
    private server!: Server;

    constructor(){
        super('bootstrap');
    }

    init(){
        this.server = new Server();
    }

    create(){
        this.scene.launch('game', {
            server: this.server
        });
    }
}