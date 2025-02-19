import antfu from "@antfu/eslint-config";

export default antfu({
  stylistic: {
    semi: true,
    indent: 2,
    quotes: "double",
    overrides: {
      "style/arrow-parens": ["error", "always"],
      "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "node/prefer-global/process": ["off"],
    },
  },
  formatters: true,
  vue: true,
  markdown: false,
});
