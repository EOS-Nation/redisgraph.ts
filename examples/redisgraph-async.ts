import { RedisGraph } from "../";

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
