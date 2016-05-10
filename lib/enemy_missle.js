var Util = require("./util");
var Missle = require('./missle');



var EnemyMissle = function (ctx, game) {
  var startingPos = [Math.random() * 600, 0];
  var remaingingBases = game.remaingingBases();
  var targetPos =
    remaingingBases[
      Math.floor(Math.random()*remaingingBases.length)
    ].pos;
  console.log(targetPos);

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
