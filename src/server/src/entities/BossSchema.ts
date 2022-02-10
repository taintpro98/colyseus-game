import { Schema, type } from "@colyseus/schema";
import { Position } from "./attr/Position";
import { Boss } from "../models/Boss";

export class BossSchema extends Schema {
    @type("string") name: string = "";
    @type(Position) position = new Position();
    @type("number") damage = 0;
    @type("number") blood = 0;

    constructor(boss: Boss){
        super();
        this.name = boss.name;
        this.damage = boss.damage;
        this.blood = boss.blood;
    }
}