let express = require('express')
let router = express.Router()
let HttpStatus = require('http-status-codes')
let ThreadController = require('./threadController.js')
let httpService = require('./services/httpWrapper.js')
let dateFormat = require('dateformat')
let uuidv1 = require('uuid/v1')
const API_ID_BASE = 'api.plugin.discussions'
const API_IDS = {
  createthread: 'create-thread',
  listthreads: 'list-threads',
  replythread: 'reply-thread',
  getthreadbyid: 'get-thread-by-id',
  actions: 'actions',
  markassolution: 'markassolution',
  creategroup: 'create-group'
}

let threadController = new ThreadController({
  service: httpService
})

const API_VERSION = '1.0'

function sendSuccessResponse (res, id, result, code = HttpStatus.OK) {
  res.status(code)
  res.send({
    'id': API_ID_BASE + '.' + id,
    'ver': API_VERSION,
    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
    'params': {
      'resmsgid': uuidv1(),
      'msgid': null,
      'status': 'successful',
      'err': '',
      'errmsg': ''
    },
    'responseCode': 'OK',
    'result': result
  })
  res.end()
}

function getErrorCode (httpCode) {
  let responseCode = 'UNKNOWN_ERROR'

  if (httpCode >= 500) {
    responseCode = 'SERVER_ERROR'
  }

  if ((httpCode >= 400) && (httpCode < 500)) {
    responseCode = 'CLIENT_ERROR'
  }

  if (httpCode === 404) {
    responseCode = 'NOT_FOUND'
  }

  return responseCode
}

function sendErrorResponse (res, id, message, httpCode = HttpStatus.BAD_REQUEST) {
  let responseCode = getErrorCode(httpCode)

  res.status(httpCode)
  res.send({
    'id': API_ID_BASE + '.' + id,
    'ver': API_VERSION,
    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo', true),
    'params': {
      'resmsgid': uuidv1(),
      'msgid': null,
      'status': 'failed',
      'err': '',
      'errmsg': message
    },
    'responseCode': responseCode,
    'result': {}
  })
  res.end()
}

module.exports = function (keycloak) {
  router.post('/list', (requestObj, responseObj, next) => {
    threadController.getThreads(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.listthreads, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.listthreads, err.message, err.status)
      })
  })
  router.get('/thread/:id/', (requestObj, responseObj, next) => {
    threadController.getThreadById(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.getthreadbyid, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.getthreadbyid, err.message, err.status)
      })
  })
  router.post('/thread/create', (requestObj, responseObj, next) => {
    threadController.createThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.createthread, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.createthread, err.message, err.status)
      })
  })
  router.post('/thread/reply', (requestObj, responseObj, next) => {
    threadController.replyThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.replythread, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.replythread, err.message, err.status)
      })
  })
  router.post('/thread/vote', (requestObj, responseObj, next) => {
    threadController.voteThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.actions, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.actions, err.message, err.status)
      })
  })
  router.post('/thread/flag', (requestObj, responseObj, next) => {
    threadController.flagThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.actions, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.actions, err.message, err.status)
      })
  })
  router.post('/thread/markanswer', (requestObj, responseObj, next) => {
    threadController.markAsAnswer(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.markassolution, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.markassolution, err.message, err.status)
      })
  })

  router.put('/thread/edit', (requestObj, responseObj, next) => {
    threadController.editThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.actions, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.actions, err.message, err.status)
      })
  })
  router.put('/reply/edit', (requestObj, responseObj, next) => {
    threadController.replyThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.actions, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.actions, err.message, err.status)
      })
  })
  router.delete('/thread/lock', (requestObj, responseObj, next) => {
    threadController.lockThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.actions, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.actions, err.message, err.status)
      })
  })
  router.delete('/thread/archive', (requestObj, responseObj, next) => {
    threadController.archiveThread(requestObj)
      .then((data) => {
        sendSuccessResponse(responseObj, API_IDS.actions, data, HttpStatus.OK)
      })
      .catch((err) => {
        sendErrorResponse(responseObj, API_IDS.actions, err.message, err.status)
      })
  })
  router.post('/thread/edit', (requestObj, responseObj, next) => {   
    var data    
      data = {
       status: 'done'
    }
    console.log('Edit thread body', requestObj)
    sendSuccessResponse(responseObj, API_IDS.markassolution, data, HttpStatus.OK)
  })

  router.post('/reply/edit',(requestObj, responseObj, next) => {
    var data    
    data = {
     status: 'done'
  }
  console.log('Edit reply body', requestObj)
  sendSuccessResponse(responseObj, API_IDS.markassolution, data, HttpStatus.OK)
  })

  router.post('/thread/lock/:id', (requestObj, responseObj, next) => {
    console.log('lock', requestObj.body)
    var data
    if (requestObj.body.isLocked === false) {
      data = {
        id: requestObj.body.id,
        option: true
      }
      console.log('inside if', data)
    } else {
      data = {
        id: requestObj.body.id,
        option: false
      }
      console.log('inside else', data)
    }
    sendSuccessResponse(responseObj, API_IDS.markassolution, data, HttpStatus.OK)
  })
  router.post('/thread/spam/:id', (requestObj, responseObj, next) => {
    console.log('lock', requestObj.body)
    var data
    if (requestObj.body.isSpam === false) {
      data = {
        id: requestObj.body.id,
        option: true
      }
      console.log('inside if', data)
    } else {
      data = {
        id: requestObj.body.id,
        option: false
      }
      console.log('inside else', data)
    }
    sendSuccessResponse(responseObj, API_IDS.markassolution, data, HttpStatus.OK)
  })


  // router.post('/thread/archive/:id', (requestObj, responseObj, next) => {
   
  //   var data    
  //     data = {       
  //         status: "archived",
  //         isUndo: true
  //     }
  //     console.log('archive in node', data)
  //   sendSuccessResponse(responseObj, API_IDS.archive, data, HttpStatus.OK)
  // })
  return router
}
// module.exports = router
