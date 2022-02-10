export default interface IPlayerRepository {
    getAll(): Promise<Player[]>;
    getPlayerDataById(): Promise<Player>;
}