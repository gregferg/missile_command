var Util = require("./util");
var Missile = require('./missile');



var EnemyMissile = function (ctx, game) {
  var startingPos = [Math.random() * 1000, 0];
  var remaingingBases = game.remaingingBases().concat(game.remaingingMissileBases());
  if (remaingingBases.length === 0) { return ; }
  var targetPos =
    remaingingBases[
      Math.floor(Math.random()*remaingingBases.length)
    ].pos;

  Missile.call(
    this,
    {
      startingPos: startingPos,
      targetPos: targetPos,
      ctx: ctx,
      game: game,
      speed: 0.7
    });
};


Util.inherits(EnemyMissile, Missile);

EnemyMissile.prototype.type = "EnemyMissile";

module.exports = EnemyMissile;
