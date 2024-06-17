/// <reference path="misc.d.ts" />

{
	Response.prototype.xml = async function () {
		const text = await this.text();
		return new window.DOMParser().parseFromString(text, "text/xml");
	};

	makePrototypeKeysNonEnumerable(Response);
}
{
	HTMLImageElement.prototype.awaitLoaded = function () {
		return new Promise<HTMLImageElement>((resolve, reject) => {
			this.onload = () => resolve(this);
			this.onerror = e => reject(e);
		});
	};

	makePrototypeKeysNonEnumerable(HTMLImageElement);
}
{
	HTMLCanvasElement.prototype.toBlobUrl = function () {
		return new Promise<string>(resolve => this.toBlob(blob => resolve(blob! && URL.createObjectURL(blob))));
	};

	makePrototypeKeysNonEnumerable(HTMLCanvasElement);
}
