import { typePopup } from '../index'

export const handleTryCatch = async (value, message, closeModal) => {
  try {
    const data = await value
    if (data.payload.status) {
      typePopup.popupNotice(typePopup.SUCCESS_MESSAGE, 'Message', message, 1)
      closeModal()
    }
  } catch (error) {
    typePopup.popupNotice(
      typePopup.ERROR_MESSAGE,
      'Message',
      'An error occurred',
      1,
    )
  }
}
