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
