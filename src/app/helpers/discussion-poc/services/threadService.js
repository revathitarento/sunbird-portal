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
    this.httpService = httpWrapper

    /**
     * @property {string} userId - An unique id of user
     */
    this.userId = userId

    /**
     * @property {string} discourseEndPoint - An endpoint url for discourse api
     */
    this.discourseEndPoint = 'http://172.17.0.2'
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
      apiKey: '6d1d27685a7bb8771bc18903d2b980a71b336d7715c28aeb345e3dac65126a47',
      apiUserName: 'revathipp'
    }

  }

  /*
   *create thread
   *
   */
  createThread (threadData, user) {
    return this.discussionAdapter.createThread(threadData, user)
  }

  getThreadsList (threadData, user) {
    return this.discussionAdapter.getThreadsList(threadData, user)
  }
}

module.exports = ThreadService
