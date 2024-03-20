import { useQuery } from 'react-query';
import { LikeFilled, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Skeleton, message } from 'antd';
import bookImg from '../../assets/book.webp';
import ItemType from '../../types/item';
import request from '../../server';
import { useState } from 'react';

import './style.scss';

const ItemCard = (item: ItemType) => {
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);

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
    <div className="card">
      <div className="card__image">
        <img src={item.photo || bookImg} alt="Book" />
      </div>
      <div className="card__buttons">
        <button onClick={() => setLiked(!liked)} className="card__btn">
          {liked ? <LikeFilled style={{ fontSize: '25px', color: 'red' }} /> : <LikeOutlined style={{ fontSize: '25px' }} />}
        </button>
        <button onClick={() => setCommented(!commented)} className="card__btn">
          <MessageOutlined style={{ fontSize: '25px', color: commented ? 'red' : '' }} />
        </button>
      </div>
      <Skeleton loading={isLoading}>
        <div className="card__header">
          <h3>{item.name}</h3>
        </div>
        <div className="card__footer">
          <p>{data?.collectionName}</p>
          <p>{data?.author}</p>
        </div>
        <div className="card__tags">
          {item?.tags.map((tag) => <p>#{tag}</p>)}
        </div>
      </Skeleton>
    </div>
  );
};

export default ItemCard;
