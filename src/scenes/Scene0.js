import { Scene } from "phaser";
import { default as hotAirBalloon } from "../assets/hot-air-balloon.png";
import { default as planeImage } from "../assets/testPlane.png";
import { default as cloudImage } from "../assets/cloud.png";
import { default as skyImage } from "../assets/testSky.png";
import { default as titleImage } from "../assets/flightOfTheCoder.png";
import { default as startImage } from "../assets/startButton.png";

import config from "../config.js";

let cursors;
let vehicle;

class Scene0 extends Scene {
  constructor(game) {
    super("Scene0");
  }

  preload() {
    this.load.image("balloon", hotAirBalloon);
    this.load.image("plane", planeImage);
    this.load.image("cloud", cloudImage);
    this.load.image("sky", skyImage);
    this.load.image("title", titleImage);
    this.load.image("startButton", startImage);
  }

  create() {
    this.add.image(400, 300, "sky");
    this.clouds = this.physics.add.group();
    this.addClouds(7, true);
    this.time.addEvent({
      delay: 1000,
      callback: this.addClouds,
      callbackScope: this,
      loop: true
    });

    vehicle = this.add.image(
      config.width / 2 - 10,
      config.height / 2 + 40,
      config.chosenVehicle
    );
    vehicle.setDepth(4);
    vehicle.direction = "down";
    cursors = this.input.keyboard.createCursorKeys();
    let title = this.add.image(400, 250, "title");
    title.setScale(0.5, 0.5);
    title.setDepth(4);
    let startButton = this.add.image(400, 530, "startButton");
    startButton.setScale(0.4, 0.4);
    startButton.setDepth(4);
    startButton.setInteractive();
    startButton.on(
      "pointerdown",
      () => {
        const GameScene = this.scene.get("Scene1");
        this.scene.stop("Scene0");
        GameScene.scene.start();
      },
      this
    );
  }

  update() {
    this.balloonAnimation();
  }

  addClouds(amount = 1, randomX = false) {
    for (let i = 0; i < amount; i++) {
      const y = Math.floor(Math.random() * 500);
      const x = randomX
        ? Math.floor(Math.random() * config.width)
        : config.width;
      const cloud = this.physics.add.sprite(x, y, "cloud");

      this.clouds.add(cloud);
      const scale = Math.random() * (0.1 - 0.05) + 0.05;
      cloud.setScale(scale, scale);
      cloud.setVelocity(-40 + Math.floor(Math.random() * 10), 0);
      cloud.setDepth(1);
      cloud.outOfBoundsKill = true;
    }
  }

  balloonAnimation() {
    if (vehicle.y < config.height / 2 + 50 && vehicle.direction === "down") {
      vehicle.y += 0.25;
    }
    if (vehicle.y === config.height / 2 + 50) {
      vehicle.direction = "up";
      vehicle.y -= 0.25;
    }
    if (vehicle.y > config.height / 2 + 30 && vehicle.direction === "up") {
      vehicle.y -= 0.25;
    }
    if (vehicle.y === config.height / 2 + 30 && vehicle.direction === "up") {
      vehicle.direction = "down";
      vehicle.y += 0.25;
    }
  }
}

export default Scene0;
