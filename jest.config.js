module.exports = {
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
