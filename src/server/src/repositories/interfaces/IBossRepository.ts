import { Boss } from "../../models/Boss";
export default interface IBossRepository {
    // getAll(): Promise<Player[]>;
    getBossDataById(bossId: number): Promise<Boss>;
}