import { Scene } from 'phaser'

import { default as hotAirBalloon } from '../assets/hotAirBalloon.png'
import { default as hotelImage } from '../assets/hotel.png'
import { default as planeImage } from '../assets/plane.png'

import config from '../config'

class Scene1 extends Scene {
  constructor () {
    super({
      active: true,
      key: "Scene1"
    })
  }

  preload () {
    this.load.image('hotel', hotelImage)

    if (config.vehicle.type === 'balloon') {
      this.load.image('balloon', hotAirBalloon)
    } else {
      this.load.image('plane', planeImage)
    }
  }

  create () {
    this.physics.world.checkCollision.down = false

    this.spaceKey = this.input.keyboard.addKey('SPACE')

    // Group to add our assets to in order to move them
    this.buildings = this.physics.add.group()

    // Can only be "balloon" or "plane", but default to "balloon"
    const vehicleTypeFailSafe = ['plane', 'balloon'].includes(config.vehicle.type) ? config.vehicle.type : 'balloon'
    this.vehicle = this.physics.add.sprite(10, 10, vehicleTypeFailSafe);
    this.vehicle.setCollideWorldBounds(true)
    this.vehicle.setDepth(2)
    this.vehicle.setPosition(config.width / 2, config.height / 2)
    this.vehicle.type = vehicleTypeFailSafe
    
    if (this.vehicle.type === 'balloon') {
      // Make balloon sway
      this.tweens.add({
        angle: {
          from: 12,
          to: 2
        },
        duration: 2000,
        ease: 'Sine.easeInOut',
        repeat: -1,
        targets: this.vehicle,
        yoyo: true
      })
    }

    this.tweens.add({
      duration: 2000,
      ease: 'Sine.easeInOut',
      repeat: -1,
      targets: this.vehicle,
      y: '+=30',
      yoyo: true
    })

    // To display our score
    this.labelScore = this.add.text(20, 20, 'Score: 0', {
      font: '32px "HolidayExtrasSans"',
      fill: 'purple',
      backgroundColor: '#fddc06'
    })
    this.labelScore.setDepth(3)
    this.labelScore.setVisible(false)
    this.labelScore.setX(30)

    // To display the level the player is in
    this.levelMessage = this.add.text(100, 175, '', {
      fill: '#542e91',
      font: '100px "HolidayExtrasSans"',
      stroke: '#ffee5f',
      strokeThickness: 8
    })   
    this.levelMessage.setDepth(4)
  }

  startGame (restart = false) {

    // Reset variables
    this.buildingsAddedToScreen = 0
    this.buildingsPassed = 0
    this.buildingsSecondsApart = 0
    this.level = 1
    this.score = 0
    this.speed = config.buildings.speed * 10

    this.labelScore.setVisible(true)

    this.spaceKey.enabled = true

    // Reset vehicle
    if (restart) {
      this.vehicle.setPosition(config.width / 2, config.height / 2)
    }
    this.vehicle.alive = true 
    this.vehicle.setGravity(0, config.vehicle.gravity)
    this.vehicle.setVisible(true)

    // Stop 'yoyotween'
    const tweens = this.tweens.getAllTweens()
    // Last one, not always 1
    const TweenToStop = tweens[tweens.length - 1]
    if (TweenToStop) {
      TweenToStop.stop()
    }

    // Add event to add buildings
    this.addBuildingTimer = this.time.addEvent({
      callback: this.addBuildings,
      callbackScope: this,
      delay: (config.buildings.secondsApart * 1000),
      loop: true
    })

    // Add the first buildings
    this.addBuildings()

    this.scene.resume()
  }

  gameOver () {
    this.vehicle.alive = false
    this.vehicle.setVisible(false)

    this.labelScore.setVisible(false)
    
    // Remove all buildings still present
    this.buildings.clear(true, true)

    this.time.removeAllEvents()
    
    // Pause this scene, so we can easily restart it.
    this.scene.pause()

    // Move to 'game over' scene
    const endScene = this.scene.get('Scene2')
    endScene.scene.start('Scene2')
  }

  update (t, dt) {

    // Ensures the buildings that our out the viewport are removed
    this.buildings.children.each(building => {
      if (building && building.x < -building.width) {
        building.destroy()
      }
    })

    // Update score text
    this.labelScore.setText(`Score: ${this.score}`)

    // Passed all buildings?
    if (this.buildingsPassed === config.buildings.amountPerLevel && this.buildings.children.size === 0) {
      this.buildingsAddedToScreen = 0
      this.buildingsPassed = 0
      this.speed += config.buildings.speedIncrease * 10
      this.buildingsSecondsApart += config.buildings.secondsApartIncrease

      this.addBuildingTimer.paused = true
      this.changeLevel()
    }

    // Fallen below the screen, you're game over!
    if (this.vehicle.body.y > config.height) {
      return this.gameOver()
    }

    const pointer = this.input.activePointer
    const dir = this.vehicle.body.velocity;
    const step = dt * 0.001 * 2; // convert to sec
    const targetRotation = dir.angle();

    // Make the vehicle float up
    if (this.spaceKey.isDown || pointer.isDown) {
      this.vehicle.setVelocity(0, -config.vehicle.gravityDecreaseAmount)

      // If we are a plane, point the nose upwards
      if (this.vehicle.type === 'plane') {
        this.vehicle.body.rotation = Phaser.Math.Linear(this.vehicle.body.rotation, -targetRotation, step)
      }
    } else {
      if (this.vehicle.type === 'plane' && dir.y > 0) {
        this.vehicle.body.rotation = Phaser.Math.Linear(this.vehicle.body.rotation, targetRotation, step)
      }
    }
  }

  addBuilding (x, y, top = false) {
    const building = this.physics.add.sprite(0, y, 'hotel')

    building.setX(building.width + x)

    this.buildings.add(building)

    building.setVelocity(-this.speed, 0)
    building.body.immovable = true
    building.setDepth(1)
    if (top) {

      // Flip the hotel upside down
      building.setFlipY(true)
    
      // Add an invisible layer so we can increase the score
      const rect = this.add.rectangle(x + building.width, 0, 1, this.sys.game.config.height, 0, config.debug ? 1 : 0)
      rect.setOrigin(0, 0)
      const empty = this.physics.add.existing(rect)
      empty.body.moves = true
      empty.body.setVelocity(-this.speed, 0)
      
      this.physics.add.overlap(this.vehicle, empty, this.increaseScore, null, this)
    }

    this.physics.add.collider(this.vehicle, building, this.gameOver, null, this)
  }

  addBuildings () {
    if (this.buildingsAddedToScreen >= config.buildings.amountPerLevel) return

    const minY = -25

    // Vertical gap between the buildings
    const gap = 245

    const y = Math.floor(Math.random() * 150) + minY
    const y2 = y + 267 + gap

    this.addBuilding(config.width, y, true)
    this.addBuilding(config.width, y2)

    this.buildingsAddedToScreen += 1
  }

  increaseScore (_, rectangle) {
    rectangle.destroy()
    this.score += config.scoreIncrease
    this.buildingsPassed++
  }

  changeLevel () {
    if (this.vehicle.alive !== true) return
    
    // Increase the level and display on screen
    this.level++
    this.levelMessage.setText(`Level ${this.level}`)
    this.levelMessage.setVisible(true)
    this.levelMessage.x = config.width / 2 - this.levelMessage.width / 2

    // Remove the message
    this.time.addEvent({
      delay: 1000,
      callback: () => this.levelMessage.setVisible(false)
    })

    this.addBuildingTimer.delay = this.buildingsSecondsApart * 1000
    this.addBuildingTimer.paused = false
  }
}

export default Scene1
