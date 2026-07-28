import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function GroupDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGroupDetails()
  }, [id])

  async function fetchGroupDetails() {
    setLoading(true)
    
    // 1. Grup Bilgisi
    const { data: gData, error: gErr } = await supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .single()
      
    if (gErr) {
      toast.error('Grup bulunamadı.')
      navigate('/groups')
      return
    }
    setGroup(gData)

    // 2. Üyeler (kullanıcı emaillerini auth.users'dan alamıyoruz çünkü RLS var, ama genelde basit projelerde auth schema sorgulanamaz.
    // O yüzden profiller tablonuz varsa oradan alınır, yoksa sadece "X Üye" diyelim veya group_members tablosundan ID'leri çekelim)
    // Şimdilik sadece user_id'leri listeleyeceğiz (Eğer users tablosuna join izni yoksa).
    const { data: mData } = await supabase
      .from('group_members')
      .select('user_id, joined_at')
      .eq('group_id', id)
    
    setMembers(mData || [])

    // 3. Paylaşılan İçerikler Feed'i
    const { data: fData } = await supabase
      .from('shared_content')
      .select('*')
      .eq('group_id', id)
      .order('shared_at', { ascending: false })

    setFeed(fData || [])
    
    setLoading(false)
  }

  if (loading) {
    return <div className="spinner" style={{ margin: '100px auto' }}></div>
  }

  return (
    <div className="container" style={{ paddingTop: '80px', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/groups')}>← Geri</button>
        <h2 style={{ margin: 0 }}>{group.name}</h2>
        <div style={{ background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>
          Davet Kodu: <strong style={{ color: 'var(--accent-cyan)' }}>{group.invite_code}</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Sol Kolon: Üyeler */}
        <div className="card">
          <h3>Grup Üyeleri ({members.length})</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {members.map(m => (
              <li key={m.user_id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  👤
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {m.user_id === user.id ? 'Siz' : 'Grup Üyesi'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Katılım: {new Date(m.joined_at).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Sağ Kolon: Paylaşılanlar */}
        <div className="card">
          <h3>Paylaşılan İçerikler</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Gruba gönderilen quiz ve çalışma kağıtları.
          </p>
          
          {feed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5, border: '1px dashed var(--border)', borderRadius: '12px' }}>
              Henüz kimse bir şey paylaşmamış.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {feed.map((item, i) => (
                <div 
                  key={item.id}
                  className="animate-fade-up"
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    padding: '20px', 
                    background: 'var(--bg-secondary)', 
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', background: 'var(--accent-indigo)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                        {item.content_type.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {new Date(item.shared_at).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{item.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Paylaşan: {item.shared_by === user.id ? 'Siz' : 'Grup Üyesi'}
                    </span>
                  </div>
                  
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/quiz?shared=${item.content_id}`)}
                  >
                    Çöz / İncele
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
