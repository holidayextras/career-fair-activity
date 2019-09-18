import { Scene } from 'phaser'

class EndScene extends Scene {
  constructor() {
    super({
      key: "EndScene"
    })
  }

  preload () {
    this.scene.bringToTop()
  }
  
  update () {
  }
  create () {
    this.startButton = this.add.text(100, 100, 'Restart!', {
      fill: '#fff',
      backgroundColor: '#542e91',
      border: '5px solid #65439c',
      font: '40px "HolidayExtrasSans"'
    })
    this.startButton.setDepth(1)
    this.startButton.setInteractive()
    this.startButton.on('pointerdown', () => {
      // this.startButton.setVisible(0)
      const MainScene = this.scene.get('MainScene')
      MainScene.startGame()
    }, this)
  }
}

export default EndScene
