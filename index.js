'use strict';

var tedious = require('tedious');
var JSONStream = require('jsonstream3');
var noms = require('noms');

module.exports = function fromMssql(db, unique, queryStr) {
  // build stream and output to stdout
  var out = JSONStream.stringify();

  // init connection object
  var connection = new tedious.Connection(db);

  // init promises with connection connect event error handling
  var ready = new Promise(function (success, error) {
    connection.on('connect', function (err) {
      if (err) {
        return error(err);
      }
      success();
    });
  });

  // setup looping variables
  var batchSize = 1000;
  var uniqueLast = -1;

  // looping batch sql select routine
  var readable = noms.obj(function (done) {
    ready.then(() => {
      var items = 0;
      var query = `select top ${batchSize} * from (${queryStr}) as t where
        ${unique}  > ${uniqueLast}
        order by ${unique} asc`;

      var command = new tedious.Request(query, err => {
        // is last batch the final batch
        if (items !== batchSize) {
          this.push(null);
          connection.close();
        }
        done(err);
      });

      command.on('row', row => {

        // Process row into json and then push to stream
        var o = {};
        row.forEach(function (c) {
          o[c.metadata.colName] = c.value;
        });
        this.push(o);

        // update looping variables
        uniqueLast = o[unique];
        items++;
      });

      connection.execSql(command);
    }).catch(done);
  });

  // output values to stdstream
  readable.pipe(out);
  return out;
};
