var FriendlyMissile = require('./friendly_missile.js');


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
