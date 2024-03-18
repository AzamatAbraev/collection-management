import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  ClockCircleOutlined,
  DatabaseOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Layout, Menu, Button, Modal, Badge, Flex } from "antd";

import Sider from "antd/es/layout/Sider";

import { Content, Header } from "antd/es/layout/layout";

import "./style.scss";
import useAuth from "../../../store/auth";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { role, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <Layout>
      <Sider
        className="dashboard-sider"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <h3 className="dashboard-logo">
          {collapsed ? "PTP" : "PTP Solutions"}
        </h3>
        <Menu
          className="menu"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          items={[
            {
              key: "/dashboard",
              icon: <UserOutlined />,
              label: (
                <Link to="dashboard">
                  Dashboard
                  <span className="dashboard-role-badge">
                    {role?.charAt(0).toUpperCase()}
                  </span>
                </Link>
              ),
            },
            {
              key: "/users",
              icon: <TeamOutlined />,
              label: (
                <Link to="users">
                  Users
                </Link>
              ),
            },
            {
              key: "/collections",
              icon: <ReadOutlined />,
              label: (
                <Link
                  to="collections"
                >
                  Collections
                </Link>
              ),
            },
            {
              key: "/items",
              icon: <ClockCircleOutlined />,
              label: (
                <Link
                  to="items"
                >
                  Items
                </Link>
              ),
            },
            {
              key: "/comments",
              icon: <DatabaseOutlined />,
              label: (
                <Link to="comments"
                >
                  Comments
                </Link>
              ),
            },
            {
              key: "4",
              label: (
                <Button
                  type="primary"
                  danger
                  style={{ width: "100%" }}
                  onClick={() =>
                    Modal.confirm({
                      title: "Do you want to log out ?",
                      onOk: () => logout(navigate),
                    })
                  }
                >
                  Logout
                </Button>
              ),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className="dashboard-header"
          style={{
            padding: 0,
          }}
        >
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={<MenuFoldOutlined />}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Flex align="center" gap={10}>
            <Link to="/dashboard" className="notification">
              <Badge className="dashboard-badge" count={0} size="small">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                >
                  <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
                </svg>
              </Badge>
            </Link>
          </Flex>
        </Header>
        <Content
          className="dashboard-main"
          style={{
            padding: 24,
            minHeight: 280,
            background: "#fff",
          }}
        >
          <div style={{ marginTop: "60px" }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;