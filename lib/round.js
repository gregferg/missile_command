var EnemyMissle = require('./enemy_missle.js');


var Round = function(roundNumber, game) {
  this.roundNumber = roundNumber;
  this.game = game;
  this.roundOccuring = false;
};

Round.prototype.calculateMissles = function(roundNumber) {
  return 10 + roundNumber * 2;
};

Round.prototype.timeInterval = function(roundNumber) {
  return 2000 / (roundNumber / 2);
};

Round.prototype.startRound = function() {
  this.roundOccuring = true;
  var numMissles = this.calculateMissles(this.roundNumber);
  var timeInterval = this.timeInterval(this.roundNumber);
  var game = this.game;
  var enemyMisslesReleased = 0;

  this.missleCreater = window.setInterval(function() {
    enemyMisslesReleased += 1;
    game.add(new EnemyMissle(game.ctx, game));

    if (enemyMisslesReleased === numMissles) {
      clearInterval(this.missleCreater);
      this.roundOver();
    }
  }.bind(this), 1000);
};

Round.prototype.isRoundOver = function () {
  return this.roundOccuring ? false : true;
};

Round.prototype.nextRound = function () {
  this.roundNumber += 1;
  this.startRound();
};

Round.prototype.roundOver = function () {
  this.roundOccuring = false;
};

Round.prototype.stopRound = function () {
  clearInterval(this.missleCreater);
};



module.exports = Round;
