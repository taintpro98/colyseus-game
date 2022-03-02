import { roomNekos, enemies } from './../services/mockdata';
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
        this.server.initRoom(this.createMap, this);
    }

    private createMap(map: number[], roomNekos: any, enemies: any){
        const { width, height } = this.scale;
        const size = 196;

        let x = width * 0.5 - size;
        let y = height * 0.2 - size;

        map.forEach((cellState, idx) => {
            if(idx > 0 && idx % 3 === 0){
                y += size + 5;
                x = width * 0.5 - size;
            }
            this.add.rectangle(x, y, size, size, 0xffffff);
            if(idx === 0 || idx === 1 || idx === 2){
                const bossCell = this.add.circle(x, y, 85, 0x0000ff);
                this.add.text(x-80, y, `Boss ${enemies[idx].name}`);
                this.add.text(x-80, y+20, `Boss blood: ${enemies[idx].metadata["health"]}`);
            }
            if(idx === 4){
                this.add.star(x, y, 10, 10, 80, 0xff0000).setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                    this.server?.sendSkillInformation(this.skillInformation);
                });
            }
            if(idx === 6 || idx === 7 || idx === 8){
                const nekoCell = this.add.circle(x, y, 85, 0xFFC0CB);
                this.add.text(x-80, y, `Neko ${roomNekos[idx-6].name}`);
                this.add.text(x-80, y+20, `Neko blood: ${roomNekos[idx-6].metadata["health"]}`);
                this.addSkills(x, y, roomNekos[idx-6]);
                this.addItems(x, y, roomNekos[idx-6]);
            }
            x += size + 5;
        })
        // this.server?.onBoardChanged(this.handleBoardChanged, this);
        this.server?.onQueueChanged(this.addQueue, this);
        this.server?.onBloodChanged(this.updateBlood, this);
    }

    private addSkills(x: number, y: number, neko: Neko){
        neko.skills.forEach((value, idx) => {
            this.add.rectangle(x - 60, y + 85*(idx+1) + 55, 80, 80, 0x00ff00).setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.pickSkills(neko, value);
                this.add.star(x - 60, y + 85*(idx+1) + 55, 4, 4, 30, 0xff0000);
            });
            this.add.text(x - 90, y + 85*(idx+1) + 55, `${value.name}`);
        })
    }

    private addItems(x: number, y: number, neko: Neko){
        neko.skills.forEach((value, idx) => {
            this.add.rectangle(x + 60, y + 85*(idx+1) + 55, 80, 80, 0xa020f0).setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.pickSkills(neko, value);
                this.add.star(x + 60, y + 85*(idx+1) + 55, 4, 4, 30, 0xff0000);
            });
            this.add.text(x + 30, y + 85*(idx+1) + 55, `xxx`);
        })
    }

    private pickSkills(neko: Neko, skill: Skill){
        this.skillInformation[neko.name] = skill;
    }

    private addQueue(queue: any[]){
        let x = 300;
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
}