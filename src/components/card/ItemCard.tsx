import { useQuery } from 'react-query';
import { LikeFilled, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Skeleton, message } from 'antd';
import bookImg from '../../assets/book.webp';
import ItemType from '../../types/item';
import request from '../../server';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ItemCard = (item: ItemType) => {
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);
  const navigate = useNavigate();

  const queryKey = ['itemData', item.collectionId, item.userId];

  const { data, isLoading, error } = useQuery(queryKey, async () => {
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
      message.error('Failed to fetch data');
      console.log(err);
    }
  });

  if (error) console.error("Failed to fetch data:", error);

  return (
    <div className="card mb-3">
      <div className="card-img-top" onClick={() => navigate(`collection/${item.collectionId}/${item._id}`)} style={{ cursor: 'pointer' }}>
        <img src={item.photo || bookImg} alt="Book" style={{ width: "100%", height: "300px", objectFit: "cover" }} className="img-fluid" />
      </div>
      <div className="card-body">
        <div className="d-flex gap-2">
          <button onClick={() => setLiked(!liked)} className="btn p-0">
            {liked ? <LikeFilled style={{ fontSize: '25px', color: 'red' }} /> : <LikeOutlined style={{ fontSize: '25px' }} />}
          </button>
          <button onClick={() => setCommented(!commented)} className="btn p-0">
            <MessageOutlined style={{ fontSize: '25px', color: commented ? 'red' : '' }} />
          </button>
        </div>
        <Skeleton loading={isLoading} active>
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
