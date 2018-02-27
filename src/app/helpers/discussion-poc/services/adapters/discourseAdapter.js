/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

let httpWrapper = require('../httpWrapper.js')
const _ = require('lodash')
let queryString = require('querystring')
/**
 * Class provides services for thread related requests */

class DiscourseAdapter {
  /**
   *
   * Callers of the constructor can invoke as follows:
   *
   * let discourseAdapter = new DiscourseAdapter()
   */
  constructor () {
    /**
     * @property {instance} httpService - Instance of httpservice which is used to make a http service call
     */
    this.httpService = httpWrapper

    /**
     * @property {string} discourseEndPoint - An endpoint url for discourse api
     */
    this.discourseEndPoint = 'http://localhost:3001'
    /**
     * @property {object} discourseUriList - List of discourse uri's
     */
    this.discourseUris = {
      list: '/search.json',
      getOne: '/t/',
      postThread: '/posts',
      users: '/users',
      postActions: '/post_actions',
      acceptAsSolution: '/solution/accept'
    }

    this.apiAuth = {
      apiKey: '582df0739d5d4503c3eb8a8828bccaaa9d27fdf7be204f47509501717f6857ec',
      apiUserName: 'loganathan.shanmugam'
    }
  }

  /*
   *create discourse user
   */
  createUser (user) {
    return new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri: this.discourseEndPoint + this.discourseUris.users + '.json',
        form: {
          api_key: this.apiAuth.apiKey,
          api_username: this.apiAuth.apiUserName,
          name: user.firstName,
          email: user.email,
          password: 'testU1234567890',
          username: user.userName,
          active: 'true',
          approved: 'true'
        }
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        if (res.user_id) {
          resolve(true)
        } else {
          reject(res)
        }
      }, (error) => {
        reject(error)
      })
    })
  }

  /*
   *check discourse user and create if not found
   */
  createUserIfNotExists (user) {
    return new Promise((resolve, reject) => {
      let options = {
        method: 'GET',
        uri: this.discourseEndPoint + this.discourseUris.users + '/' + user.userName + '.json'
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        if (res.user) {
          resolve(true)
        } else {
          this.createUser(user).then((success) => {
            resolve(true)
          }, (error) => {
            reject(error)
          })
        }
      }, (error) => {
        reject(error)
      })
    })
  }

  /*
   *create discourse topic
   *
   */
  createThread (threadData, user) {
    return new Promise((resolve, reject) => {
      this.createUserIfNotExists(user).then((success) => {
        let formData = {
          api_key: this.apiAuth.apiKey,
          api_username: user.userName,
          title: threadData.title,
          raw: threadData.body,
          category: threadData.type,
          topic_id: 2181185
        }
        formData['tags[]'] = 'course__' + threadData.communityId
        let options = {
          method: 'POST',
          uri: this.discourseEndPoint + this.discourseUris.postThread,
          form: formData
        }
        this.httpService.call(options).then((data) => {
          let res = JSON.parse(data.body)
          console.log(res)
          if (res) {
            resolve(res.topic_id)
          } else {
            reject(res)
          }
        }, (error) => {
          reject(error)
        })
      }, (error) => {
        reject(error)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  extractThreadList (topics, posts) {
    let threadList = []
    _.forEach(topics, function (topic) {
      let postData = _.find(posts, {topic_id: topic.id, post_number: 1})
      let threadData = {
        id: topic.id,
        author: {
          userName: postData.username,
          name: postData.name
        },
        body: postData.cooked.substring(postData.cooked.indexOf('>') + 1, postData.cooked.lastIndexOf('<')),
        title: topic.title,
        createdDate: topic.created_at,
        replyCount: topic.reply_count,
        likeCount: postData.like_count
      }
      threadList.push(threadData)
    })
    return threadList
  }

  /*
   *get discourse topics
   *
   */
  getThreadsList (threadData, user) {
    return new Promise((resolve, reject) => {
      this.createUserIfNotExists(user).then((success) => {
        let filters = {
          q: '#' + threadData.type + ' tags:course__' + threadData.communityId,
          page: 1,
          api_key: this.apiAuth.apiKey,
          api_username: user.userName
        }

        let options = {
          method: 'GET',
          uri: this.discourseEndPoint + this.discourseUris.list + '?' + queryString.stringify(filters)
        }

        this.httpService.call(options).then((data) => {
          let res = JSON.parse(data.body)
          console.log(res)
          if (res) {
            resolve(this.extractThreadList(res.topics, res.posts))
          } else {
            reject(res)
          }
        }, (error) => {
          reject(error)
        })
      }, (error) => {
        reject(error)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

module.exports = DiscourseAdapter
