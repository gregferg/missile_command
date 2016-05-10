/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(4);
	var GameView = __webpack_require__(10);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game(ctx);
	  new GameView(game, ctx).start();
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var Explosion = __webpack_require__(11);
	
	var SPEED = 5;
	var STARTING_POS = [600, 600];
	
	var Missle = function(options) {
	  if (!options.startingPos) {
	    this.strokeStyle = 'blue';
	    this.type = "FriendlyMissle";
	  } else {
	    this.strokeStyle = 'red';
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
	
	
	Missle.prototype.draw = function (ctx) {
	  //the target pos of the missle
	  if (this.type === "FriendlyMissle") {
	  var target = this.targetPos;
	
	  ctx.moveTo(target[0] - 10, target[1] + 10);
	  ctx.lineTo(target[0] + 10, target[1] - 10);
	  ctx.moveTo(target[0] - 10, target[1] - 10);
	  ctx.lineTo(target[0] + 10, target[1] + 10);
	  ctx.stroke();
	}
	
	  //the circle head of the missle
	  ctx.strokeStyle = this.strokeStyle;
	  ctx.fillStyle = this.strokeStyle;
	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0], this.pos[1], 4, 0, 2 * Math.PI, true
	  );
	  ctx.fill();
	
	  //the tail of the missle
	
	  var gradient = ctx.createLinearGradient(
	    this.pos[0],
	    this.pos[1],
	    this.pos[0] - this.delta[0] * SPEED * 5,
	    this.pos[1] - this.delta[1] * SPEED * 5
	  );
	  gradient.addColorStop(0, this.strokeStyle);
	  gradient.addColorStop(1,"white");
	
	  ctx.strokeStyle = gradient;
	
	  ctx.beginPath();
	
	  ctx.moveTo(this.pos[0], this.pos[1]);
	  ctx.lineTo(
	    this.pos[0] - this.delta[0] * SPEED * 5,
	    this.pos[1] - this.delta[1] * SPEED * 5
	  );
	  ctx.stroke();
	
	};
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	Missle.prototype.move = function (timeDelta) {
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
	    this.type === 'FriendlyMissle'
	    ) {
	      this.game.add(new Explosion(this.pos, this.game));
	      this.game.remove(this);
	    }
	
	  if (
	    this.pos[1] > this.targetPos[1] &&
	    this.type === 'EnemyMissle'
	    ) {
	    this.game.remove(this);
	    this.game.destroyBase(this.targetPos);
	    this.game.add(new Explosion(this.targetPos, this.game));
	    console.log("LOST A POINT");
	  }
	};
	
	
	
	module.exports = Missle;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var FriendlyMissle = __webpack_require__(3);
	
	
	var Target = function(game, ctx) {
	  this.game = game;
	  this.ctx = ctx;
	  this.radius = 10;
	  this.pos = [0,0];
	
	  var canvas = document.getElementById('game');
	  canvas.addEventListener("mousemove", function (e) {
	    this.pos = [e.clientX - 8, e.clientY - 8];
	  }.bind(this));
	
	  canvas.addEventListener("click", function (e) {
	    console.log(e);
	    var pos = [e.clientX - 8, e.clientY - 8];
	    this.game.add(
	      new FriendlyMissle({
	        targetPos: pos,
	        ctx: this.ctx,
	        game: game
	      })
	    );
	  }.bind(this));
	};
	
	Target.prototype.draw = function () {
	  var ctx = this.ctx;
	  ctx.fillStyle = 'blue';
	
	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  );
	  ctx.stroke();
	};
	
	
	module.exports = Target;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	
	var Missle = __webpack_require__(1);
	
	
	
	var FriendlyMissle = function (targetPos, ctx, game) {
	
	
	  Missle.call(this, targetPos, ctx, game);
	};
	
	
	Util.inherits(FriendlyMissle, Missle);
	
	FriendlyMissle.prototype.type = "FriendlyMissle";
	
	module.exports = FriendlyMissle;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroid = __webpack_require__(5);
	var Bullet = __webpack_require__(9);
	var Ship = __webpack_require__(8);
	var Target = __webpack_require__(2);
	var EnemyMissle = __webpack_require__(13);
	var Explosion = __webpack_require__(11);
	var Base = __webpack_require__(14);
	
	
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var MovingObject = __webpack_require__(7);
	var Ship = __webpack_require__(8);
	
	var DEFAULTS = {
		COLOR: "#505050",
		RADIUS: 25,
		SPEED: 4
	};
	
	var Asteroid = function (options = {}) {
	  options.color = DEFAULTS.COLOR;
	  options.pos = options.pos || options.game.randomPosition();
	  options.radius = DEFAULTS.RADIUS;
	  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
	
	  MovingObject.call(this, options);
	};
	
	
	Asteroid.prototype.collideWith = function (otherObject) {
	  if (otherObject.type === "Ship") {
	    otherObject.relocate();
	  }
	};
	
	Util.inherits(Asteroid, MovingObject);
	
	Asteroid.prototype.type = "Asteroid";
	
	module.exports = Asteroid;

/***/ },
/* 6 */
/***/ function(module, exports) {

	var Util = {
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir: function (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	  // Find distance between two points.
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	  // Find the length of the vector.
	  norm: function (vec) {
	    return Util.dist([0, 0], vec);
	  },
	  // Return a randomly oriented vector with the given length.
	  randomVec : function (length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	  // Scale the length of a vector by the given amount.
	  scale: function (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	  inherits: function (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass };
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	};
	
	module.exports = Util;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	
	var MovingObject = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
	};
	
	MovingObject.prototype.collideWith = function (otherObject) {
	  ; // default do nothing
	};
	
	MovingObject.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	
	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  );
	  ctx.fill();
	};
	
	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  var centerDist = Util.dist(this.pos, otherObject.pos);
	  return centerDist < (this.radius + otherObject.radius);
	};
	
	MovingObject.prototype.isWrappable = true;
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	MovingObject.prototype.move = function (timeDelta) {
	  //timeDelta is number of milliseconds since last move
	  //if the computer is busy the time delta will be larger
	  //in this case the MovingObject should move farther in this frame
	  //velocity of object is how far it should move in 1/60th of a second
	  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
	      offsetX = this.vel[0] * velocityScale,
	      offsetY = this.vel[1] * velocityScale;
	
	  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	
	  if (this.game.isOutOfBounds(this.pos)) {
	    if (this.isWrappable) {
	      this.pos = this.game.wrap(this.pos);
	    } else {
	      this.remove();
	    }
	  }
	};
	
	MovingObject.prototype.remove = function () {
	  this.game.remove(this);
	};
	
	module.exports = MovingObject;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Ship = __webpack_require__(8);
	var MovingObject = __webpack_require__(7);
	var Util = __webpack_require__(6);
	var Bullet = __webpack_require__(9);
	
	function randomColor() {
	  var hexDigits = "0123456789ABCDEF";
	
	  var color = "#";
	  for (var i = 0; i < 3; i ++) {
	    color += hexDigits[Math.floor((Math.random() * 16))];
	  }
	
	  return color;
	}
	
	var Ship = function (options) {
	  options.radius = Ship.RADIUS;
	  options.vel = options.vel || [0, 0];
	  options.color = options.color || randomColor();
	
	  MovingObject.call(this, options);
	};
	
	Ship.prototype.type = "Ship";
	
	Ship.RADIUS = 15;
	
	Util.inherits(Ship, MovingObject);
	
	Ship.prototype.fireBullet = function () {
	  var norm = Util.norm(this.vel);
	
	  if (norm == 0) {
	    // Can't fire unless moving.
	    return;
	  }
	
	  var relVel = Util.scale(
	    Util.dir(this.vel),
	    Bullet.SPEED
	  );
	
	  var bulletVel = [
	    relVel[0] + this.vel[0], relVel[1] + this.vel[1]
	  ];
	
	  var bullet = new Bullet({
	    pos: this.pos,
	    vel: bulletVel,
	    color: this.color,
	    game: this.game
	  });
	
	  this.game.add(bullet);
	};
	
	Ship.prototype.power = function (impulse) {
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];
	};
	
	Ship.prototype.relocate = function () {
	  this.pos = this.game.randomPosition();
	  this.vel = [0, 0];
	};
	
	Ship.prototype.type = "Ship";
	
	module.exports = Ship;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var MovingObject = __webpack_require__(7);
	var Asteroid = __webpack_require__(5);
	
	var Bullet = function (options) {
	  options.radius = Bullet.RADIUS;
	
	  MovingObject.call(this, options);
	};
	
	Bullet.RADIUS = 2;
	Bullet.SPEED = 15;
	
	Util.inherits(Bullet, MovingObject);
	
	Bullet.prototype.collideWith = function (otherObject) {
	  if (otherObject.type === "Asteroid") {
	    this.remove();
	    otherObject.remove();
	  }
	};
	
	Bullet.prototype.isWrappable = false;
	Bullet.prototype.type = "Bullet";
	
	module.exports = Bullet;


/***/ },
/* 10 */
/***/ function(module, exports) {

	
	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	};
	
	
	GameView.prototype.start = function () {
	  this.lastTime = 0;
	  //start the animation
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function(time){
	  var timeDelta = time - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	
	  //every call to animate requests causes another call to animate
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	
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


/***/ },
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var Missle = __webpack_require__(1);
	
	
	
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


/***/ },
/* 14 */
/***/ function(module, exports) {

	var Base = function(pos, game) {
	  this.alive = true;
	  this.pos = pos;
	};
	
	
	Base.prototype.draw = function (ctx) {
	  ctx.strokeStyle = 'green';
	  ctx.fillStyle = 'red';
	
	  if (this.alive) {
	    ctx.strokeRect(this.pos[0], this.pos[1], 20, 10);
	  } else {
	    ctx.fillRect(this.pos[0], this.pos[1], 20, 10);
	  }
	};
	
	Base.prototype.move = function () {
	
	};
	
	
	module.exports = Base;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map