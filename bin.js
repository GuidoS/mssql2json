#!/usr/bin/env node

'use strict';

var fromMssql = require('./');
var fs = require('fs');
var argv = require('yargs')
  .usage('Usage: $0 config_file')
  .demand(1)
  .alias('q', 'query')
  .describe('q', 'sql query')
  .alias('b', 'batch')
  .describe('b', 'batch size')
  .alias('c', 'conn')
  .describe('c', 'connection information object')
  .help('h')
  .alias('h', 'help')
  .example(`$0 config.json -q 'select * from table'`, `use config file, overide query in config`)
  .epilog('Copyright (c) 2015 Applied Geographics, Inc.\nLicensed under The MIT License')
  .argv;

fs.readFile(argv._[0], (err, resp) => {
  var config = null;
  if (err) {
    config = {};
  } else {
    config = JSON.parse(resp.toString());
  }

  var c = argv.c || config.conn;
  var q = argv.q || config.query;
  var b = argv.b || config.batchSize;

  fromMssql(c, q, b).pipe(process.stdout);
  
});
