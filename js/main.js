/*
 * アプリを追加するには、下のAPPS配列に1オブジェクト追加するだけでOKです。
 * icon: 絵文字1文字でOK / tag: フィルター用のカテゴリ名
 */
const APPS = [
  {
    icon: "📝",
    tag: "生産性",
    title: "TaskFlow",
    desc: "シンプルなToDo管理アプリ。ドラッグ&ドロップで並び替えができます。",
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    icon: "🎨",
    tag: "ツール",
    title: "ColorPick",
    desc: "画像から配色パレットを抽出できるカラーツールです。",
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    icon: "🎮",
    tag: "ゲーム",
    title: "Puzzle Lab",
    desc: "ブラウザで遊べるパズルゲーム。スコアランキング機能付き。",
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    icon: "📊",
    tag: "ツール",
    title: "QuickChart",
    desc: "CSVを貼り付けるだけでグラフを自動生成するツールです。",
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    icon: "📸",
    tag: "ツール",
    title: "CaptureApp",
    desc: "画面上の指定した範囲だけをキャプチャして常に最前面に表示できるWindows用キャプチャツール。OCRと翻訳機能付き。",
    downloadUrl: "https://github.com/satoru-ta/CaptureApp/releases/tag/v1.0.0",
  },
];

const grid = document.getElementById("apps-grid");
const filterBar = document.getElementById("filter-bar");

function renderApps(filter) {
  grid.innerHTML = "";
  const list = filter === "all" ? APPS : APPS.filter((a) => a.tag === filter);

  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-soft)">該当するアプリがありません。</p>`;
    return;
  }

  list.forEach((app) => {
    const links = [];
    if (app.demoUrl) {
      links.push(`<a class="primary" href="${app.demoUrl}" target="_blank" rel="noopener">試す</a>`);
    } else if (app.downloadUrl) {
      links.push(`<a class="primary" href="${app.downloadUrl}" target="_blank" rel="noopener">ダウンロード</a>`);
    }
    if (app.codeUrl) {
      links.push(`<a href="${app.codeUrl}" target="_blank" rel="noopener">コード</a>`);
    }

    const card = document.createElement("article");
    card.className = "app-card";
    card.innerHTML = `
      <div class="app-thumb">${app.icon}</div>
      <div class="app-body">
        <span class="app-tag">${app.tag}</span>
        <h3 class="app-title">${app.title}</h3>
        <p class="app-desc">${app.desc}</p>
        <div class="app-links">${links.join("")}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function buildFilters() {
  const tags = ["all", ...new Set(APPS.map((a) => a.tag))];
  filterBar.innerHTML = tags
    .map(
      (tag, i) =>
        `<button class="filter-btn${i === 0 ? " active" : ""}" data-filter="${tag}">${
          tag === "all" ? "すべて" : tag
        }</button>`
    )
    .join("");

  filterBar.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderApps(btn.dataset.filter);
    });
  });
}

buildFilters();
renderApps("all");

// テーマ切り替え
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});

document.getElementById("year").textContent = new Date().getFullYear();
