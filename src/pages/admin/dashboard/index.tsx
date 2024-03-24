import { Row, Col, Card, Statistic, List, Avatar } from 'antd';
import { UserOutlined, ReadOutlined, MessageOutlined, UnorderedListOutlined } from '@ant-design/icons';
import request from '../../../server';
import { useQuery } from 'react-query';
import UserType from '../../../types/user';
import { getAllItems } from '../../../api/items';
import { getCollections } from '../../../api/collections';
import convertToReadableDate from '../../../utils/convertCommentTime';
import { useTranslation } from 'react-i18next';


const AdminDashboard = () => {
  const { t } = useTranslation()

  const getAdminUsers = async () => {
    const { data } = await request.get("users");
    return data;
  }

  const getAllComments = async () => {
    const { data } = await request.get("comments");
    return data;
  }


  const { data: adminUsers } = useQuery("adminUsers", getAdminUsers)
  const { data: comments } = useQuery("adminComments", getAllComments);
  const { data: items } = useQuery("adminItems", getAllItems);
  const { data: collections } = useQuery("adminCollections", getCollections);
  console.log(comments);

  return (
    <div className="dashboard-overview">
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Collections")}
              value={collections?.length}
              prefix={<ReadOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Items")}
              value={items?.length}
              prefix={<UnorderedListOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Users")}
              value={adminUsers?.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Comments")}
              value={comments?.length}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title={t("Recent-Users")} bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={adminUsers?.slice(0, 3)}
              renderItem={(user: UserType) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<p>{user.username}</p>}
                    description={
                      <div>
                        <p>{user.status}</p>
                        <p>{t("Joined-On")} {convertToReadableDate(user.createdAt)}</p>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={t("Recent-Comments")} bordered={false}>
            <List
              dataSource={comments?.slice(0, 3)}
              renderItem={(comment: { content: string; createdAt: string, userId: { username: string } }) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<MessageOutlined />} />}
                    title={comment?.userId?.username}
                    description={
                      <div>
                        <p>{comment?.content}</p>
                        <p>{t("Posted-On")} {convertToReadableDate(comment?.createdAt)}</p>
                      </div>
                    }

                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
