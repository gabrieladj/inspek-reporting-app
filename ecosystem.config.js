//to make sure PM2 loads correct .env file

module.exports = {
    apps: [{
      name: 'app-name',
      script: './app.js',  // Entry point of your app
      env: {
        NODE_ENV: 'production',
        CORS_ORIGIN: process.env.CORS_ORIGIN, // Load environment variables
        // add any other env variables needed here
      }
    }]
  };
  