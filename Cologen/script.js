const container = document.querySelector(".container");
const refreshBtn = document.querySelector(".refresh-btn");

const maxPaletteBoxes = 5;

// Function to copy color to clipboard
const copyColor = (color, hexValue) => {
    const tempInput = document.createElement("input");
    tempInput.value = hexValue;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    const hexSpan = color.querySelector(".hex-value");
    hexSpan.innerText = "Copied!";
    setTimeout(() => (hexSpan.innerText = hexValue), 1000);
};

// Function to generate a lighter or darker shade
const adjustShade = (hex, factor) => {
    const rgb = parseInt(hex.slice(1), 16); // Convert hex to RGB
    let r = (rgb >> 16) + factor; // Extract red and adjust
    let g = ((rgb >> 8) & 0xff) + factor; // Extract green and adjust
    let b = (rgb & 0xff) + factor; // Extract blue and adjust

    // Clamp values to 0-255 range
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    // Convert back to hex and return
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

// Function to generate a random color
const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0").toUpperCase()}`;
};

// Function to generate the palette
const generatePalette = () => {
    container.innerHTML = ""; // Clearing the container

    // Randomly decide whether to generate shades or random colors
    const isShades = Math.random() > 0.5; // 50% chance

    // Generate a random base color
    let baseColor = generateRandomColor();

    for (let i = 0; i < maxPaletteBoxes; i++) {
        let randomHex;

        if (isShades) {
            // Adjust shades of the base color
            const shadeFactor = (i - Math.floor(maxPaletteBoxes / 2)) * 30; // Gradually lighten or darken
            randomHex = adjustShade(baseColor, shadeFactor);
        } else {
            // Generate completely random colors
            randomHex = generateRandomColor();
        }

        // Create and append the color element
        const color = document.createElement("li");
        color.classList.add("color");
        color.innerHTML = `<div class="rect-box" style="background: ${randomHex}"><span class="hex-value">${randomHex}</span></div>`;

        color.addEventListener("click", () => copyColor(color, randomHex));
        container.appendChild(color);
    }
};

generatePalette();

refreshBtn.addEventListener("click", generatePalette);
