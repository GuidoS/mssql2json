'use strict';

var config = require('./config.json');
var fromMssql = require('./');
var test = require('tape');
var JSONStream = require('jsonstream3');

test('works!', function (t) {
  var query = 'select top 2000 * from AddressPoint';
  var items = 0;
  fromMssql(config.db, config.unique, query)
    .on('error', e => t.error(e))
    .pipe(JSONStream.parse('*'))
    .on('data', () => items++)
    .on('end', () => {
      t.equals(2000, items);
      t.end();
    }).on('error', e => t.error(e));

});
