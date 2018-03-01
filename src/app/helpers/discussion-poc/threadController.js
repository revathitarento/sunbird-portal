const _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await') //eslint-disable-line
let HttpStatus = require('http-status-codes')
let ThreadService = require('./services/threadService.js')
let httpWrapper = require('./services/httpWrapper.js')
let AppError = require('./services/ErrorInterface.js')
let DiscouseAdapter = require('./services/adapters/discourseAdapter.js')
let UserService = require('./services/userService.js')

class ThreadController {
  constructor({
    service
  } = {}) {
    /**
     * @property {instance} httpService - Instance of httpservice which is used to make a http service call
     */
    this.discouseAdapter = new DiscouseAdapter({})
    this.httpService = httpWrapper
	this.threadService = new ThreadService(this.discouseAdapter)
	this.userService = new UserService()
  }


  
  /**
   * Get threads list
   *
   * @return  {[type]} return transformed data
   */
  getThreads(requestObj) {
    return this.__getThreads()(requestObj)
  }

  /**
   * Get thread by id
   *
   * @return  {[type]} return transformed data
   */
  getThreadById(requestObj) {
    return this.__getThreadById()(requestObj)
  }

  /**
   * create thread
   *
   * @return  {[type]} return transformed data
   */
  createThread(requestObj) {
    return this.__createThread()(requestObj)
  }

  /**
   * create thread
   *
   * @return  {[type]} return transformed data
   */
  replyThread(requestObj) {
    return this.__replyThread()(requestObj)
  }
  /**
   * create thread
   *
   * @return  {[type]} return transformed data
   */
  voteThread(requestObj) {
    return this.__voteThread()(requestObj)
  }
  /**
   * create thread
   *
   * @return  {[type]} return transformed data
   */
  flagThread(requestObj) {
    return this.__flagThread()(requestObj)
  }

  /**
   * create thread
   *
   * @return  {[type]} return transformed data
   */
  markAsAnswer(requestObj) {
    return this.__markAsAnswer()(requestObj)
  }




  /*
   *create thread flow
   *
   */
  __markAsAnswer(requestObj) {
    return async ((requestObj) => {
      try {

        let authUserToken = await (this.userService.getToken(requestObj))

        let userProfile = await (this.userService.getUserProfile(authUserToken))

        if (userProfile) {
          return new Promise((resolve, reject) => {
            let user = {
              userName: userProfile.userName,
            }
            let answerData = {
              postId: requestObj.body.postId
            }

            this.threadService.markAsAnswer(answerData, user).then((threadResponse) => {
              resolve({
                status: threadResponse
              })
            }, function (error) {
              reject({
                error: error
              })
            })
          })
        } else {
          return {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {
        return {
          message: 'Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }


  /*
   *create thread flow
   *
   */
  __flagThread(requestObj) {
    return async ((requestObj) => {
      try {

        let authUserToken = await (this.userService.getToken(requestObj))

        let userProfile = await (this.userService.getUserProfile(authUserToken))

        if (userProfile) {
          return new Promise((resolve, reject) => {
            let user = {
              userName: userProfile.userName
            }
            let threadData = {
              postId: requestObj.body.postId,
              undo: requestObj.body.undo
            }
            this.threadService.flagThread(threadData, user).then((threadResponse) => {
              resolve({
                status: threadResponse
              })
            }, function (error) {
              reject({
                error: error
              })
            })
          })
        } else {
          return {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {

        return {
          message: 'Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }

  /*
   *create thread flow
   *
   */
  __voteThread(requestObj) {
    return async ((requestObj) => {
      try {

        let authUserToken = await (this.userService.getToken(requestObj))

        let userProfile = await (this.userService.getUserProfile(authUserToken))

        if (userProfile) {
          return new Promise((resolve, reject) => {
            let user = {
              userName: userProfile.userName
            }
            let threadData = {
              postId: requestObj.body.postId,
              value: requestObj.body.value,
              undo: requestObj.body.undo
            }
            this.threadService.voteThread(threadData, user).then((threadResponse) => {
              resolve({
                status: threadResponse
              })
            }, function (error) {
              reject({
                error: error
              })
            })
          })
        } else {
          return {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {

        return {
          message: 'Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }


  /*
   *reply thread flow
   *
   */
  __replyThread(requestObj) {
    return async ((requestObj) => {
      try {
        let authUserToken = await (this.userService.getToken(requestObj))
        // validate request
        let userProfile = await (this.userService.getUserProfile(authUserToken))

        if (userProfile) {
          return new Promise((resolve, reject) => {
            let threadData = {
              threadId: requestObj.body.threadId,
              body: requestObj.body.body
            }
            let user = {
              userName: userProfile.userName,
              firstName: userProfile.firstName,
              email: userProfile.email
            }
            this.threadService.replyThread(threadData, user).then((threadResponse) => {
              resolve({
                id: threadResponse
              })
            }, function (error) {
              reject({
                error: error
              })
            })
          })
        } else {
          return {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {

        return {
          message: 'Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }

  /*
   *create thread flow
   *
   */
  __createThread(requestObj) {
    return async ((requestObj) => {
      try {
        let authUserToken = await (this.userService.getToken(requestObj))
        // validate request
        let userProfile = await (this.userService.getUserProfile(authUserToken))

        if (userProfile) {
          return new Promise((resolve, reject) => {
            let threadData = {
              title: requestObj.body.title,
              body: requestObj.body.body,
              communityId: requestObj.body.communityId,
              type: requestObj.body.type
            }
            let user = {
              userName: userProfile.userName,
              firstName: userProfile.firstName,
              email: userProfile.email
            }

            this.threadService.createThread(threadData, user).then((threadResponse) => {
              resolve({
                id: threadResponse
              })
            }, function (error) {
              reject({
                error: error
              })
            })
          })
        } else {
          return {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {

        return {
          message: 'Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }

  /**
   * Initialize the get threads flow
   * @return Object Response of getThreads
   */
  __getThreads() {
    return async ((requestObj) => {
      try {
        let authUserToken = await (this.userService.getToken(requestObj))
        // validate request
        let userProfile = await (this.userService.getUserProfile(authUserToken))

        // validate request
        let userId = await (this.userService.getLoggedinUserId()(requestObj))
        if (userId) {
          return new Promise((resolve, reject) => {
            let threadFilters = {
              communityId: requestObj.body.communityId,
              type: requestObj.body.type
            }
            let user = {
              userName: userProfile.userName
            }
            this.threadService.getThreadsList(threadFilters, user).then((threadResponse) => {
              resolve({
                threads: threadResponse
              })
            }, function (error) {
              reject({
                error: error
              })
            })
          })
        } else {
          return {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {
        console.log("Error in catch", error)
        return {
          message: 'Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }

  /**
   * Initialize the get threads by idflow
   * @return Object Response of getThreadByID
   */
  __getThreadById() {
    return async ((requestObj) => {
      try {
        let authUserToken = await (this.userService.getToken(requestObj))
        // validate request
        let userProfile = await (this.userService.getUserProfile(authUserToken))

        // validate request
        let userId = await (this.userService.getLoggedinUserId()(requestObj))
        if (userId) {
          return new Promise((resolve, reject) => {
            let user = {
              userName: userProfile.userName
            }
            this.threadService.getThreadById(requestObj.params.id, user).then((threadResponse) => {
              resolve({
                thread: threadResponse
              })
            }, function (error) {
              reject({
                error: error
              })
            })
          })
        } else {
          return {
            message: 'Unauthorized User',
            status: HttpStatus.UNAUTHORIZED
          }
        }
      } catch (error) {
        return {
          message: 'Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
    })
  }

  /**
   * Which is used to create a custom error object
   * @param  {Object} error  - Error object it should contain message and status attribute
   *                           For example error = {message:'Invalid request object', status:'400'}
   * @return {Object}        - Error object
   */
  customError(error) {
    console.log("419 error ", error)
    if (error.isCustom) {
      return new AppError({
        message: error.message || 'Unable to process the request!',
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      })
    } else {
      return new AppError({
        message: 'Unable to process the request!',
        status: HttpStatus.INTERNAL_SERVER_ERROR
      })
    }
  }
}
module.exports = ThreadController
