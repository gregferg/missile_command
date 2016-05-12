var Target = require("./target.js");
var EnemyMissile = require("./enemy_missile.js");
var Explosion = require("./explosion.js");
var Base = require("./base.js");
var MissileBase = require("./missile_base.js");
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
  this.friendlyMissiles = [];
  this.enemyMissiles = [];
  this.explosions = [];
  this.bases = BASE_POS.map(function(basePos, idx) {
    return new Base(basePos, self);
  });
  this.missleBases = MISSLE_BASE_POS.map(function(basePos, idx) {
    return new MissileBase(basePos, self);
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
  if (object.type === "FriendlyMissile") {
    this.friendlyMissiles.push(object);
  } else if (object.type === "Explosion") {
    this.explosions.push(object);
  } else if (object.type === "EnemyMissile") {
    this.enemyMissiles.push(object);
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

Game.prototype.remaingingMissileBases = function () {
  var remaingingMissileBases = [];

  this.missleBases.forEach(function(base) {
    if (base.alive) { remaingingMissileBases.push(base); }
  });

  return remaingingMissileBases;
};

Game.prototype.gameOver = function () {
  if (this.remaingingMissileBases().length === 0) {
    return true;
  } else {
    return false;
  }
};

Game.prototype.clearMissiles = function () {
  this.enemyMissiles = [];
};

Game.prototype.cheat = function () {
  window.addEventListener("click", function (e) {
    this.clearMissiles();
  }.bind(this));
};

Game.prototype.renderGameOver = function () {
  window.clearInterval(this.missleCreater);
  // console.log("game overrr");

  this.ctx.font = "48px helvetica";
  this.ctx.fillText("GAME OVER", 350, 250);
  this.ctx.fillText("Hit Space to play again", 250, 350);
};



Game.prototype.addAPoint = function() {
  this.points += 100;
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
    this.friendlyMissiles,
    this.explosions,
    this.enemyMissiles,
    this.bases,
    this.missleBases
  );
};

Game.prototype.checkCollisions = function () {
  var game = this;

  this.explosions.forEach(function (explosion) {
    game.enemyMissiles.forEach(function (enemyMissile) {
      if (explosion.isCollidedWith(enemyMissile)) {
        game.addAPoint();
        game.remove(enemyMissile);
        game.add(new Explosion(enemyMissile.pos, game));
        return;
      }
    });
  });
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

  ctx.fillStyle = "#B3E5FC";
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  ctx.fillStyle = "#66BB6A";
  ctx.fillRect(0, 560, Game.DIM_X, Game.DIM_Y);

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
  this.ctx.fillStyle = "white";
  this.ctx.font = "24px helvetica";
  this.ctx.fillText("Score: " + this.points.toString(), 800, 25);
};

Game.prototype.renderRound = function () {
  this.ctx.fillStyle = "white";
  this.ctx.font = "24px helvetica";
  this.ctx.fillText("Round: " + this.round.roundNumber.toString(), 15, 25);
};

Game.prototype.renderNextRound = function () {
  this.ctx.fillStyle = "white";
  this.ctx.font = "48px helvetica";
  this.ctx.fillText("NEXT ROUND", 350, 300);
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
    this.enemyMissiles.length === 0 &&
    this.remaingingMissileBases().length > 0 &&
    !this.nextRoundIntermission
  ) {
    this.nextRound();
  }
};

Game.prototype.resetBasesAmmo = function () {
  this.remaingingMissileBases().forEach(function(base) {
    base.resetAmmo();
  });
};
Game.prototype.addUpRoundScore = function () {
  var self = this;

  this.remaingingMissileBases().forEach(function(base) {
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
  } else if (object.type === 'FriendlyMissile') {
    this.friendlyMissiles.splice(this.friendlyMissiles.indexOf(object), 1);
  } else if (object.type === 'EnemyMissile') {
    this.enemyMissiles.splice(this.enemyMissiles.indexOf(object), 1);
  } else if (object.type === 'Base') {
    this.bases.splice(this.bases.indexOf(object), 1);
  } else if (object.type === 'MissileBase') {
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
