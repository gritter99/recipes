module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "json", "node"],
  // setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  }
};