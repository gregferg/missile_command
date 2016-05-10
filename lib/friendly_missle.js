var Util = require("./util");

var Missle = require('./missle');



var FriendlyMissle = function (targetPos, ctx, game) {


  Missle.call(this, targetPos, ctx, game);
};


Util.inherits(FriendlyMissle, Missle);

FriendlyMissle.prototype.type = "FriendlyMissle";

module.exports = FriendlyMissle;
