interface CommentType {
  _id: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  userId: {
    username: string;
    _id: string;
  };
}

export default CommentType;
