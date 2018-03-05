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
    pathRewrite: {'/userId': '/d1924601-9ce1-4b6e-b3b1-1442a3d61ac4'}
  }
 ]
 module.exports = PROXY_CONFIG