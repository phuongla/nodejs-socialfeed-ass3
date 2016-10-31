let rp = require('request')
let Promise = require('songbird')

let network = {
      icon: 'facebook',
      name: 'Facebook',
      class: 'btn-primary'
    }
const graphURL = 'https://graph.facebook.com/v2.5' 

class FacebookController {
    constructor(config){
        this.config = config
    }

    async getHomeTimeline() {
        let response = await rp.promise.get(graphURL + '/me/feed?access_token=' + this.config.accessToken)
        console.log(response.body.data)
        
        let data = feeds.map( feed => {
            return {
                id: feed.id_str,
                image: feed.user.profile_image_url,
                text: feed.text,
                name: feed.user.name,
                username: '@' + tweet.user.screen_name,
                liked: feed.favorited,
                network: network
            }
        })
        return data
    }
    /*
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
    */
}

module.exports = FacebookController