import { Scene } from 'phaser'

class StartScene extends Scene {
  constructor() {
    super({
      active: true,
      key: "StartScene"
    })
  }

  preload () {
    this.scene.bringToTop()
  }

  create () {
    this.startButton = this.add.text(100, 100, 'Start!', {
      backgroundColor: '#542e91',
      border: '5px solid #65439c',
      fill: '#fff',
      font: '40px "HolidayExtrasSans"'
    })

    this.startButton.setInteractive()
    this.startButton.on('pointerdown', () => {
      this.scene.pause()
      this.startButton.setVisible(0)
      const MainScene = this.scene.get('MainScene')
      MainScene.startGame()
    }, this)
  }
  
  update () {
  }
  
}

export default StartScene
