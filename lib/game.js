var Asteroid = require("./asteroid");
var Bullet = require("./bullet");
var Ship = require("./ship");
var Target = require("./target.js");
var EnemyMissle = require("./enemy_missle.js");
var Explosion = require("./explosion.js");
var Base = require("./base.js");
var MissleBase = require("./missle_base.js");
var Round = require("./round.js");


var BASE_POS = [
  [200, 550],
  [300, 550],
  [400, 550],
  [600, 550],
  [700, 550],
  [800, 550]
];

var MISSLE_BASE_POS = [
  [100, 550],
  [500, 550],
  [900, 550]
];

var Game = function (ctx) {
  var self = this;
  this.friendlyMissles = [];
  this.enemyMissles = [];
  this.explosions = [];
  this.bases = BASE_POS.map(function(basePos, idx) {
    return new Base(basePos, self);
  });
  this.missleBases = MISSLE_BASE_POS.map(function(basePos, idx) {
    return new MissleBase(basePos, self);
  });

  this.target = new Target(this, ctx);
  this.ctx = ctx;

  this.points = 0;
  this.nextRoundIntermission = false;

  this.round = new Round(1, this);
  this.round.startRound();
  // this.cheat();
};


Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.NUM_ASTEROIDS = 10;

Game.prototype.add = function (object) {
  if (object.type === "FriendlyMissle") {
    this.friendlyMissles.push(object);
  } else if (object.type === "Explosion") {
    this.explosions.push(object);
  } else if (object.type === "EnemyMissle") {
    this.enemyMissles.push(object);
}
  // } else {
  //   throw "wtf?";
  // }
};

Game.prototype.remaingingBases = function () {
  var remaingingBases = [];

  this.bases.forEach(function(base) {
    if (base.alive) { remaingingBases.push(base); }
  });

  return remaingingBases;
};

Game.prototype.remaingingMissleBases = function () {
  var remaingingMissleBases = [];

  this.missleBases.forEach(function(base) {
    if (base.alive) { remaingingMissleBases.push(base); }
  });

  return remaingingMissleBases;
};

Game.prototype.gameOver = function () {
  return (this.remaingingBases().length === 0) ? true : false;
};

Game.prototype.clearMissles = function () {
  this.enemyMissles = [];
};

Game.prototype.cheat = function () {
  window.addEventListener("click", function (e) {
    this.clearMissles();
  }.bind(this));
};

Game.prototype.renderGameOver = function () {
  window.clearInterval(this.missleCreater);

  this.ctx.font = "48px serif";
  this.ctx.fillText("GAME OVER", 600, 300);
  this.ctx.fillText("Hit Space to play again", 600, 400);

  // window.addEventListener();


};



Game.prototype.addAPoint = function() {
  this.points += 1;
},

Game.prototype.destroyBase = function(pos) {
  var bases = this.bases.concat(this.missleBases);
  bases.forEach(function(base) {
    if (base.pos === pos) {
      base.alive = false;
      return;
    }
  });
},


Game.prototype.allObjects = function () {
  return [].concat(
    this.friendlyMissles,
    this.explosions,
    this.enemyMissles,
    this.bases,
    this.missleBases
  );
};

Game.prototype.checkCollisions = function () {
  var game = this;

  this.explosions.forEach(function (explosion) {
    game.enemyMissles.forEach(function (enemyMissle) {
      if (explosion.isCollidedWith(enemyMissle)) {
        game.addAPoint();
        game.remove(enemyMissle);
        game.add(new Explosion(enemyMissle.pos, game));
        return;
      }
    });
  });
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  // ctx.fillStyle = Game.BG_COLOR;
  // ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });

  this.target.draw();

  this.renderRound();
  this.renderScore();
  if (this.gameOver()) { this.renderGameOver(); }
  if (this.nextRoundIntermission) {this.renderNextRound(); }
};

Game.prototype.renderScore = function () {
  this.ctx.font = "24px serif";
  this.ctx.fillText("Score: " + this.points.toString(), 800, 25);
};

Game.prototype.renderRound = function () {
  this.ctx.font = "24px serif";
  this.ctx.fillText("Round: " + this.round.roundNumber.toString(), 15, 25);
};

Game.prototype.renderNextRound = function () {
  this.ctx.font = "48px serif";
  this.ctx.fillText("NEXT ROUND", 400, 300);
};
// Game.prototype.isOutOfBounds = function (pos) {
//   return (pos[0] < 0) || (pos[1] < 0) ||
//     (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
// };

Game.prototype.moveObjects = function (delta) {
  this.allObjects().forEach(function (object) {
    object.move(delta);
  });
};

Game.prototype.checkRound = function (delta) {
  if (
    !this.round.roundOccuring &&
    this.round.isRoundOver() &&
    this.enemyMissles.length === 0 &&
    this.remaingingBases().length > 0 &&
    !this.nextRoundIntermission
  ) {
    this.nextRound();
  }
};

Game.prototype.resetBasesAmmo = function () {
  this.remaingingMissleBases().forEach(function(base) {
    base.resetAmmo();
  });
};
Game.prototype.addUpRoundScore = function () {
  var self = this;
  this.remaingingMissleBases().forEach(function(base) {
    self.points += 200;
    self.points += base.ammo * 100;
  });
  this.remaingingBases().forEach(function(base) {
    self.points += 200;
  });
};

Game.prototype.nextRound = function() {
  this.nextRoundIntermission = true;
  this.resetBasesAmmo();
  this.addUpRoundScore();

  setTimeout(function() {
    this.round.nextRound();
    this.nextRoundIntermission = false;
  }.bind(this), 3000);
};

Game.prototype.remove = function (object) {
  if (object.type === 'Explosion') {
    this.explosions.splice(this.explosions.indexOf(object), 1);
  } else if (object.type === 'FriendlyMissle') {
    this.friendlyMissles.splice(this.friendlyMissles.indexOf(object), 1);
  } else if (object.type === 'EnemyMissle') {
    this.enemyMissles.splice(this.enemyMissles.indexOf(object), 1);
  } else if (object.type === 'Base') {
    this.bases.splice(this.bases.indexOf(object), 1);
  } else if (object.type === 'MissleBase') {
    this.misslesBases.splice(this.misslesBases.indexOf(object), 1);

  // } else {
  //   throw "wtf?";
  }
};

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
  this.checkCollisions();
  this.checkRound();
};


module.exports = Game;
