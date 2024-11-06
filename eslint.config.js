import pluginJs from "@eslint/js";
import importOrder from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { rules: { "react/react-in-jsx-scope": "off" } },
  {
    files: ["**/*.tsx"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      import: importOrder,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: ["external", "builtin", "internal", "sibling", "parent", "index"],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["internal"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          // new line between groups
          "newlines-between": "always",
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-prototype-builtins": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/prop-types": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "react/no-unknown-property": "off",
    },
  },
];
