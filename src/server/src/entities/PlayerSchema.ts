import { Schema, type, ArraySchema } from "@colyseus/schema";
import { NekoSchema } from "./NekoSchema";

export interface PressedKeys {
    x: number;
    y: number;
}

export class PlayerSchema extends Schema {
    @type("string") name: string = "";
    @type([ NekoSchema ]) nekoes: ArraySchema<NekoSchema>;

    pressedKeys: PressedKeys = { x: 0, y: 0 };
    constructor(){
        super();
        this.nekoes = new ArraySchema(
            new NekoSchema("pikachu", 4, 90),
            new NekoSchema("doraemon", 3, 80),
            new NekoSchema("optimus", 6, 95)
        )
    }
}