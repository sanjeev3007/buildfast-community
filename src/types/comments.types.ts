export interface TextPostComment {
  id: number;
  textPostId: number;
  userId: string;
  parentId: number | null;
  content: string;
  authorName: string;
  createdAt: string;
  replies: TextPostComment[];
}

export interface LikesResult {
  count: number;
  liked: boolean;
}
