import React, { useState } from 'react';
import { Button, Form, Input, Modal, Skeleton, Space, Table, TableProps, Tag, message } from 'antd';
import { useQuery, useQueryClient } from 'react-query';
import { DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

import request from '../../../server';
import convertTime from '../../../utils/convertTime';

import useUsersFunctions from '../../../store/users';
import UserType from '../../../types/user';

import "./style.scss";
import useAuth from '../../../store/auth';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const queryClient = useQueryClient();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("")
  const [tableKey, setTableKey] = useState(0);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("")

  const { deleteUser, blockUser, unblockUser, updateRole } = useUsersFunctions();
  const { user, logout } = useAuth();

  const navigate = useNavigate()

  const fetchUsers = async () => {
    const { data } = await request.get(`users${search ? `?query=${search}` : ''}`);
    return data;
  };

  const { data: users, isLoading } = useQuery(["users", search], () => fetchUsers(), {
    keepPreviousData: true,
  });

  const handleDelete = async () => {
    if (selectedRowKeys.length > 0) {
      Modal.confirm({
        title: 'Are you sure you want to delete selected user(s)? This will delete all data associated (collections, items, ..)',
        async onOk() {
          await Promise.all(selectedRowKeys.map((id) => deleteUser(id.toString())));
          if (selectedRowKeys.includes(user.userId)) {
            await logout(navigate)
            message.info("Your account has been deleted. Redirecting to register page...");
          }
          setSelectedRowKeys([]);
          setTableKey(prevKey => prevKey + 1);
          queryClient.invalidateQueries('users');
          message.success("Users deleted");
        },
      });
    } else {
      message.info("Please select user to perform this action");
    }
  };

  const handleBlock = () => {
    if (selectedRowKeys.length > 0) {
      Modal.confirm({
        title: 'Are you sure you want to block selected user(s)?',
        async onOk() {
          await Promise.all(selectedRowKeys.map((id) => blockUser(id.toString())));
          if (selectedRowKeys.includes(user.userId)) {
            await logout(navigate)
            message.info("Your account has been blocked. Redirecting to register page...");
          }
          setSelectedRowKeys([]);
          setTableKey(prevKey => prevKey + 1);
          queryClient.invalidateQueries('users');
          message.success("Blocked");
        },
      });
    } else {
      message.info("Please select user(s) to perform this action");
    }
  }

  const handleUnblock = () => {
    if (selectedRowKeys.length > 0) {
      Modal.confirm({
        title: 'Are you sure you want to unblock selected user(s)?',
        async onOk() {
          await Promise.all(selectedRowKeys.map((id) => unblockUser(id.toString())));
          setSelectedRowKeys([]);
          setTableKey(prevKey => prevKey + 1);

          queryClient.invalidateQueries('users');
          message.success("Unblocked");
        },
      });
    } else {
      message.info("Please select user(s) to perform this action");
    }
  }

  const rowSelection = {
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (userId) {
      await request.patch(`users/${userId}`, values)
    }
    queryClient.invalidateQueries('users');
    setIsModalOpen(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedRowKeys([]);
    setTableKey(prevKey => prevKey + 1);
  }

  const handleEdit = async (id: string) => {
    setIsModalOpen(true);
    setUserId(id)
    const { data } = await request.get(`users/${id}`);
    form.setFieldsValue(data);
  }

  const handleRole = async (id: string, role: string) => {
    Modal.confirm({
      title: "Are you sure that you want to change this user's role?",
      async onOk() {
        await updateRole(id, role)
        message.success(`role changed to ${role === "user" ? "admin" : "user"}`)
        queryClient.invalidateQueries('users');
      }
    })
  }

  const columns: TableProps['columns'] = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, data: UserType) => <p style={{ textTransform: "capitalize" }}>{text} {data._id === user.userId ? "(You)" : ""}</p>,
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
      sorter: (a, b) => a.role.localeCompare(b.role),
      render: (role: string) => <Tag color={role === "admin" ? "red" : "blue"}>{role}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === "blocked" ? "red" : "green"}>{status}</Tag>,
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => <p>{convertTime(date)}</p>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, data) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(data._id)}><EditOutlined /></Button>
          <Button onClick={() => handleRole(data._id, data.role)}>{data.role === "admin" ? "Demote" : "Promote"}</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ padding: "20px 0px" }}>Users</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Searching.." />
        <Button danger onClick={handleBlock} ><LockOutlined />Block</Button>
        <Button className='unblock__btn' style={{ color: "green" }} onClick={handleUnblock}><UnlockOutlined />Unblock</Button>
        <Button type='primary' danger onClick={handleDelete}><DeleteOutlined /> Delete</Button>
      </Space>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        bordered
        key={tableKey}
        scroll={{
          x: 1000,
        }}
        loading={isLoading}
        columns={columns}
        dataSource={users?.map((user: UserType) => ({ ...user, key: user._id }))}
      />
      <Modal
        title="Edit User"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <Skeleton loading={isLoading}>
          <Form
            form={form}
            layout="vertical"
            name="userForm"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please input the username!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please input the email!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Skeleton>
      </Modal>
    </div >
  );
};

export default AdminUsers;
