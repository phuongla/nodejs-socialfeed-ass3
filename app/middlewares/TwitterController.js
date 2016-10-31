let Twitter = require('twitter')
let Promise = require('songbird')

let network = {
      icon: 'twitter',
      name: 'Twitter',
      class: 'btn-info'
    }

class TwitterController {
    constructor(twitterConfig){
        this.twitterClient = new Twitter(twitterConfig)
    }

    async getHomeTimeline() {
        let tweets = await this.twitterClient.promise.get('statuses/home_timeline')
        .catch(err => {
            console.log(err)
        })
        let data = tweets.map( tweet => {
            return {
                id: tweet.id_str,
                image: tweet.user.profile_image_url,
                text: tweet.text,
                name: tweet.user.name,
                username: '@' + tweet.user.screen_name,
                liked: tweet.favorited,
                network: network
            }
        })
        return data
    }

    async like(id){
        this.twitterClient.promise.post('favorites/create', { id })
        .catch(err => {
            console.log(err)
        })
    }

    async unlike(id){
        this.twitterClient.promise.post('favorites/destroy', { id })
        .catch(err => {
            console.log(err)
        })
    }

    async compose(status){        
        this.twitterClient.promise.post('statuses/update', {status})
        .catch(err => {
            console.log(err)
        })
    }

    async getFeed(id) {
        let tweet = await this.twitterClient.promise.get('statuses/show', {id})
        .catch(err => {
            console.log(err)
        })
        return {
            id: tweet.id_str,
            image: tweet.user.profile_image_url,
            text: tweet.text,
            name: tweet.user.name,
            username: '@' + tweet.user.screen_name,
            liked: tweet.favorited,
            network: network
        }
    }

    async reply(id, message) {
        let feed = await this.getFeed(id)
        let replyData = { 
            status:  `${feed.username} ${message}`,
            in_reply_to_status_id:  id 
        }
        await this.twitterClient.promise.post('statuses/update', replyData
        ).catch(err => {
            console.log(err)
        })
    }

    async reply(id, message) {
        let feed = await this.getFeed(id)
        let replyData = { 
            status:  `${feed.username} ${message}`,
            in_reply_to_status_id:  id 
        }
        await this.twitterClient.promise.post('statuses/update', replyData
        ).catch(err => {
            console.log(err)
        })
    }

    async share(id, message) {
        try {
            if(message) {
                let feed = await this.getFeed(id)
                let qouteData = `${message} ${feed.username} ${feed.text}`
                await this.twitterClient.promise.post('statuses/update', {qouteData})
            } else{
                await this.twitterClient.promise.post('statuses/retweet', {id})
            }
        } catch(err) {
            console.log(err)
        }
    }
}

module.exports = TwitterController