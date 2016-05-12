var Util = require("./util");

var Missile = require('./missile');



var FriendlyMissile = function (targetPos, ctx, game) {


  Missile.call(this, targetPos, ctx, game);
};


Util.inherits(FriendlyMissile, Missile);

FriendlyMissile.prototype.type = "FriendlyMissile";

module.exports = FriendlyMissile;
