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
}

module.exports = ThreadService
