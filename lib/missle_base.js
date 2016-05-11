


var MissleBase = function(pos, game) {
  this.pos = pos;
  this.ammo = 10;
  this.alive = true;
};

MissleBase.prototype.type = "MissleBase";

MissleBase.prototype.resetAmmo = function() {
  this.ammo = 10;
};

MissleBase.prototype.draw = function (ctx) {
  ctx.strokeStyle = 'green';
  ctx.fillStyle = 'red';

  if (this.alive) {
    ctx.strokeRect(this.pos[0], this.pos[1], 30, 20);
    ctx.fillText(this.ammo.toString(), this.pos[0], this.pos[1] + 50);
  } else {
    ctx.fillRect(this.pos[0], this.pos[1], 30, 20);
    ctx.fillText("X", this.pos[0], this.pos[1] + 50);

  }


};


MissleBase.prototype.move = function () {

};

MissleBase.prototype.fire = function () {
  this.ammo -= 1;
};

module.exports = MissleBase;
