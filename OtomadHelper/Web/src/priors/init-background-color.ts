{
	// Show the correct background color before React rendering.
	const backgroundColor = JSON.parse(localStorage.colorMode ?? null)?.backgroundColor;
	if (backgroundColor) document.documentElement.style.backgroundColor = backgroundColor;
}
