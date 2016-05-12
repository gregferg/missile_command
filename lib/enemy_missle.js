var Util = require("./util");
var Missle = require('./missle');



var EnemyMissle = function (ctx, game) {
  var startingPos = [Math.random() * 1000, 0];
  var remaingingBases = game.remaingingBases().concat(game.remaingingMissleBases());
  if (remaingingBases.length === 0) { return ; }
  var targetPos =
    remaingingBases[
      Math.floor(Math.random()*remaingingBases.length)
    ].pos;

  Missle.call(
    this,
    {
      startingPos: startingPos,
      targetPos: targetPos,
      ctx: ctx,
      game: game,
      speed: 0.7
    });
};


Util.inherits(EnemyMissle, Missle);

EnemyMissle.prototype.type = "EnemyMissle";

module.exports = EnemyMissle;
