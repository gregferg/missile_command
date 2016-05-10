var FriendlyMissle = require('./friendly_missle.js');


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
