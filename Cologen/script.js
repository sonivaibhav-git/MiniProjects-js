const container = document.querySelector(".container");
const refreshBtn = document.querySelector(".refresh-btn");

const maxPaletteBoxes = 5;

// Function to check if the user is on a mobile device
const isMobile = () => /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

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

// Function to determine if the color is light or dark
const isColorDark = (hex) => {
    const rgb = parseInt(hex.slice(1), 16); // Convert hex to RGB
    const r = (rgb >> 16) & 0xff; // Extract red
    const g = (rgb >> 8) & 0xff; // Extract green
    const b = rgb & 0xff; // Extract blue

    // Calculate luminance
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 128; // Consider color dark if luminance is below 128
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

// Function to generate the palette based on 60-30-10 rule
const generatePalette = () => {
    container.innerHTML = ""; // Clearing the container

    const baseColor = generateRandomColor(); // Base color
    const secondaryColor = adjustShade(baseColor, -30); // Slightly darker shade
    const accentColor = adjustShade(baseColor, 60); // Lighter shade

    const colors = [
        { hex: baseColor, weight: "60%" },
        { hex: secondaryColor, weight: "30%" },
        { hex: accentColor, weight: "10%" },
        { hex: generateRandomColor(), weight: "Random" },
        { hex: generateRandomColor(), weight: "Random" },
    ];

    colors.forEach(({ hex }) => {
        const isDark = isColorDark(hex);
        const textColor = isDark ? "white" : "black";
        const borderColor = isDark ? "white" : "black";

        const color = document.createElement("li");
        color.classList.add("color");
        color.innerHTML = `
            <div class="rect-box" style="background: ${hex}">
                <span class="hex-value" style="color: ${textColor}; border: 1px solid ${borderColor}">${hex}</span>
            </div>
        `;

        color.addEventListener("click", () => copyColor(color, hex));
        container.appendChild(color);
    });
};

generatePalette();

// Event listener for refresh button
refreshBtn.addEventListener("click", generatePalette);

// Add keydown listener for desktop users
if (!isMobile()) {
    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            event.preventDefault(); // Prevent page scroll when spacebar is pressed
            generatePalette();
        }
    });
}
