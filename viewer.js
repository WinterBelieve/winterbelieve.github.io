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

const VIEWER_UI = {
  zh: {
    tag: "文件檢視",
    back: "返回學術成果",
    prev: "上一頁",
    next: "下一頁",
    loading: "載入文件中...",
    error: "無法在此裝置內嵌顯示文件，請改用桌機瀏覽。",
    page: (current, total) => `第 ${current} / ${total} 頁`
  },
  en: {
    tag: "Document Viewer",
    back: "Back to Publications",
    prev: "Previous",
    next: "Next",
    loading: "Loading document...",
    error: "Unable to render this document inline on this device.",
    page: (current, total) => `Page ${current} / ${total}`
  }
};

const PDF_JS_VERSION = "3.11.174";
const PDF_WORKER_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDF_JS_VERSION}/build/pdf.worker.min.js`;

const viewerState = {
  currentDocKey: "",
  pdfDoc: null,
  currentPage: 1,
  totalPages: 0,
  renderToken: 0,
  resizeTimer: null
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

function getUiByLang(lang) {
  return VIEWER_UI[lang] || VIEWER_UI.en;
}

function setNodeText(id, value) {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
}

function setLoadingState(message) {
  const loadingNode = document.getElementById("pdf-loading");
  const canvas = document.getElementById("pdf-canvas");
  const errorNode = document.getElementById("pdf-error");

  if (loadingNode) {
    loadingNode.hidden = false;
    loadingNode.textContent = message;
  }
  if (canvas) {
    canvas.hidden = true;
  }
  if (errorNode) {
    errorNode.hidden = true;
    errorNode.textContent = "";
  }
}

function setErrorState(message) {
  const loadingNode = document.getElementById("pdf-loading");
  const canvas = document.getElementById("pdf-canvas");
  const errorNode = document.getElementById("pdf-error");

  if (loadingNode) {
    loadingNode.hidden = true;
  }
  if (canvas) {
    canvas.hidden = true;
  }
  if (errorNode) {
    errorNode.hidden = false;
    errorNode.textContent = message;
  }
}

function setCanvasVisible() {
  const loadingNode = document.getElementById("pdf-loading");
  const canvas = document.getElementById("pdf-canvas");
  const errorNode = document.getElementById("pdf-error");

  if (loadingNode) {
    loadingNode.hidden = true;
  }
  if (canvas) {
    canvas.hidden = false;
  }
  if (errorNode) {
    errorNode.hidden = true;
    errorNode.textContent = "";
  }
}

function updatePaginationUi(lang) {
  const ui = getUiByLang(lang);
  setNodeText("pdf-prev", ui.prev);
  setNodeText("pdf-next", ui.next);

  const indicator = document.getElementById("pdf-page-indicator");
  if (indicator) {
    if (viewerState.totalPages > 0) {
      indicator.textContent = ui.page(viewerState.currentPage, viewerState.totalPages);
    } else {
      indicator.textContent = "";
    }
  }

  const prevBtn = document.getElementById("pdf-prev");
  const nextBtn = document.getElementById("pdf-next");
  if (prevBtn) {
    prevBtn.disabled = viewerState.currentPage <= 1 || !viewerState.pdfDoc;
  }
  if (nextBtn) {
    nextBtn.disabled = viewerState.currentPage >= viewerState.totalPages || !viewerState.pdfDoc;
  }
}

async function renderCurrentPage() {
  if (!viewerState.pdfDoc) {
    return;
  }

  const canvas = document.getElementById("pdf-canvas");
  const stage = document.getElementById("pdf-stage");
  if (!canvas || !stage) {
    return;
  }

  const token = viewerState.renderToken;
  const page = await viewerState.pdfDoc.getPage(viewerState.currentPage);
  if (token !== viewerState.renderToken) {
    return;
  }

  const baseViewport = page.getViewport({ scale: 1 });
  const availableWidth = Math.max(260, stage.clientWidth - 20);
  const cssScale = availableWidth / baseViewport.width;
  const viewport = page.getViewport({ scale: cssScale });

  const outputScale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = `${Math.floor(viewport.width)}px`;
  canvas.style.height = `${Math.floor(viewport.height)}px`;

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const renderContext = {
    canvasContext: context,
    viewport,
    transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0]
  };

  await page.render(renderContext).promise;
  if (token !== viewerState.renderToken) {
    return;
  }

  setCanvasVisible();
  updatePaginationUi(readViewerLang());
}

async function loadDocument(docKey, filePath) {
  const lang = readViewerLang();
  const ui = getUiByLang(lang);

  if (!window.pdfjsLib) {
    setErrorState(ui.error);
    return;
  }

  window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;

  viewerState.renderToken += 1;
  viewerState.currentDocKey = docKey;
  viewerState.pdfDoc = null;
  viewerState.currentPage = 1;
  viewerState.totalPages = 0;
  updatePaginationUi(lang);
  setLoadingState(ui.loading);

  try {
    const loadingTask = window.pdfjsLib.getDocument({ url: encodeURI(filePath) });
    const pdfDoc = await loadingTask.promise;
    if (viewerState.currentDocKey !== docKey) {
      return;
    }

    viewerState.pdfDoc = pdfDoc;
    viewerState.totalPages = pdfDoc.numPages;
    viewerState.currentPage = 1;
    updatePaginationUi(lang);
    await renderCurrentPage();
  } catch {
    setErrorState(ui.error);
  }
}

function renderViewerPage() {
  const params = new URLSearchParams(window.location.search);
  const docKey = params.get("doc");
  const doc = VIEWER_DOCS[docKey] || VIEWER_DOCS.nst2024;
  const lang = readViewerLang();
  const copy = doc[lang] || doc.en;
  const ui = getUiByLang(lang);

  setNodeText("viewer-tag", ui.tag);
  setNodeText("viewer-title", copy.title);
  setNodeText("viewer-meta", copy.meta);
  setNodeText("viewer-back", ui.back);

  updatePaginationUi(lang);

  const effectiveKey = VIEWER_DOCS[docKey] ? docKey : "nst2024";
  if (viewerState.currentDocKey !== effectiveKey) {
    loadDocument(effectiveKey, doc.file);
  }
}

function turnPage(step) {
  if (!viewerState.pdfDoc) {
    return;
  }

  const nextPage = viewerState.currentPage + step;
  if (nextPage < 1 || nextPage > viewerState.totalPages) {
    return;
  }

  viewerState.currentPage = nextPage;
  updatePaginationUi(readViewerLang());
  renderCurrentPage();
}

const prevBtn = document.getElementById("pdf-prev");
if (prevBtn) {
  prevBtn.addEventListener("click", () => turnPage(-1));
}

const nextBtn = document.getElementById("pdf-next");
if (nextBtn) {
  nextBtn.addEventListener("click", () => turnPage(1));
}

window.addEventListener("resize", () => {
  if (!viewerState.pdfDoc) {
    return;
  }

  window.clearTimeout(viewerState.resizeTimer);
  viewerState.resizeTimer = window.setTimeout(() => {
    renderCurrentPage();
  }, 160);
});

document.querySelectorAll("[data-set-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    window.setTimeout(renderViewerPage, 0);
  });
});

renderViewerPage();
