import { Scene } from "phaser";

import { default as hotAirBalloon } from "../assets/hot-air-balloon.png";
import { default as planeImage } from "../assets/testPlane.png";
import { default as skyImage } from "../assets/testSky.png";
import { default as cloudImage } from "../assets/cloud.png";
import { default as hotelImage } from "../assets/testHotel2.png";

import config from "../config";

let chosenVehicle;
class Scene1 extends Scene {
  constructor(game) {
    super("Scene1");
  }

  preload() {
    this.load.image("cloud", cloudImage);
    this.load.image("hotel", hotelImage);
    this.load.image("sky", skyImage);
    if (config.chosenVehicle === "balloon") {
      this.load.image("balloon", hotAirBalloon);
    } else {
      this.load.image("plane", planeImage);
    }
  }

  create() {
    this.buildingCount = 0;
    this.level = 1
    this.cursors = this.input.keyboard.createCursorKeys();
    const { width: sceneWidth, height: sceneHeight } = this.sys.game.config;

    this.add.image(400, 300, "sky");

    this.buildings = this.physics.add.group();
    this.clouds = this.physics.add.group();
    this.speed = config.buildings.buildingSpeed * 10;

    this.time.addEvent({
      delay: 5000,
      callback: this.addClouds,
      callbackScope: this,
      loop: true
    });

    if (config.chosenVehicle === "plane") {
      this.plane = this.physics.add.sprite((sceneWidth - 180) / 4, 245, "plane");
      this.plane.setImmovable(true);
      this.plane.setCollideWorldBounds(true);
      this.plane.setDepth(2);
      this.plane.alive = true;
      this.plane.setGravity(0, config.vehicle.gravity);
      this.plane.setPosition((sceneWidth - 40) / 4, 245);
      chosenVehicle = this.plane;
    } else {
      this.balloon = this.physics.add.sprite((sceneWidth - 180) / 4, 245, "balloon");
      this.balloon.setImmovable(true);
      this.balloon.setCollideWorldBounds(true);
      this.balloon.setDepth(2);
      this.balloon.alive = true;
      this.balloon.setGravity(0, config.vehicle.gravity);
      this.balloon.setPosition((sceneWidth - 40) / 4, 245);
      chosenVehicle = this.balloon;
    }

    this.physics.world.checkCollision.down = false;

    this.addClouds(15, true);
    this.addBuildings();

    this.labelScore = this.add.text(30, 12, "Score: 0", {
      fontSize: "32px",
      fill: "purple",
      backgroundColor: "#fddc06"
    });
    this.labelScore.setDepth(3);
    this.labelScore.setX(30);
    this.labelScore.visible = false;
    this.score = 0;
    this.labelScore.visible = true;
    this.labelScore.text = "0";
    this.time.addEvent({
      event: "addBuildingLoop",
      delay: (config.buildings.buildingGap * 1000) / 2,
      callback: this.addBuildings,
      callbackScope: this,
      loop: true
    });

    this.levelMessage = this.add.text(100, 175, "Level " + this.level, {
      fontSize: "100px",
      fill: "#542e91",
      stroke: "#ffee5f",
      strokeThickness: 8
    });
    this.levelMessage.x = config.width / 2 - this.levelMessage.width / 2;
    this.levelMessage.setDepth(4);
    this.time.addEvent({
      delay: 1000,
      callback: this.hideLevelText,
      callbackScope: this,
      loop: false
    });
  }

  update() {
    this.levelCheck();
    if (this.fallenThrough()) {
      this.scene.stop("Scene1");
      const endScene = this.scene.get("Scene2");
      endScene.scene.start("Scene2");
    }
    if (config.gameOver) {
      config.gameOver = false;
      this.scene.stop("Scene1");
      const endScene = this.scene.get("Scene2");
      endScene.scene.start("Scene2");
    }
    if (this.cursors.space.isDown) {
      chosenVehicle.setVelocity(0, -config.vehicle.force);
      if (chosenVehicle === this.plane && chosenVehicle.angle >= -3) {
        chosenVehicle.angle -= config.vehicle.plane.thrust / 100;
      } else if (chosenVehicle.angle >= -10) {
        chosenVehicle.angle -= config.vehicle.plane.thrust / 100;
      }
    } else {
      if (chosenVehicle === this.plane && chosenVehicle.angle <= 5) {
        chosenVehicle.angle += config.vehicle.plane.weight / 100;
      } 
      if (chosenVehicle === this.balloon && chosenVehicle.angle <= 15) {
        chosenVehicle.angle += config.weather.windForce / 100;
      }
    }
  }

  fallenThrough() {
    return chosenVehicle.body.y > config.height;
  }

  floatUp() {
    chosenVehicle.setVelocity(0, -config.vehicle.gravityDecreaseAmount);
  }

  hitBuilding() {
    config.gameOver = true;
  }

  addBuilding(x, y, top = false) {
    const building = this.physics.add.sprite(x, y, "hotel");
    this.buildings.add(building);
    building.setVelocity(-this.speed, 0);
    building.body.immovable = true;
    building.outOfBoundsKill = true;
    building.setDepth(1);
    if (top) {
      // Flip the hotel upside down
      building.setFlipY(true);
      //Add an invisible layer so we can increase the score
      const hitBox = this.physics.add.sprite(x + 50, y + 200, "hotel");
      hitBox.setVisible(false);
      hitBox.setVelocity(-this.speed, 0);
      hitBox.body.immovable = false;
      hitBox.setDepth(1);
      this.physics.add.collider(
        chosenVehicle,
        hitBox,
        this.increaseScore,
        null,
        this
      );
    }
    this.physics.add.collider(
      chosenVehicle,
      building,
      this.hitBuilding,
      null,
      this
    );
  }

  addBuildings() {
    const minY = -25;
    const gap = 245;

    const y = Math.floor(Math.random() * 150) + minY;
    const y2 = y + 267 + gap;

    this.addBuilding(config.width, y, true);
    this.addBuilding(config.width, y2);

    this.buildingCount += 1;
  }

  increaseScore(chosenVehicle, rectangle) {
    rectangle.destroy(rectangle);
    this.score += config.scoreIncrease;
    config.score = this.score;
    this.labelScore.setText("Score: " + this.score);

    const { width: sceneWidth } = this.sys.game.config;
  }

  addClouds(amount = 1, randomX = false) {
    var startAssetX = config.width;
    for (let i = 0; i < amount; i++) {
      const y = Math.floor(Math.random() * 500);
      const x = randomX ? Math.floor(Math.random() * startAssetX) : startAssetX;
      const cloud = this.physics.add.sprite(x, y, "cloud");

      this.clouds.add(cloud);
      const scale = Math.random() * (0.1 - 0.05) + 0.05;
      cloud.setScale(scale, scale);
      cloud.setVelocity(-80 + Math.floor(Math.random() * 10), 0);
      cloud.outOfBoundsKill = true;
    }
  }

  levelCheck() {
    if(this.buildingCount === config.levelLength) {
      this.buildingCount = 0;
      this.time.removeAllEvents();
      this.addClouds();
      this.speed += config.buildings.speedIncrease * 10;
      this.time.addEvent({
        delay: 5000,
        callback: this.addClouds,
        callbackScope: this,
        loop: true
      });
      this.time.addEvent({
        delay: 3000,
        callback: this.changeLevel,
        callbackScope: this,
        loop: false
      });
      this.time.addEvent({
        delay: 2000,
        callback: this.displayLevelText,
        callbackScope: this,
        loop: false
      });
    }
  }

  changeLevel() {
    this.level++;
    this.time.removeAllEvents();
    this.addClouds();
    this.time.addEvent({
      delay: 5000,
      callback: this.addClouds,
      callbackScope: this,
      loop: true
    });
    this.time.addEvent({
      event: "addBuildingLoop",
      delay: (config.buildings.buildingGap * 1000) / (this.level + 1),
      callback: this.addBuildings,
      callbackScope: this,
      loop: true
    });
  }

  displayLevelText() {
    this.levelMessage.setText("Level " + this.level);
    this.levelMessage.setVisible(true);
    this.time.addEvent({
      delay: 1000,
      callback: this.hideLevelText,
      callbackScope: this,
      loop: false
    });
  }

  hideLevelText() {
    this.levelMessage.setVisible(false);
  }
}

export default Scene1;
