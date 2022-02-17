import { Schema, type } from "@colyseus/schema";
import { Position } from "./attr/Position";
import { Boss } from "../models/Boss";

export class BossSchema extends Schema {
    @type("string") name: string = "";
    // @type(Position) position = new Position();
    @type("number") damage = 0;
    @type("number") blood = 0;
    @type("number") speed = 0;
    @type("string") metadata = `{"damage":3,"blood":-1}`;

    constructor(boss: Boss){
        super();
        this.name = boss.name;
        this.damage = boss.damage;
        this.blood = boss.blood;
        this.speed = boss.speed;
    }
}