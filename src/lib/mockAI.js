// Reverted to stable mock AI responses for demo mode (single high-quality dataset)

export function getMockCVAnalysis(jobTitle) {
  return {
    matchScore: 72,
    summary: `Your profile shows solid foundational skills relevant to the ${jobTitle} role. You demonstrate strong technical capabilities, but there are key areas where targeted improvements could significantly boost your application's competitiveness.`,
    strengths: [
      'Strong technical foundation with relevant programming languages',
      'Demonstrated project experience with real-world applications',
      'Clear educational background aligned with role requirements',
    ],
    gaps: [
      'Limited professional work experience in a corporate environment',
      'Missing certifications commonly expected for this role',
      'Portfolio lacks examples of large-scale collaborative projects',
    ],
    missingKeywords: ['Agile/Scrum', 'CI/CD pipelines', 'Docker', 'REST API design', 'TypeScript'],
    suggestions: [
      'Add quantifiable achievements to each experience bullet (e.g., "reduced load time by 40%")',
      'Include a dedicated Skills section with the exact keywords from the job description',
      'Add GitHub links and live demo URLs to showcase your projects',
    ],
    coverLetterOpening: `I am excited to apply for the ${jobTitle} position, as it perfectly aligns with my passion for building impactful software solutions. Through my academic projects and hands-on experience, I have developed a strong foundation in the core technologies your team relies on. I am eager to bring my problem-solving mindset and collaborative spirit to your organization.`,
  }
}

export function getMockQuiz(questionCount) {
  const allQuestions = [
    {
      id: 1,
      question: 'What is the primary purpose of React hooks?',
      options: [
        'A) To replace class components with functional equivalents',
        'B) To add state and lifecycle features to function components',
        'C) To improve application performance automatically',
        'D) To enable server-side rendering',
      ],
      correctIndex: 1,
      explanation: 'React hooks allow function components to use state and other React features that were previously only available in class components.',
    },
    {
      id: 2,
      question: 'Which HTTP method is typically used to update an existing resource?',
      options: ['A) GET', 'B) POST', 'C) PUT', 'D) DELETE'],
      correctIndex: 2,
      explanation: 'PUT is used to update or replace an existing resource at a specified URL.',
    },
    {
      id: 3,
      question: 'What does SQL stand for?',
      options: [
        'A) Structured Query Language',
        'B) Simple Query Logic',
        'C) Standard Question Library',
        'D) Secure Query Layer',
      ],
      correctIndex: 0,
      explanation: 'SQL stands for Structured Query Language, used to manage and manipulate relational databases.',
    },
    {
      id: 4,
      question: 'What is a primary key in a database?',
      options: [
        'A) The first column in every table',
        'B) A unique identifier for each row in a table',
        'C) The most important data field',
        'D) A foreign reference to another table',
      ],
      correctIndex: 1,
      explanation: 'A primary key uniquely identifies each record in a database table and cannot contain NULL values.',
    },
    {
      id: 5,
      question: 'Which concept describes keeping related code together?',
      options: ['A) Abstraction', 'B) Polymorphism', 'C) Encapsulation', 'D) Inheritance'],
      correctIndex: 2,
      explanation: 'Encapsulation bundles data and methods that operate on that data within one unit, hiding internal implementation details.',
    },
    {
      id: 6,
      question: 'What is the time complexity of binary search?',
      options: ['A) O(n)', 'B) O(n²)', 'C) O(log n)', 'D) O(1)'],
      correctIndex: 2,
      explanation: 'Binary search repeatedly divides the search space in half, resulting in O(log n) time complexity.',
    },
    {
      id: 7,
      question: 'What does API stand for?',
      options: [
        'A) Application Programming Interface',
        'B) Automated Process Integration',
        'C) Advanced Protocol Interface',
        'D) Application Process Index',
      ],
      correctIndex: 0,
      explanation: 'API stands for Application Programming Interface — a set of rules that allow different software applications to communicate.',
    },
    {
      id: 8,
      question: 'Which of the following is NOT a JavaScript data type?',
      options: ['A) undefined', 'B) boolean', 'C) character', 'D) symbol'],
      correctIndex: 2,
      explanation: "JavaScript doesn't have a 'character' type. Single characters are simply strings of length 1.",
    },
    {
      id: 9,
      question: 'What is version control primarily used for?',
      options: [
        'A) Speeding up code execution',
        'B) Tracking changes to code over time',
        'C) Compiling source code',
        'D) Managing server deployments',
      ],
      correctIndex: 1,
      explanation: 'Version control systems like Git track changes to files over time, allowing collaboration and history management.',
    },
    {
      id: 10,
      question: 'In CSS, what does the "cascading" in Cascading Style Sheets refer to?',
      options: [
        'A) Animations that flow downward',
        'B) The way styles are inherited and prioritized',
        'C) A waterfall layout pattern',
        'D) Responsive breakpoints',
      ],
      correctIndex: 1,
      explanation: 'Cascading refers to the priority scheme that determines which style rules apply when multiple rules target the same element.',
    }
  ]
  return allQuestions.slice(0, questionCount)
}

export function getMockSummary() {
  return `# 📖 React & Modern Web Geliştirme Özeti

## Genel Bakış (Overview)
React, kullanıcı arayüzü oluşturmak için tasarlanmış bileşen tabanlı (component-based) popüler bir JavaScript kütüphanesidir. Modern web projelerinde yüksek performanslı ve modüler yapılar oluşturmayı sağlar. State (durum) ve props (özellikler) kavramları yardımıyla dinamik arayüzler sunar.

## Önemli Başlıklar (Key Concepts)
- **Bileşen Tabanlı Mimari (Component Architecture):** Uygulamanın her arayüz parçasının (örneğin buton, navbar) bağımsız birer yapı taşı olarak kodlanmasıdır. Kodun tekrar kullanılabilirliğini artırır.
- **Sanal DOM (Virtual DOM):** React, gerçek DOM'u doğrudan güncellemek yerine sanal bir kopyasını günceller. Değişiklikleri karşılaştırıp (diffing) sadece değişen alanları gerçek DOM'a yansıtır, bu da hızı artırır.
- **Hooks (Kancalar):** Fonksiyonel bileşenlerde durum (State) ve yaşam döngüsü özelliklerini (lifecycle) kullanmamızı sağlayan useState, useEffect gibi fonksiyonlardır.
- **Vite:** Geliştirme sunucusunu native ESM (ECMAScript Modules) tabanlı başlatarak geleneksel araçlara (Webpack) kıyasla çok daha hızlı başlatan modern bir build aracıdır.

## Özet Çıkarımlar (Key Takeaways)
- Modüler bileşen yapısı sayesinde kod tabanı büyüdükçe bakım ve geliştirme kolaylaşır.
- Sanal DOM ve verimli render süreçleri tarayıcı performansını optimize eder.
- Hooks mimarisi sayesinde sınıf (class) yapısına ihtiyaç duymadan temiz fonksiyonlarla geliştirme yapılabilir.`
}

export function getMockFlashcards(cardCount = 6) {
  const cards = [
    {
      front: 'Virtual DOM nedir ve ne işe yarar?',
      back: 'React\'in gerçek DOM üzerinde doğrudan işlem yapmak yerine kullandığı bellek içi kopyadır. Sadece değişen düğümleri güncelleyerek tarayıcı performansını optimize eder.'
    },
    {
      front: 'useState Hook\'u ne amaçla kullanılır?',
      back: 'Fonksiyonel React bileşenlerinde dinamik verileri (state) saklamak, değiştirmek ve bileşenin yeniden çizilmesini (re-render) tetiklemek için kullanılır.'
    },
    {
      front: 'useEffect Hook\'u nedir?',
      back: 'React bileşenlerinde veri çekme, abonelik oluşturma veya DOM\'u manuel değiştirme gibi yan etkileri (side-effects) yönetmemizi sağlayan hook\'tur.'
    },
    {
      front: 'React\'te Props ne anlama gelir?',
      back: 'Üst bileşenden alt bileşene tek yönlü veri transferi yapmak için kullanılan salt okunur (read-only) özelliklerdir.'
    },
    {
      front: 'SPA (Single Page Application) nedir?',
      back: 'Sayfa yenilenmeden dinamik olarak sadece değişen içeriklerin yüklendiği ve kullanıcılara kesintisiz bir masaüstü uygulaması deneyimi sunan tek sayfalı web uygulamalarıdır.'
    },
    {
      front: 'Vite\'in geleneksel araçlardan (örn. Webpack) farkı nedir?',
      back: 'Vite, tarayıcıların sunduğu yerleşik ESM (ECMAScript Modules) desteğini kullanır. Dosyaları önceden paketlemek yerine talep anında yükleyerek anlık açılış (cold start) sağlar.'
    }
  ]
  return cards.slice(0, cardCount)
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

export function getMockChatResponse(userMessage = '') {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('usestate') || msg.includes('state') || msg.includes('durum')) {
    return `React'te **useState**, fonksiyonel bileşenlerde dinamik verileri (durum/state) tanımlamamızı ve yönetmemizi sağlayan en temel Hook'tur.
Kullanımı:
\`const [count, setCount] = useState(0);\`
Burada \`count\` mevcut durumu, \`setCount\` ise bu durumu güncellemek için kullanılan fonksiyondur. State her güncellendiğinde React bileşeni otomatik olarak yeniden çizer (re-render).`;
  }
  
  if (msg.includes('useeffect') || msg.includes('side-effect') || msg.includes('lifecycle')) {
    return `**useEffect**, React bileşenlerinde yan etkileri (side-effects) yönetmek için kullanılan Hook'tur. API'den veri çekme, abonelik başlatma veya DOM'u doğrudan güncelleme gibi durumlar yan etkidir.
    
İkinci parametre (bağımlılık dizisi):
- Boş bırakılırsa: Her renderda çalışır.
- Boş dizi \`[]\` verilirse: Sadece component mount edildiğinde (ilk açılışta) bir kez çalışır.
- Değişkenler eklenirse \`[state]\`: Bu değişkenler her değiştiğinde çalışır.`;
  }
  
  if (msg.includes('virtual dom') || msg.includes('dom') || msg.includes('sanal dom')) {
    return `**Virtual DOM (Sanal DOM)**, React'in arayüz güncellemelerini hızlandırmak için hafızada tuttuğu gerçek tarayıcı DOM'unun hafif bir kopyasıdır.
Bileşen durumu değiştiğinde:
1. React sanal DOM'u günceller.
2. Önceki sanal DOM ile yenisini karşılaştırır (diffing algoritması).
3. Sadece değişen düğümleri gerçek DOM'a yansıtır. Bu sayede tüm sayfayı tekrar çizmek yerine sadece ilgili alanı güncelleyerek yüksek performans sağlar.`;
  }

  if (msg.includes('nerede') || msg.includes('nasil') || msg.includes('nedir') || msg.includes('ne ise yarar')) {
    return `Yüklediğiniz doküman **React & Modern Web Geliştirme** konusunu içermektedir. Dokümanda özet olarak şu kavramlardan bahsedilmektedir:
1. **Bileşen Mimarisi:** Arayüzün tekrar kullanılabilir parçalara bölünmesi.
2. **Sanal DOM:** Tarayıcı performansını artıran verimli güncelleme mekanizması.
3. **Hooks (useState, useEffect):** Fonksiyonel bileşenlerde state ve yaşam döngüsü yönetimi.

Öğrenmek istediğiniz özel bir kavram varsa sorabilirsiniz (Örn: "useState nedir?")`;
  }

  return `Merhaba! Yüklediğiniz **React & Modern Web Geliştirme** belgesiyle ilgili size yardımcı olmaya hazırım. 

Bana belgeyle ilgili her türlü konuyu sorabilir, örneğin **useState**, **useEffect** veya **Sanal DOM** gibi kavramları daha detaylı açıklamamı isteyebilirsiniz.`;
}
