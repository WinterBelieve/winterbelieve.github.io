const LANG_KEY = "daniel_site_lang";
const INTRO_KEY = "daniel_intro_seen";
const THEME_KEY = "daniel_site_theme";
const SORT_KEY_PREFIX = "daniel_site_sort_";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const body = document.body;
const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enter-btn");
const cursorGlow = document.querySelector(".cursor-glow");

let revealObserver = null;

const themeCopy = {
  zh: {
    dark: "切換至夜間模式",
    light: "切換至日間模式",
    darkShort: "夜間模式",
    lightShort: "日間模式"
  },
  en: {
    dark: "Switch to dark mode",
    light: "Switch to light mode",
    darkShort: "Dark mode",
    lightShort: "Light mode"
  }
};

const PAGE_KEYS = [
  "about",
  "education",
  "experience",
  "publications",
  "teaching",
  "activities",
  "contact"
];

const SOURCE_SORT_ORDERS = {
  education: "asc",
  experience: "desc",
  publications: "desc",
  teaching: "asc",
  activities: "asc"
};

const sortCopy = {
  zh: {
    label: "時間排序",
    group: "選擇時間排序方式",
    desc: "由新到舊",
    asc: "由舊到新"
  },
  en: {
    label: "Timeline order",
    group: "Choose timeline order",
    desc: "Newest first",
    asc: "Oldest first"
  }
};

const content = {
  zh: {
    pageTitle: "袁聖博 Daniel Yuan | 學術履歷",
    intro: {
      kicker: "Academic Portfolio",
      title: "袁聖博 Daniel Yuan",
      copy: "歡迎來到我的學術個人網站。\n請先選擇語言，再進入頁面。",
      enter: "進入網站"
    },
    nav: {
      about: "首頁",
      education: "學歷",
      experience: "經歷",
      publications: "學術成果",
      teaching: "教學助理",
      activities: "社團參與",
      contact: "聯絡"
    },
    hero: {
      tag: "學術個人網站",
      namePrimary: "袁聖博",
      nameSecondary: "Daniel Yuan",
      title: "臨床醫學（理學）博士生",
      affiliation: "長庚大學｜醫學院臨床醫學研究所 / 智慧運算學院人工智慧研究所",
      primary: "查看學術成果",
      secondary: "聯絡方式",
      metrics: [
        { value: "4", label: "學術成果（論文、Workshop、碩論）" },
        { value: "14+", label: "課程 TA 支援經驗" },
        { value: "2", label: "研究助理職務（校內與醫院）" }
      ]
    },
    about: {
      tag: "自我介紹",
      title: "研究背景與方向",
      lead: "袁聖博目前為長庚大學臨床醫學研究所人工智慧組博士生，研究聚焦於腦部醫學影像與心臟超音波影像的人工智慧分析。曾從事膠質母細胞瘤復發樣態的預測研究；在心臟超音波影像方面，進行以自監督學習為核心的左心室分割模型開發。另外亦參與胃鏡與眼底鏡影像分析相關研究，累積跨模態醫學影像建模經驗。目前亦參與 Taiwan AICoE「邁向新世代前瞻人工智慧主題研究專案計畫（114 年度）」之「超越 Scaling 法則：一個以資料效率與可信賴為核心的模組化醫療視覺基礎模型架構」研究，關注資料效率、模型模組化與可信賴醫療人工智慧。"
    },
    education: {
      tag: "學歷",
      title: "學術訓練路徑",
      items: [
        {
          title: "電子科",
          subtitle: "國立臺北科技大學附屬桃園農工高級中等學校",
          note: "2015/09 - 2018/06"
        },
        {
          title: "電機工程學士",
          subtitle: "明志科技大學 電機工程系",
          note: "2018/09 - 2022/06"
        },
        {
          title: "人工智慧碩士",
          subtitle: "長庚大學 人工智慧學系碩士班",
          note: "2022/09 - 2024/07"
        },
        {
          title: "臨床醫學（理學）博士生",
          subtitle: "長庚大學 臨床醫學研究所 人工智慧組博士班｜博士三年級",
          note: "2024/09 - 現今"
        }
      ]
    },
    experience: {
      tag: "經歷",
      title: "研究與實務經驗",
      items: [
        {
          title: "Taiwan AICoE 研究計畫",
          period: "邁向新世代前瞻人工智慧主題研究專案計畫（114 年度）",
          points: [
            "研究主題：超越 Scaling 法則：一個以資料效率與可信賴為核心的模組化醫療視覺基礎模型架構"
          ]
        },
        {
          title: "研究助理職務（博士班期間）",
          period: "2024/09 - 現今",
          points: [
            "長庚大學 研究助理",
            "長庚醫院心臟內科 兼任研究助理（Adjunct Research Assistant）"
          ]
        },
        {
          title: "Operating System Developer / 系統平台開發人員",
          period: "",
          points: [
            "與人工智慧研究中心副主任共同開發教學平台系統，採用 k8s 架構。",
            "提供可執行程式與訓練 AI 模型的教學環境，支援課程實作與教學。"
          ]
        },
        {
          title: "工業技術研究院 綠能與環境研究所 實習生",
          period: "2020/09 - 2021/09",
          points: [
            "馬達波形實驗與分析（10 個月，現場）：進行波形量測、訊號分析，以及馬達驅動器與相關電子元件測試。",
            "遠距研究協作（2 個月）：協助國際專利檢索與文獻翻譯（英文期刊、日文資料），整理重點並製作簡報。"
          ]
        }
      ]
    },
    publications: {
      tag: "學術成果",
      title: "論文、投稿與學術發表",
      summary: "以時間軸瀏覽論文與學術發表；有文件的成果，可直接在網站中閱讀。",
      items: [
        {
          kind: "研討會論文｜口頭發表",
          title: "Cross-Dataset Comparison of Pretrained CV Backbones for Echocardiography Segmentation",
          venue: "IIAI AAI 2026 (SCAI 2026)｜日本",
          role: "第一作者口頭發表（First Author, Oral Presentation）",
          description: "比較預訓練電腦視覺骨幹於不同心臟超音波資料集上的分割表現，聚焦跨資料集評估。",
          links: []
        },
        {
          kind: "工作坊口頭報告",
          title: "Self-Supervised Masked Autoencoders for High-Accuracy Left Ventricle Segmentation in Echocardiography",
          venue: "ACML 2025 Workshop - Medical AI Workshop: Making AI Safe and Healthy (MASH)",
          role: "第一作者口頭發表（First Author, Oral Presentation）",
          description: "以自監督遮罩自編碼器（Masked Autoencoders）為主軸，開發心臟超音波影像的左心室分割模型。",
          links: [
            { label: "開啟 Workshop 展示頁", href: "viewer.html?doc=acml2025" }
          ]
        },
        {
          kind: "碩士論文",
          title: "使用全腦分割影像提升神經膠質瘤復發樣態預測準確度",
          venue: "長庚大學 碩士論文",
          role: "碩士論文",
          description: "研究如何使用全腦分割影像，提升神經膠質瘤復發樣態的預測準確度；以腦部 MRI 分析連結影像資訊與預測任務。",
          links: [
            { label: "開啟碩論展示頁", href: "viewer.html?doc=thesis" }
          ]
        },
        {
          kind: "研討會論文",
          title: "Application of Incremental Learning to Medical Image Segmentation of Glioblastoma Multiforme",
          venue: "NST2024",
          role: "第一作者（First Author）",
          description: "探討增量學習在膠質母細胞瘤醫學影像分割中的應用，是腦部 MRI 研究經驗的一部分。",
          links: [
            { label: "開啟論文展示頁", href: "viewer.html?doc=nst2024" }
          ]
        }
      ]
    },
    teaching: {
      tag: "教學助理",
      title: "課程助教經歷",
      summary: "自碩一下開始至博士班期間，持續擔任多門課程 TA，涵蓋 AI 學程、臨醫所 AI 組、健康數據所與 AIMD 跨域課程。",
      instructorLabel: "授課教師",
      items: [
        { term: "碩一下", course: "資料探勘", audience: "AI 學程大三", instructor: "蘇豐文教授" },
        { term: "碩二上", course: "智慧計算導論", audience: "人工智慧學系大一", instructor: "林桂傑講座教授（首任院長）、許永真特聘教授" },
        { term: "碩二上", course: "程式語言及其醫學應用", audience: "醫學系、中醫系", instructor: "白思芸博士後研究員" },
        { term: "碩二下", course: "深度學習（英文授課，碩博合開）", audience: "AI 碩士班、臨醫所 AI 組博士班", instructor: "王佑中教授" },
        { term: "博一上", course: "深度學習", audience: "AI 學程大三", instructor: "王佑中教授" },
        { term: "博一下", course: "深度學習（英文授課，碩博合開）", audience: "AI 碩士班、臨醫所 AI 組博士班", instructor: "林桂傑講座教授" },
        { term: "博二上", course: "生成式人工智慧（英文授課，碩博合開）", audience: "AI 碩士班、臨醫所 AI 組博士班", instructor: "許永真院長" },
        { term: "博二上", course: "智慧方法概論", audience: "臨醫所 AI 組博士班、健康數據所", instructor: "林桂傑講座教授" },
        { term: "博二上", course: "智慧運算技術導論（英文授課）", audience: "AI 碩士班", instructor: "林桂傑講座教授" },
        { term: "博二上", course: "機器學習（支援）", audience: "人工智慧學系大二", instructor: "楊智淵助理教授" },
        { term: "博二上", course: "醫學影像處理（支援）", audience: "AI 學系碩士班、健康數據所", instructor: "許艾伶助理教授" },
        { term: "博二下", course: "智慧運算技術導論", audience: "AIMD（醫學系、中醫系）", instructor: "林桂傑講座教授" },
        { term: "博三上", course: "智慧方法概論", audience: "AI 碩士班、健康數據所", instructor: "林桂傑講座教授" },
        { term: "博三上", course: "智慧運算技術導論（英文授課）", audience: "AI 博士班、臨醫所 AI 組博士班", instructor: "林桂傑講座教授" }
      ]
    },
    activities: {
      tag: "社團參與",
      title: "跨領域學生社群經驗",
      items: [
        { stage: "高中", clubs: ["地理社", "桌球社", "潛能開發社"] },
        { stage: "大學", clubs: ["愛樂社", "國樂社", "技擊社"] },
        { stage: "碩士班", clubs: ["鋼琴社"] },
        {
          stage: "博士班",
          groups: [
            { title: "公共類", clubs: ["人工智慧學系系學會"] },
            { title: "地區類", clubs: ["桃園校友會"] },
            { title: "音樂類", clubs: ["鋼琴社"] },
            { title: "體育類", clubs: ["劍道社", "桌球社", "網球社", "羽球社", "熱舞社", "登山社", "自由搏擊社", "跆拳道社"] },
            { title: "學藝類", clubs: ["國醫社", "天文社", "圍棋社", "桌遊社", "漫研社", "茶道社", "資訊社", "攝影社", "烘焙社", "創創社"] },
            { title: "宗教服務類", clubs: ["蒲公英工作隊"] }
          ]
        }
      ]
    },
    contact: {
      tag: "聯絡",
      title: "聯絡資訊",
      copy: "歡迎透過 Email 或 GitHub 與我聯絡。",
      email: "winterdanielyuan@gmail.com",
      githubLabel: "GitHub",
      githubHref: "https://github.com/winterbelieve",
      scholarLabel: "Google Scholar（待補）",
      scholarHref: "#"
    },
    footer: "© {year} 袁聖博 Daniel Yuan. All rights reserved."
  },
  en: {
    pageTitle: "Daniel Yuan | Academic Profile",
    intro: {
      kicker: "Academic Portfolio",
      title: "Daniel Yuan",
      copy: "Welcome to my academic website.\nPlease select your language before entering.",
      enter: "Enter Site"
    },
    nav: {
      about: "Home",
      education: "Education",
      experience: "Experience",
      publications: "Publications",
      teaching: "Teaching",
      activities: "Activities",
      contact: "Contact"
    },
    hero: {
      tag: "Academic Profile",
      namePrimary: "Daniel Yuan",
      nameSecondary: "袁聖博",
      title: "PhD Student in Clinical Medical Sciences",
      affiliation: "Chang Gung University | College of Medicine / College of Intelligent Computing",
      primary: "View Publications",
      secondary: "Contact",
      metrics: [
        { value: "4", label: "Academic outputs (thesis, conference, workshop)" },
        { value: "14+", label: "Teaching assistant assignments" },
        { value: "2", label: "Research assistant positions" }
      ]
    },
    about: {
      tag: "About",
      title: "Background and Research Focus",
      lead: "Sheng-Po Yuan is currently a PhD student in the Graduate Institute of Clinical Medical Sciences, Division of Artificial Intelligence, at Chang Gung University. His research focuses on AI-based analysis of brain medical imaging and cardiac ultrasound imaging. He has previously worked on predicting recurrence patterns of glioblastoma and on self-supervised left ventricle segmentation in echocardiography. He has also participated in gastroscopy and fundus imaging research, building cross-modality experience in medical image modeling. He is currently involved in the Taiwan AICoE Next-Generation Forward-Looking AI Thematic Research Program (2025 / ROC Year 114), contributing to the project “Beyond Scaling Laws: A Modular Medical Vision Foundation Model Architecture Centered on Data Efficiency and Trustworthiness,” with an emphasis on data-efficient, modular, and trustworthy medical AI."
    },
    education: {
      tag: "Education",
      title: "Academic Training Path",
      items: [
        {
          title: "Department of Electronics",
          subtitle: "The Affiliated Tao-Yuan Agricultural & Industrial Senior High School of National Taipei University of Technology",
          note: "2015/09 - 2018/06"
        },
        {
          title: "B.S. in Electrical Engineering",
          subtitle: "Department of Electrical Engineering, Ming Chi University of Technology",
          note: "2018/09 - 2022/06"
        },
        {
          title: "M.S. in Artificial Intelligence",
          subtitle: "Department of Artificial Intelligence, Chang Gung University",
          note: "2022/09 - 2024/07"
        },
        {
          title: "PhD Student in Clinical Medical Sciences",
          subtitle: "Graduate Institute of Clinical Medical Sciences, Division of Artificial Intelligence PhD Program | Year 3, Chang Gung University",
          note: "2024/09 - Present"
        }
      ]
    },
    experience: {
      tag: "Experience",
      title: "Research and Practical Experience",
      items: [
        {
          title: "Taiwan AICoE Research Project",
          period: "Next-Generation Forward-Looking AI Thematic Research Program (2025 / ROC Year 114)",
          points: [
            "Research topic: Beyond Scaling Laws: A Modular Medical Vision Foundation Model Architecture Centered on Data Efficiency and Trustworthiness."
          ]
        },
        {
          title: "Research Assistant Roles During PhD Study",
          period: "Sep 2024 - Present",
          points: [
            "Research Assistant, Chang Gung University",
            "Adjunct Research Assistant, Department of Cardiology, Chang Gung Memorial Hospital"
          ]
        },
        {
          title: "Operating System Developer (System Platform Developer)",
          period: "",
          points: [
            "Co-developed a teaching platform system with the deputy director of the AI Research Center using a k8s architecture.",
            "Provided a runnable environment where students and faculty can execute code and train AI models for coursework and teaching."
          ]
        },
        {
          title: "Intern, Green Energy and Environment Research Laboratories, ITRI",
          period: "Sep 2020 - Sep 2021",
          points: [
            "Motor Waveform Experiment and Analysis (10 months, on-site): conducted waveform experiments, signal analysis, and testing of motor drivers and related electronic components.",
            "Remote Research Assistance (2 months): reviewed international patents, translated English and Japanese references, summarized key findings, and prepared presentation slides."
          ]
        }
      ]
    },
    publications: {
      tag: "Publications",
      title: "Thesis, Conference, and Workshop Outputs",
      summary: "Explore theses, conference papers, and presentations by year. Available documents can be read within this website.",
      items: [
        {
          kind: "Conference Paper | Oral Presentation",
          title: "Cross-Dataset Comparison of Pretrained CV Backbones for Echocardiography Segmentation",
          venue: "IIAI AAI 2026 (SCAI 2026) | Japan",
          role: "First Author, Oral Presentation",
          description: "A cross-dataset comparison of pretrained computer vision backbones for echocardiography segmentation, focusing on how segmentation performance varies across datasets.",
          links: []
        },
        {
          kind: "Workshop Oral Presentation",
          title: "Self-Supervised Masked Autoencoders for High-Accuracy Left Ventricle Segmentation in Echocardiography",
          venue: "ACML 2025 Workshop - Medical AI Workshop: Making AI Safe and Healthy (MASH)",
          role: "First Author, Oral Presentation",
          description: "Development of a left ventricle segmentation model for echocardiography using self-supervised masked autoencoders.",
          links: [
            { label: "Open Workshop Viewer", href: "viewer.html?doc=acml2025" }
          ]
        },
        {
          kind: "Master's Thesis",
          title: "Enhancing the Prediction Accuracy of Glioblastoma Recurrence Patterns Using Whole Brain Segmentation Images",
          venue: "Master's Thesis, Chang Gung University",
          role: "Master's Thesis",
          description: "An investigation of whole-brain segmentation images for improving the prediction of glioblastoma recurrence patterns, connecting brain MRI analysis with a prediction task.",
          links: [
            { label: "Open Thesis Viewer", href: "viewer.html?doc=thesis" }
          ]
        },
        {
          kind: "Conference Paper",
          title: "Application of Incremental Learning to Medical Image Segmentation of Glioblastoma Multiforme",
          venue: "NST2024",
          role: "First Author",
          description: "An exploration of incremental learning for medical image segmentation of glioblastoma multiforme, forming part of his work in brain MRI analysis.",
          links: [
            { label: "Open Paper Viewer", href: "viewer.html?doc=nst2024" }
          ]
        }
      ]
    },
    teaching: {
      tag: "Teaching",
      title: "Teaching Assistant Experience",
      summary: "Since the first semester of my master's program, I have continuously served as a TA in AI, medical, and interdisciplinary courses.",
      instructorLabel: "Instructor",
      items: [
        { term: "M.S. Year 1 Spring", course: "Data Mining", audience: "AI Program, Junior Undergraduate", instructor: "Prof. Von-Wun Soo" },
        { term: "M.S. Year 2 Fall", course: "Introduction to Intelligent Computing", audience: "Department of AI, Freshman", instructor: "Chair Prof. Kwei-Jay Lin (Founding Dean), Dist. Prof. Jane Yung-Jen Hsu" },
        { term: "M.S. Year 2 Fall", course: "Programming Language for Medical Applications", audience: "School of Medicine and School of Traditional Chinese Medicine", instructor: "Postdoctoral Researcher Ssu-Yun Pai" },
        { term: "M.S. Year 2 Spring", course: "Deep Learning (English-taught, Joint Master's/PhD)", audience: "AI Master's Program and Divison of AI in Clinical Medical Sciences PhD Program", instructor: "Prof. Yu-Chung Wang" },
        { term: "PhD Year 1 Fall", course: "Deep Learning", audience: "AI Program, Junior Undergraduate", instructor: "Prof. Yu-Chung Wang" },
        { term: "PhD Year 1 Spring", course: "Deep Learning (English-taught, Joint Master's/PhD)", audience: "AI Master's Program and Divison of AI in Clinical Medical Sciences PhD Program", instructor: "Chair Prof. Kwei-Jay Lin" },
        { term: "PhD Year 2 Fall", course: "Generative Artificial Intelligence (English-taught, Joint Master's/PhD)", audience: "AI Master's Program and Divison of AI in Clinical Medical Sciences PhD Program", instructor: "Dean Jane Yung-Jen Hsu" },
        { term: "PhD Year 2 Fall", course: "Introduction to Intelligent Methods", audience: "Divison of AI in Clinical Medical Sciences PhD Program and Institute of Health Data Science", instructor: "Chair Prof. Kwei-Jay Lin" },
        { term: "PhD Year 2 Fall", course: "Introduction to Intelligent Computing Technologies (English-taught)", audience: "AI Master's Program", instructor: "Chair Prof. Kwei-Jay Lin" },
        { term: "PhD Year 2 Fall", course: "Machine Learning (Support TA)", audience: "Department of AI, Sophomore Undergraduate", instructor: "Asst. Prof. Chih-Yuan Yang" },
        { term: "PhD Year 2 Fall", course: "Medical Image Processing (Support TA)", audience: "AI Master's Program and Institute of Health Data", instructor: "Asst. Prof. Ai-Ling Hsu" },
        { term: "PhD Year 2 Spring", course: "Introduction to Intelligent Computing Technologies", audience: "AIMD, School of Medicine and School of Chinese Medicine", instructor: "Chair Prof. Kwei-Jay Lin" },
        { term: "PhD Year 3 Fall", course: "Introduction to Intelligent Methods", audience: "AI Master's Program and Institute of Health Data Science", instructor: "Chair Prof. Kwei-Jay Lin" },
        { term: "PhD Year 3 Fall", course: "Introduction to Intelligent Computing Technologies (English-taught)", audience: "AI PhD Program and Division of AI in Clinical Medical Sciences PhD Program", instructor: "Chair Prof. Kwei-Jay Lin" }
      ]
    },
    activities: {
      tag: "Activities",
      title: "Student Clubs and Communities",
      items: [
        { stage: "High School", clubs: ["Geography Club", "Table Tennis Club", "Potential Development Club"] },
        { stage: "Undergraduate", clubs: ["Love Music Club", "Chinese Music Club", "Martial Arts Club"] },
        { stage: "Master's Program", clubs: ["Piano Club"] },
        {
          stage: "PhD Program",
          groups: [
            { title: "Departmental Associations", clubs: ["Department of Artificial Intelligence Student Association"] },
            { title: "Regional Associations", clubs: ["Taoyuan Alumni Association"] },
            { title: "Music", clubs: ["Piano Club"] },
            { title: "Sports", clubs: ["Kendo Club", "Table Tennis Club", "Tennis Club", "Badminton Team", "Dance Club", "Mountain Climbing Club", "Kickboxing Club", "Taekwondo Club"] },
            { title: "Academic & Arts", clubs: ["Chinese Medical Research Society", "Astronomy Club", "Go Club", "Board Game Club", "Comics Study Club", "Tea Ceremony Club", "Information Agency", "Photography Club", "Baking Club", "CGU Innovation Club"] },
            { title: "Religious & Service", clubs: ["Dandelions Service Team"] }
          ]
        }
      ]
    },
    contact: {
      tag: "Contact",
      title: "Contact Information",
      copy: "You are welcome to contact me by email or connect with me on GitHub.",
      email: "winterdanielyuan@gmail.com",
      githubLabel: "GitHub",
      githubHref: "https://github.com/winterbelieve",
      scholarLabel: "Google Scholar (Pending)",
      scholarHref: "#"
    },
    footer: "© {year} Daniel Yuan. All rights reserved."
  }
};

const designCopy = {
  zh: {
    skip: "跳至主要內容",
    brandSubtitle: "醫學影像・人工智慧",
    heroProgram: "長庚大學 · 臨床醫學研究所人工智慧組博士班 · 博士三年級",
    heroDeck: "研究腦部 MRI 與心臟超音波影像，<br>關注影像分割、自監督學習與跨資料集模型評估。",
    heroContact: "聯絡我 ↗",
    heroScroll: "往下探索 ↓",
    profileBandTitle: "研究領域",
    profileBandHint: "Medical Imaging & AI",
    profileBandTopics: "腦部 MRI · 心臟超音波 · 資料效率與可信賴 AI",
    currentWorkLabel: "目前的研究連結",
    aboutAside: "長庚大學<br>長庚醫院心臟內科<br>Taiwan AICoE 研究計畫",
    researchTitle: "研究主題與進行中的工作",
    researchDeck: "從腦部影像到心臟超音波，連結過去的研究與目前關注的問題。",
    datasetDisclaimer: "下列醫學影像各取自一位公開資料集個案，僅用於介紹影像模態，並非本人蒐集的影像或模型預測結果。",
    datasetSourcesTitle: "公開影像範例：來源、處理與授權",
    sourceLinks: "資料來源",
    sourceCitation: "資料與論文引用",
    provenanceLink: "完整引用與處理紀錄",
    selectedTitle: "研究，留下的足跡",
    allPublications: "所有學術成果 ↗",
    readWork: "閱讀成果 ↗",
    viewWork: "成果資訊 ↗",
    journeyTitle: "持續累積，也持續探索",
    connectTitle: "讓交流，開啟下一個想法。",
    connectAction: "與我聯絡 ↗",
    footerNote: "以人工智慧探索醫學影像，持續學習，連結研究與臨床。",
    footerExplore: "探索網站",
    footerContact: "保持聯繫",
    backTop: "回到頂端 ↑",
    pageEnd: "有想法想交流？與我聯絡 ↗",
    contactHeading: "從一句話，<br>開始一次交流。",
    contactLocation: "臺灣・桃園",
    viewerReturn: "← 學術成果",
    menuOpen: "開啟選單",
    menuClose: "關閉選單",
    research: [
      { dataset: "brain", title: "腦部 MRI", label: "BRAIN MRI", description: "曾從事膠質母細胞瘤復發樣態預測。碩士研究以全腦分割影像為基礎，另在 NST 2024 探討增量學習於腦腫瘤影像分割的應用。", topics: ["全腦分割與復發樣態預測", "增量學習與腦腫瘤分割"], href: "viewer.html?doc=thesis", linkLabel: "閱讀碩士論文 ↗" },
      { dataset: "echo", title: "心臟超音波", label: "ECHOCARDIOGRAPHY", description: "進行自監督學習的左心室分割模型開發，並比較預訓練電腦視覺骨幹於不同心臟超音波資料集上的分割表現。", topics: ["自監督遮罩自編碼器（MAE）", "跨資料集模型評估"], href: "viewer.html?doc=acml2025", linkLabel: "閱讀 Workshop 簡報 ↗" },
      { title: "可信賴醫療 AI", label: "TAIWAN AICOE · 114 年度", description: "參與「超越 Scaling 法則：一個以資料效率與可信賴為核心的模組化醫療視覺基礎模型架構」研究計畫，關注醫療視覺模型的資料效率、模組化與可信賴性。", topics: ["資料效率與模組化設計", "可信賴醫療視覺基礎模型"], href: "experience.html", linkLabel: "查看研究計畫與經歷 ↗", figureTitle: "Beyond<br>Scaling Laws", figureTopics: ["資料效率", "模組化", "可信賴"], caption: "研究計畫主題，不代表已完成的模型架構。" }
    ],
    journeys: [
      { key: "education", label: "ACADEMIC JOURNEY", description: "從電子、電機，到人工智慧與臨床醫學。" },
      { key: "teaching", label: "LEARNING TOGETHER", description: "在跨領域課程中，協助學習，也持續學習。" },
      { key: "activities", label: "BEYOND THE LAB", description: "音樂、運動與社群，研究以外的探索。" }
    ]
  },
  en: {
    skip: "Skip to main content",
    brandSubtitle: "Medical imaging & AI",
    heroProgram: "Chang Gung University · Graduate Institute of Clinical Medical Sciences, Division of Artificial Intelligence · PhD Year 3",
    heroDeck: "Brain MRI and echocardiography research,<br>with a focus on segmentation, self-supervised learning, and cross-dataset evaluation.",
    heroContact: "Get in touch ↗",
    heroScroll: "Explore below ↓",
    profileBandTitle: "Research Focus",
    profileBandHint: "Medical Imaging & AI",
    profileBandTopics: "Brain MRI · Echocardiography · Data-efficient, trustworthy AI",
    currentWorkLabel: "Research Connections",
    aboutAside: "Chang Gung University<br>Cardiology, Chang Gung Memorial Hospital<br>Taiwan AICoE project",
    researchTitle: "Research Topics & Current Work",
    researchDeck: "Connecting previous work in brain imaging with current questions in echocardiography and medical AI.",
    datasetDisclaimer: "Each medical image shows one de-identified public dataset case, illustrating the imaging modality only. These are not images acquired by me or predictions from my models.",
    datasetSourcesTitle: "Public image examples: sources, processing & licenses",
    sourceLinks: "Dataset source",
    sourceCitation: "Data & publication citation",
    provenanceLink: "Full attribution & processing record",
    selectedTitle: "Research, in progress and in print.",
    allPublications: "All publications ↗",
    readWork: "Read work ↗",
    viewWork: "View details ↗",
    journeyTitle: "Always learning. Always exploring.",
    connectTitle: "A conversation can start a new idea.",
    connectAction: "Get in touch ↗",
    footerNote: "Exploring medical images with AI, connecting research, learning, and clinical practice.",
    footerExplore: "Explore",
    footerContact: "Stay in touch",
    backTop: "Back to top ↑",
    pageEnd: "Have an idea to discuss? Get in touch ↗",
    contactHeading: "Every conversation<br>starts somewhere.",
    contactLocation: "Taoyuan, Taiwan",
    viewerReturn: "← Publications",
    menuOpen: "Open navigation",
    menuClose: "Close navigation",
    research: [
      { dataset: "brain", title: "Brain MRI", label: "BRAIN MRI", description: "Previous work on glioblastoma recurrence pattern prediction using whole-brain segmentation images, alongside an NST 2024 study of incremental learning for brain tumor image segmentation.", topics: ["Whole-brain segmentation and recurrence patterns", "Incremental learning for tumor segmentation"], href: "viewer.html?doc=thesis", linkLabel: "Read master's thesis ↗" },
      { dataset: "echo", title: "Echocardiography", label: "CARDIAC ULTRASOUND", description: "Developing self-supervised left ventricle segmentation models and comparing pretrained computer vision backbones across echocardiography datasets.", topics: ["Self-supervised masked autoencoders (MAE)", "Cross-dataset model evaluation"], href: "viewer.html?doc=acml2025", linkLabel: "Read workshop slides ↗" },
      { title: "Trustworthy medical AI", label: "TAIWAN AICOE · 2025", description: "Participation in the project Beyond Scaling Laws: A Modular Medical Vision Foundation Model Architecture Centered on Data Efficiency and Trustworthiness, focusing on these three themes in medical vision.", topics: ["Data efficiency and modular design", "Trustworthy medical vision foundation models"], href: "experience.html", linkLabel: "View project & experience ↗", figureTitle: "Beyond<br>Scaling Laws", figureTopics: ["Data efficiency", "Modularity", "Trustworthiness"], caption: "Project themes, not a completed model architecture." }
    ],
    journeys: [
      { key: "education", label: "ACADEMIC JOURNEY", description: "From electronics and electrical engineering to AI and clinical medical sciences." },
      { key: "teaching", label: "LEARNING TOGETHER", description: "Supporting interdisciplinary courses, and learning alongside students." },
      { key: "activities", label: "BEYOND THE LAB", description: "Music, sports, and communities: exploring life beyond research." }
    ]
  }
};

const datasetExamples = {
  brain: {
    image: "assets/data-examples/upenn-gbm-00002-flair.png",
    width: 192,
    height: 256,
    name: "TCIA UPENN-GBM",
    subject: "UPENN-GBM-00002",
    source: "https://www.cancerimagingarchive.net/collection/upenn-gbm/",
    citation: "Bakas, S., Sako, C., Akbari, H., et al. (2021). Multi-parametric magnetic resonance imaging (mpMRI) scans for de novo Glioblastoma (GBM) patients from the University of Pennsylvania Health System (UPENN-GBM), Version 2. The Cancer Imaging Archive.",
    citationUrl: "https://doi.org/10.7937/TCIA.709X-DN49",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    termsUrl: "https://wiki.cancerimagingarchive.net/display/Public/Data+Usage+Policies+and+Restrictions",
    zh: {
      alt: "UPENN-GBM-00002 個案的腦部軸向 FLAIR MRI 切片，真實公開資料集影像，無分割疊圖。",
      view: "軸向 FLAIR MRI",
      processing: "自一組 FLAIR 影像中選取單張軸向切片，僅調整灰階顯示窗並轉為 PNG，未重採樣、生成影像細節或加上腫瘤分割標記。",
      terms: "依 CC BY 4.0 提供，須保留來源、授權連結與修改說明，並遵循 TCIA 不得重新識別個案等使用規範。此圖不受本站保留所有權利的頁尾文字限制。",
      termsLabel: "TCIA 資料使用規範"
    },
    en: {
      alt: "Axial FLAIR brain MRI slice from public dataset subject UPENN-GBM-00002, without a segmentation overlay.",
      view: "Axial FLAIR MRI",
      processing: "One axial slice was selected from a FLAIR series and exported to PNG with grayscale display windowing only. No resampling, generated detail, or tumor segmentation overlay was applied.",
      terms: "Provided under CC BY 4.0 with source, license link, and modification notice, subject to TCIA policies including no re-identification of participants. This image is excluded from the site's all-rights-reserved footer notice.",
      termsLabel: "TCIA data usage policy"
    }
  },
  echo: {
    image: "assets/data-examples/ev9v-plax-example.jpg",
    width: 320,
    height: 240,
    name: "EV9V",
    subject: "PLHLA · Frame 0",
    source: "https://huggingface.co/datasets/bgx666/EV9V",
    citation: "Gou, B., Zhang, J., Xiong, J., He, T., et al. (2026). EV9V: Echocardiographic View 9 Varieties. Reference supplied by the dataset authors: Spatio-Temporal Fusion Model for Standard View Classification of Echocardiographic Videos.",
    citationUrl: "https://huggingface.co/datasets/bgx666/EV9V/blob/main/README.md#citation",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    zh: {
      alt: "EV9V 公開資料集單一影片的胸骨旁長軸心臟超音波影格。",
      view: "胸骨旁長軸（PLHLA）",
      processing: "直接使用資料集中的單張原始 JPEG，未裁切、重採樣或修改像素。畫面中的儀器資訊與量測線來自原始影像，不是本人模型的輸出。",
      terms: "資料集作者以 CC BY 4.0 發布，可在保留署名、來源及授權資訊下分享。這張影像僅用於介紹超音波模態，不作臨床診斷，也不適用本站的保留所有權利聲明。"
    },
    en: {
      alt: "A parasternal long-axis echocardiography frame from one video in the public EV9V dataset.",
      view: "Parasternal long axis (PLHLA)",
      processing: "One original JPEG is used byte-for-byte, without cropping, resampling, or pixel changes. Scanner information and measurement lines belong to the source image, not to a model developed by the website author.",
      terms: "Released by the dataset authors under CC BY 4.0, allowing sharing with credit, source and license information. This example illustrates the imaging modality only and is not for clinical diagnosis. The site's all-rights-reserved notice does not apply to this image."
    }
  }
};

function renderResearchFigure(item, lang) {
  const sample = datasetExamples[item.dataset];
  if (sample) {
    const localized = sample[lang];
    return `<figure class="research-visual">
      <div class="research-figure research-figure--dataset"><img src="${sample.image}" width="${sample.width}" height="${sample.height}" alt="${escapeHtml(localized.alt)}" loading="lazy" decoding="async"></div>
    </figure>`;
  }
  return `<figure class="research-visual">
    <div class="research-figure research-figure--project"><span class="project-wordmark">Taiwan AICoE</span><strong>${escapeHtml(item.figureTitle).replaceAll("&lt;br&gt;", "<br>")}</strong><div class="project-topics">${item.figureTopics.map((topic) => `<span>${escapeHtml(topic)}</span>`).join("")}</div></div>
  </figure>`;
}

function renderDatasetSources(lang, copy) {
  const container = document.getElementById("dataset-source-notes");
  if (!container) return;
  container.innerHTML = Object.values(datasetExamples).map((sample) => {
    const localized = sample[lang];
    return `<article>
      <h3>${sample.name}</h3>
      <p class="source-subject">${sample.subject} · ${escapeHtml(localized.view)}</p>
      <p>${escapeHtml(localized.processing)}</p>
      <p>${escapeHtml(localized.terms)}</p>
      <p class="source-citation">${escapeHtml(sample.citation)}</p>
      <div class="source-links"><a href="${sample.source}">${copy.sourceLinks} ↗</a><a href="${sample.citationUrl}">${copy.sourceCitation} ↗</a><a href="${sample.licenseUrl}">${sample.license} ↗</a>${sample.termsUrl ? `<a href="${sample.termsUrl}">${localized.termsLabel} ↗</a>` : ""}</div>
    </article>`;
  }).join("") + copy.research.filter((item) => item.caption).map((item) => `<div class="project-source-note"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.caption)}</p></div>`).join("") + `<a class="source-record" href="assets/data-examples/ATTRIBUTION.md">${copy.provenanceLink} ↗</a>`;
}

function renderDesign(lang, ui) {
  const copy = designCopy[lang];
  document.querySelectorAll("[data-copy]").forEach((element) => {
    const value = copy[element.dataset.copy];
    if (typeof value === "string") {
      element.innerHTML = escapeHtml(value).replaceAll("&lt;br&gt;", "<br>");
    }
  });
  document.querySelectorAll("[data-footer-nav]").forEach((link) => {
    link.textContent = ui.nav[link.dataset.footerNav];
  });
  document.querySelectorAll("[data-site-email]").forEach((link) => {
    link.textContent = ui.contact.email;
    link.href = `mailto:${ui.contact.email}`;
  });
  document.querySelectorAll("[data-site-github]").forEach((link) => {
    link.href = ui.contact.githubHref;
  });
  const research = document.getElementById("research-cards");
  if (research) {
    research.innerHTML = copy.research.map((item) => `
      <article class="research-card reveal">
        ${renderResearchFigure(item, lang)}
        <h3>${escapeHtml(item.title)}</h3><p class="research-label">${escapeHtml(item.label)}</p><p class="research-description">${escapeHtml(item.description)}</p>
        <ul class="research-topics">${item.topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}</ul>
        <a class="text-link research-link" href="${item.href}">${escapeHtml(item.linkLabel)}</a>
      </article>
    `).join("");
    renderDatasetSources(lang, copy);
  }
  const selected = document.getElementById("selected-publications");
  if (selected) {
    selected.innerHTML = ui.publications.items.slice(0, 2).map((item, index) => {
      const link = item.links[0];
      return `<article class="selected-item reveal"><span class="selected-year">${index === 0 ? "2026" : "2025"}</span><div><p class="paper-type">${escapeHtml(item.kind)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.venue)} · ${escapeHtml(item.role)}</p></div><a href="${escapeHtml(link ? link.href : "publications.html")}">${link ? copy.readWork : copy.viewWork}</a></article>`;
    }).join("");
  }
  const journeys = document.getElementById("journey-links");
  if (journeys) {
    journeys.innerHTML = copy.journeys.map((item) => `<a class="journey-card reveal" href="${item.key}.html"><span>${item.label}</span><span class="journey-arrow" aria-hidden="true">↗</span><h3>${escapeHtml(ui.nav[item.key])}</h3><p>${escapeHtml(item.description)}</p></a>`).join("");
  }
  const menu = document.querySelector(".menu-toggle");
  if (menu) {
    menu.setAttribute("aria-label", menu.getAttribute("aria-expanded") === "true" ? copy.menuClose : copy.menuOpen);
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function getStoredValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors in restricted environments.
  }
}

function getSortOrder(pageKey) {
  const savedOrder = getStoredValue(`${SORT_KEY_PREFIX}${pageKey}`);
  return savedOrder === "asc" || savedOrder === "desc" ? savedOrder : "desc";
}

function getOrderedItems(items, pageKey) {
  const sourceOrder = SOURCE_SORT_ORDERS[pageKey];
  const selectedOrder = getSortOrder(pageKey);

  if (!sourceOrder || selectedOrder === sourceOrder) {
    return items;
  }

  return [...items].reverse();
}

function updateSortControls(pageKey, lang) {
  const toolbar = document.querySelector("[data-sort-toolbar]");
  if (!toolbar || !SOURCE_SORT_ORDERS[pageKey]) {
    return;
  }

  const copy = sortCopy[lang] || sortCopy.en;
  const selectedOrder = getSortOrder(pageKey);
  const label = toolbar.querySelector("[data-sort-label]");
  const group = toolbar.querySelector("[data-sort-group]");

  if (label) {
    label.textContent = copy.label;
  }

  if (group) {
    group.setAttribute("aria-label", copy.group);
  }

  toolbar.querySelectorAll("[data-sort-order]").forEach((button) => {
    const order = button.dataset.sortOrder;
    const isActive = order === selectedOrder;
    button.textContent = copy[order];
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function setLink(id, label, href) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  element.textContent = label;
  element.href = href;

  const isPlaceholder = href === "#";
  element.classList.toggle("is-placeholder", isPlaceholder);
  element.setAttribute("aria-disabled", String(isPlaceholder));
}

function updateActiveNav(pageKey) {
  PAGE_KEYS.forEach((key) => {
    const node = document.getElementById(`nav-${key}`);
    if (!node) {
      return;
    }

    const isActive = key === pageKey;
    node.classList.toggle("is-current", isActive);
    if (isActive) {
      node.setAttribute("aria-current", "page");
    } else {
      node.removeAttribute("aria-current");
    }
  });
}

function resolvePageTitle(ui, pageKey) {
  const pageLabel = ui.nav?.[pageKey];
  if (!pageLabel || pageKey === "about") {
    return ui.pageTitle;
  }

  return `${ui.pageTitle} | ${pageLabel}`;
}

function renderMetrics(items) {
  const container = document.getElementById("metrics-container");
  if (!container) {
    return;
  }

  container.innerHTML = items.map((item) => `
    <article class="metric reveal">
      <h3>${escapeHtml(item.value)}</h3>
      <p>${escapeHtml(item.label)}</p>
    </article>
  `).join("");
}

function renderEducation(items) {
  const container = document.getElementById("education-list");
  if (!container) {
    return;
  }

  container.innerHTML = items.map((item) => `
    <article class="timeline-item reveal">
      <div class="item-top">
        <h3>${escapeHtml(item.title)}</h3>
      </div>
      <p class="item-sub">${escapeHtml(item.subtitle)}</p>
      ${item.note ? `<p class="item-note">${escapeHtml(item.note)}</p>` : ""}
    </article>
  `).join("");
}

function renderExperience(items) {
  const container = document.getElementById("experience-list");
  if (!container) {
    return;
  }

  container.innerHTML = items.map((item) => `
    <article class="timeline-item reveal">
      <div class="item-top">
        <h3>${escapeHtml(item.title)}</h3>
      </div>
      ${item.period ? `<p class="item-sub">${escapeHtml(item.period)}</p>` : ""}
      <ul class="content-list">
        ${item.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

function renderPublications(items) {
  const container = document.getElementById("publications-list");
  if (!container) {
    return;
  }

  container.innerHTML = items.map((item) => {
    const links = Array.isArray(item.links)
      ? item.links.map((link) => {
          const isPlaceholder = link.href === "#";
          const href = isPlaceholder ? "#" : encodeURI(link.href);
          const classes = isPlaceholder ? " class=\"is-placeholder\" aria-disabled=\"true\"" : "";
          return `<a href="${escapeHtml(href)}"${classes}>${escapeHtml(link.label)}</a>`;
        }).join("")
      : "";

    return `
      <article class="timeline-item reveal">
        <div class="item-top">
          <h3 class="paper-title">${escapeHtml(item.title)}</h3>
        </div>
        <p class="paper-type">${escapeHtml(item.kind)}</p>
        <p class="item-sub">${escapeHtml(item.venue)}</p>
        <p class="item-note">${escapeHtml(item.role)}</p>
        ${item.description ? `<p class="paper-description">${escapeHtml(item.description)}</p>` : ""}
        ${links ? `<div class="paper-links">${links}</div>` : ""}
      </article>
    `;
  }).join("");
}

function renderTeaching(items, instructorLabel) {
  const container = document.getElementById("teaching-list");
  if (!container) {
    return;
  }

  container.innerHTML = items.map((item) => `
    <article class="teaching-item reveal">
      <p class="teaching-term">${escapeHtml(item.term)}</p>
      <h3 class="teaching-course">${escapeHtml(item.course)}</h3>
      <p class="teaching-meta">${escapeHtml(item.audience)}</p>
      <p class="teaching-meta">${escapeHtml(instructorLabel)}: ${escapeHtml(item.instructor)}</p>
    </article>
  `).join("");
}

function renderActivities(items) {
  const container = document.getElementById("activities-list");
  if (!container) {
    return;
  }

  const renderClubs = (clubs) => `<ul class="club-list">${clubs.map((club) => `<li>${escapeHtml(club)}</li>`).join("")}</ul>`;

  container.innerHTML = items.map((item) => `
    <article class="club-card${item.groups ? " club-card-grouped" : ""} reveal">
      <h3>${escapeHtml(item.stage)}</h3>
      ${item.groups ? `<div class="club-groups">${item.groups.map((group) => `
        <section class="club-group">
          <h4>${escapeHtml(group.title)}</h4>
          ${renderClubs(group.clubs)}
        </section>
      `).join("")}</div>` : renderClubs(item.clubs)}
    </article>
  `).join("");
}

function setLanguageButtons(lang) {
  document.querySelectorAll("[data-set-lang]").forEach((button) => {
    const isActive = button.dataset.setLang === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelectorAll("[data-lang-choice]").forEach((button) => {
    const isActive = button.dataset.langChoice === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function getActiveTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function updateThemeButtons(lang) {
  const currentTheme = getActiveTheme();
  const targetTheme = currentTheme === "dark" ? "light" : "dark";
  const copy = themeCopy[lang] || themeCopy.en;
  const label = copy[targetTheme];
  const shortLabel = copy[`${targetTheme}Short`];

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.setAttribute("aria-pressed", String(currentTheme === "dark"));

    const icon = button.querySelector(".theme-icon");
    if (icon) {
      icon.textContent = targetTheme === "dark" ? "☾" : "☀";
    }

    const text = button.querySelector(".theme-label");
    if (text) {
      text.textContent = shortLabel;
    }
  });
}

function setTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;

  if (persist) {
    setStoredValue(THEME_KEY, theme);
  }

  updateThemeButtons(currentLanguage);
}

function setupRevealObserver() {
  if (prefersReducedMotion) {
    document.querySelectorAll(".reveal").forEach((node) => node.classList.add("in-view"));
    return;
  }

  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 24, 260)}ms`;
    revealObserver.observe(node);
  });
}

function bindTiltCards() {
  if (prefersReducedMotion) {
    return;
  }

  document.querySelectorAll(".hover-tilt").forEach((card) => {
    if (card.dataset.tiltBound === "1") {
      return;
    }

    card.dataset.tiltBound = "1";
    card.addEventListener("mousemove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const tiltX = ((y - centerY) / centerY) * -3.5;
      const tiltY = ((x - centerX) / centerX) * 3.5;
      card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  });
}

function unlockSite(immediate = false) {
  body.classList.remove("is-locked");
  document.querySelectorAll(".site-header, main, .site-footer").forEach((element) => { element.inert = false; });

  if (intro) {
    if (immediate) {
      intro.style.display = "none";
    } else {
      intro.classList.add("is-hidden");
      window.setTimeout(() => {
        intro.style.display = "none";
      }, 700);
    }
  }

  setupRevealObserver();
  bindTiltCards();
  if (!immediate) {
    document.getElementById("main")?.focus({ preventScroll: true });
  }
}

function renderSite(lang) {
  const ui = content[lang];
  if (!ui) {
    return;
  }

  const pageKey = body.dataset.page && PAGE_KEYS.includes(body.dataset.page)
    ? body.dataset.page
    : "about";

  body.dataset.lang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  document.title = resolvePageTitle(ui, pageKey);

  setText("intro-kicker", ui.intro.kicker);
  setText("intro-title", ui.intro.title);
  setText("intro-copy", ui.intro.copy);
  setText("enter-btn", ui.intro.enter);

  setText("nav-about", ui.nav.about);
  setText("nav-education", ui.nav.education);
  setText("nav-experience", ui.nav.experience);
  setText("nav-publications", ui.nav.publications);
  setText("nav-teaching", ui.nav.teaching);
  setText("nav-activities", ui.nav.activities);
  setText("nav-contact", ui.nav.contact);
  updateActiveNav(pageKey);

  setText("hero-tag", ui.hero.tag);
  setText("hero-name-zh", ui.hero.namePrimary);
  setText("hero-name-en", ui.hero.nameSecondary);
  setText("hero-title", ui.hero.title);
  setText("hero-affiliation", ui.hero.affiliation);
  setText("hero-primary", ui.hero.primary);
  setText("hero-secondary", ui.hero.secondary);
  renderMetrics(ui.hero.metrics);

  setText("about-tag", ui.about.tag);
  setText("about-title", ui.about.title);
  setText("about-lead", ui.about.lead);

  setText("education-tag", ui.education.tag);
  setText("education-title", ui.education.title);
  renderEducation(getOrderedItems(ui.education.items, "education"));

  setText("experience-tag", ui.experience.tag);
  setText("experience-title", ui.experience.title);
  renderExperience(getOrderedItems(ui.experience.items, "experience"));

  setText("publications-tag", ui.publications.tag);
  setText("publications-title", ui.publications.title);
  setText("publications-summary", ui.publications.summary);
  renderPublications(getOrderedItems(ui.publications.items, "publications"));

  setText("teaching-tag", ui.teaching.tag);
  setText("teaching-title", ui.teaching.title);
  setText("teaching-summary", ui.teaching.summary);
  renderTeaching(getOrderedItems(ui.teaching.items, "teaching"), ui.teaching.instructorLabel);

  setText("activities-tag", ui.activities.tag);
  setText("activities-title", ui.activities.title);
  renderActivities(getOrderedItems(ui.activities.items, "activities"));

  setText("contact-tag", ui.contact.tag);
  setText("contact-title", ui.contact.title);
  setText("contact-copy", ui.contact.copy);
  setLink("contact-github", ui.contact.githubLabel, ui.contact.githubHref);
  setLink("contact-scholar", ui.contact.scholarLabel, ui.contact.scholarHref);

  const emailNode = document.getElementById("contact-email");
  if (emailNode) {
    emailNode.textContent = ui.contact.email;
    emailNode.href = `mailto:${ui.contact.email}`;
  }

  const year = String(new Date().getFullYear());
  setText("footer-text", ui.footer.replace("{year}", year));
  renderDesign(lang, ui);

  setLanguageButtons(lang);
  updateThemeButtons(lang);
  updateSortControls(pageKey, lang);

  if (!body.classList.contains("is-locked")) {
    setupRevealObserver();
    bindTiltCards();
  }
}

function detectInitialLanguage() {
  const saved = getStoredValue(LANG_KEY);
  if (saved === "zh" || saved === "en") {
    return saved;
  }

  const browserLanguage = (navigator.language || "").toLowerCase();
  return browserLanguage.startsWith("zh") ? "zh" : "en";
}

let currentLanguage = detectInitialLanguage();
renderSite(currentLanguage);

if (!intro || prefersReducedMotion || getStoredValue(INTRO_KEY) === "1") {
  unlockSite(true);
} else {
  document.querySelectorAll(".site-header, main, .site-footer").forEach((element) => { element.inert = true; });
  intro.querySelector("[data-lang-choice]")?.focus();
}

document.querySelectorAll("[data-set-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    currentLanguage = button.dataset.setLang;
    setStoredValue(LANG_KEY, currentLanguage);
    renderSite(currentLanguage);
  });
});

document.querySelectorAll("[data-lang-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    currentLanguage = button.dataset.langChoice;
    setStoredValue(LANG_KEY, currentLanguage);
    renderSite(currentLanguage);
  });
});

document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = getActiveTheme() === "dark" ? "light" : "dark";
    setTheme(nextTheme, true);
  });
});

document.querySelectorAll("[data-sort-order]").forEach((button) => {
  button.addEventListener("click", () => {
    const pageKey = body.dataset.page;
    const order = button.dataset.sortOrder;

    if (!SOURCE_SORT_ORDERS[pageKey] || (order !== "asc" && order !== "desc")) {
      return;
    }

    setStoredValue(`${SORT_KEY_PREFIX}${pageKey}`, order);
    renderSite(currentLanguage);
  });
});

if (enterBtn) {
  enterBtn.addEventListener("click", () => {
    setStoredValue(INTRO_KEY, "1");
    setStoredValue(LANG_KEY, currentLanguage);
    unlockSite(false);
  });
}

const menuButton = document.querySelector(".menu-toggle");
const siteNavigation = document.getElementById("site-nav");

function closeNavigation() {
  siteNavigation?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", designCopy[currentLanguage].menuOpen);
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? designCopy[currentLanguage].menuClose : designCopy[currentLanguage].menuOpen);
  siteNavigation?.classList.toggle("is-open", isOpen);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
    closeNavigation();
    menuButton.focus();
  }
  if (event.key === "Tab" && body.classList.contains("is-locked") && intro) {
    const controls = [...intro.querySelectorAll("button")];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) {
    closeNavigation();
  }
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 1160) { closeNavigation(); }
});

if (cursorGlow && !prefersReducedMotion) {
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") { return; }
    cursorGlow.style.opacity = "1";
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });

  window.addEventListener("pointerleave", () => {
    cursorGlow.style.opacity = "0";
  });
}
