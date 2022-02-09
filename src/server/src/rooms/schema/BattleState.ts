import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import IBattleState from "../../../../types/IBattleState";
import { Player } from "../../entities/Player";

export class BattleState extends Schema implements IBattleState {
    @type(["number"]) board: ArraySchema<number>;
    @type("number") activePlayer: number = 0;
    @type({ map: Player }) players = new MapSchema<Player>();

    constructor() {
        super();
        this.board = new ArraySchema(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
    }
}