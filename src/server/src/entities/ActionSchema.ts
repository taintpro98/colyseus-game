import { Schema, type, ArraySchema } from "@colyseus/schema";
import { Action } from "../../../types/IBattleState";

export class ActionSchema extends Schema {
    @type("string") character_name: string = "";
    @type("number") character_type: number = 0;
    @type("number") skill_id: number = 0;
    @type("number") speed: number = 0;
    @type("string") metadata: string = "";

    constructor(action: Action){
        super();
        this.character_name = action.character_name;
        this.character_type = action.character_type;
        this.skill_id = action.skill_id;
        this.speed = action.speed;
        this.metadata = action.metadata;
    }
}