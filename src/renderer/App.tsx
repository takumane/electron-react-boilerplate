import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './reset.css';
import styles from './App.module.sass';
import { Button, Divider, Layout, PageHeader, Space } from 'antd';
import TrainingCalendar from './components/TrainingCalendar';
import logo from './logo.png';
const { Header, Footer, Sider, Content } = Layout;
import { Select } from 'antd';
import Title from 'antd/lib/typography/Title';
import Chart from './components/Chart';

const { Option } = Select;

const Hello = () => {
  return <>
    <Layout className={styles.app}>
      <Sider className={styles.sideBar} width={400}>
        <div className={styles.logo}>
          <img src={logo}/>
          <div className={styles.oni}>ONISTRONG</div>
        </div>
        {/* <PageHeader title={'Overview'}/> */}
        <Space>
          <Button shape='round'>Stats</Button>
          <Button shape='round'>Exercises</Button>
          <Button shape='round'>Programming</Button>
        </Space>
        <br/>
        <br/>
        <div className={styles.statCard}>
          <Title level={5} className={styles.statName}>
            Training progress
          </Title>
          <div className={styles.statChart}>
            <Chart/>
          </div>
        </div>
        <div className={styles.statCard}>
          <Title level={5} className={styles.statName}>
            Lifts data
          </Title>
          <div className={styles.statChart}>

          </div>
        </div>
      </Sider>
      <Content className={styles.mainContent}>
        <PageHeader className={styles.pageHeader} 
          title={<Button type='default' shape='round' size='large'>Week 4 of 6</Button>}
          extra={<Select defaultValue="day" style={{ width: 120 }}>
            <Option value="day">
              Day
            </Option>
            <Option value="week">
              Week
            </Option>
            <Option value="block">
              Block
            </Option>
            <Option value="season">
              Season
            </Option>
        </Select>}
        />
        <TrainingCalendar/>
      </Content>
    </Layout>
  </>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
