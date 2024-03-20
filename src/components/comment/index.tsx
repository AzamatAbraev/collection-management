import { UserOutlined } from "@ant-design/icons";
import CommentType from "../../types/comment";
import "./style.scss";
import convertToReadableDate from "../../utils/convertCommentTime";

const CommentCard = (comment: CommentType) => {
  return (
    <div className="comment">
      <div className="comment__image">
        <UserOutlined style={{ fontSize: "20px" }} />
      </div>
      <div className="comment__content">
        <div style={{ display: "flex", gap: "10px" }}>
          <h3 className="comment__username">{comment.userId.username}</h3>
          <p className="comment__content">{convertToReadableDate(comment.createdAt)}</p>
        </div>
        <p className="comment__content">{comment.content}</p>
      </div>
    </div>
  )
}

export default CommentCard