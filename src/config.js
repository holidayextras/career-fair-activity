// All the config things for the game

export default {

  // Change the amount of hotels on screen, or how fast they appear
  buildings: {
    amountPerLevel: 2,
    // In seconds
    secondsApart: 5,
    secondsApartIncrease: 0.5,
    speed: 13,
    speedIncrease: 4
  },

  debug: false,

  // Game dimensions
  height: 600,
  width: 800,

  fillScreen: true,

  hasHighScores: true,
  numberOfPlayersInHighScore: 5,

  // Want a higher score? Change this
  scoreIncrease: 1,

  text: {
    colour: '#542e91',
    strokeColour: '#ffee5f'
  },

  // All of the below will make the vehicle's physics behave dfferent
  vehicle: {
    gravity: 50,
    gravityDecreaseAmount: 50,
    plane: {
      thrust: 15,
      weight: 9
    },

    // "balloon" or "plane"
    type: 'balloon' // <!-- change me if you want a different vehicle
  },

  weather: {
    windSpeed: 40
  }
}
