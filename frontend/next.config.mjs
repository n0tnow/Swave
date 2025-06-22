/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        buffer: 'buffer',
        util: 'util',
        fs: false,
        net: false,
        tls: false,
      };
    }

    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Error: Can't resolve 'require-addon'/,
      /Module not found: Error: Can't resolve 'sodium-native'/,
    ];

    return config;
  },
  turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
      },
    },
  },
  transpilePackages: ['@stellar/stellar-sdk'],
};

export default nextConfig;
