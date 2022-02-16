import { Schema, type, ArraySchema } from "@colyseus/schema";
import { SkillSchema } from "./SkillSchema";

export class NekoSchema extends Schema {
    @type("string") name: string = "";
    @type("number") damage: number = 3;
    @type("number") blood: number = 100;
    @type([ SkillSchema ]) skills: ArraySchema<SkillSchema>;
    constructor(name: string, damage: number, blood: number){
        super();
        this.name = name;
        this.damage = damage;
        this.blood = blood;
        this.skills = new ArraySchema(
            new SkillSchema(1, "attack", 0, 3, ""),
            new SkillSchema(2, "resume", 1, 4, "")
        );
    }
}