import { Game } from 'phaser'

import './styles.css'

// Import our scenes

import MainScene from './scenes/MainScene'
import EndScene from './scenes/EndScene'
import StartScene from './scenes/StartScene'

import config from './config'

const game = new Game({
  type: Phaser.AUTO,
  width: config.width,
  height: config.height,
  backgroundColor: '#222222',
  parent: 'app',
  scene: [  
    StartScene,
    MainScene,
    EndScene,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: config.debug
    }
  }
})
