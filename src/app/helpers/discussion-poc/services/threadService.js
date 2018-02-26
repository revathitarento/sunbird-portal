/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

let webService = require('request')
let envVariables = require('../../environmentVariablesHelper.js')
let httpWrapper = require('./httpWrapper.js')
let async = require('async')
const _ = require('lodash')
let AppError = require('./ErrorInterface.js')
let HttpStatus = require('http-status-codes')
/**
 * Class provides services for thread related requests */

class ThreadService {
  /**
   *
   * Callers of the constructor can invoke as follows:
   *
   * let userService = new UserService({userAccessToken: 135-5435-6456,userId:5343434-67676-135-5, httpService:instance })
   */
  constructor({
    userId
  } = {}) {
    /**
     * @property {instance} httpService - Instance of httpservice which is used to make a http service call
     */
    this.httpService = httpWrapper

    /**
     * @property {string} userId - An unique id of user
     */
    this.userId = userId

    /**
     * @property {string} discourseEndPoint - An endpoint url for discourse api
     */
    this.discourseEndPoint = 'http://51242de9.ngrok.io'
    /**
     * @property {object} discourseUriList - List of discourse uri's
     */
    this.discourseUris = {
      list: '/tags/',
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
  createUser(userName) {
    return new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        uri: this.discourseEndPoint + this.discourseUris.users + '.json',
        form: {
          api_key: this.apiAuth.apiKey,
          api_username: this.apiAuth.apiUserName,
          name: userName,
          email: userName + '@gmail.com',
          password: 'testU1234567890',
          username: userName,
          active: 'true',
          approved: 'true'
        }
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        if (res.user_id) {
          resolve(true)
        } else {
          reject(true)
        }
      }, (error) => {
        reject(true)
      })
    })
  }

  /*
   *check discourse user and create if not found
   */
  createUserIfNotExists(userName) {
    return new Promise((resolve, reject) => {
      let options = {
        method: 'GET',
        uri: this.discourseEndPoint + this.discourseUris.users + '/' + userName + '.json'
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        if (res.user) {
          resolve(true)
        } else {
          this.createUser(userName).then((success) => {
            resolve(true)
          }, (error) => {
            reject(true)
          })
        }
      }, (error) => {
        reject(true)
      })
    })
  }


  /*
   *create discourse topic
   *
   */
  postActions(actionData) {
    console.log('action data', actionData)
    return new Promise((resolve, reject) => {
      this.createUserIfNotExists(actionData.userName).then((success) => {
        console.log('suc', success);

        let formData = {
          api_key: this.apiAuth.apiKey,
          api_username: actionData.userName,
          id: actionData.id,
          post_action_type_id: actionData.actionTypeId
        }
        let options = {
          method: 'POST',
          uri: this.discourseEndPoint + this.discourseUris.postActions,
          form: formData
        }
        if (actionData.undo) {
          options.method = 'DELETE'
          options.uri = options.uri + '/' + formData.id
        }
        this.httpService.call(options).then((data) => {
          let res = JSON.parse(data.body)
          console.log('res', res);
          if (res.id) {
            resolve(res.id)
          } else {

            reject(new AppError({
              message: 'Discourse error',
              status: HttpStatus.INTERNAL_SERVER_ERROR
            }))
          }
        }, (error) => {
          reject(new AppError({
            message: 'Discourse error',
            status: HttpStatus.INTERNAL_SERVER_ERROR
          }))
        }).catch((error) => {
          reject({
            message: 'Discourse action error',
            status: HttpStatus.INTERNAL_SERVER_ERROR
          })
        })
      }, (error) => {
        reject(new AppError({
          message: 'Discourse user creation error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }))
      }).catch((error) => {
        reject(new AppError({
          message: 'Discourse user error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }))
      })
    })
  }




  /*
   *create discourse topic
   *
   */
  markAsSolution(actionData) {

    return new Promise((resolve, reject) => {
      let formData = {
        api_key: this.apiAuth.apiKey,
        api_username: actionData.userName,
        id: actionData.id
      }
      let options = {
        method: 'POST',
        uri: this.discourseEndPoint + this.discourseUris.acceptAsSolution,
        form: formData
      }
      this.httpService.call(options).then((data) => {
        let res = JSON.parse(data.body)
        console.log("res", res)
        if (res.success == "OK") {
          resolve('success')
        } else {
          reject({
            message: 'Discourse error',
            status: HttpStatus.INTERNAL_SERVER_ERROR
          })
        }
      }, (error) => {
        reject({
          message: 'Discourse error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        })
      }).catch((error) => {
        reject({
          message: 'Discourse action error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        })
      })

    })
  }








  /*
   *create discourse topic
   *
   */
  postThread(threadData) {
    return new Promise((resolve, reject) => {
      this.createUserIfNotExists(threadData.userName).then((success) => {
        let isReply = false
        let formData = {
          api_key: this.apiAuth.apiKey,
          api_username: threadData.userName,
          title: threadData.title,
          raw: threadData.description
        }

        if (threadData.topic_id) {
          formData.topic_id = threadData.topic_id
          formData.title = undefined
        } else {
          formData["tags[]"] = threadData.contextId
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
            reject({
              message: 'Discourse thread creation error',
              status: HttpStatus.INTERNAL_SERVER_ERROR
            })
          }
        }, (error) => {
          reject({
            message: 'Discourse thread creation error',
            status: HttpStatus.INTERNAL_SERVER_ERROR
          })
        })
      }, (error) => {
        reject(new AppError({
          message: 'Discourse user creation error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }))
      }).catch((error) => {
        reject(new AppError({
          message: 'Discourse user error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }))
      })
    })
  }



  /*
   * Get threads
   */
  getRecentThreads(userName, contextId) {
    return new Promise((resolve, reject) => {
      this.createUserIfNotExists(userName).then((success) => {
        let options = {
          method: 'GET',
          uri: this.discourseEndPoint + this.discourseUris.list + contextId + '.json'
        }
        console.log("optins ", options)
        this.httpService.call(options).then((data) => {
          let res = JSON.parse(data.body)
          console.log(res)
          if (res.topic_list) {
            resolve(res.topic_list.topics)
          }
          else {
            resolve([])
          }

        })
      }, (error) => {
        reject(new AppError({
          message: 'Discourse user creation error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }))
      }).catch((error) => {
        reject({
          message: 'Discourse error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        })
      })
    }).catch((error) => {
      reject(new AppError({
        message: 'Discourse error',
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }))
    })
  }

  /*
   * Get thread by its id
   */
  getThreadById(id, userName) {
    return new Promise((resolve, reject) => {
      let options = {
        method: 'GET',
        uri: this.discourseEndPoint + this.discourseUris.getOne + id + '.json?api_username=' + userName + '&api_key=' + this.apiAuth.apiKey
      }
      this.httpService.call(options).then((data) => {
        console.log(data.body)
        let res = JSON.parse(data.body)

        let posts = res.post_stream.posts
        let description = posts[0]
        posts.splice(0, 1)
        let threadData = {
          id: res.id,
          title: res.title,
          description: description.cooked,
          replies: posts,
          created_at: res.created_at,
          created_by: res.details.created_by.username,
          desId: description.id
        }
        resolve(threadData)
      })
    })
  }
}

module.exports = ThreadService
