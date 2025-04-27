import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Switch, 
  Button, 
  Card, 
  message, 
  Tabs,
  Select,
  InputNumber
} from 'antd';
import { 
  SettingOutlined, 
  NotificationOutlined, 
  DatabaseOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    general: {},
    notifications: {},
    database: {},
    security: {}
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/settings');
      const data = await response.json();
      setSettings(data);
      form.setFieldsValue(data);
    } catch (error) {
      message.error('Failed to fetch settings');
    }
    setLoading(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      await fetch('http://localhost:3000/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      message.success('Settings saved successfully');
    } catch (error) {
      message.error('Failed to save settings');
    }
    setLoading(false);
  };

  return (
    <Card title="System Settings" loading={loading}>
      <Tabs defaultActiveKey="general">
        <TabPane
          tab={
            <span>
              <SettingOutlined />
              General
            </span>
          }
          key="general"
        >
          <Form
            form={form}
            onFinish={handleSave}
            layout="vertical"
            initialValues={settings.general}
          >
            <Form.Item
              name="systemName"
              label="System Name"
              rules={[{ required: true, message: 'Please input system name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="timezone"
              label="Timezone"
              rules={[{ required: true, message: 'Please select timezone!' }]}
            >
              <Select>
                <Option value="UTC">UTC</Option>
                <Option value="EST">EST</Option>
                <Option value="PST">PST</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="autoRefresh"
              label="Auto Refresh"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="refreshInterval"
              label="Refresh Interval (seconds)"
              rules={[{ required: true, message: 'Please input refresh interval!' }]}
            >
              <InputNumber min={5} max={300} />
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane
          tab={
            <span>
              <NotificationOutlined />
              Notifications
            </span>
          }
          key="notifications"
        >
          <Form
            form={form}
            onFinish={handleSave}
            layout="vertical"
            initialValues={settings.notifications}
          >
            <Form.Item
              name="emailNotifications"
              label="Email Notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="emailAddress"
              label="Email Address"
              rules={[{ type: 'email', message: 'Please input valid email!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="slackNotifications"
              label="Slack Notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="slackWebhook"
              label="Slack Webhook URL"
            >
              <Input />
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane
          tab={
            <span>
              <DatabaseOutlined />
              Database
            </span>
          }
          key="database"
        >
          <Form
            form={form}
            onFinish={handleSave}
            layout="vertical"
            initialValues={settings.database}
          >
            <Form.Item
              name="backupEnabled"
              label="Automatic Backups"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="backupFrequency"
              label="Backup Frequency"
            >
              <Select>
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="retentionDays"
              label="Retention Period (days)"
              rules={[{ required: true, message: 'Please input retention period!' }]}
            >
              <InputNumber min={1} max={365} />
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane
          tab={
            <span>
              <SafetyOutlined />
              Security
            </span>
          }
          key="security"
        >
          <Form
            form={form}
            onFinish={handleSave}
            layout="vertical"
            initialValues={settings.security}
          >
            <Form.Item
              name="twoFactorAuth"
              label="Two-Factor Authentication"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="sessionTimeout"
              label="Session Timeout (minutes)"
              rules={[{ required: true, message: 'Please input session timeout!' }]}
            >
              <InputNumber min={5} max={1440} />
            </Form.Item>

            <Form.Item
              name="passwordPolicy"
              label="Password Policy"
            >
              <Select>
                <Option value="basic">Basic</Option>
                <Option value="medium">Medium</Option>
                <Option value="strong">Strong</Option>
              </Select>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={() => form.submit()}>
          Save Settings
        </Button>
      </div>
    </Card>
  );
};

export default Settings; 