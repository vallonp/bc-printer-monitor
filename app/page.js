'use client'
import { useState, useEffect } from 'react'

const CLOUD_RUN_URL = process.env.CLOUD_RUN_URL || 'https://bc-printer-monitor-991694103609.us-central1.run.app'

export default function Home() {
  const [printers, setPrinters] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const loadPrinters = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${CLOUD_RUN_URL}/api/printers`)
      const data = await response.json()
      
      if (data.success) {
        setPrinters(data.data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Error loading printers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrinters()
    const interval = setInterval(loadPrinters, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const onlineCount = printers.filter(p => p.status === 'online').length
  const totalCount = printers.length

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏛️ Boston College Printer Status</h1>
        <p style={styles.subtitle}>Real-time monitoring of BC library printers</p>
        
        <div style={styles.stats}>
          <button onClick={loadPrinters} style={styles.button}>
            🔄 Refresh
          </button>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>{onlineCount}/{totalCount}</span>
            <span style={styles.statLabel}>Printers Online</span>
          </div>
          {lastUpdated && (
            <div style={styles.lastUpdated}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading printer data...</div>
      ) : (
        <div style={styles.printersGrid}>
          {printers.map((printer, index) => (
            <div key={index} style={{
              ...styles.printerCard,
              borderLeftColor: printer.status === 'online' ? '#28a745' : '#dc3545'
            }}>
              <h3 style={styles.printerName}>{printer.name}</h3>
              <div style={styles.printerInfo}>
                <strong>IP:</strong> {printer.ip} | 
                <strong> Status:</strong> 
                <span style={{
                  color: printer.status === 'online' ? '#28a745' : '#dc3545',
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {printer.status.toUpperCase()}
                </span>
              </div>
              
              {printer.toners && printer.toners.map((toner, tonerIndex) => (
                <div key={tonerIndex} style={styles.tonerContainer}>
                  <div style={styles.tonerLabel}>
                    {toner.color} Toner: {toner.level}%
                  </div>
                  <div style={styles.tonerBar}>
                    <div 
                      style={{
                        ...styles.tonerFill,
                        width: `${toner.level}%`,
                        backgroundColor: toner.level > 20 ? '#9b1b30' : '#dc3545'
                      }}
                    />
                  </div>
                </div>
              ))}
              
              {printer.error && (
                <div style={styles.error}>
                  <strong>Note:</strong> {printer.error}
                </div>
              )}
              
              <div style={styles.timestamp}>
                Updated: {new Date(printer.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: '20px',
    background: 'linear-gradient(135deg, #9b1b30 0%, #7a1525 100%)',
    minHeight: '100vh',
    color: 'white'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
    marginBottom: '20px'
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  button: {
    background: 'white',
    color: '#9b1b30',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  statBox: {
    textAlign: 'center',
    background: 'rgba(255,255,255,0.1)',
    padding: '15px',
    borderRadius: '8px'
  },
  statNumber: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  statLabel: {
    fontSize: '0.9rem',
    opacity: 0.8
  },
  lastUpdated: {
    fontSize: '0.9rem',
    opacity: 0.7
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    padding: '40px'
  },
  printersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  printerCard: {
    background: 'white',
    color: '#333',
    padding: '20px',
    borderRadius: '8px',
    borderLeft: '5px solid #9b1b30',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  printerName: {
    margin: '0 0 10px 0',
    fontSize: '1.2rem',
    color: '#9b1b30'
  },
  printerInfo: {
    marginBottom: '15px',
    fontSize: '0.9rem'
  },
  tonerContainer: {
    marginBottom: '10px'
  },
  tonerLabel: {
    fontSize: '0.9rem',
    marginBottom: '5px'
  },
  tonerBar: {
    background: '#e9ecef',
    borderRadius: '5px',
    height: '20px',
    overflow: 'hidden'
  },
  tonerFill: {
    height: '100%',
    borderRadius: '5px',
    transition: 'width 0.3s ease',
    textAlign: 'center',
    color: 'white',
    lineHeight: '20px',
    fontSize: '0.8rem'
  },
  error: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    marginTop: '10px'
  },
  timestamp: {
    fontSize: '0.7rem',
    color: '#666',
    marginTop: '10px',
    textAlign: 'right'
  }
}
