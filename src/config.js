// All the config things for the game

export default {

  buildings: {
    amountPerLevel: 8,
    // In seconds
    secondsApart: 5,
    secondsApartIncrease: 0.5,
    speed: 10,
    speedIncrease: 4
  },

  debug: false,

  // Game dimensions
  height: 600,
  width: 800,

  fillScreen: true,

  hasHighScores: true,
  numberOfPlayersInHighScore: 5,

  scoreIncrease: 1,

  vehicle: {
    gravity: 50,
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
