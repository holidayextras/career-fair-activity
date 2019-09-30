import { Scene } from 'phaser'

import { default as retryButton } from '../assets/retry.png'

import config from '../config'

class Scene2 extends Scene {
  constructor () {
    super({
      key: 'Scene2'
    })
  }

  preload () {
    this.load.image('retryButton', retryButton)
    // this.scene.bringToTop()
  }

  create () {
    const retryButton = this.add.image(400, 530, 'retryButton')
    retryButton.setScale(0.4, 0.4)
    retryButton.setDepth(4)
    retryButton.setInteractive()
    retryButton.on('pointerdown', () => {
      this.scene.stop('Scene2')
      this.scene.get('Scene1').startGame(true)
    }, this)

    this.message = this.add.text(100, 175, 'Game Over!', {
      fill: '#542e91',
      font: '100px "HolidayExtrasSans"',
      stroke: '#ffee5f',
      strokeThickness: 8
    })
    this.message.setDepth(4)

    this.scoreMessage = this.add.text(175, 300, `Your score: ${this.scene.get('Scene1').score}`, {
      fill: '#542e91',
      font: '50px "HolidayExtrasSans"',
      stroke: '#ffee5f',
      strokeThickness: 8
    })
    this.scoreMessage.setDepth(4)
    this.scoreMessage.x = config.width / 2 - this.scoreMessage.width / 2
  }
}

export default Scene2
