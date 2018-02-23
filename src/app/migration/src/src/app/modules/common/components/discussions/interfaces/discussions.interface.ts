export class DiscussionsObject {
    constructor(
        public threadTitle: string,
        public threadDesc: string,
        public replyAnswer: string
    ) {
        this.threadTitle = threadTitle;
        this.threadDesc = threadDesc;
        this.replyAnswer = replyAnswer;
    }
}
