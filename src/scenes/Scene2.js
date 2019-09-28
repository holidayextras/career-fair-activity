import { Scene } from "phaser";
import config from "../config";
import { default as retryButtonImage } from "../assets/retry.png";
import { default as skyImage } from "../assets/testSky.png";
import { default as cloudImage } from "../assets/cloud.png";

var cursors;

class Scene2 extends Scene {
  constructor() {
    super("Scene2");
  }
  preload() {
    this.load.image("retryButton", retryButtonImage);
    this.load.image("sky", skyImage);
    this.load.image("cloud", cloudImage);
  }

  create() {
    this.add.image(400, 300, "sky");
    cursors = this.input.keyboard.createCursorKeys();

    //this.add.text(200, 200, "Game Over - Your score was " + config.score);
    this.clouds = this.physics.add.group();

    this.time.addEvent({
      delay: 5000,
      callback: this.addClouds,
      callbackScope: this,
      loop: true
    });

    let retryButton = this.add.image(400, 530, "retryButton");
    retryButton.setScale(0.4, 0.4);
    retryButton.setDepth(4);
    retryButton.setInteractive();
    retryButton.on(
      "pointerdown",
      () => {
        const GameScene = this.scene.get("Scene1");
        this.scene.stop("Scene2");
        GameScene.scene.start();
      },
      this
    );

    this.addClouds(15, true);

    this.message = this.add.text(100, 175, "Game Over!", {
      fontSize: "100px",
      fill: "#542e91",
      stroke: "#ffee5f",
      strokeThickness: 8
    });
    this.message.setDepth(4);
    this.scoreMessage = this.add.text(
      175,
      300,
      "Your score:  " + config.score,
      {
        fontSize: "50px",
        fill: "#542e91",
        stroke: "#ffee5f",
        strokeThickness: 8
      }
    );
    this.scoreMessage.setDepth(4);
    this.scoreMessage.x = config.width / 2 - this.scoreMessage.width / 2;
  }

  update() {
    // if (cursors.space.isDown) {
    //   this.scene.stop("Scene2");
    //   const restartScene = this.scene.get("Scene0");
    //   restartScene.scene.start();
    // }
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
}
export default Scene2;
