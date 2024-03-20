import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import request from "../../../server";
import { useState } from "react";
import { Button, Input, Space } from "antd";
import CommentCard from "../../../components/comment";
import CommentType from "../../../types/comment";

const ItemPage = () => {
  const queryClient = useQueryClient();
  const { itemId } = useParams();
  const [commentContent, setCommentContent] = useState("");
  const [seeComments, setSeeComments] = useState(false);

  const fetchSingleItem = async () => {
    const { data } = await request.get(`items/${itemId}`);
    return data;
  };

  const fetchComments = async () => {
    const { data } = await request.get(`items/${itemId}/comments`);
    return data;
  };

  const { data: item, isLoading: isLoadingItem } = useQuery("singleItem", fetchSingleItem);
  const { data: comments, isLoading: isLoadingComments } = useQuery(["comments", itemId], fetchComments);


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

  if (isLoadingItem || isLoadingComments) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h3>{item?.name}</h3>
      <p>{item?.tags?.join(', ')}</p>
      <div>
        <Space>
          <Input placeholder="Write a comment" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
          <Button onClick={handleAddComment}>Add Comment</Button>
        </Space>
        <h3 style={{ cursor: "pointer", margin: "10px 0px" }} onClick={() => setSeeComments(!seeComments)}>See Comments ({comments?.length || 0})</h3>
        {seeComments ? <div className="comments__row">
          {comments?.map((comment: CommentType) => (
            <CommentCard key={comment._id} {...comment} />
          ))}
        </div> : ""}
      </div>
    </div>
  );
};

export default ItemPage;
