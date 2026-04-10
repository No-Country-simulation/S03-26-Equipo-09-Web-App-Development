/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Los colores de tu prototipo Harold:
        primary: "#182442",          // El azul oscuro elegante
        secondary: "#006c49",        // El verde de "Sistema Online"
        background: "#f8f9fa",       // El gris claro de fondo
        error: "#ba1a1a",            // Rojo para alertas
        "surface-container": "#edeeef",
        "surface-container-low": "#f3f4f5",
        "on-surface-variant": "#45464e",
        "outline-variant": "#c6c6ce",
      },
      fontFamily: {
        // La fuente Inter que usaste en el HTML
        sans: ["Inter", "sans-serif"],
      },
      // Esto te servirá para las animaciones suaves del Dashboard
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};