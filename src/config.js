// All the config things for the game

export default {

  buildings: {
    amountPerLevel: 1,
    // In seconds
    secondsApart: 5,
    secondsApartIncrease: 1,
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
    gravity: 50,
    gravityDecreaseAmount: 50,
    plane: {
      thrust: 15,
      weight: 9
    },

    // "balloon" or "plane"
    type: 'plane'
  },

  weather: {
    windSpeed: 40
  }
}
