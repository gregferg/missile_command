var EnemyMissile = require('./enemy_missile.js');


var Round = function(roundNumber, game) {
  this.roundNumber = roundNumber;
  this.game = game;
  this.roundOccuring = false;
};

Round.prototype.calculateMissiles = function(roundNumber) {
  return 10 + roundNumber * 2;
};

Round.prototype.timeInterval = function(roundNumber) {
  return 1000 / (roundNumber / 2);
};

Round.prototype.startRound = function() {
  this.roundOccuring = true;
  var numMissiles = this.calculateMissiles(this.roundNumber);
  var timeInterval = this.timeInterval(this.roundNumber);
  var game = this.game;
  var enemyMissilesReleased = 0;

  this.missileCreater = window.setInterval(function() {
    enemyMissilesReleased += 1;
    game.add(new EnemyMissile(game.ctx, game));

    if (enemyMissilesReleased === numMissiles) {
      clearInterval(this.missileCreater);
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
  clearInterval(this.missileCreater);
};



module.exports = Round;
