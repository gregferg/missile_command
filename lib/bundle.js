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

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(11);
	
	
	var Lightening = __webpack_require__(12);
	
	var game;
	var gameView;
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  var ctx = canvasEl.getContext("2d");
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	
	  ctx.font = "48px helvetica";
	  ctx.fillText("Hit Space to play", 360, 300);
	
	
	  var startGame = function(e) {
	    if (e.keyCode === 32) {
	      game = new Game(ctx);
	      gameView = new GameView(game, ctx).start();
	      window.removeEventListener("keydown", this);
	    }
	  };
	
	  window.addEventListener("keydown", startGame);
	
	  // window.addEventListener("click", function(e) {
	  //   new Lightening(ctx, e);
	  // });
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Target = __webpack_require__(2);
	var EnemyMissile = __webpack_require__(7);
	var Explosion = __webpack_require__(6);
	var Base = __webpack_require__(8);
	var MissileBase = __webpack_require__(9);
	var Round = __webpack_require__(10);
	
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var FriendlyMissile = __webpack_require__(3);
	
	
	var Target = function(game, ctx) {
	  this.game = game;
	  this.ctx = ctx;
	  this.radius = 10;
	  this.pos = [0,0];
	
	  var canvas = document.getElementById('game');
	  canvas.addEventListener("mousemove", function (e) {
	    this.pos = [e.clientX - 8 - e.currentTarget.offsetLeft, e.clientY - 8];
	  }.bind(this));
	
	  canvas.addEventListener("click", function (e) {
	    var pos = [e.clientX - e.currentTarget.offsetLeft, e.clientY - 8];
	    this.shootMissile(pos);
	  }.bind(this));
	};
	
	Target.prototype.shootMissile = function (pos) {
	  var startingPos = this.chooseMissileBase(pos);
	  if (!startingPos) { return ; }
	
	  this.game.add(
	    new FriendlyMissile({
	      friendlyMissile: true,
	      startingPos: startingPos,
	      targetPos: pos,
	      ctx: this.ctx,
	      game: this.game
	    })
	  );
	};
	
	Target.prototype.chooseMissileBase = function(pos) {
	  var remaingingMissileBases = this.game.remaingingMissileBases();
	  var missileDistances = [200, 400, 1000];
	
	  for (var i = 0; i < missileDistances.length; i++) {
	    var dist = missileDistances[i];
	
	    for (var j = 0; j < remaingingMissileBases.length; j++) {
	      var missileBase = remaingingMissileBases[j];
	
	      if (Math.abs(pos[0] - missileBase.pos[0]) <= dist && missileBase.ammo > 0) {
	        missileBase.fire();
	        return missileBase.pos;
	      }
	    }
	  }
	
	  return false;
	};
	
	Target.prototype.draw = function () {
	  var ctx = this.ctx;
	  ctx.fillStyle = 'blue';
	
	  ctx.beginPath();
	  ctx.moveTo(this.pos[0], this.pos[1] + 10);
	  ctx.lineTo(this.pos[0], this.pos[1] - 10);
	  ctx.moveTo(this.pos[0] - 10, this.pos[1]);
	  ctx.lineTo(this.pos[0] + 10, this.pos[1]);
	  ctx.stroke();
	};
	
	
	module.exports = Target;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	
	var Missile = __webpack_require__(5);
	
	
	
	var FriendlyMissile = function (targetPos, ctx, game) {
	
	
	  Missile.call(this, targetPos, ctx, game);
	};
	
	
	Util.inherits(FriendlyMissile, Missile);
	
	FriendlyMissile.prototype.type = "FriendlyMissile";
	
	module.exports = FriendlyMissile;


/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var Explosion = __webpack_require__(6);
	
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var Missile = __webpack_require__(5);
	
	
	
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


/***/ },
/* 8 */
/***/ function(module, exports) {

	var Base = function(pos, game) {
	  this.alive = true;
	  this.pos = pos;
	};
	
	
	Base.prototype.draw = function (ctx) {
	  if (this.alive) {
	    ctx.fillStyle = '#616161';
	    ctx.fillRect(this.pos[0] - 10, this.pos[1], 20, 10);
	  } else {
	    ctx.fillStyle = 'red';
	    ctx.fillRect(this.pos[0] - 10, this.pos[1], 20, 10);
	  }
	};
	
	Base.prototype.move = function () {
	
	};
	
	
	module.exports = Base;


/***/ },
/* 9 */
/***/ function(module, exports) {

	
	
	
	var MissileBase = function(pos, game) {
	  this.pos = pos;
	  this.ammo = 10;
	  this.alive = true;
	};
	
	MissileBase.prototype.type = "MissileBase";
	
	MissileBase.prototype.resetAmmo = function() {
	  this.ammo = 10;
	};
	
	MissileBase.prototype.draw = function (ctx) {
	  ctx.font = "24px helvetica";
	
	  if (this.alive) {
	    ctx.fillStyle = '#616161';
	    ctx.fillRect(this.pos[0] - 15, this.pos[1], 30, 20);
	    ctx.fillText(this.ammo.toString(), this.pos[0] - 10, this.pos[1] + 50);
	  } else {
	    ctx.fillStyle = 'red';
	    ctx.fillRect(this.pos[0] - 15, this.pos[1], 30, 20);
	    ctx.fillText("X", this.pos[0] - 10, this.pos[1] + 50);
	
	  }
	
	
	};
	
	
	MissileBase.prototype.move = function () {
	
	};
	
	MissileBase.prototype.fire = function () {
	  this.ammo -= 1;
	};
	
	module.exports = MissileBase;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var EnemyMissile = __webpack_require__(7);
	
	
	var Round = function(roundNumber, game) {
	  this.roundNumber = roundNumber;
	  this.game = game;
	  this.roundOccuring = false;
	};
	
	Round.prototype.calculateMissiles = function(roundNumber) {
	  return 10 + roundNumber * 2;
	};
	
	Round.prototype.timeInterval = function(roundNumber) {
	  return 1000 / (roundNumber / 2);
	};
	
	Round.prototype.startRound = function() {
	  this.roundOccuring = true;
	  var numMissiles = this.calculateMissiles(this.roundNumber);
	  var timeInterval = this.timeInterval(this.roundNumber);
	  var game = this.game;
	  var enemyMissilesReleased = 0;
	
	  this.missileCreater = window.setInterval(function() {
	    enemyMissilesReleased += 1;
	    game.add(new EnemyMissile(game.ctx, game));
	
	    if (enemyMissilesReleased === numMissiles) {
	      clearInterval(this.missileCreater);
	      this.roundOver();
	    }
	  }.bind(this), 1000);
	};
	
	Round.prototype.isRoundOver = function () {
	  return this.roundOccuring ? false : true;
	};
	
	Round.prototype.nextRound = function () {
	  this.roundNumber += 1;
	  this.startRound();
	};
	
	Round.prototype.roundOver = function () {
	  this.roundOccuring = false;
	};
	
	Round.prototype.stopRound = function () {
	  clearInterval(this.missileCreater);
	};
	
	
	
	module.exports = Round;


/***/ },
/* 11 */
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
/* 12 */
/***/ function(module, exports) {

	var Lightening = function(ctx, e) {
	  this.startingPos = [e.clientX, e.clientY];
	  this.pos = this.startingPos;
	  this.ctx = ctx;
	  this.draw();
	};
	
	
	Lightening.prototype.draw = function() {
	  while (this.pos[1] < 600) {
	    var nextPos = this.nextPoint(this.pos);
	    this.connectPoints(this.pos, nextPos);
	    this.pos = nextPos;
	    if (Math.random() < .005) {
	      var newPos = { clientX: this.pos[0], clientY: this.pos[1] };
	      new Lightening(this.ctx, newPos);
	    }
	  }
	};
	
	
	Lightening.prototype.nextPoint = function(pos) {
	  return [
	    pos[0] + Math.random() * 7 - Math.random() * 7,
	    pos[1] + Math.random() * 5
	  ];
	};
	
	Lightening.prototype.connectPoints = function(startPos, endPos) {
	  var ctx = this.ctx;
	
	  ctx.beginPath();
	  ctx.strokeStyle = 'blue';
	  ctx.moveTo(startPos[0], startPos[1]);
	  ctx.lineTo(endPos[0], endPos[1]);
	  ctx.stroke();
	};
	
	
	module.exports = Lightening;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map