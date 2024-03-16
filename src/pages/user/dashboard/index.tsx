import useAuth from "../../../store/auth";


import userIcon from "../../../assets/user-icon.svg"
import settingsIcon from "../../../assets/settins-icon.svg"

import "./style.scss";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import useCollection from "../../../store/collections";
import TextArea from "antd/es/input/TextArea";
import LoadingPage from "../../loading";
import UserCollectionCard from "../../../components/card/UserCollectionCard";

const UserDashboard = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm()



  const navigate = useNavigate();
  const { loading, userCollections, getUserCollections, addCollection } = useCollection();
  const { user } = useAuth();


  const showModal = () => {
    form.resetFields();
    setOpen(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values.userId = user.userId;
      await addCollection(values);
      setOpen(false);
    } catch (error) {
      message.error("Submission failed")
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    getUserCollections()
  }, [getUserCollections])

  return (
    <section className="user">
      {loading ? <LoadingPage /> : <div className="container user__dashboard">
        <div className="user__dashboard__header">
          <div className="user__logo">
            <img src={userIcon} alt="User Icon" />
            <p className="user__name">{user.name}</p>
          </div>
          <div className="user__controls">
            <button onClick={() => navigate("/account")} className="user__btn"><img src={settingsIcon} />Settings</button>
            <button onClick={showModal} className="add__btn user__btn"><PlusOutlined style={{ fontSize: "20px" }} /> New Collection</button>
          </div>
        </div>
        <div className="user__dashboard__body">
          {userCollections.length > 0 ? <div className="user__dashboard__row">
            {userCollections?.map((collection) => <UserCollectionCard key={collection?._id} {...collection} />)}
          </div> : <p>No Collection found</p>}
        </div>
      </div>}
      <Modal
        title="Create a new collection"
        open={open}
        onOk={handleOk}
        okText="Add Collection"
        confirmLoading={loading}
        onCancel={handleCancel}
      >
        <Form
          name="New Collection"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          form={form}
          style={{ maxWidth: 700 }}
          initialValues={{}}
          size="large"
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
      </Modal>
    </section>
  )
}

export default UserDashboard