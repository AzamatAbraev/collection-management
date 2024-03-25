import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Select, Tooltip } from 'antd';
import { useQuery, useQueryClient } from 'react-query';

import request from '../../../server';
import CollectionType from '../../../types/collection';
import useCollection from '../../../store/collections';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

import "./style.scss"

const AdminCollections = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const [collectionId, setCollectionId] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [form] = Form.useForm();
  const { t } = useTranslation()

  const { deleteCollection } = useCollection();

  const fetchCollections = async () => {
    const { data } = await request.get(`collections${search ? `?query=${search}` : ''}`);
    return data;
  };


  const { data: collections, isLoading } = useQuery(["collections", search], () => fetchCollections(), {
    keepPreviousData: true,
  });

  const handleDelete = async () => {
    if (selectedRowKeys.length > 0) {
      Modal.confirm({
        title: "Are you sure that you want to delete selected collections",
        async onOk() {
          await Promise.all(selectedRowKeys.map((id) => deleteCollection(id.toString())));

          setSelectedRowKeys([]);
          setTableKey(prevKey => prevKey + 1);
          queryClient.invalidateQueries("collections")
          message.success("Success");
        }
      })
    } else {
      message.info("Please select user(s) to perform action!")
    }
  }

  const handleEdit = async () => {
    if (selectedRowKeys.length === 1) {
      const id = selectedRowKeys[0];
      setIsModalOpen(true);
      setCollectionId(id.toString());
      const { data } = await request.get(`collections/${id}`);
      form.setFieldsValue(data);
    } else {
      message.error("Please select exactly one collection to edit.");
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (category) {
      values.category = category;
    }

    if (collectionId) {
      await request.patch(`collections/${collectionId}`, values)
    }
    queryClient.invalidateQueries('collections');
    setIsModalOpen(false);
    setCategory("")

    setSelectedRowKeys([]);

    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCategory("")
  };

  const rowSelection = {
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys)
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <Tooltip title={text}>
          {text.length > 60 ? `${text.slice(0, 60)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Author',
      dataIndex: 'userId',
      key: 'userId',
      render: (user: { _id: string, username: string }) => <p>{user.username}</p>
    },
    {
      title: 'Item Count',
      dataIndex: 'itemCount',
      key: 'itemCount',
    },
  ];

  return (
    <div>
      <h1 className='pt-2 pb-2'>Collections</h1>
      <Space className='mb-3 d-flex'>
        <Input className='collections-search' value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Searching.." />
        <Button className='d-flex align-items-center' type='primary' danger onClick={handleDelete} ><DeleteOutlined />Delete</Button>
        <Button className='d-flex align-items-center' type='primary' onClick={handleEdit}><EditOutlined />Edit</Button>
      </Space>
      <Table
        key={tableKey}
        columns={columns}
        pagination={{ pageSize: 7 }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        bordered
        dataSource={collections?.map((collection: CollectionType) => ({ ...collection, key: collection._id }))}
        loading={isLoading}
        scroll={{ x: 700 }}
      />
      <Modal
        title="Edit Collection"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="Update"
      >
        <Form
          form={form}
          name="collectionEdit"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the collection name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the collection description!' }]}
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
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCollections;
