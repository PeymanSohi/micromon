import React, { useState, useEffect } from 'react';
import { Table, Card, DatePicker, Select, Input, Space, Button, Tag } from 'antd';
import { logsService } from '../services/api';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    level: undefined,
    dateRange: undefined,
    search: undefined
  });

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix(),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        const color = {
          error: 'red',
          warn: 'orange',
          info: 'blue',
          debug: 'green'
        }[level] || 'default';
        return <Tag color={color}>{level.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'ERROR', value: 'error' },
        { text: 'WARN', value: 'warn' },
        { text: 'INFO', value: 'info' },
        { text: 'DEBUG', value: 'debug' }
      ],
      onFilter: (value, record) => record.level === value,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
    },
  ];

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {
        level: filters.level,
        startDate: filters.dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: filters.dateRange?.[1]?.format('YYYY-MM-DD'),
        search: filters.search
      };
      const data = await logsService.getLogs(params);
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card title="System Logs">
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by Level"
          style={{ width: 120 }}
          allowClear
          onChange={(value) => handleFilterChange('level', value)}
        >
          <Option value="error">ERROR</Option>
          <Option value="warn">WARN</Option>
          <Option value="info">INFO</Option>
          <Option value="debug">DEBUG</Option>
        </Select>

        <RangePicker
          onChange={(dates) => handleFilterChange('dateRange', dates)}
        />

        <Input.Search
          placeholder="Search logs"
          onSearch={(value) => handleFilterChange('search', value)}
          style={{ width: 200 }}
        />

        <Button onClick={() => setFilters({})}>
          Clear Filters
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
};

export default SystemLogs; 