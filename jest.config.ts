import { Config } from 'jest';

export default {
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
} satisfies Config;
