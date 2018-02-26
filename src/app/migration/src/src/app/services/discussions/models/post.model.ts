// export interface Post{
//     userId: number;
//     id: string;
//     body: string;
//     title: string;
// }

export class Post {
    constructor(       
        public id: number,       
        public title: string,
        public created_at: Date,
        public like_count: number
    ){}
}