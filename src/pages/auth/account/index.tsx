import { LogoutOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Modal, Select, message } from 'antd';
import i18n from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import request from '../../../server';
import useAuth from '../../../store/auth';
import useTheme from '../../../store/theme';

interface PasswordChangeType { currentPassword: string, newPassword: string }
interface UserUpdateType {
  username: string,
  email: string,
  language: string,
  theme: string,
}

const { Option } = Select;

const AccountSettings = () => {
  const [formAccount] = Form.useForm();
  const [formPassword] = Form.useForm();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { user, language, setLanguage, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const theme = localStorage.getItem("theme") || "light";

  const handleAccountSubmit = async (values: UserUpdateType) => {
    await request.patch(`users/${user.userId}`, values);

    switchLanguage(values.language)
    toggleTheme();
    navigate("/");
    message.success('Updated');
  };

  const handlePasswordSubmit = async (values: PasswordChangeType) => {
    await request.patch("auth/password", values)
    message.success('Updated');
    setShowPasswordForm(false);
    formPassword.resetFields();
  };

  const switchLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setLanguage(language);
    localStorage.setItem('LANGUAGE', language);
  };

  const getSingleUser = async () => {
    const { data } = await request.get(`users/${user.userId}`);
    return data
  }
  const { data: userData } = useQuery("userData", getSingleUser)

  useEffect(() => {
    formAccount.setFieldsValue(userData)
  }, [formAccount, userData])

  useEffect(() => {
    formAccount.setFieldsValue({
      language,
      theme,
    });
  }, [language, theme, formAccount]);

  return (
    <div className="container">
      <div className='d-flex align-items-center justify-content-between mb-4 mt-5'>
        <h2 className='fs-1'>{t("Account Settings")}</h2>
        <Button className='d-flex align-items-center' size='large' type='primary' danger onClick={() =>
          Modal.confirm({
            title: t("Do you want to log out?"),
            async onOk() {
              await logout(navigate);
            },
          })
        }><LogoutOutlined />{t("Logout")}</Button>
      </div>
      <Form
        form={formAccount}
        layout="vertical"
        onFinish={handleAccountSubmit}
        size='large'
        className="account-form mb-5"
      >
        <Form.Item
          label={t("Username")}
          name="username"
          rules={[{ required: true, message: t("Validation") }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t("Email")}
          name="email"
          rules={[{ required: true, message: t("Validation"), type: 'email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t("Language")}
          name="language"
          rules={[{ required: true, message: t("Validation") }]}
        >
          <Select value={language} placeholder={t("Select a language")}>
            <Option value="en">{t("English")}</Option>
            <Option value="uz">{t("Uzbek")}</Option>
            <Option value="ru">{t("Russian")}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t("Theme")}
          name="theme"
          rules={[{ required: true, message: t("Validation") }]}
        >
          <Select value={theme} placeholder={t("Select a theme")}>
            <Option value="light">{t("Light")}</Option>
            <Option value="dark">{t("Dark")}</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("Update")}
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <Button
        type="default"
        size='large'
        onClick={() => setShowPasswordForm(!showPasswordForm)}
        className="mb-3"
      >
        {showPasswordForm ? t('Cancel Password Change') : t('Update Password')}
      </Button>

      {showPasswordForm && (
        <Form
          form={formPassword}
          layout="vertical"
          onFinish={handlePasswordSubmit}
          className='password-form'
          size='large'
        >
          <Form.Item
            label={t("Current Password")}
            name="currentPassword"
            rules={[{ required: true, message: t("Validation") }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={t("New Password")}
            name="newPassword"
            rules={[{ required: true, message: t("Validation") }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t("Change Password")}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default AccountSettings;
