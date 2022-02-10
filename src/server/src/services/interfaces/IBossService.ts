import { Boss } from "../../models/Boss";
export default interface IBossService {
    // getAll(): Promise<Player[]>;
    getBossDataById(playerId: number): Promise<Boss>;
} 