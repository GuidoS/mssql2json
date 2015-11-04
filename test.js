'use strict';

var fromMssql = require('./');

var test = require('tape');
var JSONStream = require('jsonstream3');
var fs = require('fs');

var testSize = 10;

// t1 test config
var t1Config = {
  'query': `select top ${testSize} * from table`,
  'batchSize': 2,
  'conn': {
    'server': 'test',
    'userName': 'test',
    'password': 'test',
    'options': {
      'database': 'test',
      'port': 1433
    }
  }
};

// t1 test config values from config file
fs.stat('./config.json', (err, stat) => {
  if (!err) {
    t1Config = require('./config.json');
  }
});

//
test(`(t1) ${testSize} items requested`, function (t) {
  t.plan(1);

  var items = 0;

  fromMssql(t1Config.conn, t1Config.query, t1Config.batchSize)
    .on('data', (data) => {
      items = (data.substr(-1, 1) === '\n') ? items : items + 1;
      console.log(items, data);
    })
    .on('error', e => t.error(e))
    .on('end', () => {
      t.equals(items, testSize);
      t.end();
    })
    .pipe(JSONStream.parse('*'));
});
