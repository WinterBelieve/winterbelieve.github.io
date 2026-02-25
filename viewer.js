const VIEWER_DOCS = {
  nst2024: {
    file: "publications/nst2024_paper.pdf",
    zh: {
      title: "NST2024：Application of Incremental Learning to Medical Image Segmentation of Glioblastoma Multiforme",
      meta: "研討會論文・第一作者"
    },
    en: {
      title: "NST2024: Application of Incremental Learning to Medical Image Segmentation of Glioblastoma Multiforme",
      meta: "Conference Paper · First Author"
    }
  },
  acml2025: {
    file: "publications/acml2025_workshop.pdf",
    zh: {
      title: "ACML 2025 Workshop（MASH）：Self-Supervised Masked Autoencoders for High-Accuracy Left Ventricle Segmentation in Echocardiography",
      meta: "工作坊口頭報告・第一作者"
    },
    en: {
      title: "ACML 2025 Workshop (MASH): Self-Supervised Masked Autoencoders for High-Accuracy Left Ventricle Segmentation in Echocardiography",
      meta: "Workshop Oral Presentation · First Author"
    }
  },
  thesis: {
    file: "publications/master_thesis.pdf",
    zh: {
      title: "使用全腦分割影像提升神經膠質瘤復發樣態預測準確度",
      meta: "碩士論文"
    },
    en: {
      title: "Master's Thesis: Enhancing the Prediction Accuracy of Glioblastoma Recurrence Patterns Using Whole Brain Segmentation Images",
      meta: "Master's Thesis"
    }
  }
};

function readViewerLang() {
  try {
    const saved = window.localStorage.getItem("daniel_site_lang");
    if (saved === "zh" || saved === "en") {
      return saved;
    }
  } catch {
    // Ignore storage errors.
  }

  const htmlLang = (document.documentElement.lang || "zh-Hant").toLowerCase();
  return htmlLang.startsWith("en") ? "en" : "zh";
}

function setNodeText(id, value) {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
}

function renderViewerPage() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get("doc");
  const doc = VIEWER_DOCS[key] || VIEWER_DOCS.nst2024;
  const lang = readViewerLang();
  const copy = doc[lang] || doc.en;
  const fileHref = encodeURI(doc.file);

  setNodeText("viewer-tag", lang === "zh" ? "文件檢視" : "Document Viewer");
  setNodeText("viewer-title", copy.title);
  setNodeText("viewer-meta", copy.meta);
  setNodeText("viewer-back", lang === "zh" ? "返回學術成果" : "Back to Publications");

  const frame = document.getElementById("doc-frame");
  if (frame) {
    frame.src = `${fileHref}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
    frame.title = copy.title;
  }
}

renderViewerPage();

document.querySelectorAll("[data-set-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    window.setTimeout(renderViewerPage, 0);
  });
});
