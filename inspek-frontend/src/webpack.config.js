module.exports = {
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "async_hooks": false // Optional if you don't want to include async_hooks polyfill
    }
  }
}
