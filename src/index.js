import { Game } from "phaser";

import Scene0 from "./scenes/Scene0";
import Scene1 from "./scenes/Scene1";
import Scene2 from "./scenes/Scene2";

const game = new Game({
  width: 800,
  height: 600,
  zoom: 1,
  backgroundColor: "#fddc06",
  parent: "game-container",
  scene: [Scene0, Scene1, Scene2],
  physics: {
    default: "arcade"
  }
});

export default game;
