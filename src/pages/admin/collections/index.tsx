import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { useQuery, useQueryClient } from 'react-query';

import request from '../../../server';
import CollectionType from '../../../types/collection';
import useUsers from '../../../hooks/useUsers';
import useCollection from '../../../store/collections';
import { EditOutlined } from '@ant-design/icons';

const AdminCollections = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const [collectionId, setCollectionId] = useState("");
  const [search, setSearch] = useState("")

  const [form] = Form.useForm();

  const { getUserById } = useUsers();

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
          message.success("Collection and all items deleted successfully.");
        }
      })
    } else {
      message.info("Please select user(s) to perform action!")
    }
  }

  const handleEdit = async (id: string) => {
    setIsModalOpen(true);
    setCollectionId(id);
    const { data } = await request.get(`collections/${id}`);
    form.setFieldsValue(data);
  }

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (collectionId) {
      await request.patch(`collections/${collectionId}`, values)
    }
    queryClient.invalidateQueries('collections');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      render: (userId: string) => <p>{getUserById(userId)}</p>
    },
    {
      title: 'Item Count',
      dataIndex: 'itemCount',
      key: 'itemCount',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: string, data: CollectionType) => (
        <Space size="middle">
          <Button type='primary' onClick={() => handleEdit(data._id)}><EditOutlined />Edit</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ padding: "20px 0px" }}>Collections</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Searching.." />
        <Button type='primary' danger onClick={handleDelete} >Delete</Button>
      </Space>
      <Table
        key={tableKey}
        columns={columns}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        bordered
        dataSource={collections?.map((collection: CollectionType) => ({ ...collection, key: collection._id }))}
        loading={isLoading}
        scroll={{ x: 1000 }}
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
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCollections;
