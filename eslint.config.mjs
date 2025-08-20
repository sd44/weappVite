import eslint from "@eslint/js"
import importPlugin from "eslint-plugin-import"
import promisePlugin from "eslint-plugin-promise"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  // ESLint 推荐配置
  eslint.configs.recommended,

  // TypeScript ESLint 推荐配置
  tseslint.configs.recommended,

  // Import 插件配置
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/no-unresolved": [
        "error",
        {
          caseSensitive: true,
          commonjs: true,
          ignore: ["^[^.]"],
        },
      ],
      "import/prefer-default-export": "off",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },

  // Promise 插件配置
  {
    plugins: {
      promise: promisePlugin,
    },
    rules: {
      "promise/always-return": "error",
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",
      "promise/catch-or-return": "error",
      "promise/no-native": "off",
      "promise/no-nesting": "warn",
      "promise/no-promise-in-callback": "warn",
      "promise/no-callback-in-promise": "warn",
      "promise/avoid-new": "off",
      "promise/no-new-statics": "error",
      "promise/no-return-in-finally": "warn",
      "promise/valid-params": "warn",
    },
  },

  // 基础 JavaScript 配置
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        window: true,
        document: true,
        App: true,
        Page: true,
        Component: true,
        Behavior: true,
        wx: true,
        worker: true,
        getApp: true,
      },
      parserOptions: {
        ecmaVersion: 2022,
        ecmaFeatures: {
          jsx: false,
        },
        sourceType: "module",
      },
    },
    rules: {
      "arrow-parens": "off",
      "comma-dangle": ["error", "only-multiline"],
      "func-names": "off",
      "global-require": "off",
      "linebreak-style": "off",
      "no-continue": "off",
      "no-else-return": "off",
      "no-param-reassign": "off",
      "no-plusplus": "off",
      "no-shadow": "off",
      "no-console": "off",
      "no-multi-assign": "off",
      "no-underscore-dangle": "off",
      "object-curly-spacing": ["error", "always"],
      "prefer-arrow-callback": "off",
      "prefer-destructuring": "off",
      "prefer-template": "off",
      // Note: you must disable the base rule as it can report incorrect errors
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      semi: ["error", "never"],
      complexity: ["error", 10],
      "handle-callback-err": ["error", "^(err|error)$"],
      "operator-linebreak": [
        "error",
        "after",
        {
          overrides: {
            ":": "before",
            "?": "before",
          },
        },
      ],
      "quote-props": [
        1,
        "as-needed",
        {
          unnecessary: true,
        },
      ],
    },
  },

  // 排除文件夹配置
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      ".claude/",
      ".cursor/",
      ".git/",
      ".github/",
      ".husky/",
      ".husky-bak/",
      ".vscode/",
      "**/*.min.js",
    ],
  }
)
