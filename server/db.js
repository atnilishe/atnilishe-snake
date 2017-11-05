Datastore = require('nedb');

var db = {
    get: function (dbName, query) {
        this.datastore = new Datastore({
            filename: dbName + '.db',
            autoload: true,
            timestampData: true
        });
        this.query = query;
        this.data = undefined;
        return this;
    },
    update: function (data) {
        this.data = data;
        return this;
    },
    run: function (callback) {
        if (this.data) {
            this.datastore.update(this.query, this.data, { upsert: true, returnUpdatedDocs: true },
                function (err, numberOfUpdated, affectedDocuments, upsert) {
                    if (err) callback(err);
                    else callback(null, affectedDocuments || {});
                });
        } else {
            this.datastore.find(this.query, function (err, docs) {
                if (err) callback(err);
                else callback(null, docs[0] || {});
              });
        }
    }
};

module.exports = db;
