import { Player } from "../../models/Player";
export default interface IPlayerService {
    // getAll(): Promise<Player[]>;
    getPlayerDataById(playerId: number): Promise<Player>;
} 