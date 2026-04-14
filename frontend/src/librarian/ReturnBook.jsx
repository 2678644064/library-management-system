import { useState, useEffect } from 'react'
import axios from 'axios'

function ReturnBook({ onBack }) {
  const [borrowRecords, setBorrowRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [returningId, setReturningId] = useState(null)

  // 获取借阅记录
  const fetchRecords = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/loans')
      setBorrowRecords(res.data)
    } catch (error) {
      alert('获取借阅记录失败')
    } finally {
      setLoading(false)
    }
  }

  // 归还图书
  const handleReturn = async (loanId) => {
    if (!window.confirm('确定归还该图书？')) return
    setReturningId(loanId)

    try {
      await axios.post(`http://localhost:3000/api/loans/return/${loanId}`)
      alert('归还成功！')
      fetchRecords()
    } catch (err) {
      const msg = err.response?.data?.message || '归还失败'
      alert(msg)
    } finally {
      setReturningId(null)
    }
  }

  // 格式化时间
  const formatTime = (t) => {
    if (!t) return '未知'
    return new Date(t).toLocaleString('zh-CN')
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>图书归还管理</h2>
        <button onClick={onBack}>返回仪表盘</button>
      </div>

      {loading ? (
        <div>加载中...</div>
      ) : (
        <div>
          {borrowRecords.length === 0 ? (
            <div>暂无借阅记录</div>
          ) : (
            borrowRecords.map((item) => (
              <div key={item.id} style={{
                border: '1px solid #ccc',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '5px'
              }}>
                <div>
                  <h4>{item.book?.title || '未知书名'}</h4>
                  <p>作者：{item.book?.author || '未知'}</p>
                  <p>借阅人：{item.user?.name || '未知用户'}</p>
                  <p>借阅时间：{formatTime(item.borrowedAt)}</p>
                  <p style={{
                    color: item.status === 'BORROWED' ? 'red' : 'green',
                    fontWeight: 'bold'
                  }}>
                    状态：{item.status === 'BORROWED' ? '借阅中' : '已归还'}
                  </p>
                </div>

                {item.status === 'BORROWED' && (
                  <button
                    onClick={() => handleReturn(item.id)}
                    disabled={returningId === item.id}
                    style={{ marginTop: '10px' }}
                  >
                    {returningId === item.id ? '归还中...' : '归还图书'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ReturnBook