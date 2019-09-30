import { Scene } from 'phaser'

import { default as startImage } from '../assets/startButton.png'
import { default as titleImage } from '../assets/flightOfTheCoder.png'

class Scene0 extends Scene {
  constructor () {
    super({
      active: true,
      key: 'Scene0'
    })
  }

  preload () {
    this.scene.bringToTop()

    this.load.image("title", titleImage);
    this.load.image("startButton", startImage);
  }

  create () {
    this.title = this.add.image(400, 200, 'title')
    this.title.setDepth(4)
    this.title.setScale(0.5, 0.5)

    this.startButton = this.add.image(400, 530, 'startButton')
    this.startButton.setDepth(4)
    this.startButton.setInteractive()
    this.startButton.setScale(0.4, 0.4)
    this.startButton.on('pointerdown', this.goToNextScene, this)
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
      targets: [this.title, this.startButton]
    })
    
  }
}

export default Scene0
