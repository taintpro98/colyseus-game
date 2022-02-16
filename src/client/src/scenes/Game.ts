import Phaser from "phaser";
import Server from "../services/Server";
import IBattleState, { Neko, Skill } from "../../../types/IBattleState";

export default class Game extends Phaser.Scene {
    private server?: Server;
    // private cells: { display: Phaser.GameObjects.Rectangle, value: Cell}[] = [];
    private nekoes: Neko[] = [];
    private skillInformation: { [key: string]: Skill} = {};

    constructor(){
        super('game');
    }

    async create(data: {server: Server}){
        const { server } = data;
        this.server = server;
        if(!this.server) throw new Error('Server instance missing');
        await this.server.join();
        this.server.onceStateChanged(this.createMap, this);
        
    }

    private createMap(state: IBattleState, sessionId: string){
        const { width, height } = this.scale;
        const size = 196;

        let x = width * 0.5 - size;
        let y = height * 0.5 - size;

        const player = state.players[`${sessionId}`];
        this.nekoes = player.nekoes;

        state.board.forEach((cellState, idx) => {
            if(idx > 0 && idx % 3 === 0){
                y += size + 5;
                x = width * 0.5 - size;
            }
            this.add.rectangle(x, y, size, size, 0xffffff);
            if(idx === 1){
                const bossCell = this.add.circle(x, y, 100, 0x0000ff);
                this.add.text(x-80, y, `Boss ${state.bosses[0].name}`);
            }
            if(idx === 4){
                this.add.star(x, y, 10, 10, 80, 0xff0000).setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                    console.log("skillInformation", this.skillInformation);
                    this.server?.sendSkillInformation(this.skillInformation);
                });
            }
            if(idx === 6 || idx === 7 || idx === 8){
                const nekoCell = this.add.circle(x, y, 95, 0xFFC0CB);
                this.add.text(x-80, y, `Neko ${this.nekoes[idx-6].name}`);
                this.addSkills(x, y, this.nekoes[idx-6]);
            }
            
            // this.cells.push({
            //     display: cell,
            //     value: cellState
            // });
            x += size + 5;
        })
        // this.server?.onBoardChanged(this.handleBoardChanged, this);
        this.server?.onQueueChanged(this.addQueue, this);
    }

    private addSkills(x: number, y: number, neko: Neko){
        neko.skills.forEach((value, idx) => {
            this.add.rectangle(x + (2*idx - 1)*60, y + 150, 80, 80, 0x00ff00).setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.pickSkills(neko, value);
                this.add.star(x + (2*idx - 1)*60, y + 150, 4, 4, 30, 0xff0000);
            });
            this.add.text(x + (2*idx - 1)*60 - 30, y+150, `${value.name}`);
        })
    }

    private pickSkills(neko: Neko, skill: Skill){
        this.skillInformation[neko.name] = skill;
    }

    private addQueue(state: IBattleState){
        let x = 900;
        let y = 100;
        state.queue.forEach((action, idx) => {
            console.log("action", action.character_name);
            this.add.rectangle(x, y + idx * 100, 80, 80, 0x00ff00);
            this.add.text(x-35, y + idx * 100, `${action.character_name}`);
        })
    }

    // private createEnemies(boss){
    //     this.add.circle(x, y, 60, 0x0000ff);
    //         this.add.text(x-50, y, "bruno");
    // }

    // private createBoard(state: IBattleState){
    //     const { width, height } = this.scale;
    //     const size = 128;

    //     let x = width * 0.5 - size;
    //     let y = height * 0.5 - size;
    //     state.board.forEach((cellState, idx) => {
    //         console.log("cellState", cellState);
    //         if(idx > 0 && idx % 3 === 0){
    //             y += size + 5;
    //             x = width * 0.5 - size;
    //         }
    //         const cell = this.add.rectangle(x, y, size, size, 0xffffff).setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
    //             this.server?.makeSelection(idx);
    //         });
    //         this.cells.push({
    //             display: cell,
    //             value: cellState
    //         });
    //         x += size + 5;
    //     })
    //     this.server?.onBoardChanged(this.handleBoardChanged, this);
    // }

    // private handleBoardChanged(board: number[]) {
    //     for(let i=0; i<board.length; i++){
    //         const cell = this.cells[i];
    //         if(cell.value !== board[i]){
    //             this.add.star(cell.display.x, cell.display.y, 4, 4, 30, 0xff0000);
    //         }
    //     }
    // }
}