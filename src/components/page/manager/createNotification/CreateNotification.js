import { UnorderedListOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
} from 'antd'
import React, { useState } from 'react'
import styles from './CreateNotification.scss'
import { dateTime, typePopup } from '../../../index'
import moment from 'moment'
import { post } from '../../../service/requestApi'
import TextArea from 'antd/lib/input/TextArea'
import PropTypes from 'prop-types'
import { saveAs } from 'file-saver'

const CreateNotification = ({ data, handleModal }) => {
  const [form] = Form.useForm()
  const [selectDivision, setDivision] = useState(true)

  const onSubmit = async (values) => {
    const { subject, message, published_to: publishedTo, date, status } = values
    const selectedFile = document.getElementById('myfile').files[0]

    const dataSent = {
      published_date: dateTime.formatDate(moment(date)),
      subject,
      message,
      status,
      attachment: selectedFile,
      created_by: 1,
      published_to: publishedTo.includes('all')
        ? JSON.stringify(['all'])
        : JSON.stringify(publishedTo),
    }

    try {
      const res = await post('/admin/notifications/store', dataSent, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.status === true) {
        typePopup.popupNotice(
          typePopup.SUCCESS_MESSAGE,
          'Success',
          'Create success message',
        )
        form.resetFields()
        handleModal()
      } else return false
    } catch (e) {
      typePopup.popupNotice(
        typePopup.ERROR_MESSAGE,
        'Reject',
        'Generate failure message',
      )
    }
  }

  const onReset = () => {
    form.resetFields()
  }

  let setPublishedTo = []
  if (typeof data?.published_to === 'string') {
    setPublishedTo = ['all']
  } else if (data?.published_to) {
    data?.published_to.map((item) => {
      setPublishedTo.push(item.id)
    })
  } else {
    setPublishedTo = []
  }

  const file = (payload) => {
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
      const indexName = payload.lastIndexOf('/')
      nameFile = payload.slice(indexName + 1, payload.length)
    }
    return (
      <Row>
        <Col xs={4} md={4} xl={4}>
          <p>File</p>
        </Col>
        <Col>
          <p
            className="textOverFlow colorBlue resetMargin"
            style={{ cursor: 'pointer', color: 'blue' }}
            onClick={redirect}
          >
            {nameFile}
          </p>
        </Col>
      </Row>
    )
  }

  return (
    <>
      <div className="notificationContainer">
        <Form
          form={form}
          name="basic"
          initialValues={{
            published_to: setPublishedTo.length > 0 ? setPublishedTo : ['all'],
            subject: data?.subject,
            date: moment(data?.published_date),
            status: moment(data?.published_date).isAfter(moment())
              ? 'Pending'
              : 'Official',
            message: data?.message,
          }}
          onFinish={(values) => onSubmit(values)}
          autoComplete="off"
        >
          <Form.Item
            name="subject"
            className={styles.InputField}
            rules={[
              {
                required: true,
                message: 'Required to subject',
              },
              {
                max: 50,
                message: 'Subject cannot be longer than 50 characters',
              },
            ]}
          >
            <Input
              prefix={<UnorderedListOutlined />}
              placeholder="Subject"
              disabled={data}
            />
          </Form.Item>

          <Row>
            <Col sm={12} xl={12}>
              <p>Date</p>
              <Form.Item
                name="date"
                rules={[
                  {
                    required: true,
                    message: 'Required to date',
                  },
                ]}
              >
                <DatePicker disabled={data} />
              </Form.Item>
            </Col>
            {data && (
              <Col sm={12} xl={12} className="status">
                <p>Status</p>
                <Form.Item
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: 'Required to status',
                    },
                  ]}
                >
                  <Select disabled={data}>
                    <Select.Option value={0}>Pending</Select.Option>
                    <Select.Option value={1}>Official</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>

          {data ? (
            file(data.attachment)
          ) : (
            <Form.Item name="file" rules={[]}>
              <Input type="file" id="myfile" name="myfile" />
            </Form.Item>
          )}

          <label>Published To : </label>
          <Form.Item name="published_to">
            <Checkbox.Group>
              <Row className="divisionName">
                <Col span={8}>
                  <Checkbox
                    value={1}
                    style={{
                      lineHeight: '32px',
                    }}
                    disabled={selectDivision && true}
                  >
                    D1
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    value={2}
                    style={{
                      lineHeight: '32px',
                    }}
                    disabled={selectDivision && true}
                  >
                    D2
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    value={3}
                    style={{
                      lineHeight: '32px',
                    }}
                    disabled={selectDivision && true}
                  >
                    D3
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    value={4}
                    style={{
                      lineHeight: '32px',
                    }}
                    disabled={selectDivision && true}
                  >
                    D4
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    value={5}
                    style={{
                      lineHeight: '32px',
                    }}
                    disabled={selectDivision && true}
                  >
                    D5
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    value={6}
                    style={{
                      lineHeight: '32px',
                    }}
                    disabled={selectDivision && true}
                  >
                    D6
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    value="all"
                    style={{
                      lineHeight: '32px',
                    }}
                    onChange={() => setDivision((prev) => !prev)}
                    disabled={data}
                  >
                    All
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="message"
            className={styles.InputField}
            rules={[
              {
                required: true,
                message: 'Required to message',
              },
              {
                max: 100,
                message: 'Message cannot be longer than 100 characters',
              },
            ]}
          >
            <TextArea
              placeholder="Message"
              autoSize={{ minRows: 5, maxRows: 5 }}
              disabled={data}
            />
          </Form.Item>

          {!data && (
            <Form.Item className="ItemSignin">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </>
  )
}

CreateNotification.propTypes = {
  data: PropTypes.object,
  handleModal: PropTypes.func,
}

export default CreateNotification
