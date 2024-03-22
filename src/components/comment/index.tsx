import { UserOutlined } from "@ant-design/icons";
import CommentType from "../../types/comment";
import convertToReadableDate from "../../utils/convertCommentTime";

const CommentCard = (comment: CommentType) => {
  return (
    <div className="d-flex align-items-center justify-content-start mb-3 p-2 bg-white rounded shadow-sm">
      <div className="p-2 bg-secondary rounded-circle">
        <UserOutlined style={{ fontSize: "20px", color: "#fff" }} />
      </div>
      <div className="d-flex flex-column ms-3">
        <div className="d-flex align-items-center gap-2">
          <h3 className="mb-0 text-capitalize fw-bold fs-5">{comment.userId.username}</h3>
          <p className="mb-0 fs-6">{convertToReadableDate(comment.createdAt)}</p>
        </div>
        <p className="mb-0">{comment.content}</p>
      </div>
    </div>
  );
}

export default CommentCard;
