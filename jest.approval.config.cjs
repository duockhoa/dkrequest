const existing = require('./jest.fuel.config.cjs');

module.exports = {
    ...existing,
    testMatch: [
        ...existing.testMatch,
        '<rootDir>/src/redux/slice/requestApproverSlice.test.js',
        '<rootDir>/src/component/Form/RequestApprovers/index.test.js',
    ],
};
