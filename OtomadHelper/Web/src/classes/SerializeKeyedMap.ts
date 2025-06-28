const keyNotFound = Symbol("serialize-keyed-map/key_not_found");

/**
 * A Map subclass that uses deep equality (via `lodash.isEqual`) for key comparison
 * instead of the default reference equality. This allows objects with the same structure
 * and values to be considered equal as keys.
 *
 * @template K - The type of the keys in the map.
 * @template V - The type of the values in the map.
 *
 * @remarks
 * - All key-based operations (`get`, `has`, `delete`) use deep equality checks.
 * - This class is useful when you need to use complex objects as keys and want value-based equality semantics.
 *
 * @example
 * ```typescript
 * import SerializeKeyedMap from "./SerializeKeyedMap";
 * const map = new SerializeKeyedMap<object, string>();
 * map.set({ a: 1 }, "value");
 * console.log(map.get({ a: 1 })); // "value"
 * ```
 */
export default class SerializeKeyedMap<K, V> extends Map<K, V> {
	#getKey(key: K) {
		for (const [k] of this)
			if (lodash.isEqual(k, key))
				return k;
		return keyNotFound;
	}

	override get(key: K) {
		const k = this.#getKey(key);
		return k === keyNotFound ? undefined : super.get(k);
	}

	override has(key: K) {
		const k = this.#getKey(key);
		return k !== keyNotFound;
	}

	override delete(key: K) {
		const k = this.#getKey(key);
		if (k === keyNotFound) return false;
		super.delete(k);
		return true;
	}

	override set(key: K, value: V) {
		const k = this.#getKey(key);
		if (k !== keyNotFound) key = k;
		super.set(key, value);
		return this;
	}
}
