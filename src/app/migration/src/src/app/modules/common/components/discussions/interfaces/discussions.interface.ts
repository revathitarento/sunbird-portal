export class DiscussionsObject {
    constructor(
        public threadTitle: string,
        public threadDesc: string,
        public replyAnswer: string,
        public contentType?: string
    ) {
        this.threadTitle = threadTitle;
        this.threadDesc = threadDesc;
        this.replyAnswer = replyAnswer;
        this.contentType = contentType;
    }
}
