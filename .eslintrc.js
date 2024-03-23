module.exports = {
    root: true,
    extends: [
        '@react-native',
        'prettier', // add this line
    ],
    rules: {
        semi: ['error', 'always'],
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
                bracketSpacing: true,
                arrowParens: 'avoid',
                bracketSameLine: true,
                singleQuote: true,
                trailingComma: 'all',
                printWidth: 80,
                tabWidth: 4,
                semi: true,
            },
        ],
    },
};
