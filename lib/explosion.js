var Util = require("./util");

var Explosion = function (pos, game) {
  this.pos = pos;
  this.game = game;
  this.radius = 1;
  this.type = 'Explosion';
};

Explosion.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
Explosion.prototype.move = function(timeDelta) {
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
  this.radius = this.radius + velocityScale;
  if (this.radius > 45) {
    this.game.remove(this);
  }
};


Explosion.prototype.isCollidedWith = function (otherObject) {
  var centerDist = Util.dist(this.pos, otherObject.pos);
  return centerDist < (this.radius);
};



module.exports = Explosion;
