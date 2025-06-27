import { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  coverageProvider: "v8",
  preset: 'ts-jest',
  rootDir: ".",
  roots: [
    'src',
    'tests',
  ],
  testEnvironment: "node",
};

export default config;
