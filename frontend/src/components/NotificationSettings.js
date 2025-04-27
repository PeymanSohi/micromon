import React, { useState, useEffect } from 'react';
import { Card, Form, Switch, Input, Button, Space, message, Divider } from 'antd';
import { notificationService } from '../services/api';

const NotificationSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const settings = await notificationService.getSettings();
      form.setFieldsValue(settings);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      message.error('Failed to fetch notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      setLoading(true);
      await notificationService.updateSettings(values);
      message.success('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      message.error('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async (type) => {
    try {
      setTesting(true);
      await notificationService.testNotification(type);
      message.success(`Test ${type} notification sent successfully`);
    } catch (error) {
      console.error(`Error testing ${type} notification:`, error);
      message.error(`Failed to send test ${type} notification`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card title="Notification Settings" loading={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          email_enabled: false,
          slack_enabled: false,
          webhook_enabled: false
        }}
      >
        <Divider orientation="left">Email Notifications</Divider>
        <Form.Item
          name="email_enabled"
          label="Enable Email Notifications"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            {
              type: 'email',
              message: 'Please enter a valid email address',
            },
            {
              required: true,
              message: 'Please enter your email address',
              validator: (_, value) => {
                if (form.getFieldValue('email_enabled') && !value) {
                  return Promise.reject('Email is required when email notifications are enabled');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={() => handleTest('email')}
            loading={testing}
            disabled={!form.getFieldValue('email_enabled')}
          >
            Test Email Notification
          </Button>
        </Form.Item>

        <Divider orientation="left">Slack Notifications</Divider>
        <Form.Item
          name="slack_enabled"
          label="Enable Slack Notifications"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="slack_webhook"
          label="Slack Webhook URL"
          rules={[
            {
              required: true,
              message: 'Please enter your Slack webhook URL',
              validator: (_, value) => {
                if (form.getFieldValue('slack_enabled') && !value) {
                  return Promise.reject('Slack webhook URL is required when Slack notifications are enabled');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Enter Slack webhook URL" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={() => handleTest('slack')}
            loading={testing}
            disabled={!form.getFieldValue('slack_enabled')}
          >
            Test Slack Notification
          </Button>
        </Form.Item>

        <Divider orientation="left">Webhook Notifications</Divider>
        <Form.Item
          name="webhook_enabled"
          label="Enable Webhook Notifications"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="webhook_url"
          label="Webhook URL"
          rules={[
            {
              required: true,
              message: 'Please enter your webhook URL',
              validator: (_, value) => {
                if (form.getFieldValue('webhook_enabled') && !value) {
                  return Promise.reject('Webhook URL is required when webhook notifications are enabled');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Enter webhook URL" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={() => handleTest('webhook')}
            loading={testing}
            disabled={!form.getFieldValue('webhook_enabled')}
          >
            Test Webhook Notification
          </Button>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Settings
            </Button>
            <Button onClick={() => form.resetFields()}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NotificationSettings; 