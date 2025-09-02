type VersionLike = string | number[];

/**
 * Represents a semantic version and provides comparison utilities.
 *
 * @example
 * ```typescript
 * const v1 = new Version("v1.2.3");
 * const v2 = new Version([1, 2, 4]);
 * v1.isLessThan(v2); // true
 * ```
 */
export default class Version {
	/**
	 * The numeric representation of the version, e.g., [1, 2, 3].
	 */
	version: number[];

	/**
	 * Creates a new Version instance from a string or array.
	 * Accepts strings like "v1.2.3", "1.2.3", or arrays like [1, 2, 3].
	 *
	 * @param version - The version string or array.
	 * @throws {TypeError} If the version is invalid.
	 */
	constructor(version: VersionLike) {
		this.version = Array.isArray(version) ? version : Version.parseVersion(version);
		Version.checkIsValidVersion(this.version);
	}

	/**
	 * Parses a version string into an array of numbers.
	 *
	 * @param versionString - The version string to parse.
	 * @returns The parsed version as an array of numbers.
	 * @throws {TypeError} If the string cannot be parsed as a version.
	 * @internal
	 */
	private static parseVersion(versionString: string) {
		let version = versionString.match(/(?<=v)\d(\.\d)*/i)?.[0];
		if (!version) version = versionString.match(/\d(\.\d)*/i)?.[0];
		if (!version) throw new TypeError(`Invalid version string: ${versionString}`);
		return version.split(".").map(v => parseInt(v, 10));
	}

	/**
	 * Checks if the version array is valid.
	 *
	 * @param version - The version array to validate.
	 * @throws {TypeError} If the version is invalid.
	 * @internal
	 */
	private static checkIsValidVersion(version: number[]) {
		if (version.length === 0 || version.some(v => !Number.isFinite(v)))
			throw new TypeError(`Invalid version: ${version}`);
	}

	/**
	 * Compares this version to another version.
	 *
	 * @param other - The other version to compare to.
	 * @returns -1 if this < other, 1 if this > other, 0 if equal.
	 */
	compareTo(other: Version | VersionLike) {
		if (!(other instanceof Version)) other = new Version(other);
		for (let i = 0; i < Math.max(this.version.length, other.version.length); i++) {
			const v1 = this.version[i] || 0, v2 = other.version[i] || 0;
			if (v1 !== v2) return Math.sign(v1 - v2);
		}
		return 0;
	}

	/**
	 * Checks if this version is equal to another version.
	 *
	 * @param other - The other version to compare to.
	 * @returns Are both versions equal?
	 *
	 * @example
	 * ```javascript
	 * new Version("v1.2.3").equals(new Version("v1.2.3")); // true
	 * ```
	 */
	equals(other: Version | VersionLike) {
		return this.compareTo(other) === 0;
	}

	/**
	 * Checks if this version is less than another version.
	 *
	 * @param other - The other version to compare to.
	 * @returns Is this version less than the other?
	 *
	 * @example
	 * ```javascript
	 * new Version("v1.2.3").isLessThan(new Version("v1.2.4")); // true
	 * ```
	 */
	isLessThan(other: Version | VersionLike) {
		return this.compareTo(other) < 0;
	}

	/**
	 * Checks if this version is greater than another version.
	 *
	 * @param other - The other version to compare to.
	 * @returns Is this version greater than the other?
	 *
	 * @example
	 * ```javascript
	 * new Version("v1.2.3").isLessThan(new Version("v1.2.2")); // true
	 * ```
	 */
	isGreaterThan(other: Version | VersionLike) {
		return this.compareTo(other) > 0;
	}

	/**
	 * Checks if this version is less than or equal to another version.
	 *
	 * @param other - The other version to compare to.
	 * @returns Is this version less than or equal to the other?
	 *
	 * @example
	 * ```javascript
	 * new Version("v1.2.3").isLessThanOrEqualTo(new Version("v1.2.4")); // true
	 * ```
	 */
	isLessThanOrEqualTo(other: Version | VersionLike) {
		return this.compareTo(other) <= 0;
	}

	/**
	 * Checks if this version is greater than or equal to another version.
	 *
	 * @param other - The other version to compare to.
	 * @returns Is this version greater than or equal to the other?
	 *
	 * @example
	 * ```javascript
	 * new Version("v1.2.3").isLessThanOrEqualTo(new Version("v1.2.2")); // true
	 * ```
	 */
	isGreaterThanOrEqualTo(other: Version | VersionLike) {
		return this.compareTo(other) >= 0;
	}
}
