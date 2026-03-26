const LANG_KEY = "daniel_site_lang";
const INTRO_KEY = "daniel_intro_seen";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const body = document.body;
const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enter-btn");
const cursorGlow = document.querySelector(".cursor-glow");

let revealObserver = null;

const PAGE_KEYS = [
  "about",
  "education",
  "experience",
  "publications",
  "teaching",
  "activities",
  "contact"
];

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
      title: "長庚大學臨床醫學研究所人工智慧組博士生",
      affiliation: "長庚大學｜醫學院臨床醫學研究所 / 智慧運算學院人工智慧研究所",
      primary: "查看學術成果",
      secondary: "聯絡方式",
      metrics: [
        { value: "3", label: "學術成果（論文、Workshop、碩論）" },
        { value: "12+", label: "課程 TA 支援經驗" },
        { value: "2", label: "研究助理職務（校內與醫院）" }
      ]
    },
    about: {
      tag: "自我介紹",
      title: "研究背景與方向",
      lead: "袁聖博目前為長庚大學臨床醫學研究所人工智慧組博士生，研究聚焦於腦部醫學影像與心臟超音波影像的人工智慧分析。曾從事膠質母細胞瘤復發樣態的預測研究；在心臟超音波影像方面，進行以自監督學習為核心的左心室分割模型開發。另外亦參與胃鏡與眼底鏡影像分析相關研究，累積跨模態醫學影像建模經驗。"
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
          title: "人工智慧組博士生",
          subtitle: "長庚大學 臨床醫學研究所",
          note: "2024/09 - 現今"
        }
      ]
    },
    experience: {
      tag: "經歷",
      title: "研究與實務經驗",
      items: [
        {
          title: "工業技術研究院 綠能與環境研究所 實習生",
          period: "2020/09 - 2021/09",
          points: [
            "馬達波形實驗與分析（10 個月，現場）：進行波形量測、訊號分析，以及馬達驅動器與相關電子元件測試。",
            "遠距研究協作（2 個月）：協助國際專利檢索與文獻翻譯（英文期刊、日文資料），整理重點並製作簡報。"
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
          title: "研究助理職務（博士班期間）",
          period: "長庚大學 / 長庚醫院",
          points: [
            "長庚大學 研究助理",
            "長庚醫院心臟內科 兼任研究助理（Adjunct Research Assistant）"
          ]
        }
      ]
    },
    publications: {
      tag: "學術成果",
      title: "論文、投稿與學術發表",
      summary: "點擊下方連結會先進入網站內的文件展示頁，再顯示對應檔案。",
      items: [
        {
          kind: "Conference Paper",
          title: "Application of Incremental Learning to Medical Image Segmentation of Glioblastoma Multiforme",
          venue: "NST2024",
          role: "第一作者（First Author）",
          links: [
            { label: "開啟論文展示頁", href: "viewer.html?doc=nst2024" }
          ]
        },
        {
          kind: "Workshop Oral Presentation",
          title: "Self-Supervised Masked Autoencoders for High-Accuracy Left Ventricle Segmentation in Echocardiography",
          venue: "ACML 2025 Workshop - Medical AI Workshop: Making AI Safe and Healthy (MASH)",
          role: "第一作者口頭發表（First Author, Oral Presentation）",
          links: [
            { label: "開啟 Workshop 展示頁", href: "viewer.html?doc=acml2025" }
          ]
        },
        {
          kind: "Master Thesis",
          title: "使用全腦分割影像提升神經膠質瘤復發樣態預測準確度",
          venue: "長庚大學 碩士論文",
          role: "碩士論文",
          links: [
            { label: "開啟碩論展示頁", href: "viewer.html?doc=thesis" }
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
        { term: "博二下", course: "智慧運算技術導論", audience: "AIMD（醫學系、中醫系）", instructor: "林桂傑講座教授" }
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
          clubs: ["鋼琴社", "國醫社", "劍道社", "天文與太空社", "圍棋社", "桌球社", "桌遊社", "資訊社", "茶道社", "烘焙社", "登山社", "攝影社", "登山社", "漫研社"]
        }
      ]
    },
    contact: {
      tag: "聯絡",
      title: "聯絡資訊",
      copy: "目前先放 Email 與 GitHub；Google Scholar 可後續補上。",
      email: "winterdanielyuan@gmail.com",
      githubLabel: "GitHub",
      githubHref: "https://github.com/winterbelieve",
      scholarLabel: "Google Scholar（待補）",
      scholarHref: "#"
    },
    footer: "(c) {year} 袁聖博 Daniel Yuan. All rights reserved."
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
      title: "PhD in Graduate Institute of Clinical Medical Sciences, Division of Artificial Intelligence",
      affiliation: "Chang Gung University | College of Medicine / College of Intelligent Computing",
      primary: "View Publications",
      secondary: "Contact",
      metrics: [
        { value: "3", label: "Academic outputs (thesis, conference, workshop)" },
        { value: "12+", label: "Teaching assistant assignments" },
        { value: "2", label: "Research assistant positions" }
      ]
    },
    about: {
      tag: "About",
      title: "Background and Research Focus",
      lead: "Sheng-Po Yuan is currently a PhD student in the Graduate Institute of Clinical Medical Sciences, Division of Artificial Intelligence, at Chang Gung University. His research focuses on AI-based analysis of brain medical imaging and cardiac ultrasound imaging. He has previously worked on predicting recurrence patterns of glioblastoma and on self-supervised left ventricle segmentation in echocardiography. He has also participated in gastroscopy and fundus imaging research, building cross-modality experience in medical image modeling."
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
          title: "PhD Student, Division of Artificial Intelligence",
          subtitle: "Graduate Institute of Clinical Medical Sciences, Chang Gung University",
          note: "2024/09 - Present"
        }
      ]
    },
    experience: {
      tag: "Experience",
      title: "Research and Practical Experience",
      items: [
        {
          title: "Intern, Green Energy and Environment Research Laboratories, ITRI",
          period: "Sep 2020 - Sep 2021",
          points: [
            "Motor Waveform Experiment and Analysis (10 months, on-site): conducted waveform experiments, signal analysis, and testing of motor drivers and related electronic components.",
            "Remote Research Assistance (2 months): reviewed international patents, translated English and Japanese references, summarized key findings, and prepared presentation slides."
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
          title: "Research Assistant Roles During PhD Study",
          period: "Chang Gung University / Chang Gung Memorial Hospital",
          points: [
            "Research Assistant, Chang Gung University",
            "Adjunct Research Assistant, Department of Cardiology, Chang Gung Memorial Hospital"
          ]
        }
      ]
    },
    publications: {
      tag: "Publications",
      title: "Thesis, Conference, and Workshop Outputs",
      summary: "Each item links to an internal viewer page in this website, where the file is displayed.",
      items: [
        {
          kind: "Conference Paper",
          title: "Application of Incremental Learning to Medical Image Segmentation of Glioblastoma Multiforme",
          venue: "NST2024",
          role: "First Author",
          links: [
            { label: "Open Paper Viewer", href: "viewer.html?doc=nst2024" }
          ]
        },
        {
          kind: "Workshop Oral Presentation",
          title: "Self-Supervised Masked Autoencoders for High-Accuracy Left Ventricle Segmentation in Echocardiography",
          venue: "ACML 2025 Workshop - Medical AI Workshop: Making AI Safe and Healthy (MASH)",
          role: "First Author, Oral Presentation",
          links: [
            { label: "Open Workshop Viewer", href: "viewer.html?doc=acml2025" }
          ]
        },
        {
          kind: "Master Thesis",
          title: "Enhancing the Prediction Accuracy of Glioblastoma Recurrence Patterns Using Whole Brain Segmentation Images",
          venue: "Master's Thesis, Chang Gung University",
          role: "Master Thesis",
          links: [
            { label: "Open Thesis Viewer", href: "viewer.html?doc=thesis" }
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
        { term: "PhD Year 2 Spring", course: "Introduction to Intelligent Computing Technologies", audience: "AIMD, School of Medicine and School of Chinese Medicine", instructor: "Chair Prof. Kwei-Jay Lin" }
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
          clubs: ["Piano Club", "Chinese Medicine Club", "Kendo Club", "Astronomy and Space Club", "Go Club", "Table Tennis Club", "Board Game Club", "Information Club", "Teaism Club", "Baking Club", "Hiking Club"]
        }
      ]
    },
    contact: {
      tag: "Contact",
      title: "Contact Information",
      copy: "Email and GitHub are ready. Google Scholar can be added once you provide the link.",
      email: "winterdanielyuan@gmail.com",
      githubLabel: "GitHub",
      githubHref: "https://github.com/winterbelieve",
      scholarLabel: "Google Scholar (Pending)",
      scholarHref: "#"
    },
    footer: "(c) {year} Daniel Yuan. All rights reserved."
  }
};

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

  container.innerHTML = items.map((item, index) => `
    <article class="timeline-item reveal">
      <div class="item-top">
        <span class="item-index">${String(index + 1).padStart(2, "0")}</span>
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

  container.innerHTML = items.map((item, index) => `
    <article class="timeline-item reveal">
      <div class="item-top">
        <span class="item-index">${String(index + 1).padStart(2, "0")}</span>
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

  container.innerHTML = items.map((item, index) => {
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
          <span class="item-index">${String(index + 1).padStart(2, "0")}</span>
          <h3 class="paper-title">${escapeHtml(item.title)}</h3>
        </div>
        <p class="paper-type">${escapeHtml(item.kind)}</p>
        <p class="item-sub">${escapeHtml(item.venue)}</p>
        <p class="item-note">${escapeHtml(item.role)}</p>
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

  container.innerHTML = items.map((item) => `
    <article class="club-card reveal">
      <h3>${escapeHtml(item.stage)}</h3>
      <ul class="club-list">
        ${item.clubs.map((club) => `<li>${escapeHtml(club)}</li>`).join("")}
      </ul>
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
  renderEducation(ui.education.items);

  setText("experience-tag", ui.experience.tag);
  setText("experience-title", ui.experience.title);
  renderExperience(ui.experience.items);

  setText("publications-tag", ui.publications.tag);
  setText("publications-title", ui.publications.title);
  setText("publications-summary", ui.publications.summary);
  renderPublications(ui.publications.items);

  setText("teaching-tag", ui.teaching.tag);
  setText("teaching-title", ui.teaching.title);
  setText("teaching-summary", ui.teaching.summary);
  renderTeaching(ui.teaching.items, ui.teaching.instructorLabel);

  setText("activities-tag", ui.activities.tag);
  setText("activities-title", ui.activities.title);
  renderActivities(ui.activities.items);

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

  setLanguageButtons(lang);

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

if (enterBtn) {
  enterBtn.addEventListener("click", () => {
    setStoredValue(INTRO_KEY, "1");
    setStoredValue(LANG_KEY, currentLanguage);
    unlockSite(false);
  });
}

if (cursorGlow && !prefersReducedMotion) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.opacity = "1";
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });

  window.addEventListener("pointerleave", () => {
    cursorGlow.style.opacity = "0";
  });
}
