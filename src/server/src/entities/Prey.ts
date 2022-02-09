import { Schema, type } from "@colyseus/schema";
import { Position } from "./attr/Position";

export class Prey extends Schema {
    @type("string") name: string = "";
    @type(Position) position = new Position();
}