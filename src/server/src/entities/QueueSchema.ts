import { Schema, type, ArraySchema } from "@colyseus/schema";
import { NekoSchema } from "./NekoSchema";
import { Action } from "../../../types/IBattleState";

export class QueueSchema extends Schema {
    // @type([ "" ]) queue: ArraySchema<Action> = new ArraySchema<Action>();
    constructor(){
        super();
    }
}