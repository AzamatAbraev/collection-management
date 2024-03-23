import { UserOutlined, EllipsisOutlined } from "@ant-design/icons";
import CommentType from "../../types/comment";
import useAuth from "../../store/auth";
import request from "../../server";
import convertToRelativeTime from "../../utils/timeDifference";
import { message, Input, Button, Popover, Space } from "antd";
import { useQueryClient } from "react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const CommentCard = (comment: CommentType) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);
  const queryClient = useQueryClient();
  const { isAuthenticated, role, user } = useAuth();

  const { t } = useTranslation()

  const isEdited = new Date(comment.updatedAt) > new Date(comment.createdAt);


  const handleDelete = async (commentId: string) => {
    await request.delete(`items/comments/${commentId}`);
    queryClient.invalidateQueries("comments");
  };

  const handleEdit = async (commentId: string) => {
    if (!newContent.trim()) {
      message.error(t("Validation"));
      return;
    }
    await request.patch(`items/comments/${commentId}`, { content: newContent });
    setIsEditing(false);
    queryClient.invalidateQueries("comments");
  };

  const optionsContent = (
    <div>
      {isAuthenticated && (role === "admin" || comment.userId._id === user.userId) && (
        <>
          {!isEditing && (
            <div>
              <Button type="text" onClick={() => setIsEditing(true)}>{t("Edit")}</Button>
              <Button type="text" onClick={() => handleDelete(comment._id)}>{t("Delete")}</Button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="d-flex align-items-center justify-content-start mb-3 p-2 bg-white rounded shadow-sm">
      <div className="p-2 bg-secondary rounded-circle">
        <UserOutlined style={{ fontSize: "20px", color: "#fff" }} />
      </div>
      <div className="d-flex flex-column ms-3 flex-grow-1">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <h3 className="mb-0 text-capitalize fw-bold fs-5">{comment.userId.username}</h3>
            {isEdited && <span>({t("Edited")})</span>}
            <p className="mb-0 fs-6">{convertToRelativeTime(comment.createdAt)}</p>
          </div>
          {isAuthenticated && (role === "admin" || comment.userId._id === user.userId) && <Popover content={optionsContent} trigger="click">
            <Button icon={<EllipsisOutlined />} />
          </Popover>}
        </div>
        {isEditing ? (
          <>
            <Input.TextArea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              autoSize={{ minRows: 1, maxRows: 3 }}
            />
            <Space className="justify-content-end mt-2">
              <Button type="primary" onClick={() => handleEdit(comment._id)}>Save</Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </Space>
          </>
        ) : (
          <p className="mb-0">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
