/**
 * @author Loganathan Shanmugam <loganathan.shanmugam@tarento.com>
 */

/**
 * Class provides services for thread related requests */

class ThreadService {
  /**
   *
   * Callers of the constructor can invoke as follows:
   *
   * let threadService = new ThreadService({discourseWrapper:instance })
   */
  constructor (discussionAdapter) {
    /**
     * @property {instance} discussionAdapter - Instance of any discussion engine's adapter like discourse which is used to make a discussion related api calls
     */
    this.discussionAdapter = discussionAdapter
  }

  /*
   *create thread
   *
   */
  createThread (threadData, user) {
    return this.discussionAdapter.createThread(threadData, user)
  }
  /*
   *reply thread
   *
   */
  replyThread (threadData, user) {
    return this.discussionAdapter.replyThread(threadData, user)
  }

  getThreadsList (threadData, user) {
    return this.discussionAdapter.getThreadsList(threadData, user)
  }
  getThreadById (threadId, user) {
    return this.discussionAdapter.getThreadById(threadId, user)
  }

  voteThread (threadData, user) {
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
  flagThread (threadData, user) {
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
}

module.exports = ThreadService
