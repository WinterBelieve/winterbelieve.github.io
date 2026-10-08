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
    fullscreen: "全螢幕",
    exitFullscreen: "退出全螢幕",
    fullscreenHint: "全螢幕閱讀文件",
    exitFullscreenHint: "退出全螢幕（Esc）",
    fitPage: "符合頁面",
    fitWidth: "符合寬度",
    fitPageHint: "等比例縮放以顯示完整頁面",
    fitWidthHint: "等比例放大至畫面寬度，可捲動閱讀",
    reader: "文件閱讀區",
    pagination: "文件翻頁",
    loading: "載入文件中...",
    error: "無法在此裝置內嵌顯示文件，請改用桌機瀏覽。",
    page: (current, total) => `第 ${current} / ${total} 頁`
  },
  en: {
    tag: "Document Viewer",
    back: "Back to Publications",
    prev: "Previous",
    next: "Next",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit fullscreen",
    fullscreenHint: "Read the document in fullscreen",
    exitFullscreenHint: "Exit fullscreen (Esc)",
    fitPage: "Fit page",
    fitWidth: "Fit width",
    fitPageHint: "Scale proportionally to show the entire page",
    fitWidthHint: "Scale to the screen width; scroll to read",
    reader: "Document reader",
    pagination: "Document pagination",
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
  renderTask: null,
  resizeTimer: null,
  overlayFullscreen: false,
  fullscreenBusy: false,
  fullscreenWanted: false,
  backgroundInert: null,
  fitMode: "width"
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

function getNativeFullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement;
}

function isReaderExpanded() {
  return viewerState.overlayFullscreen || getNativeFullscreenElement() === document.getElementById("pdf-reader");
}

function updateReaderUi(lang) {
  const reader = document.getElementById("pdf-reader");
  const fullscreenButton = document.getElementById("pdf-fullscreen");
  const fitButton = document.getElementById("pdf-fit");
  if (!reader || !fullscreenButton || !fitButton) {
    return;
  }

  const ui = getUiByLang(lang);
  const expanded = isReaderExpanded();
  const fitsPage = viewerState.fitMode === "page";
  reader.classList.toggle("is-expanded", expanded);
  reader.classList.toggle("is-fit-page", expanded && fitsPage);
  reader.setAttribute("aria-label", ui.reader);
  reader.setAttribute("role", expanded ? "dialog" : "region");
  if (expanded) {
    reader.setAttribute("aria-modal", "true");
  } else {
    reader.removeAttribute("aria-modal");
  }
  document.body.classList.toggle("is-viewer-expanded", expanded);
  if (expanded && !viewerState.backgroundInert) {
    viewerState.backgroundInert = [...document.querySelectorAll(".site-header, .site-footer, .viewer-heading, .viewer-actions, .skip-link")]
      .map((node) => ({ node, inert: node.inert }));
    viewerState.backgroundInert.forEach(({ node }) => { node.inert = true; });
  } else if (!expanded && viewerState.backgroundInert) {
    viewerState.backgroundInert.forEach(({ node, inert }) => { node.inert = inert; });
    viewerState.backgroundInert = null;
  }
  fullscreenButton.setAttribute("aria-pressed", String(expanded));
  fullscreenButton.title = expanded ? ui.exitFullscreenHint : ui.fullscreenHint;
  setNodeText("pdf-fullscreen-label", expanded ? ui.exitFullscreen : ui.fullscreen);
  fitButton.hidden = !expanded;
  fitButton.textContent = fitsPage ? ui.fitWidth : ui.fitPage;
  fitButton.title = fitsPage ? ui.fitWidthHint : ui.fitPageHint;
  document.getElementById("pdf-controls")?.setAttribute("aria-label", ui.pagination);
  document.getElementById("pdf-fullscreen-icon")?.setAttribute("d", expanded
    ? "M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5"
    : "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5");
}

function schedulePageRender(delay = 0) {
  window.clearTimeout(viewerState.resizeTimer);
  viewerState.resizeTimer = window.setTimeout(renderCurrentPage, delay);
}

function syncReaderFullscreen() {
  if (getNativeFullscreenElement() === document.getElementById("pdf-reader")) {
    viewerState.overlayFullscreen = false;
    if (!viewerState.fullscreenWanted) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) {
        Promise.resolve(exit.call(document)).catch(() => {});
      }
    }
  }
  updateReaderUi(readViewerLang());
  schedulePageRender();
  if (!isReaderExpanded()) {
    viewerState.fullscreenWanted = false;
    document.getElementById("pdf-fullscreen")?.focus({ preventScroll: true });
  }
}

async function toggleReaderFullscreen() {
  const reader = document.getElementById("pdf-reader");
  if (!reader || viewerState.fullscreenBusy) {
    return;
  }

  viewerState.fullscreenBusy = true;
  viewerState.fullscreenWanted = !isReaderExpanded();
  try {
    if (viewerState.overlayFullscreen) {
      viewerState.overlayFullscreen = false;
    } else if (getNativeFullscreenElement() === reader) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) {
        await exit.call(document);
      }
    } else {
      const request = reader.requestFullscreen || reader.webkitRequestFullscreen;
      if (request) {
        try {
          // Some embedded browsers leave the native request pending indefinitely.
          await Promise.race([
            Promise.resolve(request.call(reader)),
            new Promise((resolve) => window.setTimeout(resolve, 1000))
          ]);
          if (getNativeFullscreenElement() !== reader) {
            viewerState.overlayFullscreen = true;
          }
        } catch {
          // Embedded previews and some mobile browsers disallow native fullscreen.
          viewerState.overlayFullscreen = true;
        }
      } else {
        viewerState.overlayFullscreen = true;
      }
    }
  } finally {
    viewerState.fullscreenBusy = false;
    syncReaderFullscreen();
    if (isReaderExpanded()) {
      document.getElementById("pdf-fullscreen")?.focus({ preventScroll: true });
    }
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

  const token = ++viewerState.renderToken;
  let renderTask = null;
  try {
    // Cancel before resizing the shared canvas during rapid paging or fullscreen changes.
    const previousTask = viewerState.renderTask;
    if (previousTask) {
      previousTask.cancel();
      await previousTask.promise.catch(() => {});
    }
    if (token !== viewerState.renderToken) {
      return;
    }

    const page = await viewerState.pdfDoc.getPage(viewerState.currentPage);
    if (token !== viewerState.renderToken) {
      return;
    }

    const baseViewport = page.getViewport({ scale: 1 });
    const stageStyle = window.getComputedStyle(stage);
    const availableWidth = Math.max(1, stage.clientWidth - parseFloat(stageStyle.paddingLeft) - parseFloat(stageStyle.paddingRight));
    let cssScale = availableWidth / baseViewport.width;
    if (isReaderExpanded() && viewerState.fitMode === "page") {
      const availableHeight = Math.max(1, stage.clientHeight - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom));
      cssScale = Math.min(cssScale, availableHeight / baseViewport.height);
    }
    const viewport = page.getViewport({ scale: cssScale });

    const outputScale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = "auto";

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    renderTask = page.render({
      canvasContext: context,
      viewport,
      transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0]
    });
    viewerState.renderTask = renderTask;
    await renderTask.promise;
    if (token !== viewerState.renderToken) {
      return;
    }

    setCanvasVisible();
    updatePaginationUi(readViewerLang());
  } catch (error) {
    if (token === viewerState.renderToken && error?.name !== "RenderingCancelledException") {
      setErrorState(getUiByLang(readViewerLang()).error);
    }
  } finally {
    if (viewerState.renderTask === renderTask) {
      viewerState.renderTask = null;
    }
  }
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
  updateReaderUi(lang);
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
  updateReaderUi(lang);

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
  document.querySelector(".doc-shell")?.scrollTo(0, 0);
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

document.getElementById("pdf-fullscreen")?.addEventListener("click", toggleReaderFullscreen);
document.getElementById("pdf-fit")?.addEventListener("click", () => {
  viewerState.fitMode = viewerState.fitMode === "page" ? "width" : "page";
  document.querySelector(".doc-shell")?.scrollTo(0, 0);
  updateReaderUi(readViewerLang());
  schedulePageRender();
});
document.addEventListener("fullscreenchange", syncReaderFullscreen);
document.addEventListener("webkitfullscreenchange", syncReaderFullscreen);
document.addEventListener("keydown", (event) => {
  if (!isReaderExpanded()) {
    return;
  }
  if (event.key === "Escape" && viewerState.overlayFullscreen) {
    event.preventDefault();
    toggleReaderFullscreen();
  } else if (event.key === "Tab" && viewerState.overlayFullscreen) {
    const controls = [...document.querySelectorAll("#pdf-reader button, #pdf-reader .doc-shell")].filter((node) => !node.hidden && !node.disabled);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  } else if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
    event.preventDefault();
    turnPage(event.key === "ArrowRight" ? 1 : -1);
  }
});

window.addEventListener("resize", () => {
  schedulePageRender(160);
});

document.querySelectorAll("[data-set-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    window.setTimeout(renderViewerPage, 0);
  });
});

renderViewerPage();
