


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
