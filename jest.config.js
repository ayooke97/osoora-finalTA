export default {
  testEnvironment: 'jsdom',
  transform: {},
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  moduleFileExtensions: ['js', 'json', 'jsx'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'server.js',
    'public/js/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ]
}
