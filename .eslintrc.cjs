/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:jsdoc/recommended-typescript'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'jsdoc'],
    root: true,
    rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/member-ordering": "error",
        "jsdoc/tag-lines": [
            "warn",
            "any",
            { startLines: 1 }
        ],
        "jsdoc/require-jsdoc": [
            "error",
            { 
                enableFixer: false,
                checkConstructors: false,
                contexts: [ 'ClassDeclaration', 'MethodDefinition:not([accessibility="private"])' ]
            }
        ],
        "jsdoc/require-returns-description": "off"
    },
    ignorePatterns: ["dist/**/*"]
};