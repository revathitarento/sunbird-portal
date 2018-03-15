export const mockRes = {
    successData: {
      "id":"api.plugin.discussions.get-thread-by-id",
      "ver":"1.0",
      "ts":"2018-03-14 06:25:20:524+0000",
      "params":{
         "resmsgid":"78603cc0-2750-11e8-ab19-432b49bea1ee",
         "msgid":null,
         "status":"successful",
         "err":"",
         "errmsg":""
      },
      "responseCode":"OK",
      "result":{
         "thread":{
            "id":58,
            "author":{
               "userName":"logunov09",
               "name":"logunov09"
            },
            "body":"Test question on sunbird portal discussions thread configurations answer",
            "title":"Test question on sunbird portal discussions thread configurations test",
            "createdDate":"2018-03-12T09:03:16.385Z",
            "repliesCount":5,
            "voteCount":0,
            "read":true,
            "posters":[
               {
                  "userId":5,
                  "userName":"logunov09"
               },
               {
                  "userId":1,
                  "userName":"revathi"
               }
            ],
            "replies":[
               {
                  "id":120,
                  "author":{
                     "userName":"logunov09",
                     "name":"logunov09"
                  },
                  "body":"Test reply on success message goes here",
                  "actions":{
                     "flag":0,
                     "downVote":-1,
                     "acceptAnswer":0
                  },
                  "createdDate":"2018-03-12T09:06:43.961Z",
                  "acceptedAnswer":false,
                  "read":true
               }
            ],
            "actions":{
               "flag":0,
               "downVote":-1
            },
            "descId":119,
            "archived":false,
            "locked":false,
            "config":{
               "upVote":true,
               "downVote":false,
               "flag":true,
               "acceptAnswer":false
            }
         }
      }
   },
   threadArchive :{
    
      "id":"api.plugin.discussions.actions",
      "ver":"1.0",
      "ts":"2018-03-14 11:10:29:162+0000",
      "params":{  
         "resmsgid":"4deb38a0-2778-11e8-ab19-432b49bea1ee",
         "msgid":null,
         "status":"successful",
         "err":"",
         "errmsg":""
      },
      "responseCode":"OK",
      "result":{  
         "status":"done"
      }
   
   },
   threadDetailsError: {
    error: {
      "id":"api.plugin.discussions.get-thread-by-id",
      "ver":"1.0",
      "ts":"2018-03-14 09:05:33:350+0000",
      "params":{
         "resmsgid":"da111460-2766-11e8-ab19-432b49bea1ee",
         "msgid":null,
         "status":"failed",
         "err":"",
         "errmsg":"Cannot set property of undefined"
      },
      "responseCode":"CLIENT_ERROR",
      "result":{
         "message":"Unauthorized User!",
         "status":401
      }
   }
}  
    };