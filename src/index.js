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
  backgroundColor: '#ff9a01',
  dom: {
    createContainer: true
  },
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

// Prepopulate if we have no scores
if (window && window.localStorage && !window.localStorage.getItem('scores')) {
  const names = ['Will', 'Thomas', 'Cem', 'Billie', 'HOLIDAYEXT']
  const fakeScores = names.map((name, i) => ({
    baseScore: config.scoreIncrease,
    name,
    score: Math.floor(Math.random() * 30),
    timeStamp: new Date().getTime() + i
  })).sort((a, b) => {
    if (a.score > b.score) return -1
    if (a.score < b.score) return 1
    if (a.timeStamp > b.timeStamp) return -1
    if (a.timeStamp < b.timeStamp) return 1
    return 0
  })
  window.localStorage.setItem('scores', JSON.stringify(fakeScores))
}

export default game
