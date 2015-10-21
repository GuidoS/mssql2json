'use strict';

var fromMssql = require('./');
var fs = require('fs');
var argv = require('yargs')
  .usage('Usage: $0 config_file [-q query] [-u unique]')
  .demand(1)
  .alias('q', 'query')
  .describe('q', 'sql query')
  .alias('u', 'unique')
  .describe('u', 'unique field, non-nullable')
  .argv;

var config = JSON.parse(fs.readFileSync(argv._[0], 'utf8'));
var q = argv.q || config.query;
var u = argv.u || config.unique;
var db = config.db;

fromMssql(db, u, q).pipe(process.stdout);
