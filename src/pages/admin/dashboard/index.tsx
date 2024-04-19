import { Row, Col, Card, Statistic, List, Avatar, Skeleton } from 'antd';
import { UserOutlined, ReadOutlined, MessageOutlined, UnorderedListOutlined } from '@ant-design/icons';
import request from '../../../server';
import { useQuery } from 'react-query';
import UserType from '../../../types/user';
import { getAllItems } from '../../../api/items';
import convertToReadableDate from '../../../utils/convertCommentTime';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Fragment } from 'react/jsx-runtime';
import LoadingPage from '../../loading';


const AdminDashboard = () => {
  const { t } = useTranslation()

  const getAdminUsers = async () => {
    const { data } = await request.get("users");
    return data;
  }

  const getCollections = async () => {
    const { data } = await request.get("collections");
    return data;
  };

  const getAllComments = async () => {
    const { data } = await request.get("comments");
    return data;
  }


  const { data: adminUsers, isLoading: usersLoading } = useQuery("adminUsers", getAdminUsers)
  const { data: comments, isLoading: commentsLoading } = useQuery("adminComments", getAllComments);
  const { data: items, isLoading: itemsLoading } = useQuery("adminItems", getAllItems);
  const { data: collections, isLoading: collectionsLoading } = useQuery("adminCollections", getCollections);

  const loading = usersLoading && commentsLoading && itemsLoading && collectionsLoading;

  if (loading) {
    return <LoadingPage />
  }

  return (
    <Fragment>
      <div className="dashboard-overview">
        <Helmet>
          <title>Admin Dashboard</title>
        </Helmet>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Skeleton loading={collectionsLoading}>
              <Card>
                <Statistic
                  title={t("Collections")}
                  value={collections?.length}
                  prefix={<ReadOutlined />}
                />
              </Card>
            </Skeleton>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Skeleton loading={itemsLoading}>
              <Card>
                <Statistic
                  title={t("Items")}
                  value={items?.length}
                  prefix={<UnorderedListOutlined />}
                />
              </Card>
            </Skeleton>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Skeleton loading={usersLoading}>
              <Card>
                <Statistic
                  title={t("Users")}
                  value={adminUsers?.length}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Skeleton>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Skeleton loading={commentsLoading}>
              <Card>
                <Statistic
                  title={t("Comments")}
                  value={comments?.length}
                  prefix={<MessageOutlined />}
                />
              </Card>
            </Skeleton>
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

    </Fragment>
  );
};

export default AdminDashboard;
