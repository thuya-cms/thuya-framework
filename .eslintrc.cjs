/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/require-await": "warn"
    },
    ignorePatterns: ["dist/**/*"],
    overrides: [{
        files: ['*.ts'],
        parserOptions: {
            project: ["./tsconfig-dev.json"]
        }
    }]
};