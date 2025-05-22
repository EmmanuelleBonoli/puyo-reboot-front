// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const vue = require("eslint-plugin-vue");

module.exports = tseslint.config(
    {
      files: ["**/*.ts", "**/*.vue"],
      ignores: ["coverage/**", "**/*.spec.ts"],
      languageOptions: {
        parser: require.resolve("vue-eslint-parser"),
        parserOptions: {
          parser: require.resolve("@typescript-eslint/parser"),
          ecmaVersion: "latest",
          sourceType: "module",
          extraFileExtensions: [".vue"],
        },
      },
      plugins: {
        vue,
      },
      processor: null, // No Angular inline templates
      extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
        ...tseslint.configs.stylistic,
        "plugin:vue/vue3-recommended",
      ],
      rules: {
        "no-else-return": ["error", { allowElseIf: false }],
        "newline-per-chained-call": ["error", { ignoreChainWithDepth: 2 }],
        "@typescript-eslint/max-params": ["warn", { max: 3 }],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/member-ordering": [
          "error",
          {
            default: ["field", "constructor", "method"],
          },
        ],
        "@typescript-eslint/naming-convention": [
          "error",
          { selector: "variable", format: ["camelCase", "UPPER_CASE"] },
          { selector: "function", format: ["camelCase"] },
          { selector: "class", format: ["PascalCase"] },
          { selector: "interface", format: ["PascalCase"] },
          { selector: "typeAlias", format: ["PascalCase"] },
          {
            selector: "memberLike",
            modifiers: ["private"],
            format: ["camelCase", "UPPER_CASE"],
            leadingUnderscore: "require",
          },
          {
            selector: "memberLike",
            modifiers: ["protected", "public"],
            format: ["camelCase"],
            leadingUnderscore: "forbid",
          },
        ],
        "@typescript-eslint/no-magic-numbers": "warn",

        // Vue rules
        "vue/component-name-in-template-casing": ["error", "kebab-case"],
        "vue/require-default-prop": "off",
        "vue/multi-word-component-names": "off",
        "vue/html-self-closing": [
          "error",
          {
            html: {
              void: "always",
              normal: "never",
              component: "always",
            },
          },
        ],
      },
    }
);
