import Phaser from "phaser";
import Server from "../services/Server";
import IBattleState from "../../../types/IBattleState";
import { Cell } from "../../../types/IBattleState";

export default class Game extends Phaser.Scene {
    private server?: Server;
    private cells: { display: Phaser.GameObjects.Rectangle, value: Cell}[] = [];
    constructor(){
        super('game');
    }

    async create(data: {server: Server}){
        const { server } = data;
        this.server = server;
        if(!this.server) throw new Error('Server instance missing');
        await this.server.join();
        this.server.onceStateChanged(this.createBoard, this);
        
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
            const cell = this.add.rectangle(x, y, size, size, 0xffffff).setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.server?.makeSelection(idx);
            });
            this.cells.push({
                display: cell,
                value: cellState
            });
            x += size + 5;
        })
        this.server?.onBoardChanged(this.handleBoardChanged, this);
    }

    private handleBoardChanged(board: number[]) {
        console.log("handleBoardChanged");
        console.log("jasdnasdj", board);
        for(let i=0; i<board.length; i++){
            const cell = this.cells[i];
            console.log("index", i);
            if(cell.value !== board[i]){
                console.log("xxxxxxxxxxxxx");
                this.add.star(cell.display.x, cell.display.y, 4, 4, 30, 0xff0000);
            }
        }
    }
}