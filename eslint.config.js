import tseslint from "typescript-eslint";
import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";

export default [
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    {
        files: ["**/*.ts", "**/*.vue"],
        ignores: ["coverage/**", "**/*.spec.ts"],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser,
                ecmaVersion: "latest",
                sourceType: "module",
                extraFileExtensions: [".vue"],
            },
        },
        plugins: {
            vue: vuePlugin,
        },
        rules: {
            "no-else-return": ["error", {allowElseIf: false}],
            "newline-per-chained-call": ["error", {ignoreChainWithDepth: 3}],
            "@typescript-eslint/max-params": ["warn", {max: 3}],
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
                {selector: "variable", format: ["camelCase", "UPPER_CASE"]},
                {selector: "function", format: ["camelCase"]},
                {selector: "class", format: ["PascalCase"]},
                {selector: "interface", format: ["PascalCase"]},
                {selector: "typeAlias", format: ["PascalCase"]},
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
            "vue/component-name-in-template-casing": ["error", "PascalCase"],
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
    },
];
