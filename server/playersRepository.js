var method = PlayersRepository.prototype;

var Datastore = require('nedb');

function PlayersRepository() {
    this.db = new Datastore({
      filename: 'players.db', 
      autoload: true,
      timestampData: true
    });
}

method.createPlayer = function(player) {
    this.db.insert(player, function(err, newPlayer) {
        if (err) console.log(err);
        console.log(newPlayer);
    });
};

method.updatePlayer = function(player) {
  this.db.update(
    {uid: player.playerInfo.uid},
    {uid: player.playerInfo.uid, name: player.playerInfo.name, length: player.body.length},
    function(err, numberOfUpdated, upsert) {
      if (err) console.log(err);
  });
};

method.findPlayerByUid = function(uid, callback) {
    this.db.findOne({uid: uid},{}, function(err, player) {
        if (err) console.log(err);
        callback(player);
    });
};

module.exports = PlayersRepository;