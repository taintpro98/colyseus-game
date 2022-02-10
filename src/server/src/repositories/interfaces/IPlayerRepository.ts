import { Player } from "../../models/Player";
export default interface IPlayerRepository {
    // getAll(): Promise<Player[]>;
    getPlayerDataById(playerId: number): Promise<Player>;
}