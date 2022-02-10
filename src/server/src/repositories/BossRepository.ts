import { injectable } from "inversify";
import IBossRepository from "./interfaces/IBossRepository";
import { db } from "../config/connection/Database";
import { STORED_PROCEDURES } from "../../constants";
import { Boss } from "../models/Boss";

@injectable()
export default class BossRepository implements IBossRepository {
    public async getBossDataById(bossId: number): Promise<Boss> {
        const result = await db.func(
            STORED_PROCEDURES.GET_BOSS_DATA_BY_ID,
            [bossId]
        );
        const boss: Boss = {
            id: bossId,
            name: result[0].name,
            damage: result[0].damage,
            blood: result[0].blood
        };
        return boss;
    }
}