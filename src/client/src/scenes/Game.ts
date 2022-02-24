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
        console.log("this scale", this.scale.width);
        const size = 169;

        console.log("this is what", this);

        let x = width * 0.5 - size;
        let y = height * 0.2 - size;

        const player = state.players[`${sessionId}`];
        this.nekoes = player.nekoes;

        state.board.forEach((cellState, idx) => {
            if(idx > 0 && idx % 3 === 0){
                y += size + 5;
                x = width * 0.5 - size;
            }
            this.add.rectangle(x, y, size, size, 0xffffff);
            if(idx === 1){
                const bossCell = this.add.circle(x, y, 85, 0x0000ff);
                this.add.text(x-80, y, `Boss ${state.bosses[0].name}`);
                this.add.text(x-80, y+20, `Boss blood: ${state.bosses[0].blood}`);
            }
            if(idx === 4){
                this.add.star(x, y, 10, 10, 80, 0xff0000).setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                    this.server?.sendSkillInformation(this.skillInformation);
                });
            }
            if(idx === 6 || idx === 7 || idx === 8){
                const nekoCell = this.add.circle(x, y, 85, 0xFFC0CB);
                this.add.text(x-80, y, `Neko ${this.nekoes[idx-6].name}`);
                this.add.text(x-80, y+20, `Neko blood: ${this.nekoes[idx-6].blood}`);
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
        this.server?.onBloodChanged(this.updateBlood, this);
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

    private addQueue(queue: any[]){
        let x = 900;
        let y = 100;
        queue.forEach((action, idx) => {
            this.add.rectangle(x, y + idx * 100, 80, 80, 0x00ff00);
            this.add.text(x-35, y + idx * 100, `${action.character_name}`);
        })
    }

    private updateBlood(state: IBattleState, sessionId: string){
        console.log("boss", state.bosses[0].blood);
        console.log("neko 1", state.players[sessionId].nekoes[0].blood);
        console.log("neko 2", state.players[sessionId].nekoes[1].blood);
        console.log("neko 3", state.players[sessionId].nekoes[2].blood);
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