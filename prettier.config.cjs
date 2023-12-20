/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  useTabs: true,
  jsxSingleQuote: true,
  arrowParens: "avoid",
  semi: true,
  tabWidth: 2,
};

module.exports = config;