export class replyObject {
    constructor(      
        public threadId: string,       
        public replyAnswer: string,
        public replyId: any,
        
    ) {
         this.threadId = threadId;
         this.replyAnswer = replyAnswer;
         this.replyId = replyId;
    }
}
