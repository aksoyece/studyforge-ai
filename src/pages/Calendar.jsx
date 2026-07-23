import { useState, useEffect } from 'react'

import { getQuizResults } from '../lib/supabase'

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
const DEFAULT_HOURS = [
  '09:00 - 10:00', 
  '11:00 - 12:00', 
  '13:00 - 14:00', 
  '15:00 - 16:00', 
  '17:00 - 18:00', 
  '19:00 - 20:00', 
  '21:00 - 22:00',
  '23:00 - 00.00'
]

export default function Calendar() {
  const [calendarData, setCalendarData] = useState(() => {
    try {
      const saved = localStorage.getItem('studyforge_calendar')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Migrate old tasks to have a timeSlot if they don't
        Object.keys(parsed).forEach(day => {
          parsed[day].forEach((t, i) => {
            if (!t.timeSlot) t.timeSlot = DEFAULT_HOURS[Math.min(i, DEFAULT_HOURS.length - 1)]
          })
        })
        return parsed
      }
    } catch(e) {}
    // Initial empty week
    return {
      'Pazartesi': [],
      'Salı': [],
      'Çarşamba': [],
      'Perşembe': [],
      'Cuma': [],
      'Cumartesi': [],
      'Pazar': []
    }
  })

  const [timeSlots, setTimeSlots] = useState(() => {
    try {
      const saved = localStorage.getItem('studyforge_timeslots')
      if (saved) return JSON.parse(saved)
    } catch(e) {}
    return DEFAULT_HOURS
  })

  useEffect(() => {
    localStorage.setItem('studyforge_timeslots', JSON.stringify(timeSlots))
  }, [timeSlots])

  const [newTimeSlotName, setNewTimeSlotName] = useState('')
  const [newTimeSlotTime, setNewTimeSlotTime] = useState('')

  const handleAddTimeSlot = (e) => {
    e.preventDefault()
    if (!newTimeSlotTime.trim()) return
    
    let finalSlotText = newTimeSlotTime.trim()
    if (newTimeSlotName.trim()) {
      finalSlotText = `${newTimeSlotName.trim()} (${finalSlotText})`
    }

    if (!timeSlots.includes(finalSlotText)) {
      setTimeSlots(prev => [...prev, finalSlotText])
    }
    setNewTimeSlotName('')
    setNewTimeSlotTime('')
  }

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [availableTasks, setAvailableTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('studyforge_tasks')
      if (saved) return JSON.parse(saved)
    } catch(e) {}
    return [
      { id: 't1', title: '1 Saat Matematik', type: 'general', color: 'var(--accent-indigo)' },
      { id: 't2', title: 'Fizik Testi Çöz', type: 'general', color: 'var(--accent-cyan)' },
      { id: 't3', title: 'Tarih Özet Oku', type: 'general', color: 'var(--accent-rose)' },
      { id: 't4', title: 'Kodlama Pratiği', type: 'general', color: 'var(--accent-mint)' }
    ]
  })

  // Save custom tasks
  useEffect(() => {
    localStorage.setItem('studyforge_tasks', JSON.stringify(availableTasks.filter(t => !t.isAi)))
  }, [availableTasks])

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    const newTask = {
      id: 'custom_' + Date.now(),
      title: newTaskTitle.trim(),
      type: 'custom',
      color: 'var(--accent-cyan)'
    }
    setAvailableTasks(prev => [newTask, ...prev])
    setNewTaskTitle('')
  }

  // Load AI recommendations from quiz history
  useEffect(() => {
    async function loadAIRecommendations() {
      try {
        const history = await getQuizResults()
        if (history && history.length > 0) {
          const wrongTopics = new Set()
          history.forEach(session => {
            if (session.wrong_questions && session.wrong_questions.length > 0) {
              session.wrong_questions.forEach(wq => {
                // Extract a keyword or just use the question
                const topic = wq.question.substring(0, 30) + '...'
                wrongTopics.add(topic)
              })
            }
          })

          if (wrongTopics.size > 0) {
            const aiTasks = Array.from(wrongTopics).map((topic, index) => ({
              id: `ai_${index}`,
              title: `Tekrar: ${topic}`,
              type: 'ai-recommendation',
              color: '#f59e0b', // Amber for AI
              isAi: true
            }))
            
            setAvailableTasks(prev => {
              const existingIds = new Set(prev.map(p => p.id))
              const newTasks = aiTasks.filter(t => !existingIds.has(t.id))
              return [...newTasks, ...prev]
            })
          }
        }
      } catch(e) {
        console.error('AI Task generation error:', e)
      }
    }
    loadAIRecommendations()
  }, [])

  // Save calendar changes
  useEffect(() => {
    localStorage.setItem('studyforge_calendar', JSON.stringify(calendarData))
  }, [calendarData])

  const handleDragStart = (e, task, sourceDay, sourceHour) => {
    e.dataTransfer.setData('task', JSON.stringify(task))
    e.dataTransfer.setData('sourceDay', sourceDay || 'sidebar')
    if (sourceHour) e.dataTransfer.setData('sourceHour', sourceHour)
  }

  const handleDrop = (e, targetDay, targetHour) => {
    e.preventDefault()
    const taskData = e.dataTransfer.getData('task')
    const sourceDay = e.dataTransfer.getData('sourceDay')
    const sourceHour = e.dataTransfer.getData('sourceHour')
    if (!taskData) return
    
    const task = JSON.parse(taskData)

    if (sourceDay === targetDay && sourceHour === targetHour) return // Dropped in the same place

    setCalendarData(prev => {
      const newData = { ...prev }

      // If moving from a day, remove it from the source day
      if (sourceDay !== 'sidebar') {
        newData[sourceDay] = newData[sourceDay].filter(t => t.id !== task.id)
      }

      // Avoid duplicates in the same day (unless it's overwriting the timeSlot)
      if (targetDay !== 'sidebar') {
        // Remove existing task in that specific timeslot if any
        newData[targetDay] = newData[targetDay].filter(t => t.timeSlot !== targetHour)
        // Ensure the task doesn't exist elsewhere in the same day
        newData[targetDay] = newData[targetDay].filter(t => t.id !== task.id)
        
        newData[targetDay] = [...newData[targetDay], { ...task, timeSlot: targetHour }]
      }

      return newData
    })

    // If removing from a day and dropping to sidebar
    if (targetDay === 'sidebar' && sourceDay !== 'sidebar') {
      setCalendarData(prev => {
        const newData = { ...prev }
        newData[sourceDay] = newData[sourceDay].filter(t => t.id !== task.id)
        return newData
      })
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault() // Necessary to allow drop
  }

  return (
    <div className="page" style={{ padding: '120px 20px 80px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
          Sürükle-Bırak <span style={{ background: 'var(--gradient-cyan)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Çalışma Takvimi</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Derslerini planla. Yapay zeka zayıf olduğun konulardan otomatik tekrarlar önerir.</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Sidebar: Available Tasks */}
        <div 
          className="glass-panel animate-fade-right" 
          style={{ width: '300px', padding: '24px', flexShrink: 0, minHeight: '600px' }}
          onDrop={(e) => handleDrop(e, 'sidebar')}
          onDragOver={handleDragOver}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📋</span> Görev Havuzu
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Görevleri tutup sağdaki günlere sürükleyin. Sileceğiniz görevleri buraya geri bırakın.
          </p>

          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input 
              type="text" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Yeni görev ekle..." 
              className="form-input" 
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', marginBottom: 0 }} 
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 12px' }}>Ekle</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {availableTasks.map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task, 'sidebar')}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${task.isAi ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'grab',
                  boxShadow: task.isAi ? '0 0 10px rgba(245, 158, 11, 0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'transform 0.2s'
                }}
                onDragEnd={(e) => e.target.style.transform = 'scale(1)'}
                onDrag={(e) => e.target.style.transform = 'scale(1.02)'}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: task.color }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: task.isAi ? '#fbbf24' : '#fff' }}>
                    {task.title}
                  </div>
                  {task.isAi && <div style={{ fontSize: '0.7rem', color: '#f59e0b', marginTop: '2px' }}>✨ AI Önerisi</div>}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'grab' }}>⋮⋮</div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🕒</span> Özel Saat Ekle
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Gece vardiyası veya esnek çalışma saatleri için takvime yeni saat dilimleri (Örn: 03:00 - 04:00) ekleyebilirsiniz.
            </p>
            <form onSubmit={handleAddTimeSlot} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="text" 
                value={newTimeSlotName}
                onChange={(e) => setNewTimeSlotName(e.target.value)}
                placeholder="İsim (Örn: Gece Mesaisi)" 
                className="form-input" 
                style={{ padding: '8px 12px', fontSize: '0.85rem', marginBottom: 0 }} 
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={newTimeSlotTime}
                  onChange={(e) => setNewTimeSlotTime(e.target.value)}
                  placeholder="Saat (Örn: 03:00 - 04:00)" 
                  className="form-input" 
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', marginBottom: 0 }} 
                />
                <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '8px 12px' }}>Ekle</button>
              </div>
            </form>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="animate-fade-up" style={{ flex: 1, width: '100%', overflowX: 'auto', paddingBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', minWidth: '850px' }}>
            {DAYS.map(day => (
              <div 
                key={day}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{day}</h4>
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {timeSlots.map(hour => {
                  const taskInSlot = calendarData[day].find(t => t.timeSlot === hour)
                  
                  return (
                    <div 
                      key={`${day}-${hour}`}
                      onDrop={(e) => handleDrop(e, day, hour)}
                      onDragOver={handleDragOver}
                      style={{
                        height: '110px',
                        borderBottom: '1px solid rgba(255,255,255,0.02)',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{hour}</div>
                      
                      {taskInSlot && (
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, taskInSlot, day, hour)}
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderLeft: `3px solid ${taskInSlot.color}`,
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'grab',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            wordBreak: 'break-word',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            flex: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <span style={{ color: taskInSlot.isAi ? '#fbbf24' : '#fff' }}>{taskInSlot.title}</span>
                          {taskInSlot.isAi && <span style={{ fontSize: '0.65rem', color: '#f59e0b' }}>✨ Zayıf Konu</span>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          </div>
        </div>

      </div>
    </div>
  )
}
