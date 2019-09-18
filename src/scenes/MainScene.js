import { Scene } from 'phaser'

import { default as hotAirBalloon } from '../assets/hot-air-balloon.png'
import { default as skyImage } from '../assets/sky.png'
import { default as cloudImage } from '../assets/cloud.png'
import { default as hotelImage } from '../assets/hotel.png'
import { default as jumpSound } from '../assets/jump.wav'

import config from '../config'

class MainScene extends Scene {

  constructor() {
    super({
      active: true,
      key: "MainScene"
    })
  }
  
  preload () {
    this.load.image('balloon', hotAirBalloon)
    this.load.image('cloud', cloudImage)
    this.load.image('hotel', hotelImage)
    this.load.image('sky', skyImage)

    this.load.audio('jump', jumpSound)
  }

  create () {

    const { width: sceneWidth, height: sceneHeight } = this.sys.game.config

    this.add.image(400, 300, 'sky')

    this.buildings = this.physics.add.group()
    this.clouds = this.physics.add.group()

    this.speed = config.startSpeed

    this.time.addEvent({
      delay: 5000,
      callback: this.addClouds,
      callbackScope: this,
      loop: true
    })

    this.balloon = this.physics.add.sprite((sceneWidth - 40) / 2, 245, 'balloon')
    this.balloon.setOrigin(0, 0)
    this.balloon.setCollideWorldBounds(true)
    this.balloon.setDepth(2)

    this.tweens.add({
      targets: this.balloon,
      angle: {
        from: 12,
        to: 2
      },
      ease: 'Sine.easeInOut',
      duration: 2000,
      repeat: -1,
      yoyo: true
    })

    this.yoyoTween = this.tweens.add({
      targets: this.balloon,
      y: '+=30',
      ease: 'Sine.easeInOut',
      duration: 2000,
      repeat: -1,
      yoyo: true
    })

    this.physics.add.collider(this.balloon, this)
    this.physics.add.collider(this.balloon, this.buildings, this.hitBuilding, null, this)

    this.spaceKey = this.input.keyboard.addKey('SPACE')
    this.spaceKey.enabled = false
    this.spaceKey.on('down', this.floatUp, this)

    this.startAssetX = sceneWidth + 50

    this.labelScore = this.add.text((sceneWidth / 2) - 100, (sceneHeight / 2) - 150, '0', {
      font: '40px "HolidayExtrasSans"',
      fill: '#ffffff',
      stroke: '#000',
      strokeThickness: 3,
      align: 'center',
      forcedWidth: '200'
    })
    this.labelScore.setX((sceneWidth + this.labelScore.width) / 2)
    this.labelScore.visible = false
    this.labelScore.setDepth(3)

    // Add the jump sound
    this.jumpSound = this.sound.add('jump')
    this.jumpSound.volume = 0

    this.addClouds(15, true)
  }

  startGame () {

    const { width: sceneWidth } = this.sys.game.config

    this.balloon.alive = true
    this.balloon.setGravity(0, config.balloon.gravity)
    this.balloon.setPosition((sceneWidth - 40) / 2, 245)
    this.score = 0

    this.labelScore.visible = true
    this.labelScore.text = '0'
    this.time.addEvent({
      delay: 10000,
      callback: this.addBuildings,
      callbackScope: this,
      loop: true
    })

    this.spaceKey.enabled = true

    this.buildings.children.iterate(building => {
      building && building.destroy(building)
    })

    this.addBuildings()
    this.yoyoTween.remove()
  }

  update () {}

  floatUp () {
    if (this.balloon.alive == false) return;

    this.balloon.setVelocity(0, -config.balloon.gravityDecreaseAmount)

    // Play sound
    this.jumpSound.play()
  }

  hitBuilding () {
    // If the balloon has already hit a pipe, we have nothing to do
    if (this.balloon.alive === false) return

    // Set the alive property of the balloon to false
    this.balloon.alive = false

    this.time.clearPendingEvents()
    this.time.paused = true
    this.buildings.children.iterate(building => {
      building && building.setVelocity && building.setVelocity(0, 0)
    })
    
    this.clouds.children.iterate(cloud => {
      cloud && cloud.setVelocity(0, 0)
    })

    const EndScene = this.scene.get('EndScene')
    EndScene.scene.start()
  }

  addBuilding (x, y, top = false) {
    const building = this.physics.add.sprite(x, y, 'hotel')

    this.buildings.add(building)

    building.setVelocity(-this.speed, 0)
    building.body.immovable = true
    building.outOfBoundsKill = true
    building.setDepth(1)
    if (top) {

      // Flip the hotel upside down
      building.setFlipY(true)
    
      // Add an invisible layer so we can increase the score
      const rect = this.add.rectangle(x + building.width / 2, 0, 1, this.sys.game.config.height, 0, 0)
      rect.setOrigin(0, 0)
      const empty = this.physics.add.existing(rect)
      empty.body.moves = true
      empty.body.setVelocity(-this.speed, 0)
      
      this.physics.add.overlap(this.balloon, empty, this.increaseScore, null, this)
    }

    this.physics.add.collider(this.balloon, building, this.hitBuilding, null, this)
  }

  addBuildings () {
    const minY = -50
    const gap = 245

    const y = Math.floor(Math.random() * 150) + minY
    const y2 = y + 267 + gap

    this.addBuilding(this.startAssetX, y, true)
    this.addBuilding(this.startAssetX, y2)

    this.speed += config.speedIncrease
  }

  increaseScore (balloon, rectangle) {
    this.score += config.scoreIncrease
    this.labelScore.text = this.score;
    
    const { width: sceneWidth } = this.sys.game.config

    this.labelScore.setX((sceneWidth + this.labelScore.width) / 2)

    rectangle.destroy(rectangle)
  }

  addClouds (amount = 1, randomX = false) {
    for (let i = 0; i < amount; i++) {
      const y = Math.floor(Math.random() * 500)
      const x = randomX ? Math.floor(Math.random() * this.startAssetX) : this.startAssetX
      const cloud = this.physics.add.sprite(x, y, 'cloud')

      this.clouds.add(cloud)
      const scale = Math.random() * (0.1 - 0.05) + 0.05
      cloud.setScale(scale, scale)
      cloud.setVelocity(-40 + (Math.floor(Math.random() * 10)), 0)
      cloud.outOfBoundsKill = true
    }
  }
}

export default MainScene
