/*
 * Googleスプレッドシートを「ウェブに公開」した際のCSV URLをここに設定してください。
 * 設定手順は README.md の「データ表(Googleスプレッドシート連携)」を参照。
 * 例: "https://docs.google.com/spreadsheets/d/e/2PACX-xxxxx/pub?output=csv"
 */
const SHEET_CSV_URL = "";

// URL未設定時にサンプル表示するダミーCSV(1行目がヘッダー)
const SAMPLE_CSV = `名前,カテゴリ,ステータス,更新日
TaskFlow,生産性,公開中,2026-07-01
ColorPick,ツール,公開中,2026-06-15
Puzzle Lab,ゲーム,開発中,2026-08-01`;

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function renderTable(rows) {
  const table = document.getElementById("data-table-el");
  const status = document.getElementById("data-table-status");
  if (!rows.length) {
    status.textContent = "データがありません。";
    return;
  }

  const [header, ...body] = rows;
  const thead = `<thead><tr>${header.map((h) => `<th>${h}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${body
    .map((r) => `<tr>${r.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;

  table.innerHTML = thead + tbody;
  table.hidden = false;
  status.hidden = true;
}

async function loadData() {
  const status = document.getElementById("data-table-status");

  if (!SHEET_CSV_URL) {
    status.textContent = "※ サンプルデータを表示中です(js/data-table.js にスプレッドシートURLを設定してください)";
    renderTable(parseCSV(SAMPLE_CSV));
    return;
  }

  try {
    const res = await fetch(SHEET_CSV_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    renderTable(parseCSV(text));
  } catch (err) {
    status.textContent = "データの読み込みに失敗しました。時間をおいて再度お試しください。";
    console.error("data-table load error:", err);
  }
}

loadData();
