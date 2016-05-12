


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


MissleBase.prototype.move = function () {

};

MissleBase.prototype.fire = function () {
  this.ammo -= 1;
};

module.exports = MissleBase;
