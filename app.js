const demoCompanies = {
  AAPL: {
    name: "Apple Inc.",
    ticker: "AAPL",
    meta: "Technology · Consumer Electronics · NASDAQ",
    price: 203.92,
    change: 1.24,
    cap: "$3.08T",
    score: 84,
    quality: "Strong compounder",
    copy: "Durable margins and cash flow offset moderating top-line growth.",
    color: "#142b27",
    metrics: [
      ["Revenue growth", "+6.1%", "+1.8 pts", "Trailing twelve months"],
      ["EPS growth", "+10.2%", "+3.4 pts", "Diluted EPS, TTM"],
      ["Net margin", "24.3%", "-0.4 pts", "Above sector median"],
      ["Forward P/E", "27.8×", "+2.1×", "12% above 5Y average"],
    ],
    signals: [["FCF yield", "3.6%"], ["ROIC", "52.4%"], ["Debt / EBITDA", "0.8×"], ["5Y revenue CAGR", "7.1%"]],
    annual: {
      labels: ["FY20", "FY21", "FY22", "FY23", "FY24", "FY25E"],
      revenue: [274.5, 365.8, 394.3, 383.3, 391.0, 414.8],
      eps: [3.28, 5.61, 6.11, 6.13, 6.08, 6.70],
    },
    quarterly: {
      labels: ["Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25E"],
      revenue: [90.8, 85.8, 94.9, 124.3, 95.4, 91.7],
      eps: [1.53, 1.40, 1.64, 2.40, 1.65, 1.48],
    },
    operating: {
      title: "Installed base",
      value: "2.35B",
      label: "active devices",
      change: "+8.1% YoY",
      values: [1.5, 1.65, 1.8, 2.0, 2.2, 2.35],
      years: ["20", "21", "22", "23", "24", "25"],
      insight: "The installed base reached an all-time high, supporting recurring services revenue.",
    },
  },
  MSFT: {
    name: "Microsoft Corp.",
    ticker: "MSFT",
    meta: "Technology · Software Infrastructure · NASDAQ",
    price: 470.38,
    change: 0.82,
    cap: "$3.50T",
    score: 91,
    quality: "Exceptional quality",
    copy: "Cloud and AI demand are powering broad-based growth with premium economics.",
    color: "#2f6f67",
    metrics: [
      ["Revenue growth", "+15.7%", "+2.5 pts", "Trailing twelve months"],
      ["EPS growth", "+18.1%", "+4.2 pts", "Diluted EPS, TTM"],
      ["Net margin", "36.1%", "+0.7 pts", "Elite profitability"],
      ["Forward P/E", "31.2×", "+3.4×", "Premium to sector"],
    ],
    signals: [["FCF yield", "2.7%"], ["ROIC", "29.8%"], ["Debt / EBITDA", "0.4×"], ["5Y revenue CAGR", "14.2%"]],
    annual: {
      labels: ["FY20", "FY21", "FY22", "FY23", "FY24", "FY25E"],
      revenue: [143.0, 168.1, 198.3, 211.9, 245.1, 283.5],
      eps: [5.76, 8.05, 9.65, 9.68, 11.80, 13.94],
    },
    quarterly: {
      labels: ["Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25E"],
      revenue: [61.9, 64.7, 65.6, 69.6, 70.1, 73.8],
      eps: [2.94, 2.95, 3.30, 3.23, 3.46, 3.61],
    },
    operating: {
      title: "Azure growth",
      value: "33%",
      label: "constant currency",
      change: "+4 pts YoY",
      values: [27, 28, 29, 31, 32, 33],
      years: ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2"],
      insight: "Azure growth continues to accelerate as AI workloads add to core cloud migrations.",
    },
  },
  NVDA: {
    name: "NVIDIA Corp.",
    ticker: "NVDA",
    meta: "Technology · Semiconductors · NASDAQ",
    price: 148.91,
    change: 2.43,
    cap: "$3.64T",
    score: 94,
    quality: "Hypergrowth leader",
    copy: "Category leadership and extraordinary margins support the market's premium expectations.",
    color: "#4f7d3a",
    metrics: [
      ["Revenue growth", "+65.2%", "-12.1 pts", "Trailing twelve months"],
      ["EPS growth", "+72.4%", "-18.0 pts", "Diluted EPS, TTM"],
      ["Net margin", "55.8%", "+1.2 pts", "Exceptional margins"],
      ["Forward P/E", "29.6×", "-8.7×", "Growth-adjusted premium"],
    ],
    signals: [["FCF yield", "2.9%"], ["ROIC", "89.3%"], ["Debt / EBITDA", "0.1×"], ["5Y revenue CAGR", "48.7%"]],
    annual: {
      labels: ["FY21", "FY22", "FY23", "FY24", "FY25", "FY26E"],
      revenue: [16.7, 26.9, 27.0, 60.9, 130.5, 196.4],
      eps: [0.25, 0.44, 0.33, 1.30, 2.94, 4.18],
    },
    quarterly: {
      labels: ["Q1'25", "Q2'25", "Q3'25", "Q4'25", "Q1'26", "Q2'26E"],
      revenue: [26.0, 30.0, 35.1, 39.3, 44.1, 46.2],
      eps: [0.61, 0.68, 0.81, 0.89, 0.96, 1.04],
    },
    operating: {
      title: "Data center",
      value: "$39.1B",
      label: "quarterly revenue",
      change: "+73% YoY",
      values: [14.5, 18.4, 22.6, 30.8, 35.6, 39.1],
      years: ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2"],
      insight: "Data center remains the engine, though comparisons are becoming increasingly demanding.",
    },
  },
  AMZN: {
    name: "Amazon.com Inc.",
    ticker: "AMZN",
    meta: "Consumer Cyclical · Internet Retail · NASDAQ",
    price: 213.57,
    change: -0.46,
    cap: "$2.27T",
    score: 87,
    quality: "Margin inflection",
    copy: "AWS acceleration and retail efficiency are translating scale into faster profit growth.",
    color: "#9a6a2f",
    metrics: [
      ["Revenue growth", "+10.8%", "-1.4 pts", "Trailing twelve months"],
      ["EPS growth", "+37.6%", "-22.0 pts", "Diluted EPS, TTM"],
      ["Net margin", "10.1%", "+2.3 pts", "Expanding rapidly"],
      ["Forward P/E", "32.7×", "-5.4×", "Below 5Y average"],
    ],
    signals: [["FCF yield", "3.2%"], ["ROIC", "18.7%"], ["Debt / EBITDA", "1.0×"], ["5Y revenue CAGR", "17.0%"]],
    annual: {
      labels: ["FY20", "FY21", "FY22", "FY23", "FY24", "FY25E"],
      revenue: [386.1, 469.8, 514.0, 574.8, 638.0, 706.9],
      eps: [2.09, 3.24, -0.27, 2.90, 5.53, 7.61],
    },
    quarterly: {
      labels: ["Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25E"],
      revenue: [148.0, 158.9, 187.8, 155.7, 162.4, 176.0],
      eps: [1.26, 1.43, 1.86, 1.59, 1.67, 1.85],
    },
    operating: {
      title: "AWS growth",
      value: "17.5%",
      label: "year over year",
      change: "+0.3 pts",
      values: [12.2, 13.2, 17.2, 19.1, 18.9, 17.5],
      years: ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2"],
      insight: "AWS demand remains healthy while capacity investment positions it for AI workloads.",
    },
  },
};

const demoPeers = [
  { ticker: "MSFT", growth: 15.7, eps: 18.1, pe: 31.2, margin: 36.1, score: 91 },
  { ticker: "AAPL", growth: 6.1, eps: 10.2, pe: 27.8, margin: 24.3, score: 84 },
  { ticker: "GOOGL", growth: 13.8, eps: 24.3, pe: 20.4, margin: 30.1, score: 89 },
  { ticker: "AMZN", growth: 10.8, eps: 37.6, pe: 32.7, margin: 10.1, score: 87 },
  { ticker: "META", growth: 16.2, eps: 21.8, pe: 22.1, margin: 39.0, score: 92 },
];

let sectors = [];
let marketData = [];

const demoScatterCompanies = [
  ["NVDA", 65.2, 29.6, 94],
  ["META", 16.2, 22.1, 92],
  ["MSFT", 15.7, 31.2, 91],
  ["GOOGL", 13.8, 20.4, 89],
  ["AMZN", 10.8, 32.7, 87],
  ["AAPL", 6.1, 27.8, 84],
  ["JPM", 8.4, 14.2, 81],
  ["WMT", 4.8, 34.1, 83],
  ["LLY", 32.4, 41.7, 90],
  ["XOM", -2.1, 15.6, 74],
];

let companies = demoCompanies;
let peers = demoPeers;
let scatterCompanies = demoScatterCompanies;
let selectedTicker = "AAPL";
let selectedPeriod = "annual";
let peerDescending = true;
let dataMetadata = null;
let watchlistTickers = [];
let searchMatches = [];
let activeSearchIndex = -1;
let searchRequest = 0;
let searchTimer = null;
let watchlistStatusTimer = null;
let currentLanguage = localStorage.getItem("northstar-language") || "en";

const $ = (selector) => document.querySelector(selector);
const fmtSign = (value, suffix = "%") => `${value >= 0 ? "+" : ""}${value.toFixed(2)}${suffix}`;
const svgNS = "http://www.w3.org/2000/svg";
const watchlistStorageKey = "northstar-watchlist";
const hiddenMetricsStorageKey = "northstar-hidden-metrics-v1";
let hiddenMetricsByTicker = {};
let customMetricsManagerOpen = false;
const selectedTickerStorageKey = "northstar-selected-ticker";
const translations = {
  zh: {
    Overview: "概览",
    Companies: "公司",
    Sectors: "行业",
    Markets: "市场",
    Watchlist: "自选股",
    "Built for clearer thinking, not financial advice.": "用于辅助清晰分析，不构成投资建议。",
    "Investment research workspace": "投资研究工作台",
    "Good morning,": "早上好，",
    "Search ticker or company": "搜索股票代码或公司",
    "Alpha Vantage · ETF proxies": "Alpha Vantage · ETF 代理",
    "Fundamental score": "基本面评分",
    "[CALCULATED]": "[计算值]",
    "[MOCK/FAKE]": "[模拟/虚假]",
    "Fundamental growth": "基本面增长",
    "Revenue & EPS": "营收与每股收益",
    Annual: "年度",
    Quarterly: "季度",
    Revenue: "营收",
    "Operating pulse": "经营脉搏",
    "Relative view": "相对比较",
    "Peer comparison": "同行比较",
    "Sort by score ↕": "按评分排序 ↕",
    Company: "公司",
    "Rev. growth": "营收增长",
    "EPS growth": "EPS增长",
    "Fwd. P/E": "预期市盈率",
    "Net margin": "净利率",
    Score: "评分",
    "Market sectors": "市场行业",
    "Sector ETF performance": "行业 ETF 表现",
    "Alpha Vantage · SPDR ETFs": "Alpha Vantage · SPDR ETF",
    "Market map": "市场地图",
    "Growth vs. valuation": "增长与估值",
    "score-based bubble sizing": "气泡大小基于评分",
    "S&P 500 ETF": "标普 500 ETF",
    "NASDAQ 100 ETF": "纳斯达克 100 ETF",
    "Dow Jones ETF": "道琼斯 ETF",
    "Russell 2000 ETF": "罗素 2000 ETF",
    "Volatility ETN": "波动率 ETN",
    Industrials: "工业",
    "Northstar Research": "Northstar 研究",
    "Price unavailable": "价格不可用",
    "Market cap unavailable": "市值不可用",
    "Market cap": "市值",
    "No companies yet. Select a company and press +.": "暂无自选股。请选择公司并点击 +。",
    "Select a company first": "请先选择公司",
    "is already added": "已在自选股中",
    "Already in watchlist": "已在自选股中",
    added: "已添加",
    removed: "已移除",
    "No US-listed SEC ticker found.": "未找到在美国上市的 SEC 股票代码。",
    Added: "已添加",
    Add: "添加",
    Fetch: "获取",
    "Fetching...": "正在获取...",
    "SEC listed company": "SEC 上市公司",
    "Revenue growth": "营收增长",
    "Net margin": "净利率",
    "Forward P/E": "预期市盈率",
    "FCF yield": "自由现金流收益率",
    ROE: "净资产收益率",
    "Debt / op. income": "债务/营业利润",
    "Revenue CAGR": "营收复合增长率",
    "Latest reported fiscal year": "最新已报告财年",
    "Diluted EPS, latest fiscal year": "最新财年摊薄每股收益",
    "Calculated from SEC filings": "根据 SEC 文件计算",
    "Alpha Vantage overview": "Alpha Vantage 公司概览",
    "Add Alpha Vantage key": "添加 Alpha Vantage 密钥",
    Provider: "数据源",
    "Exceptional quality": "卓越质量",
    "Strong compounder": "强劲复利型公司",
    "Solid fundamentals": "基本面稳健",
    "Mixed profile": "基本面表现不一",
    "Strong growth and profitability create an unusually resilient fundamental profile.": "强劲增长和盈利能力构成了非常稳健的基本面。",
    "Healthy growth and durable economics support long-term compounding potential.": "健康增长与持久的商业经济性支持长期复利潜力。",
    "The business is performing well, with a few areas worth monitoring.": "公司经营表现良好，但仍有少数领域值得关注。",
    "Growth, profitability, or balance-sheet signals require closer review.": "增长、盈利能力或资产负债表信号需要进一步审视。",
    "Installed base": "设备安装基数",
    "active devices": "活跃设备",
    "Azure growth": "Azure 增长",
    "constant currency": "固定汇率",
    "Data center": "数据中心",
    "quarterly revenue": "季度营收",
    "AWS growth": "AWS 增长",
    "year over year": "同比",
    "Annual revenue": "年度营收",
    "latest fiscal year": "最新财年",
    Technology: "科技",
    TECHNOLOGY: "科技",
    Financials: "金融",
    FINANCE: "金融",
    Healthcare: "医疗保健",
    "LIFE SCIENCES": "生命科学",
    "Consumer cyc.": "可选消费",
    Communication: "通信",
    "CONSUMER CYCLICAL": "可选消费",
    "COMMUNICATION SERVICES": "通信服务",
    "CONSUMER ELECTRONICS": "消费电子",
    SEMICONDUCTORS: "半导体",
    Other: "其他",
    "REVENUE GROWTH": "营收增长",
    Growth: "增长",
    "Fundamentals and market data refreshed": "基本面及市场数据更新时间",
    "Fundamentals refreshed": "基本面数据更新时间",
    "Market data is not configured": "市场数据尚未配置",
    "[MOCK/FAKE] Generated data could not be loaded. All company figures shown below are fallback demo data.": "[模拟/虚假] 无法加载生成数据。下方所有公司数据均为备用演示数据。",
    "The installed base reached an all-time high, supporting recurring services revenue.": "设备安装基数创历史新高，为经常性服务收入提供支持。",
    "Azure growth continues to accelerate as AI workloads add to core cloud migrations.": "随着 AI 工作负载叠加核心云迁移需求，Azure 增长继续加速。",
    "Data center remains the engine, though comparisons are becoming increasingly demanding.": "数据中心仍是增长引擎，但同比基数正变得更具挑战。",
    "AWS demand remains healthy while capacity investment positions it for AI workloads.": "AWS 需求保持健康，产能投资正在为 AI 工作负载做好准备。",
    "Quarterly revenue": "季度营收",
    "Quarterly drill-down": "季度明细",
    "Latest reported details": "最新报告明细",
    "Revenue YoY": "营收同比",
    "Diluted EPS": "摊薄每股收益",
    "Net income": "净利润",
    "Operating income": "营业利润",
    "Premiums earned": "已赚保费",
    "Claims incurred": "已发生赔付",
    "Medical loss ratio": "医疗赔付率",
    "SG&A expense": "销售及管理费用",
    "Quarter details unavailable": "季度明细暂不可用",
    "Common financial metrics": "通用财务指标",
    "Financial indicators": "财务指标",
    "SEC filings": "SEC 文件",
    "Free cash flow": "自由现金流",
    "Operating cash flow": "经营现金流",
    "Capital expenditures": "资本支出",
    "FCF margin": "自由现金流利润率",
    "Operating margin": "营业利润率",
    "Latest fiscal year": "最新财年",
    "Company-specific metrics": "公司特定指标",
    "Operating metrics": "经营指标",
    "Manage metrics": "管理指标",
    "Done": "完成",
    "Hide": "隐藏",
    "Restore": "恢复",
    "Hidden metrics": "已隐藏指标",
    "Hidden only for this ticker": "仅对此股票隐藏",
    "No metrics are hidden.": "没有隐藏的指标。",
    "All company-specific metrics are hidden. Use Manage metrics to restore them.": "所有公司特定指标均已隐藏。请使用管理指标恢复。",
    Members: "会员人数",
    "Total members reported at period end.": "期末报告会员总数。",
    "Company-specific metric reported in SEC filings.": "公司在 SEC 文件中报告的特定指标。",
    "SEC reported": "SEC 报告值",
    "Same quarter prior year": "上年同期",
    "Compared with same quarter last year": "与去年同期相比",
    "Profit to loss": "由盈转亏",
    "Loss to profit": "由亏转盈",
    "Loss narrowed": "亏损收窄",
    "Loss widened": "亏损扩大",
    "EPS changed from positive to negative": "每股收益由正转负",
    "EPS changed from negative to positive": "每股收益由负转正",
    "EPS remains negative": "每股收益仍为负值",
    Calculated: "计算值",
    Filed: "申报日期",
    "latest reported quarter": "最近报告季度",
    "Reported revenue trend derived from SEC 10-Q and 10-K filings.": "营收趋势根据 SEC 10-Q 和 10-K 文件计算。",
    "Market quotes unavailable": "市场行情暂不可用",
    "Sector quotes unavailable": "行业行情暂不可用",
    "Valuation data unavailable": "估值数据暂不可用",
    "Trailing twelve months": "过去十二个月",
    "Diluted EPS, TTM": "过去十二个月摊薄每股收益",
    "Above sector median": "高于行业中位数",
    "12% above 5Y average": "高于五年平均值 12%",
    "Elite profitability": "卓越盈利能力",
    "Premium to sector": "相对行业存在溢价",
    "Exceptional margins": "卓越利润率",
    "Growth-adjusted premium": "经增长调整后的溢价",
    "Expanding rapidly": "快速扩张",
    "Below 5Y average": "低于五年平均值",
  },
};

function tr(text) {
  if (currentLanguage === "en") return text;
  return translations.zh[text] || text;
}

function mockText() {
  return tr("[MOCK/FAKE]");
}

function calculatedText() {
  return tr("[CALCULATED]");
}

function translateMeta(meta) {
  if (currentLanguage === "en") return meta;
  return meta.split(" · ").map((part) => tr(part)).join(" · ");
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  document.title = currentLanguage === "zh" ? "Northstar | 股票分析" : "Northstar | Stock Intelligence";
  $("#language-selector").setAttribute("aria-label", currentLanguage === "zh" ? "语言" : "Language");
  document.querySelectorAll("#language-selector button").forEach((button) => {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  $("#add-watchlist").setAttribute("aria-label", currentLanguage === "zh" ? "将当前公司加入自选股" : "Add selected company to watchlist");
  document.querySelector(".main-nav").setAttribute("aria-label", currentLanguage === "zh" ? "主导航" : "Main navigation");
  $("#stock-search").placeholder = tr("Search ticker or company");
  const staticText = [
    [".nav-item[data-view='overview']", "⌁ ", "Overview"],
    [".nav-item[data-view='companies']", "◇ ", "Companies"],
    [".nav-item[data-view='sectors']", "◎ ", "Sectors"],
    [".nav-item[data-view='markets']", "↗ ", "Markets"],
    [".watchlist .section-label", "", "Watchlist"],
    [".sidebar-footer p", "", "Built for clearer thinking, not financial advice."],
    [".eyebrow", "", "Investment research workspace"],
    [".market-source", "", "Alpha Vantage · ETF proxies"],
    [".revenue-card .section-label", "", "Fundamental growth"],
    [".revenue-card h2", "", "Revenue & EPS"],
    [".detail-card .section-label", "", "Quarterly drill-down"],
    [".detail-card h2", "", "Latest reported details"],
    [".financial-metrics-card .section-label", "", "Common financial metrics"],
    [".financial-metrics-card h2", "", "Financial indicators"],
    [".financial-metrics-card .as-of", "", "SEC filings"],
    [".custom-metrics-card .section-label", "", "Company-specific metrics"],
    [".custom-metrics-card h2", "", "Operating metrics"],
    ["#hidden-metrics-panel strong", "", "Hidden metrics"],
    ["#hidden-metrics-panel > div > span", "", "Hidden only for this ticker"],
    [".peer-card .section-label", "", "Relative view"],
    [".peer-card h2", "", "Peer comparison"],
    ["#sort-peers", "", "Sort by score ↕"],
    [".sector-card .section-label", "", "Market sectors"],
    [".sector-card h2", "", "Sector ETF performance"],
    [".sector-card .as-of", "", "Alpha Vantage · SPDR ETFs"],
    [".scatter-card .section-label", "", "Market map"],
    [".scatter-card h2", "", "Growth vs. valuation"],
    ["footer span:first-child", "", "Northstar Research"],
  ];
  staticText.forEach(([selector, prefix, key]) => {
    const element = $(selector);
    if (element) element.textContent = `${prefix}${tr(key)}`;
  });
  const greeting = $("h1");
  if (greeting) greeting.innerHTML = `${tr("Good morning,")} <em>Lihao.</em>`;
  document.querySelectorAll("#period-control button").forEach((button) => {
    button.textContent = tr(button.dataset.period === "annual" ? "Annual" : "Quarterly");
  });
  const legend = document.querySelectorAll(".legend span");
  if (legend[0]) legend[0].lastChild.textContent = tr("Revenue");
  document.querySelector(".users-card .section-label").childNodes[0].textContent = `${tr("Operating pulse")} `;
  const qualityLabel = document.querySelector(".thesis-score .section-label");
  if (qualityLabel) qualityLabel.innerHTML = `${tr("Fundamental score")} <b class="calculated-inline">${calculatedText()}</b>`;
  document.querySelectorAll(".mock-inline").forEach((label) => {
    if (label.id !== "operating-provenance") label.textContent = mockText();
  });
  document.querySelectorAll(".calculated-inline").forEach((label) => {
    label.textContent = calculatedText();
  });
  const scatterAsOf = document.querySelector(".scatter-card .as-of");
  if (scatterAsOf) scatterAsOf.innerHTML = `<b class="calculated-inline">${calculatedText()}</b> ${tr("score-based bubble sizing")}`;
  const headers = ["Company", "Rev. growth", "EPS growth", "Fwd. P/E", "Net margin"];
  document.querySelectorAll(".peer-card th").forEach((th, index) => {
    if (index < headers.length) th.textContent = tr(headers[index]);
    if (index === 5) th.innerHTML = `${tr("Score")} <span class="calculated-inline">${calculatedText()}</span>`;
  });
  renderCompany();
  renderPeers();
  renderSectors();
  renderScatter();
  renderMarketStrip();
  renderFallbackWarning();
  renderDataStatus();
  renderSearchResults($("#stock-search").value);
  syncWatchlistButton();
}

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(svgNS, tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function renderMarketStrip() {
  $("#market-strip").innerHTML = marketData.length
    ? marketData
    .map(
      ({ symbol, name, price, change }) => `
        <div class="market-item">
          <span>${tr(name)} · ${symbol}</span>
          <strong>${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          <small class="${change >= 0 ? "positive" : "negative"}">${fmtSign(change)}</small>
        </div>`,
    )
    .join("")
    : `<div class="market-empty">${tr("Market quotes unavailable")}</div>`;
}

function renderWatchlist() {
  const visibleCompanies = watchlistTickers.map((ticker) => companies[ticker]).filter(Boolean);
  $("#watchlist-items").innerHTML = visibleCompanies.length
    ? visibleCompanies.map(
        (company) => `
        <div class="watchlist-row ${company.ticker === selectedTicker ? "selected" : ""}">
          <button class="watchlist-company" data-ticker="${company.ticker}">
            <strong>${company.ticker}</strong>
            <span class="${company.change >= 0 ? "positive" : "negative"}">${fmtSign(company.change)}</span>
          </button>
          <button class="watchlist-remove" data-remove-ticker="${company.ticker}" aria-label="${currentLanguage === "zh" ? `从自选股移除 ${company.ticker}` : `Remove ${company.ticker} from watchlist`}">×</button>
        </div>`,
      ).join("")
    : `<div class="watchlist-empty">${tr("No companies yet. Select a company and press +.")}</div>`;

  document.querySelectorAll(".watchlist-company").forEach((button) => {
    button.addEventListener("click", () => selectCompany(button.dataset.ticker));
  });
  document.querySelectorAll(".watchlist-remove").forEach((button) => {
    button.addEventListener("click", () => removeFromWatchlist(button.dataset.removeTicker));
  });
  syncWatchlistButton();
}

function syncWatchlistButton() {
  const button = $("#add-watchlist");
  const alreadyAdded = watchlistTickers.includes(selectedTicker);
  button.disabled = alreadyAdded;
  button.textContent = alreadyAdded ? "✓" : "+";
  button.setAttribute(
    "aria-label",
    alreadyAdded
      ? `${selectedTicker} ${tr("Already in watchlist")}`
      : currentLanguage === "zh"
        ? "将当前公司加入自选股"
        : "Add selected company to watchlist",
  );
  button.title = alreadyAdded ? `${selectedTicker} ${tr("Already in watchlist")}` : "";
}

function showWatchlistStatus(message) {
  const status = $("#watchlist-status");
  clearTimeout(watchlistStatusTimer);
  status.textContent = message;
  watchlistStatusTimer = setTimeout(() => {
    status.textContent = "";
  }, 2200);
}

function saveWatchlist() {
  localStorage.setItem(watchlistStorageKey, JSON.stringify(watchlistTickers));
}

function loadWatchlist() {
  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem(watchlistStorageKey) || "[]");
  } catch {
    saved = [];
  }
  watchlistTickers = saved.filter((ticker) => companies[ticker]);
  if (!watchlistTickers.length) {
    watchlistTickers = ["AAPL", "MSFT", "NVDA", "AMZN"].filter((ticker) => companies[ticker]);
  }
}

function addToWatchlist(ticker = selectedTicker) {
  if (!companies[ticker]) {
    showWatchlistStatus(tr("Select a company first"));
    return false;
  }
  if (watchlistTickers.includes(ticker)) {
    syncWatchlistButton();
    return false;
  }
  watchlistTickers.push(ticker);
  saveWatchlist();
  renderWatchlist();
  renderSearchResults($("#stock-search").value);
  showWatchlistStatus(currentLanguage === "zh" ? `${ticker} ${tr("added")}` : `${ticker} added`);
  return true;
}

function removeFromWatchlist(ticker) {
  watchlistTickers = watchlistTickers.filter((item) => item !== ticker);
  saveWatchlist();
  renderWatchlist();
  renderSearchResults($("#stock-search").value);
  showWatchlistStatus(currentLanguage === "zh" ? `${ticker} ${tr("removed")}` : `${ticker} removed`);
}

function closeSearchResults() {
  $("#search-results").classList.remove("open");
  $("#stock-search").setAttribute("aria-expanded", "false");
  activeSearchIndex = -1;
}

function rankCachedCompanies(normalized) {
  return Object.values(companies)
    .filter((company) =>
      company.ticker.includes(normalized) || company.name.toUpperCase().includes(normalized),
    )
    .sort((a, b) => {
      const aExact = a.ticker === normalized ? 0 : a.ticker.startsWith(normalized) ? 1 : 2;
      const bExact = b.ticker === normalized ? 0 : b.ticker.startsWith(normalized) ? 1 : 2;
      return aExact - bExact || a.ticker.localeCompare(b.ticker);
    })
    .map((company) => ({
      ticker: company.ticker,
      name: company.name,
      meta: company.meta,
      color: company.color,
      cached: true,
    }));
}

function paintSearchResults(query) {
  const normalized = query.trim().toUpperCase();
  const results = $("#search-results");
  if (!normalized) {
    searchMatches = [];
    closeSearchResults();
    return;
  }

  if (!searchMatches.length) {
    results.innerHTML = `
      <div class="search-empty">
        ${tr("No US-listed SEC ticker found.")}
      </div>`;
  } else {
    results.innerHTML = searchMatches
      .map((company, index) => `
        <button class="search-result ${index === activeSearchIndex ? "active" : ""}" data-search-ticker="${company.ticker}" role="option">
          <span class="search-result-logo" style="background:${company.color || "#1f6657"}">${company.ticker[0]}</span>
          <span class="search-result-copy">
            <strong>${company.ticker} · ${company.name}</strong>
            <span>${translateMeta(company.meta || company.exchange || tr("SEC listed company"))}</span>
          </span>
          <span class="search-result-action">${company.cached ? (watchlistTickers.includes(company.ticker) ? tr("Added") : tr("Add")) : tr("Fetch")}</span>
        </button>`,
      )
      .join("");
  }

  results.classList.add("open");
  $("#stock-search").setAttribute("aria-expanded", "true");
  document.querySelectorAll(".search-result").forEach((button) => {
    button.addEventListener("click", () => chooseSearchResult(button.dataset.searchTicker));
  });
}

async function renderSearchResults(query) {
  const normalized = query.trim().toUpperCase();
  if (!normalized) {
    searchMatches = [];
    paintSearchResults("");
    return;
  }

  const requestId = ++searchRequest;
  const cached = rankCachedCompanies(normalized);
  searchMatches = cached.slice(0, 8);
  paintSearchResults(normalized);

  try {
    const response = await fetch(`/api/tickers?q=${encodeURIComponent(normalized)}`);
    if (!response.ok) throw new Error(`Search returned HTTP ${response.status}`);
    const payload = await response.json();
    if (requestId !== searchRequest) return;
    const merged = new Map(cached.map((item) => [item.ticker, item]));
    for (const result of payload.results || []) {
      if (!merged.has(result.ticker)) merged.set(result.ticker, { ...result, cached: false });
    }
    searchMatches = [...merged.values()].slice(0, 8);
    paintSearchResults(normalized);
  } catch (error) {
    if (!cached.length && requestId === searchRequest) {
      $("#search-results").innerHTML = `<div class="search-empty">${currentLanguage === "zh" ? "实时股票搜索不可用" : "Live ticker search unavailable"}: ${error.message}</div>`;
      $("#search-results").classList.add("open");
    }
  }
}

function refreshPeerData(updatedPeers) {
  if (updatedPeers?.length) peers = updatedPeers;
  scatterCompanies = peers
    .filter((peer) => Number.isFinite(peer.growth) && Number.isFinite(peer.pe))
    .map((peer) => [peer.ticker, peer.growth, peer.pe, peer.score]);
  renderPeers();
}

async function chooseSearchResult(ticker) {
  const match = searchMatches.find((item) => item.ticker === ticker);
  if (!match) return;
  if (companies[ticker]) {
    selectCompany(ticker);
    addToWatchlist(ticker);
    $("#stock-search").value = "";
    closeSearchResults();
    return;
  }

  const action = document.querySelector(`[data-search-ticker="${ticker}"] .search-result-action`);
  if (action) action.textContent = tr("Fetching...");
  document.querySelectorAll(".search-result").forEach((button) => { button.disabled = true; });

  try {
    const response = await fetch(`/api/companies/${encodeURIComponent(ticker)}`, { method: "POST" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    companies[ticker] = mergeCompany(payload.company);
    refreshPeerData(payload.peers);
    selectCompany(ticker);
    addToWatchlist(ticker);
    $("#stock-search").value = "";
    closeSearchResults();
  } catch (error) {
    $("#search-results").innerHTML = `<div class="search-empty">${currentLanguage === "zh" ? `无法获取 ${ticker}` : `Could not fetch ${ticker}`}: ${error.message}</div>`;
  }
}

function renderCompany() {
  const company = companies[selectedTicker];
  $("#company-logo").textContent = company.ticker[0];
  $("#company-logo").style.background = company.color;
  $("#company-name").textContent = company.name;
  $("#company-ticker").textContent = company.ticker;
  $("#fundamentals-ticker").textContent = company.ticker;
  $("#company-meta").textContent = translateMeta(company.meta);
  $("#company-price").textContent = Number.isFinite(company.price) ? `$${company.price.toFixed(2)}` : tr("Price unavailable");
  $("#company-change").textContent = fmtSign(company.change);
  $("#company-change").className = company.change >= 0 ? "positive" : "negative";
  $("#company-cap").textContent = company.cap === "Quote key required"
    ? tr("Market cap unavailable")
    : `${tr("Market cap")} ${company.cap}`;
  $("#quality-score").textContent = company.score;
  $("#quality-label").textContent = tr(company.quality);
  $("#quality-copy").textContent = tr(company.copy);
  $("#score-ring").style.setProperty("--score", `${company.score}%`);

  $("#signal-list").innerHTML = company.signals
    .map(([label, value]) => `<div class="signal"><span>${tr(label)}</span><strong>${value}</strong></div>`)
    .join("");

  renderSummaryMetrics(company);

  const op = company.operating;
  const operatingProvenance = $("#operating-provenance");
  const operatingIsMock = op.provenance === "mock" || (!dataMetadata && Boolean(op));
  operatingProvenance.textContent = operatingIsMock ? mockText() : "";
  operatingProvenance.className = operatingIsMock ? "mock-inline" : "";
  $("#operating-title").textContent = tr(op.title);
  $("#operating-value").textContent = op.value;
  $("#operating-label").textContent = tr(op.label);
  $("#operating-change").textContent = currentLanguage === "zh" ? op.change.replace("YoY", "同比") : op.change;
  $("#operating-insight").textContent = tr(op.insight);
  const detail = company.quarterDetail;
  $("#detail-period").textContent = detail
    ? `${detail.period}${detail.filed ? ` · ${tr("Filed")} ${detail.filed}` : ""}`
    : "";
  $("#detail-grid").innerHTML = detail?.items?.length
    ? detail.items.map(([label, value, note]) => `
        <article class="detail-item">
          <span>${tr(label)}</span>
          <strong>${value}</strong>
          <small>${tr(note)}</small>
        </article>`).join("")
    : `<div class="detail-empty">${tr("Quarter details unavailable")}</div>`;
  renderFinancialMetrics(company.financialMetrics || []);
  renderCustomMetrics(company.customMetrics || []);

  renderFundamentals();
  renderOperatingChart();
  renderWatchlist();
}

function renderSummaryMetrics(company) {
  const metrics = company.periodMetrics?.[selectedPeriod] || company.metrics;
  $("#metrics-grid").innerHTML = metrics
    .map(([label, value, delta, note, history], index) => {
      const isNegative = delta.startsWith("-");
      const neutral = label === "Forward P/E" || delta === "Same quarter prior year";
      return `
        <article class="metric-card card">
          <div class="metric-top">
            <span>${tr(label)}</span>
            <span class="metric-delta ${neutral ? "" : isNegative ? "negative" : "positive"}">${tr(delta)}</span>
          </div>
          <strong>${tr(value)}</strong>
          <p>${tr(note)}</p>
          ${renderMetricHistory(history, "metric-history")}
        </article>`;
    })
    .join("");
}

function renderMetricHistory(history, className) {
  if (!history?.labels?.length) return "";
  return `<div class="${className}">
    ${history.labels.map((label, index) => `
      <div>
        <span>${label}</span>
        <strong>${tr(history.displayValues[index])}</strong>
      </div>`).join("")}
  </div>`;
}

function renderFinancialMetrics(metrics) {
  const card = $("#financial-metrics-card");
  card.hidden = !metrics.length;
  $("#financial-metrics-grid").innerHTML = metrics.map((metric) => `
    <article class="financial-metric">
      <span>${tr(metric.title)}</span>
      <strong>${metric.value}</strong>
      <small>${tr(metric.note)}${metric.period ? ` · ${metric.period}` : ""}</small>
      ${renderMetricHistory(metric.history, "financial-metric-history")}
    </article>`).join("");
}

function renderCustomMetrics(metrics) {
  const card = $("#custom-metrics-card");
  card.hidden = !metrics.length;
  if (!metrics.length) {
    $("#custom-metrics-grid").innerHTML = "";
    return;
  }
  const hiddenIds = new Set(hiddenMetricsByTicker[selectedTicker] || []);
  const visibleMetrics = metrics.filter((metric) => !hiddenIds.has(metric.id));
  const hiddenMetrics = metrics.filter((metric) => hiddenIds.has(metric.id));
  $("#manage-custom-metrics").textContent = tr(customMetricsManagerOpen ? "Done" : "Manage metrics");
  $("#hidden-metrics-panel").hidden = !customMetricsManagerOpen;
  $("#hidden-metrics-list").innerHTML = hiddenMetrics.length
    ? hiddenMetrics.map((metric) => `
        <button class="metric-restore" data-restore-metric="${metric.id}">${tr("Restore")} ${tr(metric.title)}</button>`).join("")
    : `<span class="hidden-metrics-empty">${tr("No metrics are hidden.")}</span>`;
  $("#custom-metrics-grid").innerHTML = visibleMetrics.length ? visibleMetrics.map((metric) => `
    <article class="custom-metric">
      <div class="custom-metric-heading">
        <div>
          <span>${tr(metric.title)}</span>
          <strong>${metric.latest}</strong>
        </div>
        <div class="custom-metric-controls">
          <small>${metric.source}</small>
          <button data-hide-metric="${metric.id}" aria-label="${tr("Hide")} ${tr(metric.title)}">${tr("Hide")}</button>
        </div>
      </div>
      <div class="custom-metric-series">
        ${metric.labels.map((label, index) => `
          <div>
            <span>${label}</span>
            <strong>${metric.displayValues[index]}</strong>
          </div>`).join("")}
      </div>
      <p>${tr(metric.description)}</p>
    </article>`).join("")
    : `<div class="custom-metrics-empty">${tr("All company-specific metrics are hidden. Use Manage metrics to restore them.")}</div>`;
}

function loadHiddenMetrics() {
  try {
    const saved = JSON.parse(localStorage.getItem(hiddenMetricsStorageKey) || "{}");
    hiddenMetricsByTicker = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    hiddenMetricsByTicker = {};
  }
}

function saveHiddenMetrics() {
  localStorage.setItem(hiddenMetricsStorageKey, JSON.stringify(hiddenMetricsByTicker));
}

function setMetricHidden(metricId, hidden) {
  const ids = new Set(hiddenMetricsByTicker[selectedTicker] || []);
  if (hidden) ids.add(metricId);
  else ids.delete(metricId);
  hiddenMetricsByTicker[selectedTicker] = [...ids];
  saveHiddenMetrics();
  renderCustomMetrics(companies[selectedTicker].customMetrics || []);
}

function renderFundamentals() {
  const svg = $("#fundamentals-chart");
  const data = companies[selectedTicker][selectedPeriod];
  const width = 700;
  const height = 245;
  const pad = { top: 18, right: 34, bottom: 30, left: 42 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const maxRevenue = Math.max(...data.revenue) * 1.18;
  const minEps = Math.min(0, ...data.eps);
  const maxEps = Math.max(...data.eps) * 1.25;
  const groupW = chartW / data.labels.length;
  const barW = Math.min(42, groupW * 0.45);

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";

  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    svg.appendChild(svgEl("line", { x1: pad.left, y1: y, x2: width - pad.right, y2: y, stroke: "#e9e6dd", "stroke-width": 1 }));
    const label = svgEl("text", { x: pad.left - 8, y: y + 3, "text-anchor": "end", fill: "#8b9692", "font-size": 8, "font-family": "DM Mono" });
    label.textContent = `$${Math.round(maxRevenue - (maxRevenue / 4) * i)}B`;
    svg.appendChild(label);
  }

  const epsPoints = [];
  data.labels.forEach((labelText, i) => {
    const centerX = pad.left + groupW * i + groupW / 2;
    const barHeight = (data.revenue[i] / maxRevenue) * chartH;
    const bar = svgEl("rect", {
      x: centerX - barW / 2,
      y: pad.top + chartH - barHeight,
      width: barW,
      height: barHeight,
      rx: 3,
      fill: i === data.labels.length - 1 ? "#68a590" : "#1f6657",
      opacity: i === data.labels.length - 1 ? 0.72 : 0.92,
      "data-index": i,
    });
    svg.appendChild(bar);

    const epsRange = maxEps - minEps || 1;
    const epsY = pad.top + chartH - ((data.eps[i] - minEps) / epsRange) * chartH;
    epsPoints.push([centerX, epsY]);

    const label = svgEl("text", { x: centerX, y: height - 8, "text-anchor": "middle", fill: "#758580", "font-size": 8, "font-family": "DM Mono" });
    label.textContent = labelText;
    svg.appendChild(label);

    const hit = svgEl("rect", { x: pad.left + groupW * i, y: pad.top, width: groupW, height: chartH, fill: "transparent", "data-index": i });
    hit.addEventListener("mousemove", (event) => showFundamentalsTooltip(event, i, data));
    hit.addEventListener("mouseleave", hideTooltips);
    svg.appendChild(hit);
  });

  const pathData = epsPoints.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  svg.appendChild(svgEl("path", { d: pathData, fill: "none", stroke: "#e77d61", "stroke-width": 2.2, "stroke-linecap": "round", "stroke-linejoin": "round" }));
  epsPoints.forEach(([x, y]) => {
    svg.appendChild(svgEl("circle", { cx: x, cy: y, r: 3.4, fill: "#fffefa", stroke: "#e77d61", "stroke-width": 2 }));
  });
}

function showFundamentalsTooltip(event, index, data) {
  const tooltip = $("#fundamentals-tooltip");
  const rect = event.currentTarget.ownerSVGElement.getBoundingClientRect();
  tooltip.innerHTML = `<strong>${data.labels[index]}</strong><br>${tr("Revenue")} $${data.revenue[index].toFixed(1)}B<br>EPS $${data.eps[index].toFixed(2)}`;
  tooltip.style.left = `${event.clientX - rect.left}px`;
  tooltip.style.top = `${event.clientY - rect.top}px`;
  tooltip.style.opacity = 1;
}

function renderOperatingChart() {
  const svg = $("#operating-chart");
  const op = companies[selectedTicker].operating;
  const width = 310;
  const height = 105;
  const pad = { top: 10, right: 8, bottom: 18, left: 7 };
  const min = Math.min(...op.values) * 0.9;
  const max = Math.max(...op.values) * 1.06;
  const points = op.values.map((value, i) => {
    const x = pad.left + (i / (op.values.length - 1)) * (width - pad.left - pad.right);
    const y = pad.top + (1 - (value - min) / (max - min)) * (height - pad.top - pad.bottom);
    return [x, y];
  });

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";

  const line = points.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const area = `${line} L ${points.at(-1)[0]} ${height - pad.bottom} L ${points[0][0]} ${height - pad.bottom} Z`;
  const gradient = svgEl("linearGradient", { id: "spark-gradient", x1: "0", y1: "0", x2: "0", y2: "1" });
  gradient.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#68a590", "stop-opacity": 0.35 }));
  gradient.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#68a590", "stop-opacity": 0 }));
  const defs = svgEl("defs");
  defs.appendChild(gradient);
  svg.appendChild(defs);
  svg.appendChild(svgEl("path", { d: area, fill: "url(#spark-gradient)" }));
  svg.appendChild(svgEl("path", { d: line, fill: "none", stroke: "#1f6657", "stroke-width": 2.2, "stroke-linecap": "round" }));

  points.forEach(([x, y], i) => {
    if (i === points.length - 1) svg.appendChild(svgEl("circle", { cx: x, cy: y, r: 4, fill: "#1f6657", stroke: "#fffefa", "stroke-width": 2 }));
    const label = svgEl("text", { x, y: height - 3, "text-anchor": "middle", fill: "#8b9692", "font-size": 7, "font-family": "DM Mono" });
    label.textContent = op.years[i];
    svg.appendChild(label);
  });
}

function renderPeers() {
  const rows = [...peers].sort((a, b) => peerDescending ? b.score - a.score : a.score - b.score);
  $("#peer-table").innerHTML = rows
    .map(
      (peer) => `
        <tr>
          <td><div class="peer-name"><span class="peer-dot">${peer.ticker[0]}</span><strong>${peer.ticker}</strong></div></td>
          <td class="${peer.growth >= 0 ? "positive" : "negative"}">${Number.isFinite(peer.growth) ? fmtSign(peer.growth, "%") : "N/A"}</td>
          <td class="${peer.eps >= 0 ? "positive" : "negative"}">${Number.isFinite(peer.eps) ? fmtSign(peer.eps, "%") : "N/A"}</td>
          <td>${Number.isFinite(peer.pe) ? `${peer.pe.toFixed(1)}×` : "N/A"}</td>
          <td>${Number.isFinite(peer.margin) ? `${peer.margin.toFixed(1)}%` : "N/A"}</td>
          <td><span class="score-pill">${peer.score}</span></td>
        </tr>`,
    )
    .join("");
}

function renderSectors() {
  $("#sector-list").innerHTML = sectors.length
    ? sectors
    .map(
      (sector) => `
        <div class="sector-row">
          <span class="sector-name"><i class="sector-swatch" style="background:${sector.color}"></i>${tr(sector.name)} <em>${sector.symbol}</em></span>
          <strong>$${Number(sector.price).toFixed(2)}</strong>
          <small class="${sector.change >= 0 ? "positive" : "negative"}">${fmtSign(sector.change)}</small>
        </div>`,
    )
    .join("")
    : `<div class="sector-empty">${tr("Sector quotes unavailable")}</div>`;
}

function renderScatter() {
  const svg = $("#scatter-chart");
  const width = 900;
  const height = 270;
  const pad = { top: 16, right: 30, bottom: 34, left: 45 };
  const xMin = -10;
  const xMax = 70;
  const yMin = 10;
  const yMax = 45;
  const xScale = (v) => pad.left + ((v - xMin) / (xMax - xMin)) * (width - pad.left - pad.right);
  const yScale = (v) => pad.top + (1 - (v - yMin) / (yMax - yMin)) * (height - pad.top - pad.bottom);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";

  [10, 20, 30, 40].forEach((value) => {
    const y = yScale(value);
    svg.appendChild(svgEl("line", { x1: pad.left, y1: y, x2: width - pad.right, y2: y, stroke: "#e9e6dd" }));
    const label = svgEl("text", { x: pad.left - 8, y: y + 3, "text-anchor": "end", fill: "#87938f", "font-size": 8, "font-family": "DM Mono" });
    label.textContent = `${value}×`;
    svg.appendChild(label);
  });

  [-10, 0, 10, 20, 30, 40, 50, 60, 70].forEach((value) => {
    const x = xScale(value);
    const label = svgEl("text", { x, y: height - 10, "text-anchor": "middle", fill: "#87938f", "font-size": 8, "font-family": "DM Mono" });
    label.textContent = `${value}%`;
    svg.appendChild(label);
  });

  const axisLabel = svgEl("text", { x: width / 2, y: height - 1, "text-anchor": "middle", fill: "#677873", "font-size": 8, "font-family": "Manrope" });
  axisLabel.textContent = tr("REVENUE GROWTH");
  svg.appendChild(axisLabel);

  if (!scatterCompanies.length) {
    const emptyLabel = svgEl("text", {
      x: width / 2,
      y: height / 2,
      "text-anchor": "middle",
      fill: "#87938f",
      "font-size": 12,
      "font-family": "Manrope",
    });
    emptyLabel.textContent = tr("Valuation data unavailable");
    svg.appendChild(emptyLabel);
    return;
  }

  scatterCompanies.forEach(([ticker, growth, pe, score]) => {
    const x = xScale(growth);
    const y = yScale(pe);
    const isSelected = ticker === selectedTicker;
    const group = svgEl("g", { "data-ticker": ticker, style: "cursor:pointer" });
    group.appendChild(svgEl("circle", {
      cx: x,
      cy: y,
      r: 5 + (score - 70) * 0.14,
      fill: isSelected ? "#e77d61" : "#1f6657",
      opacity: isSelected ? 1 : 0.72,
      stroke: isSelected ? "#fffefa" : "none",
      "stroke-width": 3,
    }));
    const label = svgEl("text", { x: x + 9, y: y - 7, fill: "#304b45", "font-size": 8, "font-weight": 700, "font-family": "DM Mono" });
    label.textContent = ticker;
    group.appendChild(label);
    group.addEventListener("mousemove", (event) => showScatterTooltip(event, ticker, growth, pe, score));
    group.addEventListener("mouseleave", hideTooltips);
    if (companies[ticker]) group.addEventListener("click", () => selectCompany(ticker));
    svg.appendChild(group);
  });
}

function showScatterTooltip(event, ticker, growth, pe, score) {
  const tooltip = $("#scatter-tooltip");
  const rect = event.currentTarget.ownerSVGElement.getBoundingClientRect();
  tooltip.innerHTML = `<strong>${ticker}</strong><br>${tr("Growth")} ${fmtSign(growth)} · P/E ${pe.toFixed(1)}×<br>${tr("Fundamental score")} ${score}`;
  tooltip.style.left = `${event.clientX - rect.left}px`;
  tooltip.style.top = `${event.clientY - rect.top}px`;
  tooltip.style.opacity = 1;
}

function hideTooltips() {
  document.querySelectorAll(".chart-tooltip").forEach((tooltip) => {
    tooltip.style.opacity = 0;
  });
}

function selectCompany(ticker) {
  if (!companies[ticker]) return;
  selectedTicker = ticker;
  customMetricsManagerOpen = false;
  localStorage.setItem(selectedTickerStorageKey, ticker);
  renderCompany();
  renderScatter();
  syncWatchlistButton();
}

function setupInteractions() {
  $("#language-selector").addEventListener("click", (event) => {
    const button = event.target.closest("[data-language]");
    if (!button || button.dataset.language === currentLanguage) return;
    currentLanguage = button.dataset.language;
    localStorage.setItem("northstar-language", currentLanguage);
    applyLanguage();
  });
  $("#period-control").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    selectedPeriod = button.dataset.period;
    document.querySelectorAll("#period-control button").forEach((item) => item.classList.toggle("active", item === button));
    renderFundamentals();
    renderSummaryMetrics(companies[selectedTicker]);
  });

  $("#sort-peers").addEventListener("click", () => {
    peerDescending = !peerDescending;
    renderPeers();
  });

  $("#add-watchlist").addEventListener("click", () => {
    addToWatchlist();
  });

  $("#manage-custom-metrics").addEventListener("click", () => {
    customMetricsManagerOpen = !customMetricsManagerOpen;
    renderCustomMetrics(companies[selectedTicker].customMetrics || []);
  });

  $("#custom-metrics-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-hide-metric]");
    if (button) setMetricHidden(button.dataset.hideMetric, true);
  });

  $("#hidden-metrics-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-restore-metric]");
    if (button) setMetricHidden(button.dataset.restoreMetric, false);
  });

  $("#stock-search").addEventListener("input", (event) => {
    activeSearchIndex = -1;
    clearTimeout(searchTimer);
    const query = event.target.value;
    searchTimer = setTimeout(() => renderSearchResults(query), 180);
  });

  $("#stock-search").addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearchResults();
      return;
    }
    if (!searchMatches.length || !["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowDown") activeSearchIndex = (activeSearchIndex + 1) % searchMatches.length;
    if (event.key === "ArrowUp") activeSearchIndex = (activeSearchIndex - 1 + searchMatches.length) % searchMatches.length;
    if (event.key === "Enter") {
      const match = searchMatches[activeSearchIndex >= 0 ? activeSearchIndex : 0];
      chooseSearchResult(match.ticker);
      return;
    }
    paintSearchResults(event.currentTarget.value);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== $("#stock-search")) {
      event.preventDefault();
      $("#stock-search").focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-control")) closeSearchResults();
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const targets = { overview: ".hero-card", companies: ".peer-card", sectors: ".sector-card", markets: ".scatter-card" };
      document.querySelector(targets[button.dataset.view])?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function mergeCompany(realCompany) {
  const fallback = demoCompanies[realCompany.ticker] ?? {};
  return {
    ...fallback,
    ...realCompany,
    price: Number.isFinite(realCompany.price) ? realCompany.price : null,
    change: Number.isFinite(realCompany.price) ? realCompany.change : 0,
    cap: realCompany.cap,
    color: realCompany.color || fallback.color || "#1f6657",
    operating: realCompany.operating || fallback.operating,
    quarterDetail: realCompany.quarterDetail || null,
    financialMetrics: realCompany.financialMetrics || [],
    customMetrics: realCompany.customMetrics || [],
  };
}

async function loadGeneratedData() {
  try {
    const response = await fetch(`data/dashboard.json?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload.companies || !Object.keys(payload.companies).length) throw new Error("No companies in generated data");

    companies = Object.fromEntries(
      Object.entries(payload.companies).map(([ticker, company]) => [ticker, mergeCompany(company)]),
    );
    peers = payload.peers ?? [];
    marketData = payload.marketData?.filter((item) => Number.isFinite(item.price)) ?? [];
    sectors = payload.sectors?.filter((item) => Number.isFinite(item.price)) ?? [];
    scatterCompanies = peers
      .filter((peer) => Number.isFinite(peer.growth) && Number.isFinite(peer.pe))
      .map((peer) => [peer.ticker, peer.growth, peer.pe, peer.score]);
    dataMetadata = payload;
  } catch (error) {
    console.info(`Using built-in demo data: ${error.message}`);
  }
}

function renderFallbackWarning() {
  document.querySelector(".fallback-warning")?.remove();
  if (dataMetadata) return;
  const warning = document.createElement("div");
  warning.className = "fallback-warning";
  warning.textContent = tr("[MOCK/FAKE] Generated data could not be loaded. All company figures shown below are fallback demo data.");
  document.querySelector(".dashboard").prepend(warning);
}

function renderDataStatus() {
  const status = document.querySelector(".data-status");
  const footer = document.querySelector("footer span:last-child");
  if (!dataMetadata) return;
  const updated = new Date(dataMetadata.generatedAt);
  status.lastChild.textContent = currentLanguage === "zh"
    ? ` ${dataMetadata.sourceMode.replace("SEC filings", "SEC 文件").replace("Alpha Vantage quotes", "Alpha Vantage 行情")}`
    : ` ${dataMetadata.sourceMode}`;
  footer.textContent = dataMetadata.sourceMode.includes("Alpha Vantage")
    ? `${tr("Fundamentals and market data refreshed")} ${updated.toLocaleString(currentLanguage === "zh" ? "zh-CN" : "en-US")}`
    : `${tr("Fundamentals refreshed")} ${updated.toLocaleString(currentLanguage === "zh" ? "zh-CN" : "en-US")} · ${tr("Market data is not configured")}`;
}

async function init() {
  await loadGeneratedData();
  const savedTicker = localStorage.getItem(selectedTickerStorageKey);
  if (savedTicker && companies[savedTicker]) selectedTicker = savedTicker;
  if (!companies[selectedTicker]) selectedTicker = Object.keys(companies)[0];
  loadHiddenMetrics();
  loadWatchlist();
  renderMarketStrip();
  renderCompany();
  renderPeers();
  renderSectors();
  renderScatter();
  renderFallbackWarning();
  renderDataStatus();
  setupInteractions();
  applyLanguage();
}

init();
