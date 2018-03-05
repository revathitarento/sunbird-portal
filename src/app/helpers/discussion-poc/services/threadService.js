/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

/**
 * Class provides services for thread related requests */
let GroupService = require('./groupService')
let async = require('asyncawait/async')
let await = require('asyncawait/await') //eslint-disable-line
let HttpStatus = require('http-status-codes')
class ThreadService {
  /**
   *
   * Callers of the constructor can invoke as follows:
   *
   * let threadService = new ThreadService({discourseWrapper:instance })
   */
  constructor(discussionAdapter) {
    /**
     * @property {instance} discussionAdapter - Instance of any discussion engine's adapter like discourse which is used to make a discussion related api calls
     */
    this.discussionAdapter = discussionAdapter
    this.groupService = new GroupService()
  }

  /*
   *create thread
   *
   */
  createThread(threadData, user) {
    return new Promise((resolve, reject) => {
      try {
        let group = await (this.groupService.getOrCreateGroup(threadData.contextType, threadData.contextId, user))
        if (group) {
          let threadId = await (this.discussionAdapter.createThread(threadData, user))
          this.groupService.addThreadConfig(group, threadId).then((success) => {
              resolve(threadId)
            },
            (error) => {
              reject({
                message: 'Error',
                status: HttpStatus.INTERNAL_SERVER_ERROR
              })
            })
        } else {
          reject({
            message: 'Error',
            status: HttpStatus.INTERNAL_SERVER_ERROR
          })
        }
      } catch (error) {
        reject({
          message: 'Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }

  editThread(threadData, user) {
    return new Promise((resolve, reject) => {
      try {
        let moderationAllowed = await (this.groupService.checkModerationAccess(threadData.threadId, user.userId))
        if (moderationAllowed === true) {
          let status = await (this.discussionAdapter.editThread(threadData, user))
          resolve(status)
        } else {
          reject({
            message: 'This action requires moderation rights',
            status: HttpStatus.FORBIDDEN
          })
        }
      } catch (error) {
        reject({
          message: 'Error in checking moderation rights',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }
  
  checkModerationAccess(threadData, user) {
    return new Promise((resolve, reject) => {
      try {
        let moderationAllowed = await (this.groupService.checkModerationAccess(threadData.threadId, user.userId))
        if (moderationAllowed === true) {          
          resolve({access:true})
        } else {
          resolve({access:false})
        }
      } catch (error) {
        reject({
          message: 'Error in checking moderation rights',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }

  archiveThread(threadData, user) {
    return new Promise((resolve, reject) => {
      try {
        let moderationAllowed = await (this.groupService.checkModerationAccess(threadData.threadId, user.userId))
        if (moderationAllowed === true) {
          threadData.status = 'archived'
          let status = await (this.discussionAdapter.moderationAction(threadData, user))
          resolve(status)
        } else {
          reject({
            message: 'This action requires moderation rights',
            status: HttpStatus.FORBIDDEN
          })
        }
      } catch (error) {
        reject({
          message: 'Error in checking moderation rights',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }

  lockThread(threadData, user) {
    return new Promise((resolve, reject) => {
      try {
        let moderationAllowed = await (this.groupService.checkModerationAccess(threadData.threadId, user.userId))
        if (moderationAllowed === true) {
          threadData.status = 'closed'
          let status = await (this.discussionAdapter.moderationAction(threadData, user))
          resolve(status)
        } else {
          reject({
            message: 'This action requires moderation rights',
            status: HttpStatus.FORBIDDEN
          })
        }
      } catch (error) {
        reject({
          message: 'Error in checking moderation rights',
          status: HttpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }


  /*
   *reply thread
   *
   */
  replyThread(threadData, user) {
    return this.discussionAdapter.replyThread(threadData, user)
  }

  getThreadsList(threadData, user) {
    return this.discussionAdapter.getThreadsList(threadData, user)
  }
  getThreadById(threadId, user) {
    return this.discussionAdapter.getThreadById(threadId, user)
  }

  voteThread(threadData, user) {
    let actionData = {
      postId: threadData.postId
    }
    switch (threadData.value) {
      case 'up':
        actionData.type = 2
        if (!threadData.undo) {
          return this.discussionAdapter.postAction(actionData, user)
        } else {
          return this.discussionAdapter.postUndoAction(actionData, user)
        }

      case 'down':
        actionData.type = -1
        if (!threadData.undo) {
          return this.discussionAdapter.retort(actionData, user)
        } else {
          return this.discussionAdapter.retort(actionData, user)
        }
    }
  }
  flagThread(threadData, user) {
    let actionData = {
      postId: threadData.postId,
      type: 8
    }
    if (!threadData.undo) {
      return this.discussionAdapter.postAction(actionData, user)
    } else {
      return this.discussionAdapter.postUndoAction(actionData, user)
    }
  }
  markAsAnswer(answerData, user) {
    return this.discussionAdapter.acceptSoution(answerData, user)
  }
}

module.exports = ThreadService
