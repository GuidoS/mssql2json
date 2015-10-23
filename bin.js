#!/usr/bin/env node

'use strict';

var fromMssql = require('./');
var fs = require('fs');
var argv = require('yargs')
  .usage('Usage: $0 config_file [-q query]')
  .demand(1)
  .alias('q', 'query')
  .describe('q', 'sql query')
  .help('h')
  .alias('h', 'help')
  .example(`$0 config.json -q 'select top 5 * from realproperty'`, `use config file, overide query in config`)
  .epilog('Copyright (c) 2015 Applied Geographics, Inc.\nLicensed under The MIT License')
  .argv;
fs.readFile(argv._[0], (err, resp) => {
  if (err) {
    throw err;
  }
  var config = JSON.parse(resp.toString());
  var q = argv.q || config.query;
  var db = config.db;

  fromMssql(db, q).pipe(process.stdout);
});
