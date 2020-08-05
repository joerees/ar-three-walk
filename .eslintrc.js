module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  "parser": "babel-eslint",
  parserOptions: {
    "ecmaVersion": 6,
    "sourceType": "module",
    extraFileExtensions: ['.vue'],
    "sourceType": "module",
    "allowImportExportEverywhere": false,
    "codeFrame": false    
  },
  extends: [
    'plugin:prettier/recommended'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'no-unused-vars': 'off',
    'no-case-declarations': 'off',
    'unicorn/escape-case': 'off',
    'unicorn/prefer-includes': 0,
    'standard/computed-property-even-spacing': 0,
    "vue/no-v-html": "off"
  }
}
