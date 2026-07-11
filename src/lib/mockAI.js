// Smart Mock AI responses categorized by PDF file name keywords

// Helper to detect category based on file name or object
function detectCategory(fileParam = '') {
  let name = '';
  if (typeof fileParam === 'string') {
    name = fileParam;
  } else if (fileParam && typeof fileParam === 'object' && fileParam.name) {
    name = fileParam.name;
  }

  name = name.toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o');

  // 1. Database Check (Prioritize specific db words)
  if (name.includes('sql') || name.includes('db') || name.includes('database') || name.includes('veritaban') || name.includes('veritabani')) {
    return 'database';
  }
  
  // 2. Frontend / React Check
  if (name.includes('react') || name.includes('web') || name.includes('frontend') || name.includes('js') || name.includes('html') || name.includes('css') || name.includes('slide1')) {
    return 'frontend';
  }
  
  // 3. History Check
  if (name.includes('tarih') || name.includes('history') || name.includes('inkilap') || name.includes('sosyal')) {
    return 'history';
  }
  
  // 4. Algorithms & Data Structures Check
  if (
    name.includes('algorithm') || 
    name.includes('kod') || 
    name.includes('program') || 
    name.includes('java') || 
    name.includes('python') || 
    name.includes('oop') || 
    name.includes('veri') || 
    name.includes('yapi') ||
    name.includes('structure') ||
    name.includes('tree') ||
    name.includes('graph') ||
    name.includes('sort') ||
    name.includes('stack') ||
    name.includes('queue')
  ) {
    return 'programming';
  }
  
  // 5. Artificial Intelligence Check
  if (name.includes('ai') || name.includes('yapay') || name.includes('intelligence') || name.includes('ml')) {
    return 'ai';
  }
  
  return 'general';
}

export function getMockCVAnalysis(jobTitle) {
  return {
    matchScore: 72,
    summary: `Profiliniz ${jobTitle} rolü için güçlü temel beceriler göstermektedir. Teknik kapasiteniz yüksek ancak hedeflenen iyileştirmeler başvurunuzu daha rekabetçi kılacaktır.`,
    strengths: [
      'Güçlü teknik temel ve ilgili dillerdeki deneyimler',
      'Gerçek hayat projelerine uygun akademik deneyimler',
      'Rolün gereksinimleriyle uyumlu eğitim geçmişi'
    ],
    gaps: [
      'Kurumsal ortamda sınırlı profesyonel iş deneyimi',
      'Sektörde yaygın olarak beklenen bazı sertifikaların eksikliği',
      'Portföyde büyük ölçekli ekip çalışması projelerinin azlığı'
    ],
    missingKeywords: ['Agile/Scrum', 'CI/CD Pipelines', 'Docker', 'REST API Tasarımı', 'TypeScript'],
    suggestions: [
      'Deneyimlerinize ölçülebilir başarılar ekleyin (örn. "yüklenme süresini %40 azalttı")',
      'Teknik kelimeleri ilan açıklamasına göre CV\'ye entegre edin',
      'Projelerinizin yanına çalışan canlı demo linkleri ekleyin'
    ],
    coverLetterOpening: `${jobTitle} pozisyonuna başvurmaktan heyecan duyuyorum. Akademik ve kişisel projelerimle geliştirdiğim temel teknik becerilerimi ekibinize sunarak değer katmak istiyorum.`
  }
}

// Dynamic Mock Datasets
const datasets = {
  frontend: {
    title: 'React & Modern Web Geliştirme',
    summary: `# 📖 React & Modern Web Geliştirme Özeti

## Genel Bakış (Overview)
React, kullanıcı arayüzü oluşturmak için tasarlanmış bileşen tabanlı (component-based) popüler bir JavaScript kütüphanesidir. Modern web projelerinde yüksek performanslı ve modüler yapılar oluşturmayı sağlar. State (durum) ve props (özellikler) kavramları yardımıyla dinamik arayüzler sunar.

## Önemli Başlıklar (Key Concepts)
- **Bileşen Tabanlı Mimari (Component Architecture):** Uygulamanın her arayüz parçasının bağımsız birer yapı taşı olarak kodlanmasıdır.
- **Sanal DOM (Virtual DOM):** React, gerçek DOM yerine sanal kopyada değişiklik yapıp sadece değişen alanları yansıtarak hızı artırır.
- **Hooks (Kancalar):** Fonksiyonel bileşenlerde durum ve yaşam döngüsü özelliklerini yönetmeyi sağlayan useState, useEffect kancalarıdır.

## Özet Çıkarımlar (Key Takeaways)
- Modüler bileşen yapısı sayesinde kod tabanı büyüdükçe bakım ve geliştirme kolaylaşır.
- Sanal DOM tarayıcı render süreçlerini optimize eder.
- Hooks yapısı sayesinde sınıf yapısına ihtiyaç duymadan temiz fonksiyonlarla kod yazılır.`,
    flashcards: [
      { front: 'Virtual DOM nedir?', back: 'React\'in gerçek DOM üzerinde doğrudan işlem yapmak yerine kullandığı bellek içi kopyadır. Sadece değişen parçaları günceller.' },
      { front: 'useState Hook\'u ne işe yarar?', back: 'Fonksiyonel React bileşenlerinde dinamik verileri (state) saklamak ve değiştirmek için kullanılır.' },
      { front: 'useEffect Hook\'u nedir?', back: 'Bileşenlerde veri çekme veya DOM değiştirme gibi yan etkileri (side-effects) yöneten fonksiyondur.' },
      { front: 'React\'te Props ne anlama gelir?', back: 'Üst bileşenden alt bileşene tek yönlü veri transferi yapmak için kullanılan salt okunur özelliklerdir.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'React hooks ne amaçla kullanılır?',
        options: ['A) State ve yaşam döngüsü özelliklerini fonksiyonel bileşenlerde kullanmak', 'B) Sayfayı hızlandırmak', 'C) CSS tasarımlarını entegre etmek', 'D) Sunucu bağlantısı kurmak'],
        correctIndex: 0,
        explanation: 'React hooks, fonksiyonel bileşenlerde state ve diğer sınıf bazlı özellikleri kullanmayı sağlar.'
      },
      {
        id: 2,
        question: 'Hangisi bir side-effect (yan etki) örneğidir?',
        options: ['A) Props ekrana yazdırmak', 'B) API\'den veri çekmek', 'C) Değişken tanımlamak', 'D) Butona stil vermek'],
        correctIndex: 1,
        explanation: 'API çağrıları, abonelikler veya harici veritabanı işlemleri side-effect olarak kabul edilir.'
      },
      {
        id: 3,
        question: 'Props verileri değiştirilebilir mi?',
        options: ['A) Evet, doğrudan', 'B) Sadece alt bileşenlerde', 'C) Hayır, props salt okunurdur (read-only)', 'D) Formüllere göre evet'],
        correctIndex: 2,
        explanation: 'React\'te tek yönlü veri akışı vardır ve props verileri alt bileşende değiştirilemez.'
      }
    ]
  },
  database: {
    title: 'Veritabanı Yönetimi & SQL',
    summary: `# 🗄️ Veritabanı Yönetimi & SQL Özeti

## Genel Bakış (Overview)
Veritabanları, verilerin organize bir şekilde saklandığı, sorgulandığı ve yönetildiği sistemlerdir. SQL (Structured Query Language) ise ilişkisel veritabanları ile iletişim kurmak için kullanılan standart sorgu dilidir.

## Önemli Başlıklar (Key Concepts)
- **Primary Key (Birincil Anahtar):** Tablodaki her bir satırı benzersiz bir şekilde tanımlayan benzersiz alandır.
- **Foreign Key (Yabancı Anahtar):** İki tabloyu birbirine bağlamak için kullanılan ve diğer tablonun birincil anahtarına referans veren alandır.
- **İndeksleme (Indexing):** Arama sorgularını hızlandırmak için verilerin arkada özel bir dizin yapısıyla tutulmasıdır.

## Özet Çıkarımlar (Key Takeaways)
- SQL verilerin hızlı, güvenli ve tutarlı bir şekilde yönetilmesini sağlar.
- Tablolar arası ilişkiler veri tekrarını önler (Normalizasyon).
- İndeksler okuma hızını artırır fakat yazma hızını bir miktar yavaşlatır.`,
    flashcards: [
      { front: 'SQL nedir?', back: 'İlişkisel veritabanlarını sorgulamak ve yönetmek için kullanılan yapılandırılmış sorgu dilidir.' },
      { front: 'Primary Key nedir?', back: 'Her satırı benzersiz şekilde tanımlayan anahtardır (Null olamaz).' },
      { front: 'Normalizasyon amacı nedir?', back: 'Veri tabanında veri tekrarını önlemek ve veri tutarlılığını korumaktır.' },
      { front: 'JOIN işlemi ne işe yarar?', back: 'Ortak kolonlar üzerinden iki veya daha fazla tabloyu birleştirerek sorgulamayı sağlar.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Benzersiz satır tanımı için hangisi kullanılır?',
        options: ['A) Foreign Key', 'B) Primary Key', 'C) Index Key', 'D) Composite Key'],
        correctIndex: 1,
        explanation: 'Primary Key (Birincil Anahtar) her satırı benzersiz bir şekilde ayırt etmeyi garanti eder.'
      },
      {
        id: 2,
        question: 'Tabloları birleştirmek için hangi SQL komutu kullanılır?',
        options: ['A) MERGE', 'B) JOIN', 'C) UNION', 'D) CONNECT'],
        correctIndex: 1,
        explanation: 'JOIN komutu, tablolar arasındaki ilişkili sütunlara dayanarak satırları birleştirir.'
      },
      {
        id: 3,
        question: 'Veri tabanında veri tekrarını önleme işlemine ne ad verilir?',
        options: ['A) Normalizasyon', 'B) İndeksleme', 'C) Kapsülleme', 'D) Replika'],
        correctIndex: 0,
        explanation: 'Normalizasyon, veri tabanı tasarımında veri tekrarını minimuma indirgeme sürecidir.'
      }
    ]
  },
  history: {
    title: 'Tarih & Genel Kültür',
    summary: `# 🏛️ Yakın Çağ Tarihi Özeti

## Genel Bakış (Overview)
Bu doküman Yakın Çağ tarihindeki dönüm noktalarını, önemli devrimleri ve küresel etkilerini konu almaktadır.

## Önemli Başlıklar (Key Concepts)
- **Fransız İhtilali (1789):** Milliyetçilik, eşitlik ve hürriyet fikirlerinin dünyaya yayılarak imparatorlukların yıkılması sürecini başlatmasıdır.
- **Sanayi Devrimi:** Kas gücünden makine gücüne geçişi sağlayarak fabrikalaşmayı ve küresel ticareti hızlandıran süreçtir.

## Özet Çıkarımlar (Key Takeaways)
- Tarihsel olaylar birbirini tetikleyen sosyal ve ekonomik nedenlere dayanır.
- Sanayi devrimi modern işçi sınıfını ve sanayileşmiş devletleri doğurmuştur.`,
    flashcards: [
      { front: 'Fransız İhtilali tarihi?', back: '1789 yılında gerçekleşmiştir.' },
      { front: 'Sanayi Devrimi nerede başladı?', back: '18. yüzyılda İngiltere\'de başlamıştır.' },
      { front: 'Milliyetçilik akımı hangi olayla yayıldı?', back: 'Fransız İhtilali sonrasında tüm dünyaya yayılmıştır.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Fransız İhtilali hangi yılda gerçekleşmiştir?',
        options: ['A) 1453', 'B) 1789', 'C) 1914', 'D) 1881'],
        correctIndex: 1,
        explanation: 'Fransız İhtilali 1789 yılında gerçekleşmiş ve Yeni Çağ\'ı kapatıp Yakın Çağ\'ı başlatmıştır.'
      },
      {
        id: 2,
        question: 'Sanayi devrimi ilk olarak hangi ülkede ortaya çıkmıştır?',
        options: ['A) Fransa', 'B) İngiltere', 'C) Almanya', 'D) ABD'],
        correctIndex: 1,
        explanation: 'Sanayi Devrimi buhar gücünün tekstil sektöründe kullanılmasıyla İngiltere\'de başlamıştır.'
      }
    ]
  },
  programming: {
    title: 'Algoritmalar & Nesne Yönelimli Programlama',
    summary: `# 💻 Algoritma ve Nesne Yönelimli Programlama (OOP)

## Genel Bakış (Overview)
Yazılım geliştirmede algoritmalar adım adım problem çözme yollarını tanımlarken, Nesne Yönelimli Programlama (OOP) ise kodun nesneler ve sınıflar etrafında modellenmesini sağlar.

## Önemli Başlıklar (Key Concepts)
- **Kapsülleme (Encapsulation):** Verilerin ve metotların bir sınıf içinde gizlenerek dışarıdan doğrudan erişimin engellenmesidir.
- **Miras Alma (Inheritance):** Bir sınıfın başka bir sınıfın özelliklerini ve metotlarını devralabilmesidir.
- **Çok Biçimlilik (Polymorphism):** Aynı isimdeki metodun farklı sınıflarda farklı şekillerde davranabilmesidir.

## Özet Çıkarımlar (Key Takeaways)
- OOP kodun tekrar kullanılabilirliğini ve sürdürülebilirliğini artırır.
- Algoritma karmaşıklığı (Big O), kodun ne kadar verimli çalıştığını ölçer.`,
    flashcards: [
      { front: 'Kapsülleme nedir?', back: 'Verilerin dış dünyadan saklanarak sadece belirlenen metotlarla erişilmesini sağlama yöntemidir.' },
      { front: 'Miras alma (Inheritance) ne sağlar?', back: 'Alt sınıfların, üst sınıfların özelliklerini ve fonksiyonlarını kullanabilmesini sağlar.' },
      { front: 'Polymorphism (Çok Biçimlilik) nedir?', back: 'Aynı arayüze sahip metodun farklı sınıflarda farklı işler yapabilmesidir.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Kodun ve verinin dışarıdan gizlenmesi konseptine ne ad verilir?',
        options: ['A) Polymorphism', 'B) Inheritance', 'C) Encapsulation', 'D) Abstraction'],
        correctIndex: 2,
        explanation: 'Encapsulation (Kapsülleme) sınıf içindeki değişkenleri gizleyip getter/setter ile güvenli erişim sunma ilkesidir.'
      },
      {
        id: 2,
        question: 'Bir metodun alt sınıflarda farklı şekilde ezilmesi (override) hangi prensibe girer?',
        options: ['A) Polymorphism', 'B) Encapsulation', 'C) Miras Alma', 'D) Soyutlama'],
        correctIndex: 0,
        explanation: 'Metot ezme (Overriding), Çok Biçimliliğin (Polymorphism) en temel örneklerinden biridir.'
      }
    ]
  },
  ai: {
    title: 'Yapay Zeka & Veri Bilimi',
    summary: `# 🤖 Yapay Zeka ve Makine Öğrenimi Özeti

## Genel Bakış (Overview)
Yapay Zeka (AI), bilgisayarların insan zekasına benzer görevleri yerine getirmesini sağlayan teknolojidir. Makine Öğrenimi (ML) ise verilerden öğrenerek tahmin yürüten algoritmaları kapsar.

## Önemli Başlıklar (Key Concepts)
- **Denetimli Öğrenme (Supervised Learning):** Etiketli veriler kullanılarak modelin eğitilmesidir.
- **Denetimsiz Öğrenme (Unsupervised Learning):** Etiketsiz verilerdeki gizli örüntülerin bulunması sürecidir.
- **Derin Öğrenme (Deep Learning):** Çok katmanlı yapay sinir ağları kullanarak karmaşık verilerin işlenmesidir.

## Özet Çıkarımlar (Key Takeaways)
- Yapay zeka büyük veri (Big Data) analiziyle beslenir.
- Yapay sinir ağları insan beyninin çalışma yapısından esinlenmiştir.`,
    flashcards: [
      { front: 'Makine Öğrenimi nedir?', back: 'Bilgisayarların açıkça programlanmadan verilerden öğrenmesini sağlayan sistemlerdir.' },
      { front: 'Supervised Learning nedir?', back: 'Girdi ve doğru çıktı (etiket) çiftleri üzerinden yapılan yapay zeka eğitimidir.' },
      { front: 'Derin Öğrenme hangi yapıyı kullanır?', back: 'Çok katmanlı Yapay Sinir Ağlarını (Artificial Neural Networks) kullanır.' }
    ],
    quiz: [
      {
        id: 1,
        question: 'Etiketli verilerle yapılan yapay zeka eğitimine ne denir?',
        options: ['A) Unsupervised Learning', 'B) Supervised Learning', 'C) Reinforcement Learning', 'D) Clustering'],
        correctIndex: 1,
        explanation: 'Supervised (Denetimli) öğrenmede girdilerin karşılık geleceği hedefler (etiketler) modele önceden verilir.'
      },
      {
        id: 2,
        question: 'Yapay sinir ağları hangi organdan esinlenerek modellenmiştir?',
        options: ['A) Kalp', 'B) Beyin', 'C) Göz', 'D) Akciğer'],
        correctIndex: 1,
        explanation: 'Yapay Sinir Ağları insan beynindeki biyolojik nöronların ve sinapsların çalışma prensiplerinden esinlenmiştir.'
      }
    ]
  },
  general: {
    title: 'Genel Akademik Çalışma Metotları',
    summary: `# 📖 Genel Akademik Çalışma Metotları

## Genel Bakış (Overview)
Verimli ders çalışma teknikleri, bilgilerin uzun süreli hafızaya aktarılmasını kolaylaştırır ve öğrenme hızını optimize eder.

## Önemli Başlıklar (Key Concepts)
- **Aktif Hatırlama (Active Recall):** Bilgiyi sadece okumak yerine kendinizi test ederek hafızadan geri çağırma yöntemidir.
- **Aralıklı Tekrar (Spaced Repetition):** Unutma eğrisine karşı koymak için bilgileri belirli zaman aralıklarıyla tekrar etmektir.
- **Pomodoro Tekniği:** 25 dakika odaklanmış çalışma ve 5 dakika mola içeren zaman yönetimi disiplinidir.

## Özet Çıkarımlar (Key Takeaways)
- Pasif okuma öğrenmede en düşük verimliliğe sahiptir.
- Flashcard ve quiz çözmek aktif hatırlama için en etkili araçlardır.`,
    flashcards: [
      { front: 'Pomodoro çalışma süresi?', back: 'Genellikle 25 dakika odaklı çalışma ve 5 dakika kısa mola şeklindedir.' },
      { front: 'Active Recall nedir?', back: 'Bilgiyi pasif okumak yerine sorularla hafızayı zorlayarak geri çağırma sürecidir.' },
      { front: 'Spaced Repetition amacı nedir?', back: 'Bilgilerin unutulma eğrisine girmeden önce belirli periyotlarla tekrar edilmesidir.' }
    ],
    quiz: [
      {
        id: 1,
        question: '25 dakika çalışma ve 5 dakika mola içeren zaman yönetimi tekniği hangisidir?',
        options: ['A) Eisenhower Matrisi', 'B) Pomodoro Tekniği', 'C) Kanban Metodu', 'D) Pareto İlkesi'],
        correctIndex: 1,
        explanation: 'Pomodoro tekniği, odaklanmayı artırmak için zamanı çalışma ve mola bloklarına böler.'
      },
      {
        id: 2,
        question: 'Öğrenmede en etkili aktif hatırlama (Active Recall) aracı hangisidir?',
        options: ['A) Kitabın altını çizmek', 'B) Notları tekrar tekrar okumak', 'C) Flashcard (çalışma kartı) çevirmek ve quiz çözmek', 'D) Videoları hızlı izlemek'],
        correctIndex: 2,
        explanation: 'Sorularla kendini test etmek ve kart çevirmek aktif hatırlama sağlayarak bilgiyi kalıcı kılar.'
      }
    ]
  }
};

export function getMockQuiz(questionCount, fileName = '') {
  const cat = detectCategory(fileName);
  const data = datasets[cat] || datasets.general;
  return data.quiz.slice(0, questionCount);
}

export function getMockSummary(fileName = '') {
  const cat = detectCategory(fileName);
  const data = datasets[cat] || datasets.general;
  return data.summary;
}

export function getMockFlashcards(cardCount = 6, fileName = '') {
  const cat = detectCategory(fileName);
  const data = datasets[cat] || datasets.general;
  return data.flashcards.slice(0, cardCount);
}

export function getMockWeaknessAnalysis() {
  return [
    {
      topic: 'React Lifecycle & Hooks (useEffect)',
      percentage: 80,
      recommendation: 'Yan etkileri (side-effects) yöneten useEffect hookunun dependency array mantığını tekrar gözden geçirin.'
    },
    {
      topic: 'Virtual DOM & Rendering Processes',
      percentage: 60,
      recommendation: 'Reactin sanal DOM güncelleme ve diffing algoritmalarını inceleyin.'
    },
    {
      topic: 'State Management (useState)',
      percentage: 40,
      recommendation: 'State güncellemelerinin asenkron doğasını ve callback kullanımını pekiştirin.'
    }
  ]
}

export function getMockRecoveryQuiz() {
  return [
    {
      id: 1,
      question: 'useEffect hookunda ikinci parametre olarak boş dizi ([]) verilmesi neyi sağlar?',
      options: [
        'A) Etkinin her renderda çalışmasını',
        'B) Etkinin sadece bileşen ekrana yüklendiğinde (mount) bir kez çalışmasını',
        'C) Etkinin hiç çalışmamasını',
        'D) Bileşenin hafızada tutulmasını'
      ],
      correctIndex: 1,
      explanation: 'Dependency array (bağımlılık dizisi) boş bırakıldığında, useEffect içindeki kod sadece component mount edildiğinde bir kez çalışır.'
    },
    {
      id: 2,
      question: 'Aşağıdakilerden hangisi bir yan etki (side-effect) örneği değildir?',
      options: [
        'A) API üzerinden veri çekme',
        'B) setInterval ile bir zamanlayıcı başlatma',
        'C) Props olarak gelen bir sayıyı ekrana yazdırma',
        'D) Tarayıcı başlığını (document.title) değiştirme'
      ],
      correctIndex: 2,
      explanation: 'Props verisini salt ekrana yazdırma işlemi saf bir render işlemidir ve yan etki sayılmaz.'
    },
    {
      id: 3,
      question: 'Reactte state güncellemeleri hakkında hangisi doğrudur?',
      options: [
        'A) State güncellemeleri senkrondur',
        'B) State doğrudan atanarak (state = value) güncellenmelidir',
        'C) State güncellemeleri sıraya alınır (asenkron çalışır)',
        'D) State güncellendiğinde component tekrar çizilmez'
      ],
      correctIndex: 2,
      explanation: 'React performans nedeniyle state güncellemelerini toplu yapar (batching) ve asenkron olarak çalıştırır.'
    },
    {
      id: 4,
      question: 'Sanal DOM (Virtual DOM) neye katkı sağlar?',
      options: [
        'A) Web sitelerinin SEO puanını artırır',
        'B) Sadece CSS yüklemelerini hızlandırır',
        'C) Doğrudan DOM müdahalelerini önleyerek sadece değişen parçaların render edilmesini sağlar',
        'D) Sunucu maliyetini azaltır'
      ],
      correctIndex: 3,
      explanation: 'Sanal DOM, gerçek DOM üzerinde en az değişiklikle (re-flow / re-paint süreçlerini azaltarak) işlem yapmayı sağlayıp hızı artırır.'
    },
    {
      id: 5,
      question: 'useEffect temizleme (cleanup) fonksiyonu ne zaman çalışır?',
      options: [
        'A) Component ilk yüklendiğinde',
        'B) Her render öncesinde ve component ekrandan kaldırılmadan (unmount) hemen önce',
        'C) Sadece hata oluştuğunda',
        'D) Sayfa yenilendiğinde'
      ],
      correctIndex: 1,
      explanation: 'useEffect içerisinden dönülen fonksiyon, bağımlılıklar değişip efekt yeniden tetiklenmeden önce ve bileşen yok edilmeden hemen önce temizlik için çalıştırılır.'
    }
  ]
}
