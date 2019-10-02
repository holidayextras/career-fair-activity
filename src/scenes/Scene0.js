import { Scene } from 'phaser'

import startImage from '../assets/startButton.png'
import titleImage from '../assets/flightOfTheCoder.png'

import config from '../config'

class Scene0 extends Scene {
  constructor () {
    super({
      active: true,
      key: 'Scene0'
    })
  }

  preload () {
    this.scene.bringToTop()

    this.load.image('title', titleImage)
    this.load.image('startButton', startImage)
  }

  create () {
    this.title = this.add.image(400, 200, 'title')
    this.title.setDepth(4)
    this.title.setInteractive()
    this.title.setScale(0.5, 0.5)
    this.title.on('pointerdown', this.doSomeMagic, this)

    this.startButton = this.add.image(400, 530, 'startButton')
    this.startButton.setDepth(4)
    this.startButton.setInteractive()
    this.startButton.setScale(0.4, 0.4)
    this.startButton.on('pointerdown', this.goToNextScene, this)

    this.information = this.add.text(0, 570, `Hit Start and use the SPACEBAR or a click of the mouse to make your ${config.vehicle.type} fly.`, {
      align: 'center',
      fill: config.text.colour,
      font: '16px "HolidayExtrasSans"',
      stroke: config.text.strokeColour,
      strokeThickness: 4
    })
    this.information.setX((config.width - this.information.width) / 2)
    this.information.setDepth(5)
  }

  goToNextScene () {
    this.startButton.off('pointerdown', this.goToNextScene, this)
    this.add.tween({
      alpha: {
        from: 1,
        to: 0
      },
      duration: 1000,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.scene.stop('Scene0')
        this.scene.get('Scene1').startGame()
      },
      targets: [this.title, this.startButton, this.information]
    })
  }

  doSomeMagic () {
    if (!this.game.magic) this.game.magic = 0
    this.game.magic++

    if (this.game.magic >= 5) {
      this.game.somethingMagic = true
      this.game.magic = 0
      this.title.off('pointerdown')
      this.add.tween({
        alpha: {
          from: 1,
          to: 0
        },
        duration: 500,
        ease: 'Sine.easeInOut',
        repeat: 2,
        targets: this.title,
        yoyo: true
      })
    }
  }
}

export default Scene0
