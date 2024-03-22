import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Button, Input, Popover, Skeleton, Space } from "antd";
import { LikeFilled, LikeOutlined, MessageOutlined } from "@ant-design/icons";

import request from "../../../server";
import CommentCard from "../../../components/comment";
import CommentType from "../../../types/comment";
import bookImage from "../../../assets/book.webp"

import "./style.scss"
import useItems from "../../../store/items";
import useAuth from "../../../store/auth";

interface LikedUserType {
  _id: string,
  username: string,
}

const ItemPage = () => {
  const { itemId } = useParams();
  const [commentContent, setCommentContent] = useState("");
  const [seeComments, setSeeComments] = useState(true);

  const queryClient = useQueryClient();
  const { likeItem, unlikeItem } = useItems();
  const { user } = useAuth()

  const fetchSingleItem = async () => {
    const { data } = await request.get(`items/${itemId}`);
    return data;
  };

  const fetchComments = async () => {
    const { data } = await request.get(`items/${itemId}/comments`);
    return data;
  };

  const { data: item, isLoading } = useQuery("singleItem", fetchSingleItem, {
    onSuccess: (data) => {
      setLiked(data.likes && data.likes.some((likedUser: LikedUserType) => likedUser._id === user.userId));
    }
  });
  const { data: comments } = useQuery(["comments", itemId], fetchComments);

  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (item && Array.isArray(item.likes)) {
      setLiked(item.likes.some((likedUser: LikedUserType) => likedUser._id === user.userId));
    }
  }, [item, user.userId]);


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

  const handleLikeClick = async () => {
    if (liked) {
      await unlikeItem(item._id)
      setLiked(false)
    } else {
      await likeItem(item._id);
      setLiked(true)
    }
    queryClient.invalidateQueries("singleItem")
  }

  const likeContent = (() => {
    if (!item || !item.likes) return <p>No one has liked this item yet.</p>;

    const totalLikes = item.likes.length;
    if (totalLikes === 0) return <p>No one has liked this item yet.</p>;

    const lastLikerUsername = item.likes[item.likes.length - 1]?.username;
    return totalLikes === 1 ?
      <p>{lastLikerUsername} liked this item.</p> :
      <p>{lastLikerUsername} and {totalLikes - 1} others liked this item.</p>;
  })();

  if (!item || !item.likes) return <p>Loading likes...</p>;


  return (
    <div className="item__container item">
      <Skeleton loading={isLoading}>
        <div className="item__content">
          <div className="item__image">
            <img src={item?.photo || bookImage} alt="Photo" />
          </div>
          <div className="card__buttons">
            <button onClick={handleLikeClick} className="btn p-0">
              {liked ? <LikeFilled style={{ fontSize: '25px', color: 'red' }} /> : <LikeOutlined style={{ fontSize: '25px' }} />}
            </button>
            <button onClick={() => setSeeComments(!seeComments)} className="btn p-0">
              <MessageOutlined style={{ fontSize: '25px', color: seeComments ? 'red' : '' }} />
            </button>
          </div>
          <div style={{ minHeight: "20px", cursor: "pointer" }}>
            <Popover placement='topLeft' content={likeContent}>
              {item.likes.length > 0 ? <p style={{ margin: "0px" }}>{item.likes.length} {item.likes.length > 1 ? "likes" : "like"}</p> : ""}
            </Popover>
          </div>
          <h3>{item?.name}</h3>
          <p style={{ color: "blue" }}>#{item?.tags?.join(', #')}</p>
        </div>
        <div className="item__comments">
          <Space>
            <Input style={{ width: "330px" }} placeholder="Write a comment" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
            <Button onClick={handleAddComment}>Add Comment</Button>
          </Space>
          <h4 style={{ cursor: "pointer", margin: "10px 0px" }} onClick={() => setSeeComments(!seeComments)}>{seeComments ? "Hide" : "See"} Comments ({comments?.length || 0})</h4>
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
