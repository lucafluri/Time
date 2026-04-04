(() => {
  "use strict";

  /* ── Constants ─────────────────────────────── */
  const LIFE_YEARS = 85;
  const WEEKS_PER_YEAR = 52;
  const TOTAL_WEEKS = LIFE_YEARS * WEEKS_PER_YEAR;
  const MS_PER_SEC = 1000;
  const MS_PER_MIN = 60 * MS_PER_SEC;
  const MS_PER_HOUR = 60 * MS_PER_MIN;
  const MS_PER_DAY = 24 * MS_PER_HOUR;
  const MS_PER_WEEK = 7 * MS_PER_DAY;

  /* ── DOM refs ──────────────────────────────── */
  const $ = (sel) => document.querySelector(sel);
  const hero = $("#hero");
  const form = $("#dateForm");
  const resultsEl = $("#results");
  const gridEl = $("#grid");
  const statsEl = $("#stats");
  const creditsEl = $("#credits");
  const resetBtn = $("#resetButton");

  /* ── State ─────────────────────────────────── */
  let birthDate = null;
  let tickInterval = null;

  /* ── Helpers ───────────────────────────────── */
  function formatNumber(n) {
    return n.toLocaleString("en-US");
  }

  function formatDate(d) {
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function calcDiff(birth) {
    const now = new Date();
    const diffMs = now - birth;
    return {
      ms: diffMs,
      seconds: Math.floor(diffMs / MS_PER_SEC),
      minutes: Math.floor(diffMs / MS_PER_MIN),
      hours: Math.floor(diffMs / MS_PER_HOUR),
      days: Math.floor(diffMs / MS_PER_DAY),
      weeks: Math.floor(diffMs / MS_PER_WEEK),
      years: diffMs / MS_PER_DAY / 365.2425,
      birth,
      now,
    };
  }

  /* ── Auto-tab between inputs ───────────────── */
  function setupAutoTab() {
    const inputs = ["dayIn", "monthIn", "yearIn", "hIn", "mIn"];
    inputs.forEach((id, i) => {
      const el = document.getElementById(id);
      el.addEventListener("input", () => {
        if (el.value.length >= parseInt(el.maxLength) && i < inputs.length - 1) {
          document.getElementById(inputs[i + 1]).focus();
        }
      });
    });
  }

  /* ── Validation ────────────────────────────── */
  function validate(day, month, year) {
    const now = new Date();
    return (
      day >= 1 && day <= 31 &&
      month >= 1 && month <= 12 &&
      year > now.getFullYear() - 120 && year <= now.getFullYear()
    );
  }

  /* ── Calculate grid position from real dates ── */
  function getLifePosition(birth) {
    const now = new Date();
    const ageThisYear = now.getFullYear() - birth.getFullYear();
    const birthdayThisYear = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    const completedYears = now < birthdayThisYear ? ageThisYear - 1 : ageThisYear;

    const lastBirthday = new Date(
      birth.getFullYear() + completedYears,
      birth.getMonth(),
      birth.getDate()
    );
    const weeksSinceLastBirthday = Math.min(
      Math.floor((now - lastBirthday) / MS_PER_WEEK),
      WEEKS_PER_YEAR - 1
    );

    return { completedYears, weeksSinceLastBirthday };
  }

  /* ── Build Grid (DocumentFragment for perf) ── */
  function buildGrid() {
    const { completedYears, weeksSinceLastBirthday } = getLifePosition(birthDate);
    const frag = document.createDocumentFragment();

    for (let year = 0; year < LIFE_YEARS; year++) {
      const label = document.createElement("span");
      label.className = "year-label";
      if (year % 10 === 0) label.classList.add("year-label--decade");
      label.textContent = year;
      frag.appendChild(label);

      for (let week = 0; week < WEEKS_PER_YEAR; week++) {
        const dot = document.createElement("div");
        dot.className = "week";

        if (year < completedYears) {
          dot.classList.add("week--lived");
        } else if (year === completedYears && week < weeksSinceLastBirthday) {
          dot.classList.add("week--lived");
        } else if (year === completedYears && week === weeksSinceLastBirthday) {
          dot.classList.add("week--now");
        } else {
          dot.classList.add("week--future");
        }

        frag.appendChild(dot);
      }
    }

    gridEl.innerHTML = "";
    gridEl.appendChild(frag);
  }

  /* ── Update Stats ──────────────────────────── */
  function updateStats(diff) {
    const birthStr = birthDate.toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
    statsEl.innerHTML = `
      <div class="stats-headline">This is your ${ordinal(diff.days + 1)} day alive</div>
      <div class="stats-birth">Born ${birthStr}</div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${diff.years.toFixed(4)}</div>
          <div class="stat-label">Years</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(diff.weeks)}</div>
          <div class="stat-label">Weeks</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(diff.days)}</div>
          <div class="stat-label">Days</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(diff.hours)}</div>
          <div class="stat-label">Hours</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(diff.minutes)}</div>
          <div class="stat-label">Minutes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(diff.seconds)}</div>
          <div class="stat-label">Seconds</div>
        </div>
      </div>
    `;
  }

  /* ── Show Results ──────────────────────────── */
  function showResults() {
    const diff = calcDiff(birthDate);

    hero.classList.add("fade-out");
    setTimeout(() => {
      hero.classList.add("collapsed");
      resultsEl.classList.remove("hidden");
      creditsEl.classList.add("credits--static");
      buildGrid();
      updateStats(diff);

      tickInterval = setInterval(() => {
        updateStats(calcDiff(birthDate));
      }, 1000);
    }, 500);
  }

  /* ── Reset ─────────────────────────────────── */
  function reset() {
    if (tickInterval) clearInterval(tickInterval);
    tickInterval = null;
    birthDate = null;
    gridEl.innerHTML = "";
    resultsEl.classList.add("hidden");
    hero.classList.remove("collapsed", "fade-out");
    creditsEl.classList.remove("credits--static");
    form.reset();
    document.getElementById("dayIn").focus();
  }

  /* ── Form Submit ───────────────────────────── */
  function handleSubmit(e) {
    e.preventDefault();

    const day = parseInt(document.getElementById("dayIn").value);
    const month = parseInt(document.getElementById("monthIn").value);
    const year = parseInt(document.getElementById("yearIn").value);
    let hours = parseInt(document.getElementById("hIn").value) || 0;
    let minutes = parseInt(document.getElementById("mIn").value) || 0;

    if (!validate(day, month, year)) {
      form.classList.add("shake");
      setTimeout(() => form.classList.remove("shake"), 400);
      return;
    }

    birthDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    showResults();
  }

  /* ── Init ──────────────────────────────────── */
  function init() {
    creditsEl.innerHTML = `&copy; ${new Date().getFullYear()} <a href="https://www.lucafluri.ch">Luca Fluri</a>`;
    setupAutoTab();
    form.addEventListener("submit", handleSubmit);
    resetBtn.addEventListener("click", reset);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
