let mongoose = require('mongoose')
let crypto = require('crypto')
const PEPPER = 'nodejs'
let Schema = mongoose.Schema

let userSchema = new Schema({
  local: {
    email: {
      type: String,
      require: true
    }, 
    password: {
      type: String,
      require: true
    }
  },
  
  facebook: {
    id: {
      type: String,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    },
    refreshToken: {
      type: String
    }
  },

  twitter: {
    id: {
      type: String,
      require: true,
      unique: true
    },
    username: {
      type: String,
      require: true
    },
    displayName: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }, 
    secret: {
      type: String,
      require: true
    }
  }
  
})

userSchema.methods.generateHash = async function(password) {
  let hash = await crypto.promise.pbkdf2(password, PEPPER, 4096, 512, 'sha256')
  return hash.toString('hex')
}

userSchema.methods.validatePassword = async function(password) {
  let hash = await crypto.promise.pbkdf2(password, PEPPER, 4096, 512, 'sha256')
  console.log(this.password)
  return hash.toString('hex') === this.local.password
}

// Utility function for linking accounts
userSchema.methods.linkAccount = function(type, values) {
  return this['link'+_.capitalize(type)+'Account'](values)
}

userSchema.methods.linkLocalAccount = function({email, password}) {
  throw new Error('Not Implemented.')
}

userSchema.methods.linkFacebookAccount = function({account, token}) {
  throw new Error('Not Implemented.')
}

userSchema.methods.linkTwitterAccount = function({account, token}) {
  throw new Error('Not Implemented.')
}

userSchema.methods.linkGoogleAccount = function({account, token}) {
  throw new Error('Not Implemented.')
}

userSchema.methods.linkLinkedinAccount = function({account, token}) {
  throw new Error('Not Implemented.')
}

userSchema.methods.unlinkAccount = function(type) {
  throw new Error('Not Implemented.')
}

let User = mongoose.model('User', userSchema)
module.exports = User
