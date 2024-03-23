import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, Link } from "react-router-dom";

import { Empty, Form, Input, Modal, Select, Skeleton, Space, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

import request from "../../../server";
import useAuth from "../../../store/auth";
import useCollection from "../../../store/collections";
import { getUserCollections } from "../../../api/collections";
import CollectionType from "../../../types/collection";

import readmoreIcon from "../../../assets/read-more.svg"
import settingsIcon from "../../../assets/settins-icon.svg"
import userIcon from "../../../assets/user-icon.svg"
import convertToReadableDate from "../../../utils/convertCommentTime";

import "./style.scss";
import LoadingPage from "../../loading";
import { useTranslation } from "react-i18next";

const UserDashboard = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<null | string>(null)
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("")

  const { addCollection, deleteCollection, updateCollection } = useCollection();
  const { user, role } = useAuth();
  const { t } = useTranslation();

  const [form] = Form.useForm()
  const queryClient = useQueryClient();
  const navigate = useNavigate();


  const { data: userCollections, isLoading } = useQuery(["userCollections", categoryFilter], getUserCollections)

  const showModal = () => {
    form.resetFields();
    form.setFieldsValue({ tags: [''] });
    setOpen(true)
  }

  const handleOk = async () => {
    const values = await form.validateFields();
    if (values.category === "Other" && values.newCategory) {
      values.category = values.newCategory;
    }

    if (!selected) {
      values.userId = user.userId;
      await addCollection(values);
    } else {
      await updateCollection(values, selected)
    }
    queryClient.invalidateQueries('userCollections');
    setOpen(false);
    setCategory("")
    setSelected(null);

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
      message.success("Success");
    } catch (error) {
      message.error("Error");
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
      message.error("Error");
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
          <Space className="user__collections__filter">
            <Select
              className="select__filter"
              style={{ width: 240 }}
              onChange={(value) => setCategoryFilter(value)}
              value={categoryFilter}
              options={[
                { label: t("All"), value: "" },
                {
                  label: t("Books"),
                  value: "Books",
                },
                {
                  label: t("Coins"),
                  value: "Coins",
                },
                {
                  label: t("Art"),
                  value: "Art",
                },
                {
                  label: t("Sports"),
                  value: "Sports",
                },
                {
                  label: t("Other"),
                  value: "Other",
                },
              ]}
            />
          </Space>
          <div className="user__controls">
            <button onClick={() => navigate("/account")} className="user__btn"><img src={settingsIcon} />{t("Settings")}</button>
            <button onClick={showModal} className="add__btn user__btn"><PlusOutlined style={{ fontSize: "20px" }} /> {t("New-Collection")}</button>
          </div>
        </div>
        <table className="collection-table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>{t("Name")}</th>
              <th>{t("Description")}</th>
              <th>{t("Category")}</th>
              <th>{t("Created")}</th>
              <th>{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {userCollections?.length > 0 ? userCollections?.map((collection: CollectionType) =>
              <tr key={collection._id}>
                <td>{(collection.name)}</td>
                <td>{collection.description}</td>
                <td>{t(collection.category)}</td>
                <td>{convertToReadableDate(collection.createdAt)}</td>
                <td>
                  <Space>
                    <button className="btn btn-primary" onClick={() => handleEdit(collection._id)}>
                      <EditOutlined />
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        Modal.confirm({
                          title: "Are you sure you want to delete this collection and all its items?",
                          async onOk() {
                            await handleDelete(collection._id);
                          },
                        })
                      }
                    >
                      <DeleteOutlined />
                    </button>
                    <Link className="btn btn-primary" to={`/collection/${collection._id}`}>
                      <img src={readmoreIcon} alt="Read More" />
                    </Link>
                  </Space>
                </td>
              </tr>
            ) : <Empty />}
          </tbody>
        </table>
      </div>}
      <Modal
        title={selected ? t("Edit") : t("New-Collection")}
        open={open}
        onOk={handleOk}
        okText={selected ? t("Edit") : t("Add")}
        confirmLoading={isLoading}
        onCancel={handleCancel}
        cancelText={t("Cancel")}
      >
        <Skeleton loading={isEditLoading}>
          <Form
            name={t("New-Collection")}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            form={form}
            style={{ maxWidth: 700 }}
            initialValues={{}}
            autoComplete="off"
          >
            <Form.Item
              label={t("Name")}
              name="name"
              rules={[{ required: true, message: t("Validation") }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t("Category")}
              name="category"
              rules={[
                {
                  required: true,
                  message: t("Validation"),
                },
              ]}
            >
              <Select
                style={{
                  width: "100%",
                }}
                onChange={(value) => setCategory(value)}
                options={[
                  { label: t("All"), value: "" },
                  {
                    label: t("Books"),
                    value: "Books",
                  },
                  {
                    label: t("Coins"),
                    value: "Coins",
                  },
                  {
                    label: t("Art"),
                    value: "Art",
                  },
                  {
                    label: t("Sports"),
                    value: "Sports",
                  },
                  {
                    label: t("Other"),
                    value: "Other",
                  },
                ]}
              />
            </Form.Item>
            {category === "Other" && (
              <Form.Item
                label={t("New-Category")}
                name="newCategory"
                rules={[{ required: true, message: t("Validation") }]}
              >
                <Input />
              </Form.Item>
            )}
            <Form.Item
              label={t("Description")}
              name="description"
              rules={[{ required: true, message: t("Validation") }]}
            >
              <TextArea />
            </Form.Item>
          </Form>
        </Skeleton>
      </Modal>
    </section >
  )
}

export default UserDashboard