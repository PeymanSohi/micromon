import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, Space, Tag, message } from 'antd';
import { backupService } from '../services/api';
import moment from 'moment';

const BackupManagement = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = {
          completed: 'green',
          pending: 'blue',
          failed: 'red',
          in_progress: 'orange'
        }[status] || 'default';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Completed At',
      dataIndex: 'completed_at',
      key: 'completed_at',
      render: (date) => date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'completed' && (
            <Button
              type="link"
              onClick={() => handleDownload(record.id)}
            >
              Download
            </Button>
          )}
          {record.status === 'failed' && (
            <Button
              type="link"
              danger
              onClick={() => handleRetry(record.id)}
            >
              Retry
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const data = await backupService.getBackups();
      setBackups(data);
    } catch (error) {
      console.error('Error fetching backups:', error);
      message.error('Failed to fetch backups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
    const interval = setInterval(fetchBackups, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleCreateBackup = async (values) => {
    try {
      await backupService.createBackup(values);
      message.success('Backup scheduled successfully');
      setModalVisible(false);
      form.resetFields();
      fetchBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
      message.error('Failed to schedule backup');
    }
  };

  const handleDownload = async (backupId) => {
    try {
      const blob = await backupService.downloadBackup(backupId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${backupId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading backup:', error);
      message.error('Failed to download backup');
    }
  };

  const handleRetry = async (backupId) => {
    try {
      await backupService.retryBackup(backupId);
      message.success('Backup retry scheduled');
      fetchBackups();
    } catch (error) {
      console.error('Error retrying backup:', error);
      message.error('Failed to retry backup');
    }
  };

  return (
    <Card
      title="Backup Management"
      extra={
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Schedule Backup
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={backups}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <Modal
        title="Schedule New Backup"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateBackup}
        >
          <Form.Item
            name="name"
            label="Backup Name"
            rules={[{ required: true, message: 'Please enter a backup name' }]}
          >
            <Input placeholder="Enter backup name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              placeholder="Enter backup description"
              rows={4}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Schedule Backup
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BackupManagement; 