import Phaser, { Game } from 'phaser'

import './styles.css'

// Import our scenes
import Scene0 from './scenes/Scene0'
import Scene1 from './scenes/Scene1'
import Scene2 from './scenes/Scene2'
import Background from './scenes/Background'
import config from './config'

// Configure the game
const game = new Game({
  backgroundColor: '#fddc06',
  height: config.height,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      debug: config.debug
    }
  },
  scene: [
    Scene0,
    Scene1,
    Scene2,
    Background
  ],
  type: Phaser.AUTO,
  width: config.width
})

export default game
