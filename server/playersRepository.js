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

method.findPlayerByName = function(name, callback) {
    this.db.findOne({name: playerInfo.name},{}, function(err, player) {
        if (err) console.log(err);
        callback(player);
      });
};

module.exports = PlayersRepository;