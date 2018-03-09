export class DiscussionsObject {
    constructor(      
        public threadTitle: string,       
        public replyAnswer: string,
        public contextType?: string,
        public threadDesc?: string,
        public threadId?: number,
        public threadConfig? : {
            upVote: boolean;
            downVote: boolean;
            flag: boolean;
            acceptAnswer: boolean;
        }
    ) {
        this.threadTitle = threadTitle;
        this.threadDesc = threadDesc;
        this.replyAnswer = replyAnswer;
        this.contextType = contextType;
         this.threadId = threadId;
         this.threadConfig = threadConfig;
    }
}
