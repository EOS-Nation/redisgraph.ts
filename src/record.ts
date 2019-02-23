import { Header, Values } from "./types";

/**
 * Hold a query record
 */
export class Record {
	private _header: Header;
	private _values: Values;

	constructor(header: Header, values: Values) {
		this._header = header;
		this._values = values;
	}

	get(key: string|number): string|number {
		let index: string|number = key;
		if (typeof key === "string") {
			index = this._header.indexOf(key);
		}
		return this._values[Number(index)];
	}

	keys() {
		return this._header;
	}

	values() {
		return this._values;
	}

	entries() {
		return this._header.map((key, index) => [key, this._values[index]]);
	}

	object<T = any>() {
		const init: T = Object()
		return this._header.reduce<T>((prev: any, key, index) => {
			prev[key] = this._values[index]
			return prev;
		}, init)
	}

	includesKey(key: string) {
		return this._header.includes(key);
	}

	includesValue(value: string|string) {
		return this._values.includes(value);
	}

	get length() {
		return this._header.length;
	}
}
