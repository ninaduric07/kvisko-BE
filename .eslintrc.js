module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "semi": ["error", "always"],
        "indent": ["error", 4],
        "no-unused-vars": ["warn", { "vars": "all", "args": "none", "ignoreRestSiblings": false }],
    }
};