module.exports = {
  root: true,
  extends: [
    '@react-native',
    'prettier', // add this line
  ],
  rules: {
    semi: ['error', 'always'],
    'prettier/prettier': ['error', { endOfLine: 'auto', bracketSpacing: true }],
  },
};
