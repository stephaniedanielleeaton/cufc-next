/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable CSS optimization in CI environments to avoid lightningcss native module issues
  // This is a workaround for the "Cannot find module '../lightningcss.linux-x64-gnu.node'" error
  webpack: (config, { isServer, dev }) => {
    // Check if running in a CI environment
    const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
    
    if (isCI) {
      // Disable CSS optimization in CI environments
      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((r) => {
            if (r.sideEffects === false && r.test && r.test.toString().includes('css')) {
              r.use = r.use.filter(
                (u) => !(u.loader && u.loader.includes('css-loader'))
              );
            }
          });
        }
      });
    }
    
    return config;
  },
  // Other Next.js configuration options
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
