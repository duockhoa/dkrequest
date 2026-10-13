// Focused checks do not depend on the legacy CRA setupTests.js.
module.exports = {
    testEnvironment: 'jsdom',
    testMatch: [
        '<rootDir>/src/utils/fuelPayment.test.js',
        '<rootDir>/src/utils/numberToWords.test.js',
        '<rootDir>/src/services/exportsFileService.test.js',
        '<rootDir>/src/component/Form/fuelPayment.test.js',
    ],
    transform: {
        '^.+\\.js$': ['babel-jest', {
            presets: [['@babel/preset-env', { targets: { node: 'current' } }], ['@babel/preset-react', { runtime: 'automatic' }]],
        }],
    },
};
