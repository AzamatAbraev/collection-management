import { useEffect, useState } from "react";

import { LikeFilled, LikeOutlined, MessageOutlined } from "@ant-design/icons";

import bookImg from "../../assets/book.webp";

import "./style.scss";
import ItemType from "../../types/item";
import request from "../../server";

const ItemCard = (item: ItemType) => {
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [author, setAuthor] = useState("")


  useEffect(() => {
    const getCollection = async () => {
      const { data } = await request.get(`collections/${item.collectionId}`)
      setCollectionName(data.name);
    }

    const getUser = async () => {
      const { data } = await request.get(`users/${item.userId}`)
      setAuthor(data.username)
    }
    getUser()
    getCollection()
  }, [item.collectionId, item.userId])

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
        <h3>{item.name}</h3>
      </div>
      <div className="card__footer">
        <p>{collectionName}</p>
        <p>{author}</p>
      </div>
    </div>
  )
}

export default ItemCard;