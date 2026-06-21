const vitest = require("eslint-plugin-vitest");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals", "next/typescript", "prettier"],
  overrides: [
    {
      files: ["**/*.{test,spec}.{ts,tsx}"],
      plugins: ["vitest"],
      rules: {
        ...vitest.configs["legacy-recommended"].rules,
        // Some tests assert via render() side effects or thrown errors.
        "vitest/expect-expect": "off",
      },
    },
  ],
};
