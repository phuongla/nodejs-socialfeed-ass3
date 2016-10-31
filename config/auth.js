// config/auth.js
module.exports = {
  'development': {
    'facebook': {
      'clientID': '1687745888220983',
      'clientSecret': 'ed4cf1f654f31df151d60427635cb31e',
      'callbackURL': 'http://socialauthenticator.com:8000/auth/facebook/callback',
      'profileFields': ['id', 'displayName', 'email']
    },
    'twitter': {
      'consumerKey': 'HwUqL5XO3Ol5vLIjg0kFByqVh',
      'consumerSecret': 'VQ5aH9mWaqwj5YcfN2R4TfPp4osP6h5qF7Yahea2uduc2L3E3B',
      'callbackUrl': 'http://socialauthenticator.com:8000/auth/twitter/callback'
    },
    'google': {
      'consumerKey': '446585441765-unda5mjs6307q1pqobvhiqj87m9m2kh1.apps.googleusercontent.com',
      'consumerSecret': '...',
      'callbackUrl': 'http://socialauthenticator.com:8000/auth/google/callback'
    }
  }
}
