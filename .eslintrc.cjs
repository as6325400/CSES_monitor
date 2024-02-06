/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double"],
    "semi": "error",
    "linebreak-style": ["error", process.platform === 'win32' ? 'windows' : 'unix'],
  }
};
