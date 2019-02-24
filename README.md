# redisgraph.ts

> TypeScript implementation of [redisgraph.js](https://github.com/RedisGraph/redisgraph.js).

[RedisGraph](https://github.com/RedisLabsModules/redis-graph/) TypeScript Client

# Installation

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install --save redisgraph.ts
```

## Overview

### Official Releases

# Example: Using the Typescript Client

```typescript
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
