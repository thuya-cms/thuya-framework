/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:jsdoc/recommended-typescript'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'jsdoc'],
    root: true,
    rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "jsdoc/tag-lines": [
            "warn",
            "any",
            {
              startLines: 1
            }
        ]
    },
    ignorePatterns: ["dist/**/*"]
};