import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyGroups, createGroup, joinGroup } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Groups() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [newGroupName, setNewGroupName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchGroups()
  }, [])

  async function fetchGroups() {
    setLoading(true)
    const data = await getMyGroups()
    setGroups(data)
    setLoading(false)
  }

  async function handleCreateGroup(e) {
    e.preventDefault()
    if (!newGroupName.trim()) return
    const id = toast.loading('Grup oluşturuluyor...')
    const { group, error } = await createGroup(newGroupName)
    
    if (error) {
      toast.error('Hata oluştu: ' + error.message, { id })
    } else {
      toast.success('Grup oluşturuldu!', { id })
      setNewGroupName('')
      fetchGroups()
    }
  }

  async function handleJoinGroup(e) {
    e.preventDefault()
    if (!inviteCode.trim()) return
    const id = toast.loading('Gruba katılınıyor...')
    const { success, error, groupId } = await joinGroup(inviteCode.trim())
    
    if (error) {
      toast.error(error, { id })
    } else {
      toast.success('Gruba başarıyla katıldınız!', { id })
      setInviteCode('')
      fetchGroups()
      navigate(`/groups/${groupId}`)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '80px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2>🤝 Çalışma Gruplarım</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        {/* Create Group */}
        <div className="card animate-fade-up">
          <h3>Yeni Grup Oluştur</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>Arkadaşlarınızla ortak bir çalışma alanı yaratın.</p>
          <form onSubmit={handleCreateGroup} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              className="input-base" 
              placeholder="Örn: Vize Kampı" 
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">Oluştur</button>
          </form>
        </div>

        {/* Join Group */}
        <div className="card animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h3>Gruba Katıl</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>Davet kodunu girerek mevcut bir gruba katılın.</p>
          <form onSubmit={handleJoinGroup} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              className="input-base" 
              placeholder="Davet kodu" 
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-secondary">Katıl</button>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="spinner" style={{ margin: '40px auto' }}></div>
      ) : groups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', opacity: 0.5, border: '1px dashed var(--border)', borderRadius: '16px' }}>
          <h3>Henüz bir grubunuz yok</h3>
          <p>Yeni bir grup oluşturun veya bir davet koduyla katılın.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {groups.map((g, i) => (
            <div 
              key={g.id} 
              className="card animate-fade-up"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '20px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                border: '1px solid transparent'
              }}
              onClick={() => navigate(`/groups/${g.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.border = '1px solid var(--accent-cyan)'}
              onMouseLeave={(e) => e.currentTarget.style.border = '1px solid transparent'}
            >
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>{g.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Katılım: {new Date(g.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                  Kod: <strong style={{ color: 'var(--accent-cyan)' }}>{g.invite_code}</strong>
                </div>
                <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
