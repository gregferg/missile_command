var Util = require("./util");
var Explosion = require('./explosion.js');

var SPEED = 5;
var STARTING_POS = [600, 600];

var Missile = function(options) {
  if (options.friendlyMissile) {
    this.strokeStyle = "#FFFDE7";
    this.type = "FriendlyMissile";
  } else {
    this.strokeStyle = '#4E342E';
  }
  this.targetPos = options.targetPos;
  this.startingPos = options.startingPos || STARTING_POS;
  this.pos = this.startingPos;
  this.speed = options.speed || SPEED;
  this.delta =
    Util.scale(Util.dir(
      [this.targetPos[0] - this.startingPos[0],
    this.targetPos[1] - this.startingPos[1]]
  ), this.speed);
  this.game = options.game;


  // Math.atan2(point1Y - fixedY, point1X - fixedX)
};


Missile.prototype.draw = function (ctx) {
  ctx.strokeStyle = this.strokeStyle;
  ctx.fillStyle = this.strokeStyle;

  //the target pos of the missle
  if (this.type === "FriendlyMissile") {
  var target = this.targetPos;

  ctx.moveTo(target[0] - 10, target[1] + 10);
  ctx.lineTo(target[0] + 10, target[1] - 10);
  ctx.moveTo(target[0] - 10, target[1] - 10);
  ctx.lineTo(target[0] + 10, target[1] + 10);
  ctx.stroke();
}

  //the circle head of the missle
  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], 4, 0, 2 * Math.PI, true
  );
  ctx.fill();

  //the tail of the missle

  var gradient = ctx.createLinearGradient(
    this.pos[0],
    this.pos[1],
    this.startingPos[0],
    this.startingPos[1]
  );
  gradient.addColorStop(0, this.strokeStyle);
  gradient.addColorStop(1,"white");

  ctx.strokeStyle = gradient;

  ctx.beginPath();

  ctx.moveTo(this.pos[0], this.pos[1]);
  ctx.lineTo(
    this.startingPos[0],
    this.startingPos[1]
  );
  // ctx.lineTo(
  //   this.pos[0] - this.delta[0] * 100,
  //   this.pos[1] - this.delta[1] * 100
  // );
  ctx.stroke();

};
var NORMAL_FRAME_TIME_DELTA = 1000/60;
Missile.prototype.move = function (timeDelta) {
  //timeDelta is number of milliseconds since last move
  //if the computer is busy the time delta will be larger
  //in this case the MovingObject should move farther in this frame
  //velocity of object is how far it should move in 1/60th of a second
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.delta[0] * velocityScale,
      offsetY = this.delta[1] * velocityScale;

  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];


  if (
    this.pos[1] < this.targetPos[1] &&
    this.type === 'FriendlyMissile'
    ) {
      this.game.add(new Explosion(this.pos, this.game));
      this.game.remove(this);
    }

  if (
    this.pos[1] > this.targetPos[1] &&
    this.type === 'EnemyMissile'
    ) {
    this.game.remove(this);
    this.game.destroyBase(this.targetPos);
    this.game.add(new Explosion(this.targetPos, this.game));
  }
};



module.exports = Missile;
