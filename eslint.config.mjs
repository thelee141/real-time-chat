import js from "@eslint/js"
import typescript from "@typescript-eslint/eslint-plugin"
import typescriptParser from "@typescript-eslint/parser"
import importPlugin from "eslint-plugin-import"
import simpleImportSort from "eslint-plugin-simple-import-sort"

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // Import sorting rules
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Import organization rules
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",

      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",

      // General rules
      "no-console": "off",
      "prefer-const": "off",
      "no-undef": "off", // TypeScript handles this
    },
  },
  {
    ignores: ["node_modules/**", "dist/**", ".next/**", "*.js"],
  },
]
