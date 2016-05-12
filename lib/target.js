var FriendlyMissle = require('./friendly_missle.js');


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
    this.shootMissle(pos);
  }.bind(this));
};

Target.prototype.shootMissle = function (pos) {
  var startingPos = this.chooseMissleBase(pos);
  if (!startingPos) { return ; }

  this.game.add(
    new FriendlyMissle({
      friendlyMissle: true,
      startingPos: startingPos,
      targetPos: pos,
      ctx: this.ctx,
      game: this.game
    })
  );
};

Target.prototype.chooseMissleBase = function(pos) {
  var remaingingMissleBases = this.game.remaingingMissleBases();
  var missleDistances = [200, 400, 1000];

  for (var i = 0; i < missleDistances.length; i++) {
    var dist = missleDistances[i];

    for (var j = 0; j < remaingingMissleBases.length; j++) {
      var missleBase = remaingingMissleBases[j];

      if (Math.abs(pos[0] - missleBase.pos[0]) <= dist && missleBase.ammo > 0) {
        missleBase.fire();
        return missleBase.pos;
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
