export class DiscussionsObject {
    constructor(      
        public threadTitle: string,       
        public replyAnswer: string,
        public contentType?: string,
        public threadDesc?: string,
        public threadId?: number
    ) {
        this.threadTitle = threadTitle;
        this.threadDesc = threadDesc;
        this.replyAnswer = replyAnswer;
        this.contentType = contentType;
         this.threadId = threadId;
    }
}
