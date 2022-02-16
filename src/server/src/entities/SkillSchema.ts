import { Schema, type, ArraySchema } from "@colyseus/schema";

export class SkillSchema extends Schema {
    @type("string") name: string = "";
    @type("number") skill_id: number = 0;
    @type("number") type: number = 0;
    @type("number") speed: number = 0;
    @type("string") metadata: string = "";
    constructor(skill_id: number, name: string, type: number, speed: number, metadata: string){
        super();
        this.skill_id = skill_id;
        this.name = name;
        this.type = type;
        this.speed = speed;
        this.metadata = metadata;
    }
}