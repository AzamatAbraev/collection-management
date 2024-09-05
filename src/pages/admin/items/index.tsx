import { DeleteOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space, Table, message } from 'antd';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import request from '../../../server';
import useItems from '../../../store/items';
import CollectionType from '../../../types/collection';

import notFoundImage from "../../../assets/not-found.png";

const AdminItems = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const [itemId, setItemId] = useState("")
  const [search, setSearch] = useState("")

  const [form] = Form.useForm();

  const { deleteItem } = useItems()

  const fetchItems = async () => {
    const { data } = await request.get(`items${search ? `?searchQuery=${search}` : ''}`);
    return data;
  };


  const { data: items, isLoading } = useQuery(["items", search], () => fetchItems(), {
    keepPreviousData: true,
  });

  const handleDelete = async () => {
    if (selectedRowKeys.length > 0) {
      Modal.confirm({
        title: "Are you sure that you want to delete selected items",
        async onOk() {
          await Promise.all(selectedRowKeys.map((id) => deleteItem(id?.toString())));

          setSelectedRowKeys([]);
          setTableKey(prevKey => prevKey + 1);
          queryClient.invalidateQueries("items")
          message.success("Items deleted successfully.");
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
      setItemId(id?.toString());
      const { data } = await request.get(`items/${id}`);
      form.setFieldsValue(data);
    } else {
      message.error("Please select exactly one collection to edit.");
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (itemId) {
      await request.patch(`items/${itemId}`, values)
    }
    queryClient.invalidateQueries('items');
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
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      render: (url: string) => <img style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "50%" }} src={url ? url : notFoundImage} />
    },
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
      render: (collection: { name: string }) => <p>{collection.name}</p>

    },
    {
      title: 'Author',
      dataIndex: 'userId',
      key: 'userId',
      render: (user: { _id: string, username: string }) => <p>{user.username}</p>
    },
  ];

  return (
    <div>
      <h1 className='pt-2 pb-2'>Items</h1>
      <Space className='mb-3'>
        <Input className='collections-search' value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Searching.." />
        <Button className='d-flex align-items-center' type='primary' danger onClick={handleDelete} ><DeleteOutlined />Delete</Button>
        <Button className='d-flex align-items-center' type='primary' onClick={handleEdit}><EditOutlined />Edit</Button>
      </Space>
      <Table
        columns={columns}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        key={tableKey}
        dataSource={items?.map((collection: CollectionType) => ({ ...collection, key: collection._id }))}
        loading={isLoading}
        scroll={{ x: 700 }}
        pagination={{ pageSize: 7 }}
        bordered
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
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name]}
                      rules={[{ required: true, message: 'Missing tag' }]}
                    >
                      <Input placeholder="Enter tag" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
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
      </Modal>
    </div>
  );
};

export default AdminItems;
