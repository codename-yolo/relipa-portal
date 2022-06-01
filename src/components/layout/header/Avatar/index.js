import React from 'react'
import Cat from './CrazyCat.jpg'
import styles from './index.module.scss'
import UserList from './UserList'
import UserBar from './Userbar'
import 'antd/dist/antd.min.css'
import { Row, Col } from 'antd'

const Index = () => {
  return (
    <div className={styles.Avatar}>
      <Row>
        <Col xs={0} md={4} xl={4}>
          <div className={styles.formImg}>
            <div className={styles.Image}>
              <img src={Cat} alt="CrazyCat" />
            </div>
            <UserList />
          </div>
        </Col>
        <Col xs={12} md={0} xl={0}>
          <UserBar />
        </Col>
      </Row>
    </div>
  )
}

export default Index
