var Asteroid = require("./asteroid");
var Bullet = require("./bullet");
var Ship = require("./ship");
var Target = require("./target.js");
var EnemyMissle = require("./enemy_missle.js");
var Explosion = require("./explosion.js");
var Base = require("./base.js");


var BASE_POS = [
  [200, 550],
  [400, 550],
  [600, 550],
  [800, 550],
  [1000, 550],
];

var Game = function (ctx) {
  var self = this;
  this.friendlyMissles = [];
  this.enemyMissles = [];
  this.explosions = [];
  this.bases = BASE_POS.map(function(basePos, idx) {
    return new Base(basePos, self);
  });
  console.log(this.bases);
  this.target = new Target(this, ctx);
  this.ctx = ctx;

  this.points = 0;
  // this.bullets = [];
  // this.ships = [];
  this.missleCreater = window.setInterval(function() {
    this.add(new EnemyMissle(ctx, this));
  }.bind(this), 1000);
};

Game.BG_COLOR = "#000000";
Game.DIM_X = 1200;
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

Game.prototype.gameOver = function () {
  return (this.remaingingBases().length === 0) ? true : false;
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
  this.bases.forEach(function(base) {
    if (base.pos === pos) {
      base.alive = false;
      return;
    }
  });
},

// Game.prototype.addAsteroids = function () {
//   for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
//     this.add(new Asteroid({ game: this }));
//   }
// };
//
// Game.prototype.addShip = function () {
//   var ship = new Ship({
//     pos: this.randomPosition(),
//     game: this
//   });
//
//   this.add(ship);
//
//   return ship;
// };

Game.prototype.allObjects = function () {
  return [].concat(
    this.friendlyMissles,
    this.explosions,
    this.enemyMissles,
    this.bases
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


  this.renderScore();
  if (this.gameOver()) { this.renderGameOver(); }
};

Game.prototype.renderScore = function () {
  this.ctx.font = "48px serif";
  this.ctx.fillText(this.points.toString(), 500, 100);
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
//
// Game.prototype.randomPosition = function () {
//   return [
//     Game.DIM_X * Math.random(),
//     Game.DIM_Y * Math.random()
//   ];
// };

Game.prototype.remove = function (object) {
  if (object.type === 'Explosion') {
    this.explosions.splice(this.explosions.indexOf(object), 1);
  } else if (object.type === 'FriendlyMissle') {
    this.friendlyMissles.splice(this.friendlyMissles.indexOf(object), 1);
  } else if (object.type === 'EnemyMissle') {
    this.enemyMissles.splice(this.enemyMissles.indexOf(object), 1);
  } else if (object.type === 'Base') {
    this.bases.splice(this.bases.indexOf(object), 1);

  // } else {
  //   throw "wtf?";
  }
};

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
  this.checkCollisions();
};

// Game.prototype.wrap = function (pos) {
//   return [
//     wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
//   ];
//
//   function wrap(coord, max) {
//     if (coord < 0) {
//       return max - (coord % max);
//     } else if (coord > max) {
//       return coord % max;
//     } else {
//       return coord;
//     }
//   }
// };

module.exports = Game;
