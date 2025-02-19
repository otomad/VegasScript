// Show the correct background color before React rendering.
document.documentElement.style.backgroundColor = JSON.parse(localStorage.colorMode ?? null)?.backgroundColor || "#202020";
