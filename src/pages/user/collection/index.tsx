import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LikeFilled, LikeOutlined, MessageOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Modal, Skeleton, Space, message } from "antd";

import request from "../../../server";
import bookImg from "../../../assets/book.webp";

import LoadingPage from "../../loading";
import ItemType from "../../../types/item";
import NoDataComponent from "../../../components/no-data-found";
import useAuth from "../../../store/auth";
import useItems from "../../../store/items";

import { useTranslation } from "react-i18next";

import "./style.scss";

interface CustomField {
  fieldName: string;
  fieldType: string;
}

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
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);


  const [form] = Form.useForm();
  const { t } = useTranslation();


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
    const values = await form.validateFields();

    const customValues: { [key: string]: string; } = {};

    customFields.forEach((field: CustomField) => {
      if (values[field.fieldName]) {
        customValues[field.fieldName] = values[field.fieldName];
      }
      delete values[field.fieldName];
    });

    if (selectedFile) {
      values.photo = selectedFile;
    }

    const payload = {
      ...values, customValues
    }

    if (!selected) {
      await addItem(payload, collectionId);
    } else {
      await updateItem(selected, values)
    }
    setOpen(false);
    setSelected(null);
    setRefetch(!refetch);
  };

  const handleEdit = async (itemId: string) => {
    try {
      setOpen(true);
      setIsEditLoading(true);
      setSelected(itemId);

      const { data } = await request.get(`items/${itemId}`);
      if (data.customValues) {
        customFields.forEach((field) => {
          if (data.customValues[field.fieldName] !== undefined) {
            data[field.fieldName] = data.customValues[field.fieldName];
          }
        });
      }
      setSelectedFile(data.photo)
      form.setFieldsValue(data);

    } catch (error) {
      message.error("Error");
    } finally {
      setIsEditLoading(false)
    }
  }

  const handleDelete = async (collectionId: string) => {
    try {
      await deleteItem(collectionId);
      setRefetch(!refetch);

    } catch (error) {
      message.error("Error");
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
        setCustomFields(data.customFields || [])
      } finally {
        setDataLoading(false)
      }
    }
    getCollection()
  }, [collectionId])

  useEffect(() => {
    getItemsByCollection(collectionId)
  }, [getItemsByCollection, collectionId, refetch])


  const renderInputs = (field: { fieldType: string, fieldName: string }) => {
    switch (field.fieldType) {
      case "Integer":
        return <InputNumber />
      case "Boolean":
        return <Checkbox>{field.fieldName}</Checkbox>
      case "Date":
        return <DatePicker />
      default:
        return <Input />
    }
  }

  return (
    <Fragment>
      {loading ? <LoadingPage /> : <div className="container collection__items">
        <div className="collection__items__header">
          <p className="collection__items__title">{collectionName}</p>
          {isAuthenticated ? <div className="user__controls">
            <button onClick={showModal} className="add__btn user__btn"><PlusOutlined style={{ fontSize: "20px" }} /> {t("New Item")}</button>
          </div> : ""}
        </div>
        {collectionItems.length > 0 ? <div className="collection__items__row">
          {collectionItems?.map((item: ItemType) =>
            <div key={item._id} className="card-item">
              <Link to={`${item._id}`} className="card-item__image">
                <img src={item.photo || bookImg} alt="Book" />
              </Link>
              <div className="d-flex align-items-center gap-2">
                <button onClick={() => setLiked(!liked)} className="card-item__btn">{liked ? <LikeFilled style={{ fontSize: "25px", color: "red" }} /> : <LikeOutlined style={{ fontSize: "25px" }} />}</button>
                <button onClick={() => setCommented(!commented)} className="card-item__btn"><MessageOutlined style={{ fontSize: "25px", color: commented ? "red" : "" }} /></button>
              </div>
              <Skeleton loading={dataLoading}>
                <div>
                  <h3>{item.name}</h3>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  {item?.tags.map((tag, index) => <p key={index}>#{tag}</p>)}
                </div>
                {item.customValues && Object.keys(item.customValues).length > 0 && (
                  <div className="item-custom-fields">
                    {Object.entries(item.customValues).map(([fieldName, fieldValue]) => (
                      <div key={fieldName} className="custom-field">
                        <strong>{fieldName}:</strong> {fieldValue.toString()}
                      </div>
                    ))}
                  </div>
                )}
                <div className="card-item__controls">
                  {isAuthenticated && (role === 'admin' || authorId === user.userId) && (
                    <div className="d-flex align-items-center gap-2">
                      <button onClick={() => handleEdit(item?._id)} className="delete__btn">{t("Edit")}</button>
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
                        {t("Delete")}
                      </button>
                    </div>
                  )}
                </div>

              </Skeleton>
            </div>
          )}

        </div> : <div className="nodata__wrapper"><NoDataComponent /></div>}

      </div>}

      <Modal
        title={selected ? t("Edit") : t("Add")}
        open={open}
        onOk={handleOk}
        okText={selected ? t("Edit") : t("Add")}
        confirmLoading={isEditLoading}
        onCancel={handleCancel}
        cancelText={t("Cancel")}
      >
        <Skeleton loading={isEditLoading}>
          <Form
            name={t("New Item")}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            form={form}
            style={{ maxWidth: 700 }}
            initialValues={{ tags: [''] }}
            autoComplete="off"
          >
            <Form.Item
              label={t("Name")}
              name="name"
              rules={[{ required: true, message: t('Validation') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label={t("Photo")}>
              <label htmlFor="fileInput" className="custom-file-upload">
                <input
                  id="fileInput"
                  type="file"
                  onChange={uploadPhoto}
                  style={{ display: 'none' }}
                />
                {selected ? "Change Image" : "Upload Image"}
              </label>
              {selectedFile && (
                <div style={{ marginTop: 10 }}>
                  <img src={selectedFile} alt="Uploaded" style={{ width: "100%", height: "250px", objectFit: "cover" }} />
                </div>
              )}
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
                        rules={[{ required: true, message: t('Validation') }]}
                      >
                        <Input placeholder={"Add"} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      {t("Add")}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            {customFields.map((field: { fieldName: string, fieldType: string }, index) => (
              <Form.Item
                key={index}
                name={field.fieldName}
                label={field.fieldName}
                valuePropName={field.fieldType === "Boolean" ? "checked" : "value"}
                rules={[{ required: true, message: `${field.fieldName} is required` }]}
              >
                {renderInputs(field)}
              </Form.Item>
            ))}
          </Form>
        </Skeleton>
      </Modal>
    </Fragment>
  )
}

export default CollectionPage