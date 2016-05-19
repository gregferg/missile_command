var Game = require("./game");
var GameView = require("./gameView");


var Lightening = require('./lightening');

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
