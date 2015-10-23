'use strict';

var tedious = require('tedious');
var JSONStream = require('jsonstream3');
var noms = require('noms');

module.exports = function fromMssql(db, queryStr) {
  // build stream and output to stdout
  var out = JSONStream.stringify();

  // init connection object
  var connection = new tedious.Connection(db);

  // init promises with connection connect event error handling
  var ready = new Promise(function(success, error) {
    connection.on('connect', function(err) {
      if (err) {
        return error(err);
      }
      success();
    });
  });

  // setup looping variables
  var batchSize = 1000;
  var indexLast = 0;

  // looping batch sql select routine
  var readable = noms.obj(function(done) {
    ready.then(() => {
      var items = 0;

      var query = `\
        select top ${batchSize} * from (\
          select ROW_NUMBER() OVER (order by rField) AS rIndex, * from(\
            select 'a' as rField, * from(${queryStr}) t\
          ) tt\
        ) ttt\
        where ttt.rIndex > ${indexLast}`;

      var command = new tedious.Request(query, err => {
        // is last batch the final batch
        if (items !== batchSize) {
          this.push(null);
          connection.close();
        }
        done(err);
      });

      // on row event from table
      command.on('row', row => {

        // Process row into json
        var o = {};
        row.forEach(function(c) {
          var colName = c.metadata.colName;
          if (colName != 'rIndex' && colName != 'rField') {
            o[colName] = c.value;
          }
        });

        // Push row into stream
        this.push(o);

        // update looping variables
        indexLast++;
        items++;
      });

      connection.execSql(command);
    }).catch(done);
  });

  // output values to stdstream
  readable.pipe(out);
  return out;
};
