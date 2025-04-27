import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Spin, Alert } from 'antd';
import { Line } from '@ant-design/plots';
import { 
  UserOutlined, 
  AlertOutlined, 
  DatabaseOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    cpu: [],
    memory: [],
    disk: [],
    alerts: []
  });
  const [systemStats, setSystemStats] = useState({
    users: 0,
    activeAlerts: 0,
    databaseSize: '0 MB',
    uptime: '0 days'
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:3000/metrics');
        const data = await response.json();
        setMetrics(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setLoading(false);
      }
    };

    const fetchSystemStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/system-stats');
        const data = await response.json();
        setSystemStats(data);
      } catch (error) {
        console.error('Error fetching system stats:', error);
      }
    };

    fetchMetrics();
    fetchSystemStats();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchSystemStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const config = {
    data: metrics.cpu,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const columns = [
    {
      title: 'Alert',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => (
        <span style={{ 
          color: severity === 'high' ? 'red' : 
                 severity === 'medium' ? 'orange' : 'green' 
        }}>
          {severity}
        </span>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="dashboard">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={systemStats.users}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Alerts"
              value={systemStats.activeAlerts}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Database Size"
              value={systemStats.databaseSize}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="System Uptime"
              value={systemStats.uptime}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="CPU Usage">
            <Line {...config} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="Recent Alerts">
            <Table 
              dataSource={metrics.alerts} 
              columns={columns} 
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 