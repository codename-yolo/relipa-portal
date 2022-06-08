import React from 'react'
import { Form, Input, Button } from 'antd'
import 'antd/dist/antd.min.css'
import { useDispatch } from 'react-redux'
import styles from './Login.module.scss'
import { typePopup } from '../../index'
import { LOCAL_STORAGE } from '../../constant/localStorage'
import { useNavigate } from 'react-router-dom'
import { loginAccess } from './Slice/sliceLogin'
import { login } from '../../service/auth-service'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onSubmit = async (values) => {
    try {
      const res = await login(values)
      dispatch(
        loginAccess({
          role: res.data.role,
          tokenAccess: res.access_token,
        }),
      )
      await localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, res.access_token)
      await localStorage.setItem(LOCAL_STORAGE.ROLE, res.data.role)
      typePopup.popupNotice(
        typePopup.SUCCESS_MESSAGE,
        'Success',
        'Login Successful',
      )
      navigate('/', { replace: true })
    } catch (e) {
      typePopup.popupNotice(typePopup.ERROR_MESSAGE, 'Failed', 'Login Failed')
    }
  }

  return (
    <>
      <div className={styles.LoginContainer}>
        <Form
          name="basic"
          initialValues={{}}
          onFinish={(values) => onSubmit(values)}
          autoComplete="off"
        >
          <h2 style={{ textAlign: 'center' }}>Login to your account</h2>
          <label className={styles.Label}>Email: </label>
          <Form.Item
            name="email"
            className={styles.InputField}
            labelAlign="left"
            rules={[
              {
                required: true,
                message: 'Required to enter email!',
              },
              {
                type: 'email',
                message: 'Enter a valid email address!',
              },
            ]}
          >
            <Input className={styles.Input} placeholder="Email" />
          </Form.Item>

          <label className={styles.Label}>Password : </label>
          <Form.Item
            name="password"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: 'Required to enter password!!',
              },
            ]}
          >
            <Input.Password className={styles.Input} placeholder="Password" />
          </Form.Item>

          <Form.Item className={styles.ItemSignin}>
            <Button className={styles.Button} type="primary" htmlType="submit">
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default Login