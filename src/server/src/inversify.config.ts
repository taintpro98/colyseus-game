
   
import { Container } from "inversify";
import { TYPES } from "./types";

//player
import IPlayerService from "./services/interfaces/IPlayerService";
import PlayerService from "./services/PlayerService";

import IPlayerRepository from "./repositories/interfaces/IPlayerRepository";
import PlayerRepository from "./repositories/PlayerRepository";

//boss
import IBossService from "./services/interfaces/IBossService";
import BossService from "./services/BossService";

import IBossRepository from "./repositories/interfaces/IBossRepository";
import BossRepository from "./repositories/BossRepository";

const container = new Container();

container.bind<IPlayerService>(TYPES.PlayerService).to(PlayerService);
container.bind<IPlayerRepository>(TYPES.PlayerRepository).to(PlayerRepository);

container.bind<IBossService>(TYPES.BossService).to(BossService);
container.bind<IBossRepository>(TYPES.BossRepository).to(BossRepository);

export { container };