import Phaser from "phaser";
import Server from "../services/Server";
import IBattleState from "../../../types/IBattleState";

export default class Game extends Phaser.Scene {
    constructor(){
        super('game');
    }

    async create(data: {server: Server}){
        const { server } = data;
        await server.join();
        server.onceStateChanged(this.createBoard, this);
    }

    private createBoard(state: IBattleState){
        const { width, height } = this.scale;
        const size = 128;

        let x = width * 0.5 - size;
        let y = height * 0.5 - size;
        state.board.forEach((cellState, idx) => {
            if(idx > 0 && idx % 3 === 0){
                y += size + 5;
                x = width * 0.5 - size;
            }
            this.add.rectangle(x, y, size, size, 0xffffff);
            x += size + 5;
        })
    }
}