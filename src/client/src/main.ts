import Phaser from 'phaser';

import Bootstrap from './scenes/Bootstrap';
import Game from './scenes/Game';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1500,
	height: 2000,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	backgroundColor: '#2d2d2d',
	scene: [Bootstrap, Game]
}

export default new Phaser.Game(config);
