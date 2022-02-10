import { injectable } from "inversify";
import IPlayerRepository from "./interfaces/IPlayerRepository";
import { db } from "../config/connection/Database";
import { STORED_PROCEDURES } from "../../constants";
import { Player } from "../models/Player";
@injectable()
export default class PlayerRepository implements IPlayerRepository {
    public async getPlayerDataById(playerId: number): Promise<Player> {
        const result = await db.func(
            STORED_PROCEDURES.GET_PLAYER_DATA_BY_ID,
            [playerId]
        );
        const player: Player = {
            id: playerId,
            name: result[0].name,
            email: result[0].email
        };
        return player;
    }
}

// (async () => {
//     let a = new PlayerRepository();
//     let x = await a.getPlayerDataById(1);
//     console.log(x);
// })();