var Util = require("./util");

var Explosion = function (pos, game) {
  this.pos = pos;
  this.game = game;
  this.radius = 1;
  this.type = 'Explosion';
  this.growing = true;
};

Explosion.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.fillStyle = '#e53935';
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
Explosion.prototype.move = function(timeDelta) {
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
  if (this.growing) {
    this.radius = this.radius + velocityScale * 0.5;
  } else {
    this.radius = this.radius - velocityScale * 1;
  }

  if (this.radius > 50 && this.growing) {
    this.growing = false;
  } else if (this.radius < 0 && !this.growing) {
    this.game.remove(this);
   }
};


Explosion.prototype.isCollidedWith = function (otherObject) {
  var centerDist = Util.dist(this.pos, otherObject.pos);
  return centerDist < (this.radius);
};



module.exports = Explosion;
