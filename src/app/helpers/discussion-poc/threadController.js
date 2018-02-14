const _ = require('lodash')
let async = require('asyncawait/async')
let await = require('asyncawait/await')
let envVariables = require('../environmentVariablesHelper.js')
let HttpStatus = require('http-status-codes')
let ApiInterceptor = require('sb_api_interceptor')
let ThreadService = require('./services/threadService.js')
let httpWrapper = require('./services/httpWrapper.js')
let AppError = require('./services/ErrorInterface.js')
class ThreadController {
	constructor({
		service
	} = {}) {
		/**
		 * @property {instance} httpService - Instance of httpservice which is used to make a http service call
		 */
		this.httpService = httpWrapper
		this.threadService = new ThreadService()
	}


	/**
	 * To get a user's profile data
	 * @param  String authUserToken User's access token
	 * @return Object               Profile data
	 */
	__getUserProfile(authUserToken) {
		return new Promise((resolve, reject) => {
			try {
				let tokenDetails = await (this.__getTokenDetails(authUserToken))

				if (!tokenDetails) {
					throw {
						message: 'Unauthorized User!',
						status: HttpStatus.UNAUTHORIZED,
						isCustom: true
					}
				}
				let options = {
					method: 'GET',
					uri: envVariables.DATASERVICE_URL + 'user/v1/read/' + tokenDetails.userId,
					headers: this.httpService.getRequestHeader(authUserToken)
				}

				this.httpService.call(options).then((data) => {
						let body = JSON.parse(data.body)
						resolve(body.result.response)
					})
					.catch((error) => {

						if (_.get(error, 'body.params.err') === 'USER_NOT_FOUND') {
							reject(this.customError({
								message: 'User not found!',
								status: HttpStatus.NOT_FOUND,
								isCustom: true
							}))
						} else if (_.get(error, 'body.params.err') === 'UNAUTHORIZE_USER') {
							reject(this.customError({
								message: 'Unauthorized User!',
								status: HttpStatus.UNAUTHORIZED,
								isCustom: true
							}))
						} else {
							reject(this.customError({
								message: 'Unknown Error!',
								status: HttpStatus.BAD_GATEWAY,
								isCustom: true
							}))
						}
					})
			} catch (error) {
				reject(this.customError(error))
			}
		})
	}

	/**
	 * Get logged in user id
	 * @return {[type]} [description]
	 */
	__getLoggedinUserId() {
		return async ((requestObj) => {
			let authUserToken = this.__getToken(requestObj)
			let tokenDetails = await (this.__getTokenDetails(authUserToken))
			if (tokenDetails) {
				return tokenDetails.userId
			}
			return false
		})
	}

	/**
	 * Get the logged in user's suth token or the token passed in API call
	 * @return String Token
	 */
	__getToken(requestObj) {
		return _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
	}

	/**
	 * Validates the token and fetch the userId
	 * @param  String authUserToken Auth user token
	 * @return Object               For a valid token return token and user id.
	 */
	__getTokenDetails(authUserToken) {
		return new Promise((resolve, reject) => {
			var keyCloak_config = {
				'authServerUrl': envVariables.PORTAL_AUTH_SERVER_URL,
				'realm': envVariables.KEY_CLOAK_REALM,
				'clientId': envVariables.PORTAL_AUTH_SERVER_CLIENT,
				'public': envVariables.KEY_CLOAK_PUBLIC
			}
			var cache_config = {
				store: envVariables.sunbird_cache_store,
				ttl: envVariables.sunbird_cache_ttl
			}
			if (authUserToken) {
				var apiInterceptor = new ApiInterceptor(keyCloak_config, cache_config)
				apiInterceptor.validateToken(authUserToken, function(err, token) {
					if (token) {
						resolve(token)
					} else {
						resolve(false)
					}
				})
			} else {
				resolve(false)
			}
		})
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
		requestObj.topic = true;
		return this.__postThread()(requestObj)
	}

	/**
	 * create thread
	 *
	 * @return  {[type]} return transformed data
	 */
	replyThread(requestObj) {
		return this.__postThread()(requestObj)
	}
	/**
	 * create thread
	 *
	 * @return  {[type]} return transformed data
	 */
	postActions(requestObj) {
		return this.__postActions()(requestObj)
	}
	/**
	 * create thread
	 *
	 * @return  {[type]} return transformed data
	 */
	markAsSolution(requestObj) {
		return this.__markAsSolution()(requestObj)
	}


	/*
	 *create thread flow
	 *
	 */
	__markAsSolution(requestObj) {
		return async ((requestObj) => {
			try {

				let authUserToken = await (this.__getToken(requestObj))

				let userProfile = await (this.__getUserProfile(authUserToken))

				if (userProfile) {
					return new Promise((resolve, reject) => {
						let answerData = {
							userName: userProfile.userName,
							id: requestObj.body.id
						}

						this.threadService.markAsSolution(answerData).then((threadResponse) => {							
							resolve({
								status: threadResponse
							})
						}, function(error) {
							console.log("threadResponse error ",error)
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
	__postActions(requestObj) {
		return async ((requestObj) => {
			try {

				let authUserToken = await (this.__getToken(requestObj))

				let userProfile = await (this.__getUserProfile(authUserToken))

				if (userProfile) {
					return new Promise((resolve, reject) => {
						let actionData = {
							userName: userProfile.userName,
							id: requestObj.params.id,
							actionTypeId: requestObj.body.actionTypeId,
							undo:requestObj.body.undo
						}

						this.threadService.postActions(actionData).then((threadResponse) => {
							resolve({
								id: threadResponse
							})
						}, function(error) {
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
	__postThread(requestObj) {
		return async ((requestObj) => {
			try {
				let authUserToken = await (this.__getToken(requestObj))
				// validate request
				let userProfile = await (this.__getUserProfile(authUserToken))

				if (userProfile) {
					return new Promise((resolve, reject) => {
						let threadData = {
							userName: userProfile.userName,
							title: requestObj.body.title,
							description: requestObj.body.description,
							contextId : requestObj.body.contextId
						}
console.log("threadData",threadData)
						if (requestObj.params.id) {
							threadData.topic_id = requestObj.params.id
						}

						this.threadService.postThread(threadData).then((threadResponse) => {
							resolve({
								id: threadResponse
							})
						}, function(error) {
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
				let authUserToken = await (this.__getToken(requestObj))
				// validate request
				let userProfile = await (this.__getUserProfile(authUserToken))

				// validate request
				let userId = await (this.__getLoggedinUserId()(requestObj))
				if (userId) {
					return new Promise((resolve, reject) => {
						this.threadService.getRecentThreads(userProfile.userName,requestObj.params.contextId).then((threadResponse) => {
							resolve({
								threads: threadResponse
							})
						}, function(error) {
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
			} catch (error) {console.log("Error in catch",error)
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
				let authUserToken = await (this.__getToken(requestObj))
				// validate request
				let userProfile = await (this.__getUserProfile(authUserToken))

				// validate request
				let userId = await (this.__getLoggedinUserId()(requestObj))
				if (userId) {
					return new Promise((resolve, reject) => {
						this.threadService.getThreadById(requestObj.params.id,userProfile.userName).then((threadResponse) => {
							resolve({
								thread: threadResponse
							})
						}, function(error) {
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
		console.log("419 error ",error)
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
