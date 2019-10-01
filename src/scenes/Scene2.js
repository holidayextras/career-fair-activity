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
  }

  create () {
    const retryButton = this.add.image(400, 530, 'retryButton')
    retryButton.setScale(0.4, 0.4)
    retryButton.setDepth(4)
    retryButton.setInteractive()
    retryButton.on('pointerdown', () => {
      this.scene.stop()
      this.scene.resume('Scene1')
      this.scene.get('Scene1').startGame(true)
    }, this)

    this.message = this.add.text(0, 175, 'Game Over!', {
      fill: '#542e91',
      font: '100px "HolidayExtrasSans"',
      stroke: '#ffee5f',
      strokeThickness: 8
    })
    this.message.setDepth(4)
    this.message.setX((config.width - this.message.width) / 2)

    this.scoreMessage = this.add.text(0, 300, `Your score: ${this.scene.get('Scene1').score}`, {
      fill: '#542e91',
      font: '50px "HolidayExtrasSans"',
      stroke: '#ffee5f',
      strokeThickness: 8
    })
    this.scoreMessage.setDepth(4)
    this.scoreMessage.setX((config.width - this.scoreMessage.width) / 2)
    this.time.addEvent({
      delay: 10000,
      callback: () => this.refresh()
    })
  }

  refresh () {
    document.location.reload();
  }
}

export default Scene2
