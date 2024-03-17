import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Skeleton, message } from "antd";
import { useState } from "react";

import useCollection from "../../../store/collections";
import TextArea from "antd/es/input/TextArea";
import useAuth from "../../../store/auth";
import convertTime from "../../../utils/convertTime";
import request from "../../../server";

import readmoreIcon from "../../../assets/read-more.svg"
import settingsIcon from "../../../assets/settins-icon.svg"
import userIcon from "../../../assets/user-icon.svg"

import "./style.scss";
import LoadingPage from "../../loading";
import { useQuery, useQueryClient } from "react-query";
import CollectionType from "../../../types/collection";


const UserDashboard = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<null | string>(null)
  const [isEditLoading, setIsEditLoading] = useState(false);

  const [form] = Form.useForm()

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { addCollection, deleteCollection, updateCollection } = useCollection();
  const { user, role } = useAuth();


  const fetchCollections = async () => {
    const { data } = await request.get("collections/user");
    return data;
  }


  const { data: userCollections, isLoading } = useQuery("userCollections", fetchCollections)


  const showModal = () => {
    form.resetFields();
    form.setFieldsValue({ tags: [''] });
    setOpen(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!selected) {
        values.userId = user.userId;
        await addCollection(values);
      } else {
        await updateCollection(values, selected)
      }
      queryClient.invalidateQueries('userCollections');
      setOpen(false);
      setSelected(null);
    } catch (error) {
      message.error("Submission failed")
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleDelete = async (collectionId: string) => {
    try {
      await request.delete(`collections/by-collection/${collectionId}`);
      await deleteCollection(collectionId);
      queryClient.invalidateQueries('userCollections');
      message.success("Collection and all items deleted successfully.");
    } catch (error) {
      message.error("Failed to delete collection and items.");
    }
  };

  const handleEdit = async (collectionId: string) => {
    try {
      setOpen(true);
      setIsEditLoading(true);
      setSelected(collectionId);
      const { data } = await request.get(`collections/${collectionId}`);
      form.setFieldsValue(data)
    } catch (error) {
      message.error("Update failed");
    } finally {
      setIsEditLoading(false)
    }
  }

  return (
    <section className="user">
      {isLoading ? <LoadingPage /> : <div className="container user__dashboard">
        <div className="user__dashboard__header">
          <div className="user__logo">
            <img src={userIcon} alt="User Icon" />
            <p className="user__name">{user.name}</p>
            <span style={{ color: "red" }} className="user__name">({role})</span>
          </div>
          <div className="user__controls">
            <button onClick={() => navigate("/account")} className="user__btn"><img src={settingsIcon} />Settings</button>
            <button onClick={showModal} className="add__btn user__btn"><PlusOutlined style={{ fontSize: "20px" }} /> New Collection</button>
          </div>
        </div>
        <div className="user__dashboard__body">
          {userCollections?.map((collection: CollectionType) => <div key={collection._id} className="collection__card">
            <div className="collection__card__row">
              <h3>{collection.name}</h3>
              <p>{collection.category}</p>
            </div>
            <div className="collection__card__row">
              <p>{collection.description}</p>
              <p>{convertTime(collection.createdAt)}</p>
            </div>
            <div className="collection__card__footer">
              <button disabled={isEditLoading} className="edit__btn" onClick={() => handleEdit(collection?._id)}><EditOutlined style={{ fontSize: "20px" }} /></button>
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
          </div>)}
        </div>
      </div>}
      <Modal
        title={selected ? "Edit Collection" : "Create Collection"}
        open={open}
        onOk={handleOk}
        okText={selected ? "Edit" : "Add"}
        confirmLoading={isLoading}
        onCancel={handleCancel}
      >
        <Skeleton loading={isEditLoading}>
          <Form
            name="New Collection"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            form={form}
            style={{ maxWidth: 700 }}
            initialValues={{}}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please provide collection name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please include category.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please describe your collection.' }]}
            >
              <TextArea />
            </Form.Item>
          </Form>
        </Skeleton>
      </Modal>
    </section>
  )
}

export default UserDashboard