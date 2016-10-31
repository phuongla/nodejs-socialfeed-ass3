let passport = require('passport')
let wrap = require('nodeifyit')
let User = require('../models/user')
let TwitterStrategy = require('passport-twitter').Strategy
let FacebookStrategy = require('passport-facebook').Strategy


// Handlers
async function twitterAuthHandler(token, tokenSecret, profile, done) {
    let user = await User.findOne({'twitter.id' : profile.id})
    if (!user) {
        console.log(`new user: ${profile.id}`)
        user = new User({
          twitter : {
            'id': profile.id,
            'username': profile.username,
            'displayName': profile.displayName,
            'token': token,
            'secret': tokenSecret
          }
        })
        
        let data = await user.save()
    }
    return done(null, user)
}

async function facebookAuthHandler(token, refreshToken, profile, done) {
    let user = await User.findOne({'facebook.id' : profile.id})
    if (!user) {
        console.log(`new user: ${profile.id}`)
        user = new User({
          facebook : {
            'id': profile.id,
            'name': profile.displayName,
            'token': token,
            'refreshToken': refreshToken
          }
        })
        
        let data = await user.save()
    }
    return done(null, user)
}


// 3rd-party Auth Helper
function loadPassportStrategy(OauthStrategy, config, userField) {
  config.passReqToCallback = true
  passport.use(new OauthStrategy(config, wrap(authCB, {spread: true})))

  async function authCB(req, token, _ignored_, account) {
      // 1. Load user from store by matching user[userField].id && account.id
      // 2. If req.user exists, we're authorizing (linking account to an existing user)
      // 2a. Ensure it's not already associated with another user
      // 2b. Link account
      // 3. If req.user !exist, we're authenticating (logging in an existing user)
      // 3a. If Step 1 failed (existing user for 3rd party account does not already exist), create a user and link this account (Otherwise, user is logging in).
      // 3c. Return user
  }
}

function configure(CONFIG) {
  // Required for session support / persistent login sessions
  passport.serializeUser(wrap(async (user) => user._id))
  passport.deserializeUser(wrap(async (id) => {
    return await User.findById(id)
  }))

  let twitterLoginStrategy = new TwitterStrategy(CONFIG.twitter, wrap(twitterAuthHandler, {spread: true}))
  passport.use('twitter', twitterLoginStrategy)
  
  let facebookLoginStrategy = new FacebookStrategy(CONFIG.facebook, wrap(facebookAuthHandler, {spread: true}))
  passport.use('facebook', facebookLoginStrategy)

  return passport
}

module.exports = {passport, configure}
