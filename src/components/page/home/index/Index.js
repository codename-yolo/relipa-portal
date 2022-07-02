import React, { useEffect, useState } from 'react'
import {
  DoubleLeftOutlined,
  LeftOutlined,
  DoubleRightOutlined,
  RightOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import { Row, Col, Modal, Button } from 'antd'
import styles from './Index.module.scss'
import './Index.scss'
import { dateTime, CMTable } from '../../../index'
import { getDataListNotice } from '../slice/slice'
import { useDispatch, useSelector } from 'react-redux'
import { saveAs } from 'file-saver'
import distance from '../../../utils/distance'
import { shortenLink } from './cutString'

const Index = () => {
  const [modal, setModal] = useState({ open: false, data: {} })
  const [heightTable, setHeightTable] = useState(0)
  const stateNotice = useSelector((state) => {
    return state.noticeList
  })
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getDataListNotice({ perPage: 10, page: 1 }))
  }, [])

  useEffect(() => {
    const height = distance('HomeTable', 47)
    setHeightTable(height.heightTable)
  }, [])
  const columns = [
    {
      title: <h4>NO</h4>,
      dataIndex: 'id',
      key: 'id',
      render: (payload, records) => {
        return (
          <p className="resetMargin textCenter">
            <> {(stateNotice.page - 1) * 10 + Number(records.key) + 1}</>
          </p>
        )
      },
    },
    {
      title: <h4>SUBJECT</h4>,
      dataIndex: 'subject',
      key: 'subject',
      render: (payload) => {
        return <div>{payload}</div>
      },
    },
    {
      title: <h4>AUTHOR</h4>,
      dataIndex: 'created_by',
      key: 'created_by',
      render: (payload) => {
        return <div>{payload}</div>
      },
    },
    {
      title: <h4>TO DEPARTMENT</h4>,
      dataIndex: 'published_to',
      key: 'published_to',
      render: (payload) => {
        const department = Array.isArray(payload)
          ? payload[0].division_name
          : 'ALL'
        return <div className="tb_center">{department}</div>
      },
    },
    {
      title: <h4>PUBLISHED DATE</h4>,
      dataIndex: 'published_date',
      key: 'published_date',
      render: (payload, record) => {
        return (
          <div className="resetMargin tb_center">
            {dateTime.formatDateTable(record.published_date)}
          </div>
        )
      },
    },
    {
      title: <h4>ATTACHMENT</h4>,
      dataIndex: 'attachment',
      key: 'attachment',
      render: (payload, record) => {
        const redirect = () => {
          const indexofDot = payload.lastIndexOf('.')
          const pathFile = payload.slice(indexofDot, payload.length)
          if (pathFile === '.zip' || pathFile === '.rar') {
            saveAs(`${payload}`, `${payload}`)
          } else {
            window.open(payload)
          }
        }
        let nameFile = payload
        if (payload) {
          nameFile = shortenLink(payload)
        }
        return (
          <div
            className="textOverflow colorBlue resetMargin"
            onClick={redirect}
          >
            {nameFile}
          </div>
        )
      },
    },
    {
      title: <h4>DETAIL</h4>,
      dataIndex: 'detail',
      key: 'detail',
      render: (payload, record) => {
        return (
          <div
            className="tb_center colorBlue resetMargin"
            onClick={() => setModal({ open: true, data: record })}
          >
            view
          </div>
        )
      },
    },
  ]

  const onShowSizeChange = (page, size) => {
    dispatch(getDataListNotice({ perPage: size, page: page }))
  }

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return (
        <>
          <Button
            icon={<DoubleLeftOutlined />}
            disabled={stateNotice.currentPage === 1}
            onClick={(e) => {
              e.stopPropagation()
              dispatch(
                getDataListNotice({
                  perPage: stateNotice.per_page,
                  page: 1,
                }),
              )
            }}
            className="ant-pagination-item"
          ></Button>
          <Button
            className="ant-pagination-item"
            disabled={stateNotice.currentPage === 1}
            icon={<LeftOutlined />}
          ></Button>
        </>
      )
    }

    if (type === 'next') {
      return (
        <>
          <Button
            className="ant-pagination-item"
            disabled={stateNotice.currentPage === stateNotice.lastPage}
            icon={<RightOutlined />}
          ></Button>
          <Button
            disabled={stateNotice.currentPage === stateNotice.lastPage}
            icon={<DoubleRightOutlined />}
            onClick={(e) => {
              e.stopPropagation()
              dispatch(
                getDataListNotice({
                  perPage: stateNotice.per_page,
                  page: stateNotice.lastPage,
                }),
              )
            }}
            className="ant-pagination-item"
          ></Button>
        </>
      )
    }

    return originalElement
  }

  const onChange = (size, page) => {
    dispatch(getDataListNotice({ perPage: page, page: size }))
  }
  const closeModal = () => {
    setModal((prev) => {
      return { ...prev, open: false }
    })
  }

  return (
    <div className={styles.Home} id="HomeTable">
      <Row
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          borderRadius: 5,
        }}
      >
        <Col xs={24} md={22} xl={24}>
          <CMTable
            title={() => {
              return (
                <>
                  <h2>Official Notice</h2>
                </>
              )
            }}
            loading={stateNotice.loading}
            className="tableNotice"
            data={stateNotice.tableData}
            width={{
              id: '4%',
              attachment: '15%',
              created_by: '12%',
              published_to: '9%',
              published_date: '10%',
              detail: '5%',
              subject: '20%',
            }}
            columns={columns}
            sorter={{ published_date: 'date' }}
            scroll={{
              x: 1000,
              y: heightTable,
            }}
            styleHead={{
              id: { position: 'tb_center' },
              subject: { position: 'tb_start' },
              created_by: { position: 'tb_center' },
              published_date: {
                position: 'tb_center',
                className: 'whiteColor',
              },
              published_to: {
                position: 'tb_center',
                className: 'whiteColor',
              },
              attachment: { position: 'tb_start' },
              detail: { position: 'tb_center' },
            }}
            styleBody={{
              subject: { className: 'textOverflow' },
              created_by: { className: 'textOverflow textCenter' },
            }}
            pagination={{
              current: stateNotice.currentPage,
              total: stateNotice.total,
              onShowSizeChange: onShowSizeChange,
              itemRender: itemRender,
              onChange: onChange,
            }}
          />
        </Col>
      </Row>
      <Modal
        className="modalNotice"
        title={<h2>Notice Detail</h2>}
        visible={modal.open}
        footer={[
          <Button key="cancel" onClick={closeModal}>
            Cancel
          </Button>,
        ]}
        width={700}
        onCancel={closeModal}
      >
        <Row>
          <Col
            xs={24}
            md={24}
            xl={24}
            style={{ display: 'flex', borderBottom: '2px solid #ab9f9f' }}
          >
            <Col
              xs={12}
              md={12}
              xl={12}
              style={{
                paddingRight: '10px',
              }}
            >
              <Col xs={24} md={24} xl={24} className="dFlex">
                <Col xl={7}>Author Name: </Col>
                <Col xl={17}>
                  {modal?.data?.created_by ? modal?.data?.created_by : ''}
                </Col>
              </Col>
              <Col xs={24} md={24} xl={24} className="dFlex">
                <Col xl={7}>Email: </Col>
                <Col xl={17}>
                  {modal?.data?.author_email ? modal?.data?.author_email : ''}
                </Col>
              </Col>

              <Col xs={24} md={24} xl={24} className="dFlex">
                <Col xl={7}>Other Email: </Col>
                <Col xl={17}>
                  {modal?.data?.author_other_email
                    ? modal?.data?.author_other_email
                    : ''}
                </Col>
              </Col>
              <Col xs={24} md={24} xl={24} className="dFlex">
                <Col xl={7}>Phone: </Col>
                <Col xl={17}>
                  {modal?.data?.author_phone ? modal?.data?.author_phone : ''}
                </Col>
              </Col>
            </Col>
            <Col
              xs={12}
              md={12}
              xl={12}
              style={{
                borderLeft: '1px solid rgb(224, 224, 224)',
                paddingLeft: '10px',
              }}
            >
              <Col xs={24} md={24} xl={24} className="dFlex">
                <Col xl={8}>To department: </Col>
                <Col xl={16}>
                  <strong>
                    {Array.isArray(modal?.data?.published_to)
                      ? modal?.data?.published_to[0].division_name
                      : 'ALL'}
                  </strong>
                </Col>
              </Col>
              <Col xs={24} md={24} xl={24} className="dFlex">
                <Col xl={8}>Published date: </Col>
                <Col xl={18}>
                  <p>{dateTime.formatDateTable(modal?.data?.published_date)}</p>
                </Col>
              </Col>
            </Col>
          </Col>
        </Row>
        <Row>
          <Col
            xs={24}
            md={24}
            xl={24}
            className="dFlex"
            style={{ marginTop: '15px' }}
          >
            <Col xl={3}>Subject: </Col>
            <Col xl={21}>
              <span style={{ fontWeight: 600 }}>{modal?.data?.subject}</span>
            </Col>
          </Col>
          <Col xs={24} md={24} xl={24} className="dFlex">
            <Col xl={3}>Message: </Col>
            <Col xl={21}>
              <span style={{ fontWeight: 500 }}> {modal?.data?.message}</span>
            </Col>
          </Col>
          <Col xs={24} md={24} xl={24} className="dFlex" style={{ margin: 0 }}>
            <Col xl={3}>Attachment: </Col>
            <Col xl={21}>
              <p>
                <span
                  className="colorBlue"
                  onClick={() => {
                    saveAs(
                      `${modal.data.attachment}`,
                      `${modal.data.attachment}`,
                    )
                  }}
                  style={{ fontWeight: 600 }}
                >
                  {modal?.data?.attachment &&
                    shortenLink(modal?.data?.attachment)}
                </span>
                <DownloadOutlined
                  style={{ display: 'inline', marginLeft: '10px' }}
                />
              </p>
            </Col>
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

export default Index
