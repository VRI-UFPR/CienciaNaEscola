module.exports = function override(config, env) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        vm: require.resolve('vm-browserify'),
    };
    return config;
};
