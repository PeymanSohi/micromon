import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Tag,
  Switch,
  Space
} from 'antd';
import { 
  BellOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const AlertManagement = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingAlert, setEditingAlert] = useState(null);

  const columns = [
    {
      title: 'Alert Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => (
        <Tag color={severity === 'high' ? 'red' : severity === 'medium' ? 'orange' : 'green'}>
          {severity}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? 'Enabled' : 'Disabled'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
          <Switch
            checked={record.enabled}
            onChange={(checked) => handleToggle(record.id, checked)}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/alerts');
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      message.error('Failed to fetch alerts');
    }
    setLoading(false);
  };

  const handleEdit = (alert) => {
    setEditingAlert(alert);
    form.setFieldsValue(alert);
    setModalVisible(true);
  };

  const handleDelete = async (alertId) => {
    try {
      await fetch(`http://localhost:3000/alerts/${alertId}`, {
        method: 'DELETE',
      });
      message.success('Alert deleted successfully');
      fetchAlerts();
    } catch (error) {
      message.error('Failed to delete alert');
    }
  };

  const handleToggle = async (alertId, enabled) => {
    try {
      await fetch(`http://localhost:3000/alerts/${alertId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });
      message.success(`Alert ${enabled ? 'enabled' : 'disabled'} successfully`);
      fetchAlerts();
    } catch (error) {
      message.error('Failed to update alert status');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingAlert) {
        await fetch(`http://localhost:3000/alerts/${editingAlert.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        message.success('Alert updated successfully');
      } else {
        await fetch('http://localhost:3000/alerts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        message.success('Alert created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      fetchAlerts();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<BellOutlined />}
          onClick={() => {
            setEditingAlert(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Create Alert
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={alerts}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingAlert ? 'Edit Alert' : 'Create Alert'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Alert Name"
            rules={[{ required: true, message: 'Please input alert name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="severity"
            label="Severity"
            rules={[{ required: true, message: 'Please select severity!' }]}
          >
            <Select>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="condition"
            label="Condition"
            rules={[{ required: true, message: 'Please input condition!' }]}
          >
            <Input placeholder="e.g., cpu_usage > 80" />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="Enabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingAlert ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AlertManagement; 