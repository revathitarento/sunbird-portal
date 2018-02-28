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
  constructor ({
    userName
  } = {}) {
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

    this.userName = userName
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
          category: threadData.type
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

  /*
   *reply discourse topic
   *
   */
  replyThread (threadData, user) {
    return new Promise((resolve, reject) => {
      this.createUserIfNotExists(user).then((success) => {
        let formData = {
          api_key: this.apiAuth.apiKey,
          api_username: user.userName,
          raw: threadData.body,
          topic_id: threadData.threadId
        }

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
      let postData = _.find(posts, {
        topic_id: topic.id,
        post_number: 1
      })
      let threadData = {
        id: topic.id,
        author: {
          userName: postData.username,
          name: postData.name
        },
        body: postData.blurb,
        title: topic.title,
        createdDate: topic.created_at,
        repliesCount: topic.posts_count - 1,
        voteCount: postData.like_count,
        seen: !topic.unseen
      }
      threadList.push(threadData)
    })
    return threadList
  }

  extractThreadData (topicData) {
    let posts = topicData.post_stream.posts
    let postData = _.find(posts, {
      topic_id: topicData.id,
      post_number: 1
    })
    let posters = []
    _.forEach(topicData.details.participants, function (participant) {
      posters.push({
        userId: participant.id,
        userName: participant.username
      })
    })

    let threadData = {
      id: topicData.id,
      author: {
        userName: postData.username,
        name: postData.name
      },

      body: postData.cooked.substring(postData.cooked.indexOf('>') + 1, postData.cooked.lastIndexOf('<')),
      title: topicData.title,
      createdDate: topicData.created_at,
      repliesCount: posts.length - 1,
      voteCount: topicData.like_count,
      read: postData.read,
      posters: posters,
      replies: [],
      actions: this.getThreadActions(postData, false)
    }
    let adapter = this
    _.forEach(posts, function (post, index) {
      if (post.post_number !== 1) {
        let replyData = {
          id: post.id,
          author: {
            userName: post.username,
            name: post.name
          },
          body: post.cooked.substring(post.cooked.indexOf('>') + 1, post.cooked.lastIndexOf('<')),
          actions: adapter.getThreadActions(post, true),
          createdDate: post.created_at,
          voteCount: post.like_count,
          acceptedAnswer: post.accepted_answer,
          read: post.read
        }
        threadData.replies.push(replyData)
      }
    })
    return threadData
  }

  getThreadActions (threadData, isPost) {
    let actions = {
      downVote: 0
    }
    _.forEach(threadData.actions_summary, function (action) {
      if (action.id === 2) {
        actions['vote'] = (action.acted === true) ? 1 : (action.can_act === true) ? 0 : -1
      }
      if (action.id === 8) {
        actions['flag'] = (action.acted === true) ? 1 : (action.can_act === true) ? 0 : -1
      }
    })
    if (actions['vote'] === -1) {
      actions['downVote'] = -1
    } else {
      if (threadData.retorts) {
        let downVoteData = _.find(threadData.retorts, {
          emoji: '-1'
        })
        if (downVoteData && downVoteData.usernames) {
          actions['downVote'] = (downVoteData.usernames.indexOf(this.userName) >= 0) ? 1 : 0
        }
      }
    }
    if (isPost) {
      actions['acceptAnswer'] = (threadData.can_accept_answer && threadData.can_accept_answer === true) ? 0 : (threadData.can_accept_answer === true && threadData.accepted_answer && threadData.accepted_answer === true && threadData.can_unaccept_answer === true) ? 1 : -1
    }
    return actions
  }

  /*
   *get discourse topics
   *
   */
  getThreadsList (threadData, user) {
    this.userName = user.userName
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

  /*
   *get discourse topics
   *
   */
  getThreadById (threadId, user) {
    this.userName = user.userName
    return new Promise((resolve, reject) => {
      this.createUserIfNotExists(user).then((success) => {
        let filters = {
          api_key: this.apiAuth.apiKey,
          api_username: this.userName
        }
        let options = {
          method: 'GET',
          uri: this.discourseEndPoint + this.discourseUris.getOne + '/' + threadId + '.json?' + queryString.stringify(filters)
        }

        this.httpService.call(options).then((data) => {
          let res = JSON.parse(data.body)
          console.log(JSON.stringify(res))

          if (res) {
            resolve(this.extractThreadData(res))
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
