import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LikeFilled, LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";

import useItems from "../../../store/items";
import request from "../../../server";

import bookImg from "../../../assets/book.webp";

import "./style.scss";


const CollectionPage = () => {
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [dataLoading, setDataLoading] = useState(false);

  const { collectionId } = useParams();
  const { collectionItems, loading, getItemsByCollection } = useItems();


  useEffect(() => {
    const getCollection = async () => {
      try {
        setDataLoading(true)
        const { data } = await request.get(`collections/${collectionId}`)
        setCollectionName(data.name);
      } finally {
        setDataLoading(false)
      }
    }
    getCollection()
  }, [collectionId])

  useEffect(() => {
    getItemsByCollection(collectionId || "")
  }, [getItemsByCollection, collectionId])

  return (
    <Skeleton loading={loading}>
      <Fragment>
        {collectionItems.length > 0 ? <div className="collectionitems__row">
          {collectionItems?.map((item) =>
            <div className="card">
              <div className="card__image">
                <img src={bookImg} alt="Book" />
              </div>
              <div className="card__buttons">
                <button onClick={() => setLiked(!liked)} className="card__btn">{liked ? <LikeFilled style={{ fontSize: "25px", color: "red" }} /> : <LikeOutlined style={{ fontSize: "25px" }} />}</button>
                <button onClick={() => setCommented(!commented)} className="card__btn"><MessageOutlined style={{ fontSize: "25px", color: commented ? "red" : "" }} /></button>
              </div>
              <Skeleton loading={dataLoading}>
                <div className="card__header">
                  <h3>{item.name}</h3>
                </div>
                <div className="card__footer">
                  <p>{collectionName}</p>
                </div>
              </Skeleton>
            </div>
          )}

        </div> : <p>No Item Found</p>}
      </Fragment>
    </Skeleton>
  )
}

export default CollectionPage