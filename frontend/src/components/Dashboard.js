import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Alert, Spin } from 'antd';
import { Line } from '@ant-design/plots';
import { metricsService, alertService } from '../services/api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [metricsData, alertsData] = await Promise.all([
          metricsService.getSystemMetrics(),
          alertService.getAlerts()
        ]);
        setMetrics(metricsData);
        setAlerts(alertsData);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => (
        <span style={{
          color: severity === 'high' ? 'red' : severity === 'medium' ? 'orange' : 'green'
        }}>
          {severity.toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="CPU Usage"
              value={metrics?.cpu?.value}
              suffix="%"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Memory Usage"
              value={metrics?.memory?.value}
              suffix="%"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Disk Usage"
              value={metrics?.disk?.value}
              suffix="%"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Active Alerts">
            <Table
              dataSource={alerts}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="System Metrics History">
            <Line
              data={[
                { time: '00:00', value: 10, category: 'CPU' },
                { time: '01:00', value: 15, category: 'CPU' },
                { time: '02:00', value: 20, category: 'CPU' },
                { time: '00:00', value: 30, category: 'Memory' },
                { time: '01:00', value: 35, category: 'Memory' },
                { time: '02:00', value: 40, category: 'Memory' },
              ]}
              xField="time"
              yField="value"
              seriesField="category"
              smooth
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 