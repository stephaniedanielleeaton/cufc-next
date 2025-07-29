/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable CSS optimization in CI environments to avoid lightningcss native module issues
  // This is a workaround for the "Cannot find module '../lightningcss.linux-x64-gnu.node'" error
  webpack: (config, { isServer, dev }) => {
    // Check if running in a CI environment or Heroku
    const isCI = process.env.CI === 'true' || 
                process.env.GITHUB_ACTIONS === 'true' || 
                process.env.HEROKU_APP_NAME !== undefined;
    
    if (isCI) {
      // Force using CSS without the lightningcss dependency
      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((r) => {
            if (r.sideEffects === false && r.test && r.test.toString().includes('css')) {
              // Remove any loaders that might use lightningcss
              r.use = r.use.filter(
                (u) => !(u.loader && (u.loader.includes('css-loader') || u.loader.includes('postcss-loader')))
              );
            }
          });
        }
      });
      
      // Disable PostCSS optimization that might use lightningcss
      if (config.plugins) {
        config.plugins = config.plugins.filter(
          (plugin) => !(plugin.constructor && plugin.constructor.name.includes('CSS'))
        );
      }
    }
    
    return config;
  },
  // Other Next.js configuration options
  reactStrictMode: true,
  // Remove swcMinify as it's no longer recognized in Next.js 15.3.4
};

module.exports = nextConfig;
