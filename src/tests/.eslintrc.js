module.exports = {
  env: {
    jest: true,
  },
  plugins: ['jest'],
  extends: ['plugin:jest/recommended', 'plugin:jest/style'],
  rules: {
    'jest/require-to-throw-message': 'error',
  },
};
