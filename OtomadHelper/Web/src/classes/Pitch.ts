const noteNames = "C,C#,D,D#,E,F,F#,G,G#,A,A#,B".split(",");

/**
 * Convert MIDI note number to Scientific Pitch Notation (SPN) string.
 * @param midiNoteNumber - The MIDI note number (e.g., C5 is 60).
 * @returns The SPN string (e.g., "C#4", "Bb3").
 */
export function midiNoteToSPN(midiNoteNumber: number) {
	return noteNames[midiNoteNumber % 12] + (midiNoteNumber / 12 | 0);
}

/**
 * Represents a musical pitch using Scientific Pitch Notation (SPN).
 * Provides utilities for converting between note names, octaves, note numbers, and frequencies.
 *
 * @example
 * ```typescript
 * const pitch = new Pitch("C#4");
 * console.log(pitch.noteNumber); // 49
 * console.log(pitch.frequency); // 277.18...
 * ```
 */
export default class Pitch {
	/** All available note names. @private */
	static readonly #noteNames = noteNames;
	/** Retrieves the middle C5 pitch instance, which MIDI note number is 60. @private */
	static readonly #middleC5 = Pitch.pitchMap("C", 5)!;
	/** Retrieves the middle A4 pitch instance, which frequency of the pitch is 440 Hz. @private */
	static readonly #middleA4 = Pitch.pitchMap("A", 4)!;

	#noteNumber: number = Pitch.#middleC5;

	/**
	 * Constructs a Pitch instance.
	 *
	 * @param spn - The SPN string (e.g., "C#4", "Bb3").
	 */
	constructor(spn: string);
	/**
	 * Constructs a Pitch instance.
	 *
	 * @param noteName - The note name (e.g., "C", "C#", "Db").
	 * @param octave - The octave number (e.g., 4, 5).
	 */
	constructor(noteName: string, octave: number);
	/**
	 * Constructs a Pitch instance.
	 *
	 * @param noteNumber - The MIDI note number (e.g., C5 is 60).
	 */
	constructor(noteNumber: number);
	constructor(...args: unknown[]) {
		if (args.length === 2)
			this.noteNameAndOctave = { noteName: args[0] as string, octave: args[1] as number };
		else
			if (typeof args[0] === "string")
				this.spn = args[0];
			else if (typeof args[0] === "number")
				this.noteNumber = args[0];
	}

	/**
	 * Parses a string in Scientific Pitch Notation (SPN) and returns the note name and octave.
	 *
	 * @param spn - The SPN string (e.g., "C#4", "Bb3").
	 * @returns An object containing the note name and octave.
	 */
	static parseSpn(spn: string) {
		const groups = spn?.match(/(?<noteName>[A-G][#♯b♭]?)(?<octave>\d+)/i)?.groups as undefined ?? { noteName: "", octave: "" };
		const octave = +groups.octave;
		let noteName = groups.noteName
			.toUpperCase()
			.replaceAll("♯", "#")
			.replace(/(?<=[A-G])[b♭]/i, "b");
		if (noteName.endsWith("b"))
			noteName = Pitch.#noteNames.nextItem(noteName[0], -1);
		return { noteName, octave };
	}

	/**
	 * Maps a note name and octave to a MIDI note number. The middle C (C5 in MIDI) is 60.
	 *
	 * @param noteName - The note name (e.g., "C", "C#", "Db").
	 * @param octave - The octave number (e.g., 4, 5).
	 * @returns The corresponding note number, or `null` if the note name is invalid.
	 */
	static pitchMap(noteName: string, octave: number) {
		const noteNameIndex = Pitch.#noteNames.indexOf(noteName);
		if (noteNameIndex === -1) return null;
		const noteNumber = noteNameIndex + octave * 12;
		return noteNumber;
	}

	/**
	 * An object containing the note name and octave.
	 * @private
	 */
	private set noteNameAndOctave(value: ReturnType<typeof Pitch.parseSpn>) {
		const noteNumber = Pitch.pitchMap(value.noteName, value.octave);
		if (noteNumber != null) this.#noteNumber = noteNumber;
	}

	/**
	 * Gets or sets the pitch in Scientific Pitch Notation (SPN) (e.g., "C#4", "Bb3").
	 */
	get spn() {
		return this.noteName + this.octave;
	}

	set spn(spn) {
		this.noteNameAndOctave = Pitch.parseSpn(spn);
	}

	/**
	 * Gets or sets the note name (e.g., "C", "C#", "D").
	 */
	get noteName() {
		return Pitch.#noteNames[this.#noteNumber % 12];
	}

	set noteName(noteName) {
		this.noteNameAndOctave = { noteName, octave: this.octave };
	}

	/**
	 * Gets or sets the octave number (e.g., 4, 5).
	 */
	get octave() {
		return this.#noteNumber / 12 | 0;
	}

	set octave(octave) {
		this.noteNameAndOctave = { noteName: this.noteName, octave };
	}

	/**
	 * Gets or sets the MIDI note number (e.g., C5 is 60).
	 */
	get noteNumber() {
		return this.#noteNumber;
	}

	set noteNumber(value) {
		this.#noteNumber = value;
	}

	/**
	 * Gets the frequency of the pitch in Hertz (e.g., A4 is 440).
	 */
	get frequency() {
		return 440 * 2 ** ((this.#noteNumber - Pitch.#middleA4) / 12);
	}
}
