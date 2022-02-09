import { Schema, type } from "@colyseus/schema";
import { Position } from "./attr/Position";

export class Enemy extends Schema {
    @type("string") name: string = "";
    @type(Position) position = new Position();
}