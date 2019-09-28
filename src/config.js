export default {
  // Game dimensions
  width: 800,
  height: 600,

  // Balloon or Plane
  chosenVehicle: "balloon",

  vehicle: {
    gravity: 90,
    gravityDecreaseAmount: 50,
    force: 50,
    plane: {
      weight: 9,
      thrust: 15
    }
  },

  score: 0,
  scoreIncrease: 1,

  levelLength: 8,

  buildings: {
    buildingGap: 4,
    buildingSpeed: 15,
    speedIncrease: 5
  },

  weather: {
    windForce: 15
  },

  debug: false,

  gameover: false
};
