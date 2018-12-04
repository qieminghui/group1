module.exports = {
    "plugins": [
        "react",
        "react-redux",
        "jquery",
    ],
    "rules": {
        "react-redux/connect-prefer-named-arguments": 2
    },
    "env": {
        "es6": true,
        "browser": true,
        "node": true,
        "jquery": true,                        //jQuery全局变量。
    },
    "parserOptions": {
        "sourceType": "module"
    },
    "extends": ["eslint:recommended", "plugin:react/recommended", "plugin:react-redux/recommended", "ivweb"],
    "globals": {
        "__inline": true,
        "IS_SERVER": true,
        "__uri": true
    }
};
