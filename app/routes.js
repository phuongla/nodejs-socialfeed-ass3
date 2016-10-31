let _ = require('lodash')
let then = require('express-then')
let isLoggedIn = require('./middlewares/isLoggedIn')
let posts = require('../data/posts')
let TwitterController = require('./middlewares/TwitterController')
let FacebookController = require('./middlewares/FacebookController')
let authConfig
let authMode

function getSocialController(req, res, next) {
    if(authMode == 'twitter') {
        let twitterConfig = {
            consumer_key: authConfig.twitter.consumerKey,
            consumer_secret: authConfig.twitter.consumerSecret,
            access_token_key: req.user.twitter.token,
            access_token_secret: req.user.twitter.secret
        }
        let twitterController = new TwitterController(twitterConfig);
        req.controller = twitterController
    } else if(authMode == 'facebook') {
        let config = {
            appId: authConfig.facebook.clientID,
            appSecret: authConfig.facebook.clientSecret,
            accessToken: req.user.facebook.token
        }
        let controller = new FacebookController(config);
        req.controller = controller
    }
    next()
}

module.exports = (app, config) => {
    authConfig = config
    let passport = app.passport

    app.get('/', (req, res) => {
        res.render('index.ejs')
    })

    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile.ejs', {
            user: req.user,
            message: req.flash('error')
        })
    })

    app.get('/logout', (req, res) => {
        req.logout,
        res.redirect('/')
    })

    app.get('/login', (req, res) => {
        res.render('login.ejs', { message: req.flash('error') })
    })

    app.get('/signup', (req, res) => {
        res.render('signup.ejs', { message: req.flash('error') })
    })

    app.get('/auth/twitter', passport.authenticate('twitter'))

    app.get('/auth/twitter/callback', (req, res, next) => { 
        authMode = 'twitter'
        next()
    }, passport.authenticate('twitter', {
        successRedirect: '/profile',
        failRedirect: '/'
    }))

    app.get('/timeline', isLoggedIn, getSocialController , async (req, res) => {
        let controller = req.controller
        let feeds = await controller.getHomeTimeline()
        res.render('timeline.ejs' , { posts: feeds })
    })

    app.get('/compose', isLoggedIn, getSocialController, (req, res) => {
        res.render('compose.ejs', { message: req.flash('error') })
    })

    app.post('/like/:id', isLoggedIn, getSocialController, async (req, res) => {
        await req.controller.like(req.params.id)
        res.end()
    })

    app.post('/unlike/:id', isLoggedIn, getSocialController, async (req, res) => {
        await req.controller.unlike(req.params.id)
        res.end()
    })

    app.post('/compose', isLoggedIn, getSocialController, then(async (req, res) => {
        let status = req.body.text
        if(!status) {
            req.flash('error', 'Status is cannot be empty')
            res.render('compose.ejs', { message: req.flash('error') })
            return
        }
        if(status.length > 140) {
            req.flash('error', 'Status is over 140 characters')
            res.render('compose.ejs', { message: req.flash('error') })
            return
        }
        await req.controller.compose(status)
        res.redirect('/timeline')
    }))

    app.get('/reply/:id', isLoggedIn, getSocialController, async (req, res) => {
        let post = await req.controller.getFeed(req.params.id)
        res.render('reply.ejs', { post: post, message: req.flash('error') })
    })

    app.post('/reply/:id', isLoggedIn, getSocialController, async (req, res) => {
        let message = req.body.reply
        if(message.length > 140) {
            req.flash('error', 'Status is over 140 characters')
            res.redirect(`/reply/${req.params.id}`)
            return
        }
        await req.controller.reply(req.params.id, message)
        res.redirect('/timeline')
    })

    app.get('/share/:id', isLoggedIn, getSocialController, async (req, res) => {
        let post = await req.controller.getFeed(req.params.id)
        res.render('share.ejs', { post: post, message: req.flash('error') })
    })

    app.post('/share/:id', isLoggedIn, getSocialController, async (req, res) => {
        let message = req.body.share
        if(message.length > 140) {
            req.flash('error', 'Status is over 140 characters')
            res.redirect(`/share/${req.params.id}`)
            return
        }
        await req.controller.share(req.params.id, message)
        res.redirect('/timeline')
    })

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'publish_actions', 'user_posts']
    }))
    app.get('/auth/facebook/callback', (req, res, next) => { 
        authMode = 'facebook'
        next()
    } , passport.authenticate('facebook', {
        successRedirect: '/profile',
        failRedirect: '/'
    }))

}