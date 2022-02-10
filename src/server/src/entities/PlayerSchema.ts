import { Schema, type } from "@colyseus/schema";
import { Position } from "./attr/Position";

export interface PressedKeys {
    x: number;
    y: number;
}

export class PlayerSchema extends Schema {
    @type("string") name: string = "";
    @type(Position) position = new Position();

    pressedKeys: PressedKeys = { x: 0, y: 0 };
}