// =============================================================
// 学級経営KPIナビ - アプリケーションロジック
// =============================================================

document.addEventListener("DOMContentLoaded", () => {
  initGoalTabs();
  initAnalyzer();
  initPractices();
  initNavigation();
  renderKPIs("university");
  renderPractices("all");
});


// ===== ナビゲーション =====
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      const sectionId = link.dataset.section;
      document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
    });
  });

  // スクロール時のアクティブ表示更新
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove("active"));
        const activeLink = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add("active");
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}


// ===== ゴール別KPI表示 =====
function initGoalTabs() {
  const tabs = document.querySelectorAll(".goal-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderKPIs(tab.dataset.goal);
    });
  });
}

function renderKPIs(goal) {
  const container = document.getElementById("kpi-display");
  const data = KPI_DATA[goal];
  if (!data) return;

  let html = "";

  for (const grade of [1, 2, 3]) {
    const gradeData = data.grades[grade];
    html += `
      <div class="grade-block">
        <div class="grade-header">
          <h3 class="grade-title">${gradeData.title}</h3>
          <p class="grade-overview">${gradeData.overview}</p>
        </div>

        <div class="kpi-cards">
          ${gradeData.kpis.map((kpi, i) => `
            <div class="kpi-card" style="animation-delay: ${i * 0.05}s">
              <div class="kpi-card-header">
                <span class="kpi-number">${i + 1}</span>
                <h4 class="kpi-name">${kpi.name}</h4>
              </div>
              <div class="kpi-card-body">
                <div class="kpi-detail">
                  <span class="kpi-label">目標値</span>
                  <span class="kpi-value target">${kpi.target}</span>
                </div>
                <div class="kpi-detail">
                  <span class="kpi-label">測定方法</span>
                  <span class="kpi-value">${kpi.how}</span>
                </div>
                <div class="kpi-detail">
                  <span class="kpi-label">頻度</span>
                  <span class="kpi-value freq">${kpi.frequency}</span>
                </div>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="management-tips">
          <h4 class="tips-title">マネジメントのポイント</h4>
          <ul class="tips-list">
            ${gradeData.management.map(tip => `<li>${tip}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}


// ===== KPI提案ツール =====
function initAnalyzer() {
  const btn = document.getElementById("analyze-btn");
  btn.addEventListener("click", analyzeAndSuggest);
}

function analyzeAndSuggest() {
  const grade = document.getElementById("grade-select").value;
  const goal = document.getElementById("goal-select").value;
  const text = document.getElementById("situation-input").value.trim();

  if (!text) {
    showResult(`<div class="result-error">クラスの状況を入力してください。</div>`);
    return;
  }

  // テキスト分析
  const detectedCategories = analyzeText(text);
  const gradeLabel = `${grade}年生`;
  const goalLabels = { university: "大学受験", qualification: "資格試験", employment: "就職", mixed: "混合クラス" };

  // 結果生成
  let html = `
    <div class="result-content">
      <div class="result-header">
        <h3>分析結果</h3>
        <div class="result-meta">
          <span class="meta-badge">${gradeLabel}</span>
          <span class="meta-badge">${goalLabels[goal]}</span>
        </div>
      </div>

      <div class="detected-issues">
        <h4>検出された課題領域</h4>
        <div class="issue-tags">
          ${detectedCategories.map(cat => `<span class="issue-tag">${ANALYSIS_KEYWORDS[cat].label}</span>`).join("")}
        </div>
      </div>
  `;

  // 各カテゴリの提案を出力
  detectedCategories.forEach(cat => {
    const suggestion = SUGGESTION_TEMPLATES[cat];
    if (!suggestion) return;

    html += `
      <div class="suggestion-block">
        <h4 class="suggestion-category">${ANALYSIS_KEYWORDS[cat].label}</h4>

        <div class="suggestion-section">
          <h5>推奨KPI</h5>
          <div class="suggested-kpis">
            ${suggestion.kpis.map(kpi => `
              <div class="suggested-kpi">
                <div class="suggested-kpi-name">${kpi.name}</div>
                <div class="suggested-kpi-detail">
                  <span class="skpi-label">測定方法:</span> ${kpi.measurement}
                </div>
                <div class="suggested-kpi-detail">
                  <span class="skpi-label">目標:</span> <strong>${kpi.target}</strong>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="suggestion-section">
          <h5>推奨マネジメント手法</h5>
          <div class="suggested-methods">
            ${suggestion.methods.map(method => `
              <div class="suggested-method">
                <div class="suggested-method-name">${method.name}</div>
                <div class="suggested-method-desc">${method.desc}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  });

  // ゴール別のKPIも追加提案
  if (goal !== "mixed" && KPI_DATA[goal]) {
    const goalData = KPI_DATA[goal].grades[grade];
    if (goalData) {
      html += `
        <div class="suggestion-block goal-suggestion">
          <h4 class="suggestion-category">${goalLabels[goal]}向け ― ${gradeLabel}の重点KPI</h4>
          <div class="suggested-kpis">
            ${goalData.kpis.slice(0, 3).map(kpi => `
              <div class="suggested-kpi">
                <div class="suggested-kpi-name">${kpi.name}</div>
                <div class="suggested-kpi-detail">
                  <span class="skpi-label">目標:</span> <strong>${kpi.target}</strong>
                </div>
                <div class="suggested-kpi-detail">
                  <span class="skpi-label">方法:</span> ${kpi.how}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
  }

  // 総合アドバイス
  html += `
    <div class="overall-advice">
      <h4>総合アドバイス</h4>
      <p>${generateOverallAdvice(detectedCategories, grade, goal)}</p>
    </div>
  </div>`;

  showResult(html);
}

function analyzeText(text) {
  const scores = {};

  for (const [category, data] of Object.entries(ANALYSIS_KEYWORDS)) {
    let score = 0;
    for (const keyword of data.keywords) {
      const regex = new RegExp(keyword, "gi");
      const matches = text.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    if (score > 0) {
      scores[category] = score;
    }
  }

  // スコア順にソートして上位カテゴリを返す
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  // 少なくとも1つは返す。何も検出されない場合は汎用的なカテゴリを返す
  if (sorted.length === 0) {
    return ["motivation", "academic"];
  }

  return sorted.slice(0, 4);
}

function generateOverallAdvice(categories, grade, goal) {
  const parts = [];

  if (grade === "1") {
    parts.push("1年生は学校生活への適応と基本的な習慣形成が最優先です。KPIを欲張りすぎず、まずは出席率と基礎学力の2本柱に集中することをお勧めします。");
  } else if (grade === "2") {
    parts.push("2年生は中だるみ対策と将来の方向性の明確化が重要な時期です。生徒が自分で目標を設定し、自分で進捗を管理する仕組みを段階的に導入しましょう。");
  } else {
    parts.push("3年生は目標達成に向けた実践と精神面のサポートのバランスが鍵です。個別対応の頻度を上げつつ、クラス全体の支え合いの文化も大切にしましょう。");
  }

  if (categories.includes("motivation") && categories.includes("academic")) {
    parts.push("モチベーションと学力の課題が同時に見られます。成績向上を直接求めるより、小さな成功体験の積み重ねでまず意欲を回復させるアプローチが効果的です。");
  }

  if (categories.includes("attendance")) {
    parts.push("出席に課題がある場合は、表面的な指導だけでなく生活リズム全体を見渡した支援が必要です。必要に応じてスクールカウンセラーとの連携も検討してください。");
  }

  if (categories.includes("relationship")) {
    parts.push("人間関係の課題はKPIだけでは測りにくい領域です。定期的な学級満足度調査（Q-U等）と日常の観察を組み合わせ、早期発見・早期対応を心がけましょう。");
  }

  parts.push("KPIは「管理するための数字」ではなく「生徒の成長を支えるための指標」です。数値目標を生徒と一緒に決め、達成のプロセスを一緒に振り返ることで、自律的な成長を促しましょう。");

  return parts.join("<br><br>");
}

function showResult(html) {
  const container = document.getElementById("analyzer-result");
  container.innerHTML = html;
  container.scrollIntoView({ behavior: "smooth", block: "nearest" });
}


// ===== 実践事例集 =====
function initPractices() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderPractices(btn.dataset.category);
    });
  });
}

function renderPractices(category) {
  const container = document.getElementById("practices-display");
  const filtered = category === "all"
    ? PRACTICES
    : PRACTICES.filter(p => p.category === category);

  const categoryLabels = {
    motivation: "モチベーション",
    discipline: "生活指導",
    academic: "学習管理",
    career: "進路指導",
    parent: "保護者連携",
    team: "学級組織"
  };

  let html = "";

  filtered.forEach((practice, i) => {
    html += `
      <div class="practice-card" style="animation-delay: ${i * 0.05}s">
        <div class="practice-card-top">
          <span class="practice-category-badge">${categoryLabels[practice.category] || practice.category}</span>
          <span class="practice-target">${practice.target}</span>
        </div>
        <h3 class="practice-title">${practice.title}</h3>
        <p class="practice-problem"><strong>こんな課題に:</strong> ${practice.problem}</p>
        <p class="practice-desc">${practice.description}</p>

        <details class="practice-details">
          <summary>実施手順・効果を見る</summary>
          <div class="practice-steps">
            <h5>実施手順</h5>
            <ol>
              ${practice.steps.map(step => `<li>${step}</li>`).join("")}
            </ol>
          </div>
          <div class="practice-effect">
            <h5>期待される効果</h5>
            <p>${practice.effect}</p>
          </div>
          <div class="practice-kpi-link">
            <h5>関連KPI</h5>
            <p>${practice.kpiLink}</p>
          </div>
        </details>
      </div>
    `;
  });

  if (filtered.length === 0) {
    html = `<p class="no-results">該当する事例がありません。</p>`;
  }

  container.innerHTML = html;
}
