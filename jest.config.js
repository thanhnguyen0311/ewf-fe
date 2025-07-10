module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
        '\\.(css|less|scss|sass|module.css)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Optional
    transformIgnorePatterns: [
        'node_modules/(?!(axios)/)', // transform axios
    ],
};