const PROXY_CONFIG = [
  {
    context: [
      '/resourcebundles/**',
      '/learner/**',
      '/content/**',
      '/announcement/v1/**',
      '/discussions/v1/**'
    ],
    target: 'http://localhost:3000',
    secure: false,
    logLevel: 'debug',
    pathRewrite: {'/userId': '/95e4942d-cbe8-477d-aebd-ad8e6de4bfc8'}
  }
 ]
 module.exports = PROXY_CONFIG