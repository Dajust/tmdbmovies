const isTest = String(process.env.NODE_ENV) === 'test';

module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        modules: isTest ? 'commonjs' : false,
        targets: {
          chrome: '58'
        }
      }
    ]
  ],
  plugins: [
    'emotion',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread'
  ]
};
