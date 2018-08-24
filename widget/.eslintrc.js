module.exports = {
    extends: ['plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    env: {
        browser: true,
        es6: true,
        node: true
    },
    rules: {
        "prettier/prettier": "error",
        "no-console": 0,
        "no-unused-vars": 0
    },
    globals: {
        "React": true,
        "ReactDOM": true
    }
};
