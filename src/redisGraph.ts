import redis, { ClientOpts, RedisClient } from "redis";
import util from "util";
import { ResultSet } from "./resultSet";

/**
 * RedisGraph client
 */
export class RedisGraph {
	private _graphId: string;
	private _sendCommand: (command: string, args?: any[]) => Promise<any>;

	/**
	 * Creates a client to a specific graph running on the specific host/post
	 * See: node_redis for more options on createClient
	 *
	 * @param graphId the graph id
	 * @param host Redis host or node_redis client
	 * @param port Redis port
	 * @param options node_redis options
	 */
	constructor(graphId: string, host?: string | RedisClient, port=6379, options?: ClientOpts) {
		this._graphId = graphId;
		const client =
			host instanceof redis.RedisClient
				? host
				: redis.createClient(port, host, options);
		this._sendCommand = util.promisify(client.send_command).bind(client);
	}

	/**
	 * SET & SETEX
	 *
	 * Set key to hold the string value.
	 * If key already holds a value, it is overwritten, regardless of its type.
	 * Any previous time to live associated with the key is discarded on successful SET operation.
	 *
	 * https://redis.io/commands/set
	 * https://redis.io/commands/setex
	 *
	 * @param {string} key key
	 * @param {string} value value
	 * @param {number} [expiration] expiration in seconds
	 * @return {string|null} OK if SET was executed correctly.
	 * @example
	 *
	 * graph.set("foo", "bar")
	 * graph.set("foo", "bar", 120) // with expiration
	 */
	async set(key: string, value: string, expiration?: number): Promise<string> {
		try {
			if (expiration) return await this._sendCommand("SETEX", [key, expiration, value]);
			return await this._sendCommand("SET", [key, value]);
		} catch (e) {
			throw new Error(e)
		}
	}

	/**
	 * GET
	 *
	 * Get the value of key.
	 * If the key does not exist the special value nil is returned.
	 * An error is returned if the value stored at key is not a string,
	 * because GET only handles string values.
	 *
	 * https://redis.io/commands/get
	 *
	 * @param {string} key key
	 * @return {string|null} the value of key, or nil when key does not exist.
	 * @example
	 *
	 * graph.set("foo");
	 */
	async get(key: string): Promise<string|null> {
		try {
			return await this._sendCommand("GET", [key]);
		} catch (e) {
			throw new Error(e)
		}
	}

	/**
	 * GRAPH.QUERY
	 *
	 * Executes the given query against a specified graph.
	 *
	 * https://oss.redislabs.com/redisgraph/commands/#graphquery
	 *
	 * @param {string} query cypher query
	 * @return {ResultSet} result set
	 * @example
	 *
	 * graph.query("MATCH (p:president)-[:born]->(:state {name:'Hawaii'}) RETURN p")
	 */
	async query(query: string) {
		try {
			const res = await this._sendCommand("GRAPH.QUERY", [this._graphId, query])
			return new ResultSet(res);
		} catch (e) {
			throw new Error(e)
		}
	}

	/**
	 * GRAPH.BULK
	 *
	 * TO-DO: DOES NOT CURRENTLY WORK
	 *
	 * https://github.com/RedisLabsModules/RedisGraph/tree/master/demo/bulk_insert
	 *
	 * @param {string[]} queries cypher queries
	 * @return {ResultSet} result set
	 * @example
	 */
	async bulk(queries: string[]) {
		try {
			const res = await this._sendCommand("GRAPH.BULK", [this._graphId, ...queries])
			return new ResultSet(res);
		} catch (e) {
			throw new Error(e)
		}
	}

	/**
	 * GRAPH.DELETE
	 *
	 * Completely removes the graph and all of its entities.
	 *
	 * Note: To delete a node from the graph (not the entire graph), execute a MATCH query and pass the alias to the DELETE clause:
	 *
	 * GRAPH.QUERY DEMO_GRAPH "MATCH (x:y {propname: propvalue}) DELETE x"
	 *
	 * https://oss.redislabs.com/redisgraph/commands/#graphdelete
	 *
	 * @return String indicating if operation succeeded or failed.
	 * @example
	 *
	 * graph.deleteGraph();
	 */
	async deleteGraph() {
		try {
			const res = await this._sendCommand("GRAPH.DELETE", [this._graphId])
			return new ResultSet(res);
		} catch (e) {
			throw new Error(e)
		}
	}

	/**
	 * GRAPH.EXPLAIN
	 *
	 * Constructs a query execution plan but does not run it.
	 *
	 * Inspect this execution plan to better understand how your query will get executed.
	 *
	 * https://oss.redislabs.com/redisgraph/commands/#graphexplain
	 *
	 * @param {string} [query] cypher query
	 * @return String representation of a query execution plan
	 * @example
	 *
	 * graph.explain("MATCH (p:president)-[:born]->(h:state {name:'Hawaii'}) RETURN p");
	 */
	async explain(query: string) {
		try {
			const res = await this._sendCommand("GRAPH.EXPLAIN", [this._graphId, query])
			return new ResultSet(res);
		} catch (e) {
			throw new Error(e)
		}
	}
}
