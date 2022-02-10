
import { injectable, inject } from "inversify";
import "reflect-metadata";

import { TYPES } from "../types";
import IBossService from "./interfaces/IBossService";
import IBossRepository from "../repositories/interfaces/IBossRepository";
import { Boss } from "../models/Boss";

@injectable()
export default class BossService implements IBossService {
    @inject(TYPES.BossRepository) private bossRepository!: IBossRepository;

    public async getBossDataById(bossId: number): Promise<Boss> {
        return await this.bossRepository.getBossDataById(bossId);
    }
}