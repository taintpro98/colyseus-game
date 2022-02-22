import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import { PlayerSchema } from "../entities/PlayerSchema";
import { BossSchema } from "../entities/BossSchema";
import { ActionSchema } from "../entities/ActionSchema";
import { Action } from "../../../types/IBattleState";
export class BattleState extends Schema {
    @type(["number"]) board: ArraySchema<number>;
    @type("number") activePlayer: number = 0;
    @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
    @type([BossSchema]) bosses: ArraySchema<BossSchema> = new ArraySchema();
    @type([ActionSchema]) queue: ArraySchema<ActionSchema>;
    @type("string") sessionId: string = "";

    constructor() {
        super();
        this.board = new ArraySchema(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        );
        this.queue = new ArraySchema();
    }

    addQueue(actions: Action[]) {
        this.queue = new ArraySchema();
        actions.forEach(value => {
            this.queue.push(new ActionSchema(value));
        })
    }
}