import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LikeFilled, LikeOutlined, MessageOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Skeleton, Space, message } from "antd";

import request from "../../../server";
import bookImg from "../../../assets/book.webp";

import LoadingPage from "../../loading";
import ItemType from "../../../types/item";
import NoDataComponent from "../../../components/no-data-found";
import useAuth from "../../../store/auth";

import "./style.scss";
import useItems from "../../../store/items";

const CollectionPage = () => {
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<null | string>(null)
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [refetch, setRefetch] = useState(false)
  const [authorId, setAuthorId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const [form] = Form.useForm();

  const { collectionId } = useParams();
  const { isAuthenticated, role, user } = useAuth();
  const { collectionItems, loading, addItem, deleteItem, updateItem, getItemsByCollection } = useItems()

  const showModal = () => {
    form.resetFields()
    setOpen(true);
  }

  const handleCancel = () => {
    setOpen(false)
    setSelected(null)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedFile) {
        values.photo = selectedFile;
      }

      if (!selected) {
        await addItem(values, collectionId);
      } else {
        await updateItem(selected, values)
      }
      setOpen(false);
      setSelected(null);
      setRefetch(!refetch);
    } catch (error) {
      message.error("Submission failed")
      console.log(error);

    }
  };

  const handleEdit = async (itemId: string) => {
    try {
      setOpen(true);
      setIsEditLoading(true);
      setSelected(itemId);

      const { data } = await request.get(`items/${itemId}`);
      form.setFieldsValue(data)

    } catch (error) {
      message.error("Update failed");
    } finally {
      setIsEditLoading(false)
    }
  }

  const handleDelete = async (collectionId: string) => {
    try {
      await deleteItem(collectionId);
      message.success("Item deleted successfully");
      setRefetch(!refetch);

    } catch (error) {
      message.error("Failed to delete the item");
    }
  };

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageData = new FormData();
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    imageData.append("image", file);
    const { data } = await request.post("upload", imageData);
    setSelectedFile(data);
  }


  useEffect(() => {
    const getCollection = async () => {
      try {
        setDataLoading(true)
        const { data } = await request.get(`collections/${collectionId}`)
        setCollectionName(data.name);
        setAuthorId(data.userId)
      } finally {
        setDataLoading(false)
      }
    }
    getCollection()
  }, [collectionId])

  useEffect(() => {
    getItemsByCollection(collectionId)
  }, [getItemsByCollection, collectionId, refetch])

  return (

    <Fragment>
      {loading ? <LoadingPage /> : <div className="container collection__items">
        <div className="collection__items__header">
          <p className="collection__items__title">{collectionName}</p>
          {isAuthenticated ? <div className="user__controls">
            <button onClick={showModal} className="add__btn user__btn"><PlusOutlined style={{ fontSize: "20px" }} /> New Item</button>
          </div> : ""}
        </div>
        {collectionItems.length > 0 ? <div className="collection__items__row">
          {collectionItems?.map((item: ItemType) =>
            <div key={item._id} className="card">
              <Link to={`${item._id}`} className="card__image">
                <img src={item.photo || bookImg} alt="Book" />
              </Link>
              <div className="card__buttons">
                <button onClick={() => setLiked(!liked)} className="card__btn">{liked ? <LikeFilled style={{ fontSize: "25px", color: "red" }} /> : <LikeOutlined style={{ fontSize: "25px" }} />}</button>
                <button onClick={() => setCommented(!commented)} className="card__btn"><MessageOutlined style={{ fontSize: "25px", color: commented ? "red" : "" }} /></button>
              </div>
              <Skeleton loading={dataLoading}>
                <div className="card__header">
                  <h3>{item.name}</h3>
                </div>
                <div className="card__tags">
                  {item?.tags.map((tag) => <p key={tag}>#{tag}</p>)}
                </div>
                <div className="card__controls">
                  {isAuthenticated && (role === 'admin' || authorId === user.userId) && (
                    <>
                      <button onClick={() => handleEdit(item?._id)} className="delete__btn">Edit</button>
                      <button
                        onClick={() =>
                          Modal.confirm({
                            title: "Are you sure you want to delete this item?",
                            async onOk() {
                              await handleDelete(item._id);
                            },
                          })
                        }
                        className="edit__btn"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>

              </Skeleton>
            </div>
          )}

        </div> : <NoDataComponent />}

      </div>}

      <Modal
        title={selected ? "Edit Item" : "Add Item"}
        open={open}
        onOk={handleOk}
        okText={selected ? "Update" : "Add"}
        confirmLoading={isEditLoading}
        onCancel={handleCancel}
      >
        <Skeleton loading={isEditLoading}>
          <Form
            name="New Item"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            form={form}
            style={{ maxWidth: 700 }}
            initialValues={{ tags: [''] }}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please provide item name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Photo">
              <input className="upload-photo" placeholder="Upload an image" onChange={uploadPhoto} type="file" />
              {/* {photo?.url ? <div className="upload-photo-container">
                <Image alt="Image" src={selectedFile?.url} />
              </div> : null} */}
            </Form.Item>
            <Form.List
              name="tags"
              rules={[
                {
                  validator: async (_, tags) => {
                    if (!tags || tags.length < 1) {
                      return Promise.reject(new Error('At least one tag is required'));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                      <Form.Item
                        {...field}
                        label={`Tag ${index + 1}`}
                        name={[field.name]}
                        rules={[{ required: true, message: 'Missing tag' }]}
                      >
                        <Input placeholder="Enter tag" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Tag
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Skeleton>
      </Modal>
    </Fragment>
  )
}

export default CollectionPage