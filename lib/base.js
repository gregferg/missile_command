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
