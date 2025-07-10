module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        // Add this if you have other file types
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
            isolatedModules: true,
        }
    },
    // For React Testing Library
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};