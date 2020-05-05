module.exports = { //**/*.js - Для игнора всех js файлов
    // "parser": 'babel-eslint',
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "google",
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            "experimentalObjectRestSpread": true
        }
        // "ecmaVersion": 2020,
        // "sourceType": "module",
    },
    "rules": {
        "max-len": ["error", 100, 2, {
            "ignoreUrls": true,
            "ignoreComments": true,
            "ignoreRegExpLiterals": true,
            "ignoreStrings": false,
            "ignoreTemplateLiterals": false
        }],
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "require-jsdoc": ["error", {
            "require": {
                "FunctionDeclaration": false,
                "MethodDefinition": false,
                "ClassDeclaration": false,
                "ArrowFunctionExpression": false,
                "FunctionExpression": false
            }
        }],
    },
    overrides: [{
        files: ["*.ts", "*.tsx"],
        parser: "@typescript-eslint/parser",
        plugins: [
            "@typescript-eslint",
            // "plugin:@typescript-eslint/eslint-recommended",
        ],
        rules: {
            // "plugin:@typescript-eslint/eslint-recommended": 'error',
            // "plugin:@typescript-eslint/recommended": 'error',
            // "plugin:@typescript-eslint/recommended-requiring-type-checking": 'error',
            '@typescript-eslint/no-unused-vars'         : 'error',
            // Require PascalCased class and interface names
            '@typescript-eslint/class-name-casing'      : 'error',
            // Require a specific member delimiter style for interfaces and type literals
            // Default Semicolon style
            '@typescript-eslint/member-delimiter-style' : 'error',
            // Require a consistent member declaration order
            '@typescript-eslint/member-ordering'        : 'error',
            // Require consistent spacing around type annotations
            '@typescript-eslint/type-annotation-spacing': 'error',
        },
    }]
}