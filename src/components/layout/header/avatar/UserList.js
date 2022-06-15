import React from 'react'
import styles from './Index.module.scss'
import Cat from './crazyCat.jpg'
import ChangePassword from '../../../page/changePassword/ChangePassword'
import Logout from '../../../page/logout/Logout'
import UserEditForm from '../../../page/editProfileModal/UserEditForm'
import { LOCAL_STORAGE } from '../../../constant/localStorage'

const UserList = () => {
  const { name } = JSON.parse(localStorage.getItem(LOCAL_STORAGE.INF_USER))
  return (
    <div className={styles.UserList}>
      <div className={styles.UserHeader}>
        <div className={styles.UserHeader__Image}>
          <img src={Cat} alt="CrazyCat" />
        </div>
        <h3>{name}</h3>
      </div>
      <div className={styles.UserBody}>
        <div className={styles.UserGroup}>
          <i className="fa-solid fa-hammer"></i>
          <UserEditForm />
        </div>
        <div className={styles.UserGroup}>
          <i className="fa-solid fa-key"></i>
          <ChangePassword />
        </div>
        <div className={styles.UserGroup}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <Logout />
        </div>
      </div>
    </div>
  )
}

export default UserList
