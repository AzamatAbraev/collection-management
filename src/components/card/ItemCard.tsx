import { useQuery, useQueryClient } from 'react-query';
import { LikeFilled, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Skeleton, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import bookImg from '../../assets/book.webp';
import ItemType from '../../types/item';
import request from '../../server';
import useItems from '../../store/items';
import useAuth from '../../store/auth';

const ItemCard = (item: ItemType) => {
  const { user } = useAuth()

  const [liked, setLiked] = useState(item.likes.includes(user.userId));
  const [commented, setCommented] = useState(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { likeItem, unlikeItem } = useItems();

  const queryKey = ['itemData', item.collectionId, item.userId];

  const { data, isLoading } = useQuery(queryKey, async () => {
    const [collectionResponse, userResponse] = await Promise.all([
      request.get(`collections/${item.collectionId}`),
      request.get(`users/${item.userId}`),
    ]);
    return {
      collectionName: collectionResponse.data.name,
      author: userResponse.data.username,
    };
  }, {
    onError: (err) => {
      message.error('Failed to fetch data' + err);
    }
  });

  const handleLikeClick = async () => {
    if (liked) {
      await unlikeItem(item._id);
      setLiked(false)
    } else {
      await likeItem(item._id);
      setLiked(true)
    }
    queryClient.invalidateQueries("latestItems");
  }

  return (
    <div className="card mb-3">
      <div className="card-img-top" onClick={() => navigate(`collection/${item.collectionId}/${item._id}`)} style={{ cursor: 'pointer' }}>
        <img src={item.photo || bookImg} alt="Book" style={{ width: "100%", height: "300px", objectFit: "cover" }} className="img-fluid" />
      </div>
      <div className="card-body">
        <div className="d-flex">
          <button onClick={handleLikeClick} className="btn p-1">
            {liked ? <LikeFilled style={{ fontSize: '25px', color: 'red' }} /> : <LikeOutlined style={{ fontSize: '25px' }} />}
          </button>
          <button onClick={() => setCommented(!commented)} className="btn p-1">
            <MessageOutlined style={{ fontSize: '25px', color: commented ? 'red' : '' }} />
          </button>
        </div>
        <Skeleton loading={isLoading} active>
          <div style={{ minHeight: "20px", cursor: "pointer" }}>
            {item.likes.length > 0 ? <p style={{ margin: "0px" }}>{item.likes.length} {item.likes.length > 1 ? "likes" : "like"}</p> : ""}
          </div>
          <div className="card-title mt-3">
            <h5 className='fs-3'>{item.name}</h5>
          </div>
          <div className="d-flex align-items-center justify-content-between card-text">
            <p>{data?.collectionName}</p>
            <p>{data?.author}</p>
          </div>
          <div className="mt-2">
            {item?.tags.map((tag, key) => <span key={key} className="badge bg-secondary me-1">#{tag}</span>)}
          </div>
        </Skeleton>
      </div>
    </div>
  );
};

export default ItemCard;
