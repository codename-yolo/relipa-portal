import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import './Table.scss'
import PropTypes from 'prop-types'

const CommonTable = ({
  data,
  remove,
  columns,
  page,
  pagination,
  sorter,
  scroll,
  styleHead,
  styleBody,
  className,
  title,
}) => {
  const [dataSource, setDataSource] = useState(null)
  const [columnS, setColumnS] = useState(null)
  // console.log('data', data, columns)
  useEffect(() => {
    const DATAVALID = data
    const REMOVEKEY = remove
    let COLUMNS = DATAVALID[0] ? Object.keys(DATAVALID[0]) : []

    if (columns !== undefined) {
      COLUMNS = columns.map((item) => {
        return item.key
      })
      if (REMOVEKEY && REMOVEKEY.length > 0) {
        COLUMNS = COLUMNS.filter((item) => {
          return !REMOVEKEY.includes(item)
        })
      }

      COLUMNS = columns.filter((item) => {
        return COLUMNS.includes(item.key)
      })
    }

    if (REMOVEKEY && REMOVEKEY.length > 0 && columns === undefined) {
      COLUMNS = COLUMNS.filter((item) => {
        return !REMOVEKEY.includes(item)
      })
      COLUMNS = COLUMNS.map((item) => {
        return {
          title: item.toUpperCase(),
          key: item,
          dataIndex: item,
        }
      })
    }

    if (sorter) {
      COLUMNS = COLUMNS.map((item) => {
        if (sorter[item.key] !== undefined) {
          switch (sorter[item.key]) {
            case 'string':
              item.sorter = (a, b) => {
                console.log(a.subject)
                return a[item.key].localeCompare(b[item.key])
              }
              break
            case 'number':
              item.sorter = (a, b) => {
                return Number(a[item.key]) - Number(b[item.key])
              }
              break
            case 'date':
              item.sorter = (a, b) => {
                const prevDate = new Date(a[item.key])
                const NowDate = new Date(b[item.key])
                return prevDate.getTime() - NowDate.getTime()
              }
              break
            default:
              throw new Error('Invalid Sorter!')
          }
        }
        return item
      })
    }

    if (styleHead) {
      COLUMNS.map((item) => {
        if (styleHead[item.key]) {
          const position = styleHead[item.key].position
            ? styleHead[item.key].position
            : ''
          const className = styleHead[item.key].className
            ? styleHead[item.key].className
            : ''
          item.title = (
            <div className={`${position} ${className}`}>{item.title}</div>
          )
        }
        return item
      })
    }

    if (styleBody) {
      COLUMNS.map((item) => {
        if (styleBody[item.key]) {
          item.render = (payload) => {
            const position = styleBody[item.key].position
              ? styleBody[item.key].position
              : ''
            const className = styleBody[item.key].className
              ? styleBody[item.key].className
              : ''
            return <div className={`${position} ${className}`}>{payload}</div>
          }
        }
        return item
      })
    }

    setColumnS(COLUMNS)
    setDataSource(() => {
      return DATAVALID.map((item, index) => {
        return { ...item, key: index }
      })
    })
  }, [data, columns, remove, sorter, styleHead, styleBody])

  if ((data || []).length === 0 && columns.length === 0) {
    return null
  }
  return (
    <>
      <Table
        title={
          title
            ? title
            : () => {
                return null
              }
        }
        className={className ? className : ''}
        pagination={
          pagination
            ? {
                ...pagination,
                position: ['bottomCenter'],
                showTotal: pagination?.showTotal
                  ? pagination?.showTotal
                  : (total) => `Total Number of ${total} records`,
              }
            : {
                pageSize: page ? page : 10,
                position: ['bottomCenter'],
                showTotal: pagination?.showTotal
                  ? pagination?.showTotal
                  : (total) => `Total Number of ${total} records`,
              }
        }
        columns={columnS}
        dataSource={dataSource}
        scroll={
          scroll
            ? scroll
            : {
                x: 1000,
                y: 200,
              }
        }
      />
    </>
  )
}

CommonTable.propTypes = {
  data: PropTypes.array,
  remove: PropTypes.array,
  columns: PropTypes.array,
  page: PropTypes.number,
  pagination: PropTypes.object,
  sorter: PropTypes.object,
  scroll: PropTypes.object,
  styleHead: PropTypes.object,
  styleBody: PropTypes.object,
  className: PropTypes.string,
  title: PropTypes.func,
}
export default CommonTable
