import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Space, Button } from 'antd';
import { 
  DashboardOutlined, 
  DatabaseOutlined, 
  CloudServerOutlined,
  ClockCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { systemHealthService } from '../services/api';

const SystemHealth = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await systemHealthService.getMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching system health metrics:', err);
      setError('Failed to fetch system health metrics');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'green';
      case 'warning':
        return 'orange';
      case 'critical':
        return 'red';
      default:
        return 'blue';
    }
  };

  const columns = [
    {
      title: 'Component',
      dataIndex: 'component',
      key: 'component',
      render: (text) => (
        <Space>
          {text === 'Database' && <DatabaseOutlined />}
          {text === 'API' && <CloudServerOutlined />}
          {text === 'Frontend' && <DashboardOutlined />}
          {text}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Response Time',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          {time}ms
        </Space>
      ),
    },
    {
      title: 'Last Checked',
      dataIndex: 'lastChecked',
      key: 'lastChecked',
    },
  ];

  if (error) {
    return (
      <Card title="System Health" loading={loading}>
        <div style={{ textAlign: 'center', color: 'red' }}>
          <WarningOutlined style={{ fontSize: 24, marginRight: 8 }} />
          {error}
          <Button type="link" onClick={fetchMetrics}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="System Health" loading={loading}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="System Uptime"
              value={metrics?.uptime || 0}
              suffix="days"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="CPU Usage"
              value={metrics?.cpuUsage || 0}
              suffix="%"
              prefix={<CloudServerOutlined />}
            />
            <Progress percent={metrics?.cpuUsage || 0} status="active" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Memory Usage"
              value={metrics?.memoryUsage || 0}
              suffix="%"
              prefix={<DatabaseOutlined />}
            />
            <Progress percent={metrics?.memoryUsage || 0} status="active" />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Component Status">
            <Table
              dataSource={metrics?.components || []}
              columns={columns}
              pagination={false}
              rowKey="component"
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default SystemHealth; 