import { Scene } from 'phaser'

import cloudImage from '../assets/cloud.png'
import skyImage from '../assets/sky.png'

import config from '../config'

class Scene2 extends Scene {
  constructor () {
    super({
      active: true,
      key: 'Background'
    })
  }

  preload () {
    this.load.image('cloud', cloudImage)
    this.load.image('sky', skyImage)

    this.scene.sendToBack()
  }

  create () {
    this.add.image(400, 300, 'sky')

    this.clouds = this.physics.add.group()

    // A loop to animate our clouds
    this.time.addEvent({
      callback: this.addClouds,
      callbackScope: this,
      delay: 5000,
      loop: true
    })

    // Add initial clouds on startup
    this.addClouds(15, true)
  }

  update (t, dt) {
    // Ensures the clouds that are out the viewport are removed
    this.clouds.children.each(cloud => {
      if (cloud && cloud.x < -cloud.width) {
        cloud.destroy()
      }
    })
  }

  addClouds (amount = 1, randomX = false) {
    for (let i = 0; i < amount; i++) {
      const y = Math.floor(Math.random() * 500)
      const cloud = this.physics.add.sprite(0, y, 'cloud')

      const scale = Math.random() * (0.1 - 0.05) + 0.05
      cloud.setScale(scale, scale)

      const cloudStartX = config.width + (cloud.width * scale)
      const x = randomX ? Math.floor(Math.random() * cloudStartX) : cloudStartX
      cloud.setX(x)

      // Add cloud to clouds group
      this.clouds.add(cloud)

      cloud.setVelocity(-config.weather.windSpeed + (Math.floor(Math.random() * 10)), 0)
      cloud.outOfBoundsKill = true
    }
  }
}

export default Scene2
