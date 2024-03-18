import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space } from 'antd';
import { useQuery } from 'react-query';

import request from '../../../server';
import CollectionType from '../../../types/collection';
import useUsers from '../../../hooks/useUsers';
import useCollections from '../../../hooks/useCollections';

const AdminItems = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();

  const { getUserById } = useUsers();
  const { getCollectionById } = useCollections();

  const fetchItems = async () => {
    const { data } = await request.get("items");
    return data;
  };


  const { data: collections, isLoading: isLoadingCollections } = useQuery(
    "items",
    fetchItems,
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => tags.join(', '),
    },
    {
      title: 'Collection',
      dataIndex: 'collectionId',
      key: 'collectionId',
      render: (collectionId: string) => <p>{getCollectionById(collectionId)}</p>

    },
    {
      title: 'Author',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string) => <p>{getUserById(userId)}</p>
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button onClick={showModal}>Edit</Button>
          <Button danger>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={collections?.map((collection: CollectionType) => ({ ...collection, key: collection._id }))}
        loading={isLoadingCollections}
        scroll={{ x: 1000 }}
        pagination={{ pageSize: 7 }}
        bordered
      />
      <Modal
        title="Edit Collection"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Update"
      >
        <Form
          form={form}
          name="collectionEdit"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
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

export default AdminItems;
