import { LikeFilled, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Button, Card, Tooltip } from 'antd';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import bookImg from '../../assets/book.webp';
import useAuth from '../../store/auth';
import useItems from '../../store/items';
import ItemType from '../../types/item';

const { Meta } = Card;

const ItemCard = (item: ItemType) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(item.likes.includes(user.userId));
  const [commented, setCommented] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { likeItem, unlikeItem } = useItems();

  const handleLikeClick = async () => {
    if (liked) {
      await unlikeItem(item._id);
      setLiked(false);
    } else {
      await likeItem(item._id);
      setLiked(true);
    }
    queryClient.invalidateQueries("latestItems");
  };

  return (
    <Card
      hoverable
      style={{ width: "100%", margin: 'auto' }}
      cover={
        <img
          alt="Book"
          src={item.photo || bookImg}
          onClick={() => navigate(`/collection/${item.collectionId}/${item._id}`)}
          style={{ height: 300, objectFit: 'cover' }}
        />
      }
      actions={[
        <Tooltip title={`${item.likes.length} ${item.likes.length === 1 ? 'like' : 'likes'}`}>
          <Button onClick={handleLikeClick} type="text" icon={liked ? <LikeFilled style={{ color: 'red' }} /> : <LikeOutlined />} />
        </Tooltip>,
        <Button onClick={() => setCommented(!commented)} type="text" icon={<MessageOutlined style={{ color: commented ? 'red' : undefined }} />} />,
      ]}
    >
      <Meta
        title={item.name}
      />
      {<p>{item.collectionId.name}</p>}
      {<p style={{ textTransform: "capitalize" }}>Published by {item.userId.username}</p>}
      <div className="custom-fields">
        {item.customValues ? Object.entries(item.customValues).map(([fieldName, fieldValue]) => (
          <div key={fieldName} className="custom-field">
            <strong>{fieldName}:</strong> {fieldValue?.toString()}
          </div>
        )) : <div className="placeholder" style={{ height: '50px' }}></div>}
      </div>
      {item?.tags.map((tag, key) => <span key={key} className="badge bg-secondary me-1">#{tag}</span>)}
    </Card>
  );
};

export default ItemCard;
