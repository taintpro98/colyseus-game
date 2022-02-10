
import { injectable, inject } from "inversify";
import "reflect-metadata";

import { TYPES } from "../types";
import IPlayerService from "./interfaces/IPlayerService";
import IPlayerRepository from "../repositories/interfaces/IPlayerRepository";
import { Player } from "../models/Player";
@injectable()
export default class PlayerService implements IPlayerService {
    @inject(TYPES.PlayerRepository) private playerRepository!: IPlayerRepository;

    public async getPlayerDataById(playerId: number): Promise<Player> {
        return await this.playerRepository.getPlayerDataById(playerId);
    }
}