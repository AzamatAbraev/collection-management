import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import { Link } from "react-router-dom";

import request from "../../server";
import useCollection from "../../store/collections";
import CollectionType from "../../types/collection";
import convertTime from "../../utils/convertTime";

import readmoreIcon from "../../assets/read-more.svg";

import "./style.scss";

const UserCollectionCard = (collection: CollectionType) => {
  const { deleteCollection } = useCollection();

  const handleDelete = async (collectionId: string) => {
    try {
      await request.delete(`collections/by-collection/${collectionId}`);
      await deleteCollection(collectionId);
      message.success("Collection and all items deleted successfully.");
    } catch (error) {
      message.error("Failed to delete collection and items.");
    }
  };


  return (
    <div className="collection__card">
      <div className="collection__card__row">
        <h3>{collection.name}</h3>
        <p>{collection.category}</p>
      </div>
      <div className="collection__card__row">
        <p>{collection.description}</p>
        <p>{convertTime(collection.createdAt)}</p>
      </div>
      <div className="collection__card__footer">
        <button className="edit__btn"><EditOutlined style={{ fontSize: "20px" }} /></button>
        <button className="delete__btn" onClick={() =>
          Modal.confirm({
            title: "Are you sure you want to delete this collection and all its items?",
            async onOk() {
              await handleDelete(collection._id);
            },
          })
        }><DeleteOutlined style={{ fontSize: "20px" }} /></button>
        <Link to={`/collection/${collection._id}`} className="collection__card__btn"><img src={readmoreIcon} alt="Read More" /></Link>
      </div>
    </div>
  );
};

export default UserCollectionCard;