// All the config things for the game

export default {

  buildings: {
    amountPerLevel: 8,
    // In seconds
    gap: 5,
    gapIncrease: 1,
    speed: 8,
    speedIncrease: 2
  },

  debug: false,

  // Game dimensions
  height: 600,
  width: 800,

  fillScreen: true,

  scoreIncrease: 1,

  vehicle: {
    gravity: 90,
    gravityDecreaseAmount: 50,
    plane: {
      thrust: 15,
      weight: 9
    },

    // "balloon" or "plane"
    type: 'balloon'
  },

  weather: {
    windSpeed: 40
  }
}
