import { useState } from "react";

import { LikeFilled, LikeOutlined, MessageOutlined } from "@ant-design/icons";

import bookImg from "../../assets/book.webp";

import "./style.scss";

const ItemCard = () => {
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);

  return (
    <div className="card">
      <div className="card__image">
        <img src={bookImg} alt="Book" />
      </div>
      <div className="card__buttons">
        <button onClick={() => setLiked(!liked)} className="card__btn">{liked ? <LikeFilled style={{ fontSize: "25px", color: "red" }} /> : <LikeOutlined style={{ fontSize: "25px" }} />}</button>
        <button onClick={() => setCommented(!commented)} className="card__btn"><MessageOutlined style={{ fontSize: "25px", color: commented ? "red" : "" }} /></button>
      </div>
      <div className="card__header">
        <h3>Name</h3>
      </div>
      <div className="card__footer">
        <p>Collection</p>
        <p>Author</p>
      </div>
    </div>
  )
}

export default ItemCard;