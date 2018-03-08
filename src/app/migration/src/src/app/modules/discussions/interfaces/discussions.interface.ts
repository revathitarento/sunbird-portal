export class DiscussionsObject {
    constructor(      
        public threadTitle: string,       
        public replyAnswer: string,
        public contextType?: string,
        public threadDesc?: string,
        public threadId?: number
    ) {
        this.threadTitle = threadTitle;
        this.threadDesc = threadDesc;
        this.replyAnswer = replyAnswer;
        this.contextType = contextType;
         this.threadId = threadId;
    }
}
