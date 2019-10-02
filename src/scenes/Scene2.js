import { Scene } from 'phaser'

import retryButton from '../assets/retry.png'

import config from '../config'

class Scene2 extends Scene {
  constructor () {
    super({
      key: 'Scene2'
    })

    this.savedScores = []
    this.getSavedScores()
  }

  preload () {
    this.load.image('retryButton', retryButton)
  }

  create () {
    const retryButton = this.add.image(300, 530, 'retryButton')
    retryButton.setScale(0.4, 0.4)
    retryButton.setDepth(4)
    retryButton.setInteractive()
    retryButton.on('pointerdown', () => {
      this.game.somethingMagic = false
      this.scene.stop()
      this.scene.resume('Scene1')
      this.scene.get('Scene1').startGame(true)
    }, this)

    // Take me to codesandbox
    const codesandboxButton = this.add.image(500, 530, 'retryButton')
    codesandboxButton.setScale(0.4, 0.4)
    codesandboxButton.setDepth(4)
    codesandboxButton.setInteractive()
    codesandboxButton.on('pointerdown', () => {
      window.open('https://codesandbox.io/s/github/holidayextras/career-fair-activity')
    }, this)

    this.message = this.add.text(0, 40, 'Game Over!', {
      fill: config.text.colour,
      font: '100px "HolidayExtrasSans"',
      stroke: config.text.strokeColour,
      strokeThickness: 8
    })
    this.message.setDepth(4)
    this.message.setX((config.width - this.message.width) / 2)
    this.nameInput = null
    this.userScore = this.scene.get('Scene1').score

    if (config.hasHighScores) {
      const styles = {
        fill: config.text.colour,
        font: '32px "HolidayExtrasSans"',
        stroke: config.text.strokeColour,
        strokeThickness: 8
      }
      this.scoreTitle = this.add.text(0, 160, `THE ${config.numberOfPlayersInHighScore} BEST PLAYERS\nRANK        SCORE       NAME`, Object.assign({}, styles, { align: 'center' }))
      this.scoreTitle.setX((config.width - this.scoreTitle.width) / 2)
      this.rankText = this.add.text(230, this.scoreTitle.y + this.scoreTitle.height, '', styles)
      this.scoresText = this.add.text(370, this.rankText.y, '', styles)
      this.namesText = this.add.text(505, this.rankText.y, '', styles)

      // Put your name in here
      this.nameInput = this.add.dom(675, 0, 'input', `color: ${config.text.colour}; font: 32px "HolidayExtrasSans"; background: transparent; outline: none; border: none;`)
      this.nameInput.node.focus()
      this.nameInput.setVisible(false)

      // Save on enter
      this.input.keyboard.on('keyup', (event) => {
        if (event.target === this.nameInput.node) {
          this.nameInput.node.value = this.nameInput.node.value.toUpperCase().substring(0, 10)
        }
      })
      this.input.keyboard.on('keydown_ENTER', this.saveScore, this)

      this.showHighScores()
    }

    this.time.addEvent({
      delay: 60000,
      callback: () => document.location.reload()
    })
  }

  getSavedScores () {
    try {
      fetch('https://api.jsonbin.io/b/5d947c639d20fe2188788727/latest')
        .then(response => {
          if (!response.ok) {
            throw new Error('Can\'t load from jsonbin')
          }
          return response.json()
        })
        .then(response => {
          if (response) {
            this.savedScores = response
          }
        })
    } catch (error) {
      console.warn('there was an error', error)
    }
  }

  showHighScores () {
    // Show highscore
    const names = []
    const scores = []
    let rank = null

    // Making sure we have an actual array to loop
    if (!this.savedScores || !Array.isArray(this.savedScores)) {
      this.savedScores = []
    }

    this.savedScores.forEach((s, i) => {
      // If config gets changed, we want to calculate based on the new config
      const score = (s.score / s.baseScore) * config.scoreIncrease
      if (this.userScore !== 0 && this.userScore >= score && !names.includes(' ') && this.nameInput.node) {
        names.push(' ')
        scores.push(this.userScore)
        rank = i + 1
      }
      names.push(s.name)
      scores.push(score)
    })

    // Means we haven't added a space for the new score, so must be lowest score
    if (this.userScore !== 0 && !names.includes(' ') && this.nameInput.node) {
      scores.push(this.userScore)
      rank = scores.length
    }

    // Use the indexes of another array to make the ranks
    this.rankText.text = scores.map((_, i) => i + 1).splice(0, config.numberOfPlayersInHighScore).join('\n')
    this.scoresText.text = scores.splice(0, config.numberOfPlayersInHighScore).join('\n')
    this.namesText.text = names.splice(0, config.numberOfPlayersInHighScore).join('\n').toUpperCase()

    if (rank && rank <= config.numberOfPlayersInHighScore) {
      this.nameInput.setVisible(true)
      this.nameInput.y = 270 + (45 * (rank - 1))
    }
  }

  saveScore () {
    this.savedScores.push({
      baseScore: config.scoreIncrease,
      name: this.nameInput.node.value || 'Anonymous',
      score: this.userScore,
      timeStamp: new Date().getTime() // To sort if scores are the same
    })
    this.savedScores = this.savedScores.sort((a, b) => {
      if (a.score > b.score) return -1
      if (a.score < b.score) return 1
      if (a.timeStamp > b.timeStamp) return -1
      if (a.timeStamp < b.timeStamp) return 1
      return 0
    })

    try {
      fetch('https://api.jsonbin.io/b/5d947c639d20fe2188788727', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.savedScores)
      }).then(response => {
        if (!response.ok) {
          throw new Error('Can\'t save to jsonbin')
        }
        // Remove name input
        this.nameInput.destroy()

        this.showHighScores()
      })
    } catch (error) {
      console.warn(error)

      // Show scores regardless
      this.showHighScores()
    }
  }
}

export default Scene2
