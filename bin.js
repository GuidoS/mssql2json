var argv = require('yargs')
  .usage('Usage: $0 config_file [options]')
  .command('count', 'Count the lines in a file')
  .demand(1)
  .example('$0 config.json', 'use config file')
  .demand('f')
  .alias('f', 'file')
  .nargs('f', 1)
  .describe('f', 'Load a file')
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2015')
  .argv;

var fs = require('fs');
var s = fs.createReadStream(argv.file);

var lines = 0;
s.on('data', function (buf) {
  lines += buf.toString().match(/\n/g).length;
});

s.on('end', function () {
  console.log(lines);
});
