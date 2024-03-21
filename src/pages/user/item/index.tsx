import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import request from "../../../server";
import { useState } from "react";
import { Button, Input, Skeleton, Space } from "antd";
import CommentCard from "../../../components/comment";
import CommentType from "../../../types/comment";

// import notFoundImage from "../../../assets/not-found.png"
import bookImage from "../../../assets/book.webp"

import "./style.scss"
import { LikeFilled, LikeOutlined, MessageOutlined } from "@ant-design/icons";

const ItemPage = () => {
  const queryClient = useQueryClient();
  const { itemId } = useParams();
  const [commentContent, setCommentContent] = useState("");
  const [seeComments, setSeeComments] = useState(false);
  const [liked, setLiked] = useState(false)

  const fetchSingleItem = async () => {
    const { data } = await request.get(`items/${itemId}`);
    return data;
  };

  const fetchComments = async () => {
    const { data } = await request.get(`items/${itemId}/comments`);
    return data;
  };

  const { data: item, isLoading } = useQuery("singleItem", fetchSingleItem);
  const { data: comments } = useQuery(["comments", itemId], fetchComments);


  const handleAddComment = async () => {
    try {
      if (commentContent) {
        await request.post(`items/${itemId}/comments`, { content: commentContent });
      }
      setCommentContent('');
      queryClient.invalidateQueries("comments");
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  return (
    <div className="item__container item">
      <Skeleton loading={isLoading}>
        <div className="item__content">
          <div className="item__image">
            <img src={item?.photo || bookImage} alt="Photo" />
          </div>
          <div className="card__buttons">
            <button onClick={() => setLiked(!liked)} className="card__btn">
              {liked ? <LikeFilled style={{ fontSize: '25px', color: 'red' }} /> : <LikeOutlined style={{ fontSize: '25px' }} />}
            </button>
            <button onClick={() => setSeeComments(!seeComments)} className="card__btn">
              <MessageOutlined style={{ fontSize: '25px', color: seeComments ? 'red' : '' }} />
            </button>
          </div>
          <h3>{item?.name}</h3>
          <p style={{ color: "blue" }}>#{item?.tags?.join(', #')}</p>
        </div>
        <div className="item__comments">
          <Space>
            <Input style={{ width: "100%" }} placeholder="Write a comment" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
            <Button onClick={handleAddComment}>Add Comment</Button>
          </Space>
          <h3 style={{ cursor: "pointer", margin: "10px 0px" }} onClick={() => setSeeComments(!seeComments)}>{seeComments ? "Hide" : "See"} Comments ({comments?.length || 0})</h3>
          {seeComments ? <div className="comments__row">
            {comments?.map((comment: CommentType) => (
              <CommentCard key={comment._id} {...comment} />
            ))}
          </div> : ""}
        </div>
      </Skeleton>
    </div>
  );
};

export default ItemPage;
