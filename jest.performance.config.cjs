const existing = require('./jest.approval.config.cjs');
module.exports = {
    ...existing,
    testMatch: [
        ...existing.testMatch,
        '<rootDir>/src/redux/slice/commentPerformance.test.js',
        '<rootDir>/src/component/Form/CommentForm/responsePerformance.test.js',
        '<rootDir>/src/redux/slice/requestPerformance.test.js',
        '<rootDir>/src/services/requestService.test.js',
        '<rootDir>/src/component/SharedComponent/Requests/performance.test.js',
    ],
};
