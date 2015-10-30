# mssql2json
mssql2json is a wrapper around the [tedious](https://github.com/pekim/tedious) library that takes in db credentials and a query and outputs JSON  array as a stream. Please review the documentation at the tedious site for more information about the TDS protocols supported.

> Please feel free to submit issues and pull requests. If you'd like to contribute and don't know where to start, have a look at [the issue list](https://github.com/GuidoS/mssql2json/issues) :)

# installation

```
npm install tedious
```

# example

```javascript
var fromMssql = require('mssql2json');

var q = 'select * table';
var db = {
  'server': 'test',
  'userName': 'test',
  'password': 'test',
  'options': {
    'database': 'test',
    'port': 1433
  }
}

fromMssql(db, q).pipe(process.stdout);
```

# inspired by
This modules is inspired by [postgres2geojson](https://github.com/AppGeo/postgres2geojson).
