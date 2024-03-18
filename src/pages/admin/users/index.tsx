import { Button, Form, Input, Modal, Skeleton, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';

import "./style.scss";
import request from '../../../server';
import { useQuery } from 'react-query';
import convertTime from '../../../utils/convertTime';
import UserType from '../../../types/user';
import { useState } from 'react';

const AdminUsers = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchUsers = async () => {
    const { data } = await request.get("users");
    return data;
  }

  const { data: users, isLoading } = useQuery("users", fetchUsers)

  const columns: TableProps['columns'] = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (data) => <p style={{ textTransform: "capitalize" }}>{data}</p>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={role === "admin" ? "red" : "blue"}>{role}</Tag>
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <p>{convertTime(date)}</p>,
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button onClick={() => showModal()}>Edit</Button>
          <Button danger>Delete</Button>
          <Button>Promote</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table scroll={{
        x: 1000,
      }} loading={isLoading} columns={columns} bordered dataSource={users?.map((user: UserType) => ({ ...user, key: user._id }))} />;
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        okText="Update"
        onCancel={handleCancel}
      >
        <Skeleton >
          <Form
            name="New Item"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            form={form}
            style={{ maxWidth: 700 }}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please provide username' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please provide email' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Skeleton>
      </Modal>
    </div>
  )
}

export default AdminUsers