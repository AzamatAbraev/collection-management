interface CommentType {
  _id: string;
  createdAt: string;
  content: string;
  userId: {
    username: string;
  };
}

export default CommentType;
