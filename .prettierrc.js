const prettierConfigStandard = require('prettier-config-standard');

const modifiedConfig = Object.assign({}, prettierConfigStandard, {
  semi: true,
  trailingComma: 'es5',
  importOrder: ['<THIRD_PARTY_MODULES>', '^(../|./|@/)'],
  importOrderParserPlugins: [
    'typescript',
    'classProperties',
    '["decorators", { "decoratorsBeforeExport": true }]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  // ... other modified settings here
});

module.exports = modifiedConfig;
