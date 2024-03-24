import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import useAuth from "../../store/auth";
import request from "../../server";
import convertToRelativeTime from "../../utils/timeDifference";
import CommentType from "../../types/comment";
import { Avatar, Button, Card, Input, message, Popover, Space, Typography } from "antd";
import { UserOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

import "./style.scss"

const CommentCard = (comment: CommentType) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);
  const queryClient = useQueryClient();
  const { isAuthenticated, role, user } = useAuth();

  const { t } = useTranslation();

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
    <Space direction="vertical">
      {isAuthenticated && (role === "admin" || comment.userId._id === user.userId) && (
        <>
          {!isEditing && (
            <>
              <Button type="text" onClick={() => setIsEditing(true)} icon={<EditOutlined />}>{t("Edit")}</Button>
              <Button type="text" danger onClick={() => handleDelete(comment._id)} icon={<DeleteOutlined />}>{t("Delete")}</Button>
            </>
          )}
        </>
      )}
    </Space>
  );

  return (
    <Card bordered className="comment-card">
      <Space>
        <Avatar icon={<UserOutlined />} />
        <div style={{ flex: 1 }}>
          <Space className="d-flex justify-content-between w-100">
            <div className="d-flex justify-content-between gap-2">
              <Text strong>{comment.userId.username}</Text>
              {isEdited && <Text type="secondary" style={{ marginLeft: 8 }}>({t("Edited")})</Text>}
              <br />
              <Text type="secondary">{convertToRelativeTime(comment.createdAt)}</Text>
            </div>
            {isAuthenticated && (role === "admin" || comment.userId._id === user.userId) && (
              <Popover content={optionsContent} trigger="click">
                <Button style={{ position: "absolute", top: "10px", right: "10px" }} shape="circle" icon={<EllipsisOutlined />} />
              </Popover>
            )}
          </Space>
          {isEditing ? (
            <>
              <Input.TextArea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                autoSize={{ minRows: 1, maxRows: 3 }}
                style={{ marginTop: 16 }}
              />
              <Space style={{ justifyContent: 'end', width: '100%', marginTop: 8 }}>
                <Button type="primary" onClick={() => handleEdit(comment._id)}>{t("Save")}</Button>
                <Button onClick={() => setIsEditing(false)}>{t("Cancel")}</Button>
              </Space>
            </>
          ) : (
            <Paragraph>{comment.content}</Paragraph>
          )}
        </div>
      </Space >
    </Card>
  );
};

export default CommentCard;
