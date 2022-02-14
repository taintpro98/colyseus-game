import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import { PlayerSchema } from "../entities/PlayerSchema";
import { BossSchema } from "../entities/BossSchema";
import IBattleState, { Cell } from "../../../types/IBattleState";
import { Boss } from "../models/Boss";
export class BattleState extends Schema implements IBattleState {
    @type(["number"]) board: ArraySchema<number>;
    @type("number") activePlayer: number = 0;
    @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
    @type({ map: BossSchema }) bosses = new MapSchema<BossSchema>();
    @type("number") turn: number = 0;

    constructor() {
        super();
        this.board = new ArraySchema(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        );
        // this.bosses.set("", new BossSchema(boss));
    }
}