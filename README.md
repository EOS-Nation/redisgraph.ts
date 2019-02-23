[![license](https://img.shields.io/github/license/RedisGraph/redisgraph.js.svg)](https://github.com/RedisGraph/redisgraph.js)
[![CircleCI](https://circleci.com/gh/RedisGraph/redisgraph.js/tree/master.svg?style=svg)](https://circleci.com/gh/RedisGraph/redisgraph.js/tree/master)
[![npm version](https://badge.fury.io/js/redisgraph.js.svg)](https://badge.fury.io/js/redisgraph.js)
[![GitHub issues](https://img.shields.io/github/release/RedisGraph/redisgraph.js.svg)](https://github.com/RedisGraph/redisgraph.js/releases/latest)
[![Codecov](https://codecov.io/gh/RedisGraph/redisgraph.js/branch/master/graph/badge.svg)](https://codecov.io/gh/RedisGraph/redisgraph.js)

# redisgraph.ts

[RedisGraph](https://github.com/RedisLabsModules/redis-graph/) JavaScript Client


# Installation

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install --save git+ssh://git@github.com:eosnationftw/redisgraph.ts.git
```

## Overview

### Official Releases


# Example: Using the JavaScript Client

```javascript
import { RedisGraph } from "redisgraph.ts";

(async () => {
	const graph = new RedisGraph("social");
	await graph.query("CREATE (:person{name:'roi',age:32})");
	await graph.query("CREATE (:person{name:'amit',age:30})");
	await graph.query("MATCH (a:person), (b:person) WHERE (a.name = 'roi' AND b.name='amit') CREATE (a)-[:knows]->(a)");
	const res = await graph.query("MATCH (a:person)-[:knows]->(:person) RETURN a");

	while (res.hasNext()) {
		const record = res.next();
		console.log(record.get("a.name"));
	}
	console.log(res.getStatistics().queryExecutionTime());

})().catch(err => console.log(err))
```

## Running tests

A simple test suite is provided, and can be run with:

```sh
$ npm test
```

The tests expect a Redis server with the RedisGraph module loaded to be available at localhost:6379

## License

redisgraph.js is distributed under the BSD3 license - see [LICENSE](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express.svg
[npm-url]: https://npmjs.org/package/redisgraph.js
