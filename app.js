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
      labels: ["FY24 Q2", "FY24 Q3", "FY24 Q4", "FY25 Q1", "FY25 Q2", "FY25 Q3 E"],
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
      labels: ["FY24 Q2", "FY24 Q3", "FY24 Q4", "FY25 Q1", "FY25 Q2", "FY25 Q3 E"],
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
      labels: ["FY25 Q1", "FY25 Q2", "FY25 Q3", "FY25 Q4", "FY26 Q1", "FY26 Q2 E"],
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
      labels: ["FY24 Q2", "FY24 Q3", "FY24 Q4", "FY25 Q1", "FY25 Q2", "FY25 Q3 E"],
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
let pendingTickerFetch = null;
let searchLoading = false;
let lastRemovedTicker = null;
let currentLanguage = localStorage.getItem("northstar-language") || "en";
let tickerContentRequest = 0;
const tickerContentCache = new Map();
const contentMetadataByTicker = new Map();
let researchStatusTimer = null;
let refreshJobs = [];
let currentUser = null;
let inviteCodeRequired = false;
let githubOAuthConfigured = false;
let supabaseAuthConfigured = false;
let preferenceSaveTimer = null;

const $ = (selector) => document.querySelector(selector);
const fmtSign = (value, suffix = "%") => `${value >= 0 ? "+" : ""}${value.toFixed(2)}${suffix}`;
const svgNS = "http://www.w3.org/2000/svg";
const watchlistStorageKey = "northstar-watchlist";
const hiddenMetricsStorageKey = "northstar-hidden-metrics-v1";
const metricDisplayStorageKey = "northstar-metric-display-v1";
const metricDisplayControlsHiddenKey = "northstar-metric-display-controls-hidden";
const selectedPeriodStorageKey = "northstar-selected-period";
let hiddenMetricsByTicker = {};
let metricDisplayByTicker = {};
let metricDisplayControlsHidden = localStorage.getItem(metricDisplayControlsHiddenKey) === "true";
let metricManagerOpen = false;
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
    "Personal research cloud": "个人研究云",
    "Local browser mode": "本地浏览器模式",
    "Signed in": "已登录",
    "Signing in...": "登录中...",
    "Continue with Google": "使用 Google 继续",
    "Continue with GitHub": "使用 GitHub 继续",
    "Developer sign in with GitHub": "开发者使用 GitHub 登录",
    "Send magic link": "发送魔法链接",
    "Magic link sent. Check your email.": "魔法链接已发送，请检查邮箱。",
    "Cloud sync enabled": "云端同步已启用",
    "Cloud sync paused": "云端同步暂停",
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
    "Quote date unavailable": "行情日期不可用",
    "Quote as of": "行情截至",
    "No companies yet. Select a company and press +.": "暂无自选股。请选择公司并点击 +。",
    "Select a company first": "请先选择公司",
    "is already added": "已在自选股中",
    "Already in watchlist": "已在自选股中",
    "Search to add a stock": "搜索并添加股票",
    "Metric visibility": "指标显示管理",
    "Reporting period": "报告期间",
    "Display settings": "显示设置",
    "Hide settings": "隐藏设置",
    Group: "分组",
    Sort: "排序",
    Chart: "图表",
    Category: "类别",
    Tier: "层级",
    None: "不分组",
    Importance: "重要性",
    "Latest value": "最新值",
    Name: "名称",
    Auto: "自动",
    Line: "折线",
    Bar: "柱状",
    "Metric split": "指标拆分",
    "Per-stock metric split": "单股指标拆分",
    "Summary": "摘要",
    "Common": "通用",
    "Stock-specific": "股票特定",
    "Hidden": "已隐藏",
    "Users & scale": "用户与规模",
    "Margins & ratios": "利润率与比率",
    "Financial operations": "财务运营",
    "Other operating metrics": "其他运营指标",
    Core: "核心",
    Important: "重要",
    Detail: "细节",
    "SEC concept": "SEC 概念",
    observations: "个观察值",
    "Stock-specific dashboard": "股票特定看板",
    "No stock-specific SEC metrics are available for this ticker yet.": "该股票目前暂无 SEC 披露的股票特定指标。",
    "Restore any metric when you need it again": "需要时可恢复任何指标",
    "All metrics in this section are hidden. Use Manage metrics to restore them.": "本区域所有指标均已隐藏。请使用“管理指标”恢复。",
    added: "已添加",
    removed: "已移除",
    Remove: "移除",
    Undo: "撤销",
    "Removed from watchlist": "已从自选股移除",
    "No US-listed SEC ticker found.": "未找到在美国上市的 SEC 股票代码。",
    Added: "已添加",
    Add: "添加",
    Fetch: "获取",
    "Open": "打开",
    "Add cached": "添加缓存",
    "Fetch & add": "获取并添加",
    "Already saved": "已保存",
    Saved: "已保存",
    "Build SEC profile": "构建 SEC 档案",
    "Usually takes 30-90 seconds for a new ticker.": "新股票通常需要 30-90 秒。",
    "Searching SEC tickers...": "正在搜索 SEC 股票代码...",
    "Type a ticker or company name.": "输入股票代码或公司名称。",
    "Try another ticker or company name.": "请尝试其他股票代码或公司名称。",
    "Downloading SEC filings and market data...": "正在下载 SEC 文件与市场数据...",
    "Keep this tab open while Northstar builds the profile.": "请保持此标签页打开，Northstar 正在构建档案。",
    "Add ticker failed": "添加股票失败",
    "Try again": "重试",
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
    "Forward outlook": "前瞻展望",
    "Guidance & estimates": "指引与预期",
    "Next quarter": "下一季度",
    "Full fiscal year": "完整财年",
    "Revenue consensus": "营收一致预期",
    "Revenue range": "营收预期范围",
    "EPS consensus": "每股收益一致预期",
    "EPS range": "每股收益预期范围",
    "Analysts": "分析师人数",
    "Estimate": "预期",
    "Estimate unavailable": "预期不可用",
    "Analyst estimates are currently unavailable.": "分析师预期目前不可用。",
    "Alpha Vantage analyst consensus": "Alpha Vantage 分析师一致预期",
    "Analyst consensus, not company-issued guidance.": "分析师一致预期，并非公司发布的指引。",
    "Nasdaq analyst consensus (EPS)": "纳斯达克分析师一致预期（每股收益）",
    "Alpha Vantage + Nasdaq analyst consensus": "Alpha Vantage 与纳斯达克分析师一致预期",
    "Multiple analyst consensus sources": "多个分析师一致预期来源",
    "Analyst consensus unavailable": "暂无分析师一致预期",
    "Company news": "公司新闻",
    "Latest headlines": "最新头条",
    "Social pulse": "社交动态",
    "X / Twitter": "X / 推特",
    "Cashtag discussion": "股票标签讨论",
    "Loading latest content...": "正在加载最新内容...",
    "No recent company news is available.": "暂无近期公司新闻。",
    "Recent X posts are unavailable.": "近期 X 帖子暂不可用。",
    "Connect X API to show recent posts here.": "连接 X API 后可在此显示近期帖子。",
    "Open live discussion on X ↗": "在 X 上打开实时讨论 ↗",
    "Copy ticker link": "复制股票链接",
    "Export data": "导出数据",
    "Refresh fundamentals": "刷新基本面",
    "Refresh news": "刷新新闻",
    "Data sources & freshness": "数据来源与更新时间",
    "Link copied": "链接已复制",
    "Copy failed": "复制失败",
    "Data exported": "数据已导出",
    "Fundamentals refreshed": "基本面已刷新",
    "Refresh failed": "刷新失败",
    "Last backend refresh": "最近后端刷新",
    "No refresh jobs yet": "暂无刷新任务",
    "succeeded": "成功",
    "failed": "失败",
    "running": "运行中",
    "News refreshed": "新闻已刷新",
    "Refreshing...": "正在刷新...",
    "Generated": "生成时间",
    "Fundamentals": "基本面",
    "Latest annual filing": "最新年度文件",
    "Latest quarterly filing": "最新季度文件",
    "Latest SEC filing": "最新 SEC 文件",
    "SEC latest check": "SEC 最新检查",
    "Latest confirmed": "已确认最新",
    "Stale - refresh needed": "已过期 - 需要刷新",
    "Unable to verify latest filing": "无法验证最新文件",
    "Fundamentals refresh": "基本面刷新",
    "Filing date unavailable": "文件日期不可用",
    "Quote": "行情",
    "Quote date": "行情日期",
    "Quote freshness": "行情新鲜度",
    "Quote date verified": "行情日期已验证",
    "Today quote": "今日行情",
    "Previous close": "前收盘价",
    "Previous close as of": "前收盘价截至",
    "Quote may be stale": "行情可能已过期",
    "Analyst estimates": "分析师预期",
    "Company news source": "公司新闻来源",
    "News latest check": "新闻最新检查",
    "Latest headline": "最新头条",
    "News fetched": "新闻获取时间",
    "Latest fetched": "已获取最新",
    "News may be stale": "新闻可能已过期",
    "News unavailable": "新闻不可用",
    "Price / fiscal-year EPS consensus": "股价 / 全财年每股收益一致预期",
    "Value": "数值",
    "Fiscal period": "财务期间",
    "X axis": "X 轴",
    "Y axis": "Y 轴",
    "Shows": "显示",
    across: "跨越",
    "each fiscal period": "每个财务期间",
    "Change": "变化",
    "EPS change": "每股收益变化",
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
  $("#add-watchlist").setAttribute("aria-label", tr("Search to add a stock"));
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
    [".guidance-card .section-label", "", "Forward outlook"],
    [".guidance-card h2", "", "Guidance & estimates"],
    [".news-card .section-label", "", "Company news"],
    [".news-card h2", "", "Latest headlines"],
    [".x-card .section-label", "", "Social pulse"],
    [".x-card h2", "", "X / Twitter"],
    [".x-card .as-of", "", "Cashtag discussion"],
    ["#estimate-legend b", "", "Estimate"],
    [".metric-visibility-card .section-label", "", "Metric visibility"],
    [".metric-visibility-card > div > p", "", "Hidden only for this ticker"],
    [".period-switcher .section-label", "", "Reporting period"],
    [".custom-metrics-card .section-label", "", "Company-specific metrics"],
    [".custom-metrics-card h2", "", "Operating metrics"],
    ["#hidden-metrics-panel strong", "", "Hidden metrics"],
    ["#hidden-metrics-panel > div > span", "", "Restore any metric when you need it again"],
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
  syncPeriodControl();
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
  renderAccount();
  renderFallbackWarning();
  renderDataStatus();
  renderSearchResults($("#stock-search").value);
  syncWatchlistButton();
}

function validReportingPeriod(period) {
  return ["annual", "quarterly"].includes(period);
}

function syncPeriodControl() {
  document.querySelectorAll("#period-control button").forEach((button) => {
    const active = button.dataset.period === selectedPeriod;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function translateSelectOptions(selector) {
  document.querySelectorAll(`${selector} option`).forEach((option) => {
    if (!option.dataset.label) option.dataset.label = option.textContent;
    option.textContent = tr(option.dataset.label);
  });
}

function updateMetricDisplayLabels() {
  [
    ["metric-group-mode", "Group"],
    ["metric-sort-mode", "Sort"],
    ["metric-chart-mode", "Chart"],
  ].forEach(([id, label]) => {
    const node = document.querySelector(`label[for='${id}']`)?.firstChild;
    if (node) node.textContent = `${tr(label)} `;
  });
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
          <button class="watchlist-remove" data-remove-ticker="${company.ticker}" aria-label="${currentLanguage === "zh" ? `从自选股移除 ${company.ticker}` : `Remove ${company.ticker} from watchlist`}">
            <span>−</span>
            <em>${tr("Remove")}</em>
          </button>
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
  button.disabled = false;
  button.textContent = "+";
  button.setAttribute("aria-label", tr("Search to add a stock"));
  button.title = tr("Search to add a stock");
}

function openWatchlistSearch() {
  const search = $("#stock-search");
  search.focus();
  search.select();
  if (search.value.trim()) renderSearchResults(search.value);
  showWatchlistStatus(tr("Search to add a stock"));
}

function showWatchlistStatus(message) {
  const status = $("#watchlist-status");
  clearTimeout(watchlistStatusTimer);
  status.textContent = message;
  watchlistStatusTimer = setTimeout(() => {
    status.textContent = "";
  }, 2200);
}

function showWatchlistUndo(ticker) {
  const status = $("#watchlist-status");
  clearTimeout(watchlistStatusTimer);
  const message = document.createElement("span");
  message.textContent = `${ticker} ${tr("Removed from watchlist")}`;
  const undo = document.createElement("button");
  undo.className = "watchlist-undo";
  undo.type = "button";
  undo.dataset.undoTicker = ticker;
  undo.textContent = tr("Undo");
  undo.addEventListener("click", () => restoreRemovedTicker(ticker));
  status.replaceChildren(message, undo);
  watchlistStatusTimer = setTimeout(() => {
    status.textContent = "";
    if (lastRemovedTicker === ticker) lastRemovedTicker = null;
  }, 6000);
}

function watchlistPayload() {
  return watchlistTickers.map((ticker) => {
    const company = companies[ticker] || {};
    const meta = company.meta || {};
    return {
      ticker,
      cik: meta.cik || company.cik || null,
      sector: meta.sector || "Unclassified",
      industry: meta.industry || "SEC registrant",
      exchange: meta.exchange || "US",
    };
  });
}

async function saveWatchlist() {
  localStorage.setItem(watchlistStorageKey, JSON.stringify(watchlistTickers));
  if (!currentUser) return;
  try {
    await fetch("/api/me/watchlist", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watchlist: watchlistPayload() }),
    });
  } catch {
    showWatchlistStatus(tr("Cloud sync paused"));
  }
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

async function loadCloudWatchlist() {
  if (!currentUser) return;
  try {
    const response = await fetch(`/api/me/watchlist?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    const cloudTickers = (payload.watchlist || []).map((item) => item.ticker).filter((ticker) => companies[ticker]);
    if (cloudTickers.length) {
      watchlistTickers = cloudTickers;
      localStorage.setItem(watchlistStorageKey, JSON.stringify(watchlistTickers));
    } else if (watchlistTickers.length) {
      saveWatchlist();
    }
  } catch {
    showWatchlistStatus(tr("Cloud sync paused"));
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
  if (!watchlistTickers.includes(ticker)) return;
  lastRemovedTicker = ticker;
  watchlistTickers = watchlistTickers.filter((item) => item !== ticker);
  saveWatchlist();
  if (selectedTicker === ticker) {
    const nextTicker = watchlistTickers.find((item) => companies[item]) || Object.keys(companies)[0];
    if (nextTicker) selectCompany(nextTicker);
  }
  renderWatchlist();
  renderSearchResults($("#stock-search").value);
  showWatchlistUndo(ticker);
}

function restoreRemovedTicker(ticker) {
  if (!lastRemovedTicker || lastRemovedTicker !== ticker || !companies[ticker]) return;
  watchlistTickers = [...watchlistTickers, ticker];
  lastRemovedTicker = null;
  saveWatchlist();
  selectCompany(ticker);
  renderWatchlist();
  renderSearchResults($("#stock-search").value);
  showWatchlistStatus(currentLanguage === "zh" ? `${ticker} ${tr("added")}` : `${ticker} added`);
}

function closeSearchResults() {
  $("#search-results").classList.remove("open");
  $("#stock-search").setAttribute("aria-expanded", "false");
  activeSearchIndex = -1;
}

function closeAccountPanel() {
  $("#account-panel").hidden = true;
  $("#account-button").setAttribute("aria-expanded", "false");
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

function searchActionLabel(company) {
  if (pendingTickerFetch === company.ticker) return tr("Fetching...");
  if (company.cached && watchlistTickers.includes(company.ticker)) return tr("Saved");
  if (company.cached) return tr("Add cached");
  return tr("Fetch & add");
}

function searchStar(company) {
  if (pendingTickerFetch === company.ticker) return "…";
  return watchlistTickers.includes(company.ticker) ? "★" : "☆";
}

function searchResultNote(company) {
  if (pendingTickerFetch === company.ticker) return tr("Downloading SEC filings and market data...");
  if (company.cached && watchlistTickers.includes(company.ticker)) return tr("Already saved");
  if (company.cached) return tr("Ready in dashboard");
  return tr("Usually takes 30-90 seconds for a new ticker.");
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
        <strong>${tr(searchLoading ? "Searching SEC tickers..." : "No US-listed SEC ticker found.")}</strong>
        <span>${tr(searchLoading ? "Type a ticker or company name." : "Try another ticker or company name.")}</span>
      </div>`;
  } else {
    results.innerHTML = searchMatches
      .map((company, index) => `
        <button class="search-result ${index === activeSearchIndex ? "active" : ""} ${pendingTickerFetch === company.ticker ? "loading" : ""}" data-search-ticker="${company.ticker}" role="option" ${pendingTickerFetch ? "disabled" : ""}>
          <span class="search-result-logo" style="background:${company.color || "#1f6657"}">${company.ticker[0]}</span>
          <span class="search-result-copy">
            <strong>${company.ticker} · ${company.name}</strong>
            <span>${translateMeta(company.meta || company.exchange || tr("SEC listed company"))}</span>
            <small>${searchResultNote(company)}</small>
          </span>
          <span class="search-result-action ${watchlistTickers.includes(company.ticker) ? "saved" : ""}">
            <b>${searchStar(company)}</b>
            ${searchActionLabel(company)}
          </span>
        </button>`,
      )
      .join("");
  }

  if (pendingTickerFetch) {
    results.insertAdjacentHTML("afterbegin", `
      <div class="search-progress">
        <strong>${tr("Build SEC profile")} · ${pendingTickerFetch}</strong>
        <span>${tr("Keep this tab open while Northstar builds the profile.")}</span>
      </div>`);
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
  searchLoading = true;
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
    searchLoading = false;
    paintSearchResults(normalized);
  } catch (error) {
    searchLoading = false;
    if (!cached.length && requestId === searchRequest) {
      $("#search-results").innerHTML = `<div class="search-empty search-error"><strong>${currentLanguage === "zh" ? "实时股票搜索不可用" : "Live ticker search unavailable"}</strong><span>${error.message}</span></div>`;
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

async function loadRefreshStatus() {
  try {
    const response = await fetch(`/api/refresh/status?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    refreshJobs = payload.jobs || [];
  } catch {
    refreshJobs = [];
  }
}

async function refreshCompanyData(ticker) {
  const button = $("#refresh-company-data");
  const previousLabel = button.textContent;
  button.disabled = true;
  button.textContent = tr("Refreshing...");
  try {
    const response = await fetch(`/api/refresh/${encodeURIComponent(ticker)}`, { method: "POST" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    companies[ticker] = mergeCompany(payload.company);
    dataMetadata = {
      ...(dataMetadata || {}),
      generatedAt: payload.generatedAt,
      peers: payload.peers || dataMetadata?.peers,
    };
    if (payload.job) refreshJobs = [payload.job, ...refreshJobs.filter((job) => job.id !== payload.job.id)].slice(0, 12);
    refreshPeerData(payload.peers);
    selectCompany(ticker, false);
    renderMarketStrip();
    renderScatter();
    renderDataStatus();
    showResearchStatus("Fundamentals refreshed");
  } catch (error) {
    showResearchStatus(`${tr("Refresh failed")}: ${error.message}`);
  } finally {
    button.disabled = false;
    button.textContent = previousLabel;
  }
}

async function chooseSearchResult(ticker) {
  const match = searchMatches.find((item) => item.ticker === ticker);
  if (!match || pendingTickerFetch) return;
  if (companies[ticker]) {
    selectCompany(ticker);
    const added = addToWatchlist(ticker);
    showWatchlistStatus(added
      ? currentLanguage === "zh" ? `${ticker} ${tr("added")}` : `${ticker} added`
      : tr("Already in watchlist"));
    $("#stock-search").value = "";
    closeSearchResults();
    return;
  }

  pendingTickerFetch = ticker;
  paintSearchResults($("#stock-search").value || ticker);
  showWatchlistStatus(`${tr("Build SEC profile")} · ${ticker}`);

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
    showWatchlistStatus(currentLanguage === "zh" ? `${ticker} ${tr("added")}` : `${ticker} added`);
  } catch (error) {
    pendingTickerFetch = null;
    $("#search-results").innerHTML = `
      <div class="search-empty search-error">
        <strong>${tr("Add ticker failed")} · ${ticker}</strong>
        <span>${error.message}</span>
        <button class="search-retry" data-retry-ticker="${ticker}">${tr("Try again")}</button>
      </div>`;
    $("#search-results").classList.add("open");
    document.querySelector("[data-retry-ticker]")?.addEventListener("click", () => chooseSearchResult(ticker));
    showWatchlistStatus(`${tr("Add ticker failed")} · ${ticker}`);
  } finally {
    pendingTickerFetch = null;
  }
}

function renderCompany() {
  const company = companies[selectedTicker];
  const quoteAsOf = company.sources?.quoteAsOf || company.quoteAsOf;
  const quoteFreshness = company.sources?.quoteFreshness;
  $("#company-logo").textContent = company.ticker[0];
  $("#company-logo").style.background = company.color;
  $("#company-name").textContent = company.name;
  $("#company-ticker").textContent = company.ticker;
  $("#fundamentals-ticker").textContent = company.ticker;
  $("#company-meta").textContent = translateMeta(company.meta);
  $("#company-price").textContent = Number.isFinite(company.price) ? `$${company.price.toFixed(2)}` : tr("Price unavailable");
  $("#company-change").textContent = Number.isFinite(company.price) ? fmtSign(company.change) : "N/A";
  $("#company-change").className = company.change >= 0 ? "positive" : "negative";
  $("#company-cap").textContent = company.cap === "Quote key required"
    ? tr("Market cap unavailable")
    : `${tr("Market cap")} ${company.cap}`;
  if (Number.isFinite(company.price)) {
    const quoteLabel = quoteFreshness?.status === "previous-close" ? "Previous close as of" : "Quote as of";
    $("#company-cap").textContent += ` · ${quoteAsOf ? `${tr(quoteLabel)} ${quoteAsOf}` : tr("Quote date unavailable")}`;
  } else if (quoteFreshness?.label) {
    $("#company-cap").textContent += ` · ${tr(quoteFreshness.label)}`;
  }
  $("#quality-score").textContent = company.score;
  $("#quality-label").textContent = tr(company.quality);
  $("#quality-copy").textContent = tr(company.copy);
  $("#score-ring").style.setProperty("--score", `${company.score}%`);
  renderResearchToolbar(company);

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
  renderGuidance(company.guidance || null, company);
  renderCustomMetrics(company.customMetrics || []);
  renderMetricProfile(company);
  renderMetricManager(company);
  renderTickerContent(company.ticker);

  renderFundamentals();
  renderOperatingChart();
  renderWatchlist();
}

function renderResearchToolbar(company) {
  $("#copy-ticker-link").textContent = tr("Copy ticker link");
  $("#export-company-data").textContent = tr("Export data");
  $("#refresh-company-data").textContent = tr("Refresh fundamentals");
  $("#refresh-ticker-content").textContent = tr("Refresh news");
  updateMetricDisplayLabels();
  translateSelectOptions("#metric-group-mode");
  translateSelectOptions("#metric-sort-mode");
  translateSelectOptions("#metric-chart-mode");
  syncMetricDisplayPanel();
  document.querySelector(".source-details summary").textContent = tr("Data sources & freshness");
  const generated = dataMetadata?.generatedAt
    ? new Date(dataMetadata.generatedAt).toLocaleString(currentLanguage === "zh" ? "zh-CN" : "en-US")
    : `${mockText()} ${tr("Generated")}`;
  const fundamentalUrl = company.sources?.fundamentals;
  const fundamentalsAsOf = company.sources?.fundamentalsAsOf || {};
  const latestCheck = fundamentalsAsOf.latestCheck || {};
  const latestFiling = latestCheck.latestFiling;
  const contentMetadata = contentMetadataByTicker.get(company.ticker) || {};
  const newsFreshness = contentMetadata.newsFreshness || {};
  const quoteAsOf = company.sources?.quoteAsOf || company.quoteAsOf;
  const quoteFreshness = company.sources?.quoteFreshness;
  const latestJob = refreshJobs.find((job) => job.ticker === company.ticker);
  const refreshStatus = latestJob
    ? `${tr(latestJob.status)} · ${new Date(latestJob.finishedAt || latestJob.startedAt).toLocaleString(currentLanguage === "zh" ? "zh-CN" : "en-US")}`
    : tr("No refresh jobs yet");
  $("#company-source-list").innerHTML = `
    <div><span>${tr("Generated")}</span><strong>${escapeHtml(generated)}</strong></div>
    <div><span>${tr("Last backend refresh")}</span><strong>${escapeHtml(refreshStatus)}</strong></div>
    <div><span>${tr("Fundamentals")}</span>${fundamentalUrl ? `<a href="${escapeHtml(fundamentalUrl)}" target="_blank" rel="noopener noreferrer">SEC EDGAR ↗</a>` : `<strong>N/A</strong>`}</div>
    <div><span>${tr("SEC latest check")}</span><strong>${escapeHtml(tr(latestCheck.label || "Unable to verify latest filing"))}</strong></div>
    <div><span>${tr("Latest SEC filing")}</span><strong>${escapeHtml(latestFiling ? `${latestFiling.form} · ${latestFiling.reportDate} · filed ${latestFiling.filed}` : "N/A")}</strong></div>
    <div><span>${tr("Latest annual filing")}</span><strong>${escapeHtml(fundamentalsAsOf.annualPeriod ? `${fundamentalsAsOf.annualPeriod} · ${fundamentalsAsOf.annualFiled || tr("Filing date unavailable")}` : "N/A")}</strong></div>
    <div><span>${tr("Latest quarterly filing")}</span><strong>${escapeHtml(fundamentalsAsOf.quarterPeriod ? `${fundamentalsAsOf.quarterPeriod} · ${fundamentalsAsOf.quarterFiled || tr("Filing date unavailable")}` : "N/A")}</strong></div>
    <div><span>${tr("Fundamentals refresh")}</span><strong>${escapeHtml(fundamentalsAsOf.refreshedAt ? new Date(fundamentalsAsOf.refreshedAt).toLocaleString(currentLanguage === "zh" ? "zh-CN" : "en-US") : generated)}</strong></div>
    <div><span>${tr("Quote")}</span><strong>${escapeHtml(company.sources?.quote || "N/A")}</strong></div>
    <div><span>${tr("Quote date")}</span><strong>${escapeHtml(quoteAsOf || tr("Quote date unavailable"))}</strong></div>
    <div><span>${tr("Quote freshness")}</span><strong>${escapeHtml(tr(quoteFreshness?.label || (quoteAsOf ? "Quote date verified" : "Quote date unavailable")))}</strong></div>
    <div><span>${tr("Analyst estimates")}</span><strong>${escapeHtml(company.guidance?.source || tr("Analyst consensus unavailable"))}</strong></div>
    <div><span>${tr("Company news source")}</span><strong>${escapeHtml(newsFreshness.provider || "Nasdaq")}</strong></div>
    <div><span>${tr("News latest check")}</span><strong>${escapeHtml(tr(newsFreshness.label || "News unavailable"))}</strong></div>
    <div><span>${tr("Latest headline")}</span><strong>${escapeHtml(newsFreshness.latestPublishedAt ? new Date(newsFreshness.latestPublishedAt).toLocaleString(currentLanguage === "zh" ? "zh-CN" : "en-US") : "N/A")}</strong></div>
    <div><span>${tr("News fetched")}</span><strong>${escapeHtml(newsFreshness.fetchedAt ? new Date(newsFreshness.fetchedAt).toLocaleString(currentLanguage === "zh" ? "zh-CN" : "en-US") : "N/A")}</strong></div>`;
}

function showResearchStatus(message) {
  clearTimeout(researchStatusTimer);
  $("#research-action-status").textContent = tr(message);
  researchStatusTimer = setTimeout(() => { $("#research-action-status").textContent = ""; }, 2500);
}

function tickerUrl(ticker) {
  const url = new URL(window.location.href);
  url.searchParams.set("ticker", ticker);
  return url;
}

function updateTickerUrl(ticker, replace = false) {
  const url = tickerUrl(ticker);
  window.history[replace ? "replaceState" : "pushState"]({ ticker }, "", url);
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function companyExportRows(company) {
  const rows = [["Ticker", company.ticker], ["Company", company.name], ["Generated", dataMetadata?.generatedAt || "[MOCK/FAKE]"]];
  for (const period of ["annual", "quarterly"]) {
    for (const [metric, value, delta, note, history] of company.periodMetrics?.[period] || []) {
      rows.push([period, metric, "latest", value, delta, note]);
      history?.labels?.forEach((label, index) => rows.push([period, metric, label, history.displayValues?.[index] ?? history.values?.[index], "", note]));
    }
  }
  for (const metric of company.financialMetrics || []) {
    rows.push(["financial", metric.title, metric.period || "latest", metric.value, "", metric.note]);
    metric.history?.labels?.forEach((label, index) => rows.push(["financial", metric.title, label, metric.history.displayValues?.[index] ?? metric.history.values?.[index], "", metric.note]));
  }
  for (const metric of company.customMetrics || []) {
    metric.labels?.forEach((label, index) => rows.push(["company-specific", metric.title, label, metric.displayValues?.[index] ?? metric.values?.[index], "", metric.source]));
  }
  for (const [label, value, note] of company.quarterDetail?.items || []) rows.push(["quarter-detail", label, company.quarterDetail.period, value, "", note]);
  if (company.sources?.fundamentalsAsOf) {
    const latestCheck = company.sources.fundamentalsAsOf.latestCheck || {};
    rows.push(["source", "Latest annual filing", company.sources.fundamentalsAsOf.annualPeriod || "", company.sources.fundamentalsAsOf.annualFiled || "", "", "SEC filing"]);
    rows.push(["source", "Latest quarterly filing", company.sources.fundamentalsAsOf.quarterPeriod || "", company.sources.fundamentalsAsOf.quarterFiled || "", "", "SEC filing"]);
    rows.push(["source", "SEC latest check", latestCheck.status || "", latestCheck.label || "", "", latestCheck.latestFiling ? JSON.stringify(latestCheck.latestFiling) : ""]);
    rows.push(["source", "Fundamentals refresh", "generated", company.sources.fundamentalsAsOf.refreshedAt || "", "", "Northstar refresh"]);
  }
  const newsFreshness = contentMetadataByTicker.get(company.ticker)?.newsFreshness;
  if (newsFreshness) {
    rows.push(["source", "News latest check", newsFreshness.status || "", newsFreshness.label || "", "", newsFreshness.provider || "Nasdaq"]);
    rows.push(["source", "Latest headline", "published", newsFreshness.latestPublishedAt || "", "", `${newsFreshness.headlineCount || 0} headlines`]);
    rows.push(["source", "News fetched", "fetched", newsFreshness.fetchedAt || "", "", "Northstar content refresh"]);
  }
  for (const [horizon, estimate] of Object.entries({ "next-quarter": company.guidance?.nextQuarter, "fiscal-year": company.guidance?.fiscalYear })) {
    if (!estimate) continue;
    rows.push(["guidance", "Revenue consensus", estimate.period || horizon, estimate.revenue, estimate.revenueRange, company.guidance.source]);
    rows.push(["guidance", "EPS consensus", estimate.period || horizon, estimate.eps, estimate.epsRange, company.guidance.source]);
  }
  return rows;
}

function exportCompanyData(company) {
  const csv = companyExportRows(company).map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${company.ticker.toLowerCase()}-northstar-data.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
  showResearchStatus("Data exported");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderNewsItems(news) {
  return news.length ? news.map((item) => `
    <a class="feed-item" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
      <span>${escapeHtml(item.publisher)} · ${escapeHtml(item.published)}</span>
      <strong>${escapeHtml(item.title)}</strong>
      ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
    </a>`).join("") : `<div class="feed-empty">${tr("No recent company news is available.")}</div>`;
}

function renderXItems(x) {
  if (x.status === "unconfigured") {
    return `<div class="feed-empty">${tr("Connect X API to show recent posts here.")}</div>`;
  }
  if (!x.posts?.length) return `<div class="feed-empty">${tr("Recent X posts are unavailable.")}</div>`;
  return x.posts.map((post) => `
    <a class="feed-item social-post" href="${escapeHtml(post.url)}" target="_blank" rel="noopener noreferrer">
      <span>${escapeHtml(post.authorName)}${post.username ? ` @${escapeHtml(post.username)}` : ""} · ${new Date(post.createdAt).toLocaleString(currentLanguage === "zh" ? "zh-CN" : "en-US")}</span>
      <p>${escapeHtml(post.text)}</p>
      <small>♡ ${post.likes} · ↻ ${post.reposts}</small>
    </a>`).join("");
}

async function renderTickerContent(ticker, force = false) {
  const requestId = ++tickerContentRequest;
  $("#news-feed").innerHTML = `<div class="feed-empty">${tr("Loading latest content...")}</div>`;
  $("#x-feed").innerHTML = `<div class="feed-empty">${tr("Loading latest content...")}</div>`;
  $("#x-search-link").href = `https://x.com/search?q=${encodeURIComponent(`$${ticker}`)}&src=typed_query&f=live`;
  $("#x-search-link").textContent = tr("Open live discussion on X ↗");
  try {
    let payload = force ? null : tickerContentCache.get(ticker);
    if (!payload) {
      const response = await fetch(`/api/content/${encodeURIComponent(ticker)}${force ? "?refresh=1" : ""}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      payload = await response.json();
      tickerContentCache.set(ticker, payload);
    }
    if (requestId !== tickerContentRequest || ticker !== selectedTicker) return;
    contentMetadataByTicker.set(ticker, {
      newsFreshness: payload.newsFreshness || {
        provider: "Nasdaq",
        status: payload.newsStatus || "unavailable",
        label: payload.newsStatus === "available" ? "Latest fetched" : "News unavailable",
        fetchedAt: payload.fetchedAt,
        latestPublishedAt: null,
        headlineCount: payload.news?.length || 0,
      },
    });
    $("#news-feed").innerHTML = renderNewsItems(payload.news || []);
    $("#x-feed").innerHTML = renderXItems(payload.x || { status: "unavailable", posts: [] });
    $("#x-search-link").href = payload.xSearchUrl;
    $("#x-search-link").textContent = tr("Open live discussion on X ↗");
    renderResearchToolbar(companies[selectedTicker]);
    if (force) showResearchStatus("News refreshed");
  } catch {
    if (requestId !== tickerContentRequest) return;
    contentMetadataByTicker.set(ticker, {
      newsFreshness: {
        provider: "Nasdaq",
        status: "unavailable",
        label: "News unavailable",
        fetchedAt: new Date().toISOString(),
        latestPublishedAt: null,
        headlineCount: 0,
      },
    });
    $("#news-feed").innerHTML = `<div class="feed-empty">${tr("No recent company news is available.")}</div>`;
    $("#x-feed").innerHTML = `<div class="feed-empty">${tr("Recent X posts are unavailable.")}</div>`;
    $("#x-search-link").href = `https://x.com/search?q=${encodeURIComponent(`$${ticker}`)}&src=typed_query&f=live`;
    renderResearchToolbar(companies[selectedTicker]);
  }
}

function renderSummaryMetrics(company) {
  const metrics = company.periodMetrics?.[selectedPeriod] || company.metrics;
  const visibleMetrics = metrics.filter(([label]) => !isMetricHidden(metricKey("summary", label)));
  $("#metrics-grid").innerHTML = visibleMetrics.length ? visibleMetrics
    .map(([label, value, delta, note, history], index) => {
      const isNegative = delta.startsWith("-");
      const neutral = label === "Forward P/E" || delta === "Same quarter prior year";
      const key = encodeURIComponent(metricKey("summary", label));
      return `
        <article class="metric-card card">
          <div class="metric-top">
            <span>${tr(label)}</span>
            <div class="metric-card-actions">
              <span class="metric-delta ${neutral ? "" : isNegative ? "negative" : "positive"}">${tr(delta)}</span>
              <button class="metric-hide" data-hide-metric="${key}" aria-label="${tr("Hide")} ${tr(label)}">${tr("Hide")}</button>
            </div>
          </div>
          <strong>${tr(value)}</strong>
          <p>${tr(note)}</p>
          ${renderMetricHistory(label === "EPS growth" ? epsChangeChartHistory(company, selectedPeriod, history) : history, "metric-history", label, "line")}
        </article>`;
    })
    .join("") : `<div class="metrics-empty card">${tr("All metrics in this section are hidden. Use Manage metrics to restore them.")}</div>`;
}

function fiscalPeriodOrdinal(label) {
  const quarter = String(label || "").match(/^FY(\d{2,4}) Q([1-4])$/);
  if (quarter) return Number(quarter[1]) * 4 + Number(quarter[2]) - 1;
  const year = String(label || "").match(/^FY(\d{2,4})$/);
  return year ? Number(year[1]) : null;
}

function epsChangeChartHistory(company, period, history) {
  if (!history?.labels?.length) return history;
  const series = period === "quarterly" ? company.quarterly : company.annual;
  const epsByPeriod = new Map((series?.labels || []).map((label, index) => [fiscalPeriodOrdinal(label), series.eps?.[index]]));
  const step = period === "quarterly" ? 4 : 1;
  const values = history.labels.map((label) => {
    const ordinal = fiscalPeriodOrdinal(label);
    const current = epsByPeriod.get(ordinal);
    const prior = epsByPeriod.get(ordinal - step);
    return Number.isFinite(current) && Number.isFinite(prior) ? current - prior : null;
  });
  return {
    ...history,
    values,
    axisFormat: "eps",
    axisLabel: "EPS change",
  };
}

function numericHistoryValue(value) {
  if (Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const normalized = value.replace(/,/g, "").trim();
  if (!normalized || /N\/A|profit to loss|loss to profit|widened|narrowed/i.test(normalized)) return null;
  const match = normalized.match(/(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  let number = Number(match[1]);
  if (normalized.includes("-$")) number = -Math.abs(number);
  if (/T/i.test(normalized)) number *= 1e12;
  else if (/B/i.test(normalized)) number *= 1e9;
  else if (/M/i.test(normalized)) number *= 1e6;
  else if (/K/i.test(normalized)) number *= 1e3;
  return Number.isFinite(number) ? number : null;
}

function metricChartValues(history) {
  const source = history.values?.length === history.labels.length ? history.values : history.displayValues;
  const values = source.map(numericHistoryValue);
  const sample = history.displayValues?.find((value) => typeof value === "string" && value !== "N/A") || "";
  if (!sample.includes("%")) return values;
  const ratios = values.map((value, index) => {
    const displayed = numericHistoryValue(history.displayValues?.[index]);
    return Number.isFinite(value) && value !== 0 && Number.isFinite(displayed) ? Math.abs(displayed / value) : null;
  }).filter(Number.isFinite);
  const scale = ratios.some((ratio) => ratio > 50 && ratio < 150) ? 100 : 1;
  return values.map((value) => Number.isFinite(value) ? value * scale : null);
}

function formatMetricAxis(value, history, delta = false) {
  const sample = history.displayValues?.find((item) => typeof item === "string" && item !== "N/A") || "";
  const prefix = sample.includes("$") || history.axisFormat === "eps" ? "$" : "";
  const suffix = sample.includes("%") ? (delta ? " pts" : "%") : /x$/i.test(sample.trim()) ? "x" : "";
  const absolute = Math.abs(value);
  let scaled = absolute;
  let unit = "";
  if (!suffix && absolute >= 1e12) [scaled, unit] = [absolute / 1e12, "T"];
  else if (!suffix && absolute >= 1e9) [scaled, unit] = [absolute / 1e9, "B"];
  else if (!suffix && absolute >= 1e6) [scaled, unit] = [absolute / 1e6, "M"];
  else if (!suffix && absolute >= 1e3) [scaled, unit] = [absolute / 1e3, "K"];
  const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
  const sign = value < 0 ? "-" : delta && value > 0 ? "+" : "";
  return `${sign}${prefix}${scaled.toFixed(digits)}${unit}${suffix}`;
}

function metricTickIndices(length, maximum = 5) {
  if (length <= maximum) return Array.from({ length }, (_, index) => index);
  return [...new Set(Array.from({ length: maximum }, (_, index) => Math.round(index * (length - 1) / (maximum - 1))))];
}

function miniChart(history, type, title) {
  if (!history?.labels?.length) return "";
  const values = metricChartValues(history);
  const validValues = values.filter(Number.isFinite);
  if (validValues.length < 2) return "";
  const width = 340;
  const height = 132;
  const pad = { top: 19, right: 9, bottom: 26, left: 47 };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;
  const escapedTitle = escapeHtml(title);
  const axisLabel = tr(history.axisLabel || "Value");
  const rawMin = Math.min(...validValues);
  const rawMax = Math.max(...validValues);
  const rawSpread = rawMax - rawMin || Math.max(Math.abs(rawMax) * 0.1, 1);
  let min = type === "bar" ? Math.min(0, rawMin) : rawMin - rawSpread * 0.12;
  let max = type === "bar" ? Math.max(0, rawMax) : rawMax + rawSpread * 0.12;
  if (min === max) max = min + 1;
  const y = (value) => pad.top + ((max - value) / (max - min)) * chartHeight;
  const x = (index) => type === "bar"
    ? pad.left + ((index + 0.5) / values.length) * chartWidth
    : pad.left + (index / Math.max(values.length - 1, 1)) * chartWidth;
  const yTicks = [max, (max + min) / 2, min];
  const grid = yTicks.map((value) => `
    <line x1="${pad.left}" y1="${y(value).toFixed(1)}" x2="${width - pad.right}" y2="${y(value).toFixed(1)}" class="metric-chart-grid" />
    <text x="${pad.left - 5}" y="${(y(value) + 2.5).toFixed(1)}" text-anchor="end" class="metric-chart-axis">${formatMetricAxis(value, history)}</text>`).join("");
  const xTicks = metricTickIndices(values.length).map((index) => `
    <line x1="${x(index).toFixed(1)}" y1="${height - pad.bottom}" x2="${x(index).toFixed(1)}" y2="${height - pad.bottom + 3}" class="metric-chart-tick" />
    <text x="${x(index).toFixed(1)}" y="${height - 8}" text-anchor="middle" class="metric-chart-axis">${escapeHtml(history.labels[index])}</text>`).join("");
  const baseline = y(Math.min(max, Math.max(min, 0)));
  let marks;
  if (type === "bar") {
    const groupWidth = chartWidth / values.length;
    const barWidth = Math.max(5, Math.min(28, groupWidth * 0.58));
    marks = values.map((value, index) => {
      if (!Number.isFinite(value)) return "";
      const valueY = y(value);
      const barY = Math.min(valueY, baseline);
      const barHeight = Math.max(1.5, Math.abs(baseline - valueY));
      const barX = x(index) - barWidth / 2;
      return `<rect x="${barX.toFixed(1)}" y="${barY.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" rx="2" fill="${value < 0 ? "#e77d61" : "#397966"}" opacity="${index === values.length - 1 ? "0.95" : "0.64"}"><title>${escapeHtml(history.labels[index])}: ${escapeHtml(history.displayValues?.[index] ?? formatMetricAxis(value, history))}</title></rect>`;
    }).join("");
  } else {
    const points = values.map((value, index) => Number.isFinite(value) ? { x: x(index), y: y(value), index } : null).filter(Boolean);
    const path = points.map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
    const dots = points.map((point) => `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${point.index === values.length - 1 ? 3.5 : 2.3}" fill="${point.index === values.length - 1 ? "#1f6657" : "#fffefa"}" stroke="#1f6657" stroke-width="1.5"><title>${escapeHtml(history.labels[point.index])}: ${escapeHtml(history.displayValues?.[point.index] ?? formatMetricAxis(values[point.index], history))}</title></circle>`).join("");
    marks = `<path d="${path}" fill="none" stroke="#397966" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />${dots}`;
  }
  const first = values.find(Number.isFinite);
  const latest = values.filter(Number.isFinite).at(-1);
  const change = latest - first;
  const changeClass = change > 0 ? "positive" : change < 0 ? "negative" : "";
  return `<div class="metric-mini-chart">
    <div class="metric-chart-meta"><span>${axisLabel}: ${formatMetricAxis(min, history)} – ${formatMetricAxis(max, history)}</span><strong class="${changeClass}">${tr("Change")} ${formatMetricAxis(change, history, true)}</strong></div>
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapedTitle}: ${axisLabel} ${formatMetricAxis(min, history)} to ${formatMetricAxis(max, history)}; ${tr("Fiscal period")} ${escapeHtml(history.labels[0])} to ${escapeHtml(history.labels.at(-1))}">
      <text x="${pad.left}" y="10" class="metric-chart-title">${axisLabel}</text>
      ${grid}${min < 0 && max > 0 ? `<line x1="${pad.left}" y1="${y(0).toFixed(1)}" x2="${width - pad.right}" y2="${y(0).toFixed(1)}" class="metric-chart-zero" />` : ""}
      ${marks}${xTicks}
      <text x="${width - pad.right}" y="${height - 1}" text-anchor="end" class="metric-chart-title">${tr("Fiscal period")}</text>
    </svg>
    <div class="metric-axis-explainer">
      <span><b>${tr("X axis")}:</b> ${tr("Fiscal period")} (${escapeHtml(history.labels[0])} → ${escapeHtml(history.labels.at(-1))})</span>
      <span><b>${tr("Y axis")}:</b> ${escapeHtml(axisLabel)} (${formatMetricAxis(min, history)} → ${formatMetricAxis(max, history)})</span>
      <span><b>${tr("Shows")}:</b> ${escapeHtml(title)} ${tr("across")} ${tr("each fiscal period")}</span>
    </div>
  </div>`;
}

function renderMetricHistory(history, className, title, chartType) {
  if (!history?.labels?.length) return "";
  return `${miniChart(history, chartType, title)}<div class="${className}">
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
  const visibleMetrics = metrics.filter((metric) => !isMetricHidden(metricKey("financial", metric.title)));
  $("#financial-metrics-grid").innerHTML = visibleMetrics.length ? visibleMetrics.map((metric) => `
    <article class="financial-metric">
      <div class="financial-metric-heading">
        <span>${tr(metric.title)}</span>
        <button class="metric-hide" data-hide-metric="${encodeURIComponent(metricKey("financial", metric.title))}" aria-label="${tr("Hide")} ${tr(metric.title)}">${tr("Hide")}</button>
      </div>
      <strong>${metric.value}</strong>
      <small>${tr(metric.note)}${metric.period ? ` · ${metric.period}` : ""}</small>
      ${renderMetricHistory(metric.history, "financial-metric-history", metric.title, /margin|ROE|CAGR|Debt/i.test(metric.title) ? "line" : "bar")}
    </article>`).join("") : `<div class="custom-metrics-empty">${tr("All metrics in this section are hidden. Use Manage metrics to restore them.")}</div>`;
}

function advanceQuarterLabel(label) {
  const match = String(label || "").match(/^FY(\d{2,4}) Q([1-4])$/);
  if (!match) return tr("Next quarter");
  const quarter = Number(match[2]);
  const fiscalYear = Number(match[1]) + (quarter === 4 ? 1 : 0);
  return `FY${String(fiscalYear).padStart(match[1].length, "0")} Q${quarter === 4 ? 1 : quarter + 1}`;
}

function nextFiscalYearLabel(label) {
  const match = String(label || "").match(/^FY(\d{2,4})/);
  if (!match) return tr("Full fiscal year");
  const year = Number(match[1]) + 1;
  return `FY${String(year).padStart(match[1].length, "0")}`;
}

function unavailableEstimate(period) {
  return {
    period,
    revenue: "N/A",
    revenueRange: "N/A",
    eps: "N/A",
    epsRange: "N/A",
    analystCount: null,
    revenueValue: null,
    epsValue: null,
  };
}

function renderGuidance(guidance, company) {
  const nextQuarter = guidance?.nextQuarter || unavailableEstimate(advanceQuarterLabel(company.quarterly?.labels?.at(-1)));
  const fiscalYear = guidance?.fiscalYear || unavailableEstimate(nextFiscalYearLabel(company.annual?.labels?.at(-1)));
  const estimates = [
    ["Next quarter", nextQuarter],
    ["Full fiscal year", fiscalYear],
  ];
  $("#guidance-source").textContent = guidance?.source ? tr(guidance.source) : "";
  $("#guidance-disclaimer").textContent = guidance?.disclaimer ? tr(guidance.disclaimer) : "";
  $("#guidance-grid").innerHTML = estimates.map(([title, estimate]) => `
        <article class="guidance-period">
          <div class="guidance-period-heading">
            <span>${tr(title)}</span>
            <strong>${estimate.period}</strong>
          </div>
          <dl>
            <div><dt>${tr("Revenue consensus")}</dt><dd>${estimate.revenue}</dd></div>
            <div><dt>${tr("Revenue range")}</dt><dd>${estimate.revenueRange}</dd></div>
            <div><dt>${tr("EPS consensus")}</dt><dd>${estimate.eps}</dd></div>
            <div><dt>${tr("EPS range")}</dt><dd>${estimate.epsRange}</dd></div>
            <div><dt>${tr("Analysts")}</dt><dd>${Number.isFinite(estimate.analystCount) ? estimate.analystCount : "N/A"}</dd></div>
          </dl>
        </article>`).join("");
}

function customMetricGroup(metric) {
  const text = `${metric.title || ""} ${metric.description || ""}`;
  if (/member|user|subscriber|customer|account|active|enrollment|covered|policy|lives/i.test(text)) return "Users & scale";
  if (/margin|ratio|rate|yield|retention|churn|loss/i.test(text)) return "Margins & ratios";
  if (/cash|flow|capex|debt|income|expense|revenue|premium|claim|cost/i.test(text)) return "Financial operations";
  return "Other operating metrics";
}

function metricProfileFor(company) {
  const profile = company.metricProfile || {};
  const customMetrics = company.customMetrics || [];
  const customGroups = profile.customGroups || customMetrics.reduce((groups, metric) => {
    const group = metric.group || customMetricGroup(metric);
    groups[group] = (groups[group] || 0) + 1;
    return groups;
  }, {});
  const customTiers = profile.customTiers || customMetrics.reduce((tiers, metric) => {
    const tier = metric.tier || "Detail";
    tiers[tier] = (tiers[tier] || 0) + 1;
    return tiers;
  }, {});
  return {
    summaryCount: profile.summaryCount ?? (company.metrics || []).length,
    financialCount: profile.financialCount ?? (company.financialMetrics || []).length,
    customCount: profile.customCount ?? customMetrics.length,
    customGroups,
    customTiers,
  };
}

function renderMetricProfile(company) {
  const profile = metricProfileFor(company);
  const hiddenCount = (hiddenMetricsByTicker[selectedTicker] || []).length;
  const chips = [
    ["Summary", profile.summaryCount],
    ["Common", profile.financialCount],
    ["Stock-specific", profile.customCount],
    ["Hidden", hiddenCount],
    ...["Core", "Important", "Detail"].map((tier) => [tier, profile.customTiers?.[tier] || 0]).filter(([, count]) => count > 0),
    ...Object.entries(profile.customGroups).filter(([, count]) => count > 0),
  ];
  $("#metric-profile").innerHTML = chips.map(([label, count]) => `
    <span class="metric-profile-chip">
      <strong>${tr(label)}</strong>
      <em>${count}</em>
    </span>`).join("");
}

function latestMetricNumber(metric) {
  const value = metric.values?.at(-1);
  if (Number.isFinite(value)) return value;
  const display = String(metric.latest || metric.displayValues?.at(-1) || "");
  const multiplier = display.includes("T") ? 1e12 : display.includes("B") ? 1e9 : display.includes("M") ? 1e6 : display.includes("K") ? 1e3 : 1;
  const parsed = Number(display.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed * multiplier : null;
}

function defaultMetricDisplay() {
  return { groupMode: "category", sortMode: "importance", chartMode: "auto" };
}

function metricDisplaySettings(ticker = selectedTicker) {
  return { ...defaultMetricDisplay(), ...(metricDisplayByTicker[ticker] || {}) };
}

function saveMetricDisplaySettings() {
  localStorage.setItem(metricDisplayStorageKey, JSON.stringify(metricDisplayByTicker));
  schedulePreferenceSave();
}

function setMetricDisplaySetting(key, value) {
  metricDisplayByTicker[selectedTicker] = { ...metricDisplaySettings(), [key]: value };
  saveMetricDisplaySettings();
  syncMetricDisplayControls();
  renderCustomMetrics(companies[selectedTicker]?.customMetrics || []);
}

function loadMetricDisplaySettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(metricDisplayStorageKey) || "{}");
    metricDisplayByTicker = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    metricDisplayByTicker = {};
  }
}

function syncMetricDisplayControls() {
  const settings = metricDisplaySettings();
  $("#metric-group-mode").value = settings.groupMode;
  $("#metric-sort-mode").value = settings.sortMode;
  $("#metric-chart-mode").value = settings.chartMode;
  syncMetricDisplayPanel();
}

function syncMetricDisplayPanel() {
  const panel = $("#metric-display-controls");
  const button = $("#toggle-metric-display");
  panel.hidden = metricDisplayControlsHidden;
  button.textContent = tr(metricDisplayControlsHidden ? "Display settings" : "Hide settings");
  button.setAttribute("aria-expanded", String(!metricDisplayControlsHidden));
}

function toggleMetricDisplayPanel() {
  metricDisplayControlsHidden = !metricDisplayControlsHidden;
  localStorage.setItem(metricDisplayControlsHiddenKey, String(metricDisplayControlsHidden));
  syncMetricDisplayPanel();
}

async function loadSession() {
  try {
    const response = await fetch(`/api/session?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    currentUser = payload.user || null;
    inviteCodeRequired = Boolean(payload.auth?.inviteRequired);
    githubOAuthConfigured = Boolean(payload.auth?.githubConfigured);
    supabaseAuthConfigured = Boolean(payload.auth?.supabaseConfigured);
    renderAccount();
  } catch {
    currentUser = null;
  }
}

async function signIn(email, inviteCode) {
  if (supabaseAuthConfigured) {
    const response = await fetch("/api/auth/supabase/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, inviteCode }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    $("#account-status").textContent = tr("Magic link sent. Check your email.");
    return;
  }
  const response = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, inviteCode }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
  currentUser = payload.user;
  renderAccount();
  await loadCloudPersonalization();
  await loadCloudWatchlist();
  renderWatchlist();
  renderCompany();
}

async function completeSupabaseAuthFromHash() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = hash.get("access_token");
  const error = hash.get("error_description") || hash.get("error");
  if (error) {
    $("#account-status").textContent = error;
    $("#account-panel").hidden = false;
    $("#account-button").setAttribute("aria-expanded", "true");
    window.history.replaceState({}, "", window.location.pathname + window.location.search);
    return;
  }
  if (!accessToken) return;
  const response = await fetch("/api/session/supabase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });
  const payload = await response.json();
  window.history.replaceState({}, "", window.location.pathname + window.location.search);
  if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
  currentUser = payload.user;
  renderAccount();
  await loadCloudPersonalization();
  await loadCloudWatchlist();
  renderWatchlist();
  renderCompany();
  showWatchlistStatus(tr("Cloud sync enabled"));
}

async function signOut() {
  await fetch("/api/session", { method: "DELETE" }).catch(() => {});
  currentUser = null;
  renderAccount();
  showWatchlistStatus(tr("Local browser mode"));
}

function renderAccount() {
  const button = $("#account-button");
  const title = $("#account-title");
  const status = $("#account-status");
  const form = $("#signin-form");
  const google = $("#google-signin");
  const github = $("#github-signin");
  const signout = $("#signout-button");
  const code = $("#signin-code");
  if (!button || !title || !status) return;
  code.hidden = !inviteCodeRequired;
  if (currentUser) {
    const label = currentUser.name || currentUser.email;
    const initials = label.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
    button.textContent = initials || "ME";
    title.textContent = tr("Personal research cloud");
    status.textContent = `${tr("Signed in")} · ${currentUser.email}`;
    google.hidden = true;
    github.hidden = true;
    form.hidden = true;
    signout.hidden = false;
  } else {
    button.textContent = "LH";
    title.textContent = tr("Personal research cloud");
    status.textContent = tr("Local browser mode");
    google.hidden = !supabaseAuthConfigured;
    google.innerHTML = `<span>G</span>${tr("Continue with Google")}`;
    github.hidden = !githubOAuthConfigured;
    github.innerHTML = `<span>GH</span>${tr("Continue with GitHub")}`;
    github.textContent = tr("Developer sign in with GitHub");
    form.hidden = false;
    form.querySelector("button").textContent = tr(supabaseAuthConfigured ? "Send magic link" : "Sign in");
    signout.hidden = true;
  }
}

async function loadCloudPersonalization() {
  if (!currentUser) return;
  try {
    const response = await fetch(`/api/me/preferences?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    if (payload.hiddenMetrics && Object.keys(payload.hiddenMetrics).length) {
      hiddenMetricsByTicker = payload.hiddenMetrics;
      localStorage.setItem(hiddenMetricsStorageKey, JSON.stringify(hiddenMetricsByTicker));
    }
    if (payload.metricDisplay && Object.keys(payload.metricDisplay).length) {
      metricDisplayByTicker = payload.metricDisplay;
      localStorage.setItem(metricDisplayStorageKey, JSON.stringify(metricDisplayByTicker));
    }
    if (validReportingPeriod(payload.selectedPeriod)) {
      selectedPeriod = payload.selectedPeriod;
      localStorage.setItem(selectedPeriodStorageKey, selectedPeriod);
      syncPeriodControl();
    }
  } catch {
    showWatchlistStatus(tr("Cloud sync paused"));
  }
}

function schedulePreferenceSave() {
  if (!currentUser) return;
  clearTimeout(preferenceSaveTimer);
  preferenceSaveTimer = setTimeout(async () => {
    try {
      await fetch("/api/me/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hiddenMetrics: hiddenMetricsByTicker, metricDisplay: metricDisplayByTicker, selectedPeriod }),
      });
    } catch {
      showWatchlistStatus(tr("Cloud sync paused"));
    }
  }, 300);
}

function metricTierRank(metric) {
  return { Core: 0, Important: 1, Detail: 2 }[metric.tier || "Detail"] ?? 3;
}

function sortedMetrics(metrics, sortMode = "importance") {
  return [...metrics].sort((a, b) => {
    if (sortMode === "name") return a.title.localeCompare(b.title);
    if (sortMode === "latest") return Math.abs(latestMetricNumber(b) || 0) - Math.abs(latestMetricNumber(a) || 0);
    if (sortMode === "trend") return Math.abs(b.trend?.percent || 0) - Math.abs(a.trend?.percent || 0);
    return metricTierRank(a) - metricTierRank(b)
      || Math.abs(b.trend?.percent || 0) - Math.abs(a.trend?.percent || 0)
      || a.title.localeCompare(b.title);
  });
}

function metricGroupLabel(metric, groupMode) {
  if (groupMode === "tier") return metric.tier || "Detail";
  if (groupMode === "none") return "All stock-specific metrics";
  return metric.group || customMetricGroup(metric);
}

function metricChartType(metric, settings) {
  if (settings.chartMode !== "auto") return settings.chartMode;
  return /members|users|rate|ratio|margin|percentage/i.test(`${metric.title} ${metric.group || ""}`) ? "line" : "bar";
}

function renderStockMetricBoard(metrics) {
  const board = $("#stock-metric-board");
  if (!metrics.length) {
    board.innerHTML = `<div class="stock-metric-board-empty">${tr("No stock-specific SEC metrics are available for this ticker yet.")}</div>`;
    return;
  }
  const settings = metricDisplaySettings();
  const groups = sortedMetrics(metrics, settings.sortMode).reduce((items, metric) => {
    const group = metricGroupLabel(metric, settings.groupMode);
    if (!items.has(group)) items.set(group, []);
    items.get(group).push(metric);
    return items;
  }, new Map());
  board.innerHTML = [...groups].map(([group, groupMetrics]) => {
    const rows = sortedMetrics(groupMetrics, settings.sortMode)
      .map((metric) => ({ metric, numeric: latestMetricNumber(metric) }))
      .slice(0, 8);
    const max = Math.max(...rows.map((row) => Math.abs(row.numeric || 0)), 1);
    return `
      <article class="stock-metric-panel">
        <div class="stock-metric-panel-heading">
          <span>${tr(group)}</span>
          <strong>${rows.length}</strong>
        </div>
        <div class="stock-metric-bars">
          ${rows.map(({ metric, numeric }) => {
            const width = Number.isFinite(numeric) ? Math.max(5, Math.min(100, Math.abs(numeric) / max * 100)) : 0;
            return `
              <div class="stock-metric-bar-row">
                <div>
                  <span>${tr(metric.title)}</span>
                  <strong>${metric.latest}</strong>
                </div>
                <i style="width:${width}%"></i>
              </div>`;
          }).join("")}
        </div>
      </article>`;
  }).join("");
}

function renderCustomMetrics(metrics) {
  const card = $("#custom-metrics-card");
  card.hidden = !metrics.length;
  if (!metrics.length) {
    $("#stock-metric-board").innerHTML = "";
    $("#custom-metrics-grid").innerHTML = "";
    return;
  }
  const visibleMetrics = metrics.filter((metric) => !isMetricHidden(metricKey("custom", metric.id)));
  const settings = metricDisplaySettings();
  renderStockMetricBoard(visibleMetrics);
  if (!visibleMetrics.length) {
    $("#custom-metrics-grid").innerHTML = `<div class="custom-metrics-empty">${tr("All company-specific metrics are hidden. Use Manage metrics to restore them.")}</div>`;
    return;
  }
  const groups = sortedMetrics(visibleMetrics, settings.sortMode).reduce((items, metric) => {
    const group = metricGroupLabel(metric, settings.groupMode);
    if (!items.has(group)) items.set(group, []);
    items.get(group).push(metric);
    return items;
  }, new Map());
  $("#custom-metrics-grid").innerHTML = [...groups].map(([group, groupMetrics]) => `
    <div class="custom-metric-group">
      <div class="custom-metric-group-heading">
        <strong>${tr(group)}</strong>
        <span>${groupMetrics.length}</span>
      </div>
      ${sortedMetrics(groupMetrics, settings.sortMode).map((metric) => `
    <article class="custom-metric">
      <div class="custom-metric-heading">
        <div>
          <span>${tr(metric.title)}</span>
          <strong>${metric.latest}</strong>
          <em class="custom-metric-meta">${tr(metric.tier || "Detail")} · ${escapeHtml(metric.latestLabel || metric.latestPeriod || "Latest")} · ${metric.observationCount || metric.values.length} ${tr("observations")}${metric.trend?.label ? ` · ${metric.trend.label}` : ""}</em>
        </div>
        <div class="custom-metric-controls">
          <small>${metric.source}</small>
          <button data-hide-metric="${encodeURIComponent(metricKey("custom", metric.id))}" aria-label="${tr("Hide")} ${tr(metric.title)}">${tr("Hide")}</button>
        </div>
      </div>
      ${miniChart(metric, metricChartType(metric, settings), metric.title)}
      <div class="custom-metric-series">
        ${metric.labels.map((label, index) => `
          <div>
            <span>${label}</span>
            <strong>${metric.displayValues[index]}</strong>
          </div>`).join("")}
      </div>
      <p>${tr(metric.description)}</p>
      ${metric.concept ? `<p class="custom-metric-concept">${tr("SEC concept")}: ${escapeHtml(metric.concept)}</p>` : ""}
    </article>`).join("")}
    </div>`).join("");
}

function loadHiddenMetrics() {
  try {
    const saved = JSON.parse(localStorage.getItem(hiddenMetricsStorageKey) || "{}");
    hiddenMetricsByTicker = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    for (const [ticker, ids] of Object.entries(hiddenMetricsByTicker)) {
      if (!Array.isArray(ids)) {
        hiddenMetricsByTicker[ticker] = [];
        continue;
      }
      hiddenMetricsByTicker[ticker] = ids.map((id) => id.includes(":") ? id : metricKey("custom", id));
    }
  } catch {
    hiddenMetricsByTicker = {};
  }
}

function saveHiddenMetrics() {
  localStorage.setItem(hiddenMetricsStorageKey, JSON.stringify(hiddenMetricsByTicker));
  schedulePreferenceSave();
}

function metricKey(type, id) {
  return `${type}:${id}`;
}

function isMetricHidden(key) {
  return (hiddenMetricsByTicker[selectedTicker] || []).includes(key);
}

function metricCatalog(company) {
  const catalog = new Map();
  for (const [label] of company.metrics || []) catalog.set(metricKey("summary", label), label);
  for (const period of ["annual", "quarterly"]) {
    for (const [label] of company.periodMetrics?.[period] || []) catalog.set(metricKey("summary", label), label);
  }
  for (const metric of company.financialMetrics || []) catalog.set(metricKey("financial", metric.title), metric.title);
  for (const metric of company.customMetrics || []) catalog.set(metricKey("custom", metric.id), metric.title);
  return catalog;
}

function renderMetricManager(company) {
  const hiddenIds = new Set(hiddenMetricsByTicker[selectedTicker] || []);
  const catalog = metricCatalog(company);
  const hiddenMetrics = [...catalog].filter(([key]) => hiddenIds.has(key));
  $("#manage-metrics").textContent = tr(metricManagerOpen ? "Done" : "Manage metrics");
  $("#hidden-metrics-panel").hidden = !metricManagerOpen;
  $("#hidden-metrics-list").innerHTML = hiddenMetrics.length
    ? hiddenMetrics.map(([key, title]) => `<button class="metric-restore" data-restore-metric="${encodeURIComponent(key)}">${tr("Restore")} ${tr(title)}</button>`).join("")
    : `<span class="hidden-metrics-empty">${tr("No metrics are hidden.")}</span>`;
}

function setMetricHidden(metricId, hidden) {
  const ids = new Set(hiddenMetricsByTicker[selectedTicker] || []);
  if (hidden) ids.add(metricId);
  else ids.delete(metricId);
  hiddenMetricsByTicker[selectedTicker] = [...ids];
  saveHiddenMetrics();
  renderCompany();
}

function renderFundamentals() {
  const svg = $("#fundamentals-chart");
  const forecastColor = "#b9823d";
  const company = companies[selectedTicker];
  const baseData = company[selectedPeriod];
  const lastLabelIsEstimate = /E$/.test(baseData.labels.at(-1) || "");
  const estimate = company.guidance?.nextQuarter;
  const data = selectedPeriod === "quarterly" && !lastLabelIsEstimate
    ? {
        labels: [...baseData.labels, `${estimate?.period || advanceQuarterLabel(baseData.labels.at(-1))} E`],
        revenue: [...baseData.revenue, Number.isFinite(estimate?.revenueValue) ? estimate.revenueValue / 1e9 : null],
        eps: [...baseData.eps, Number.isFinite(estimate?.epsValue) ? estimate.epsValue : null],
        estimated: [...baseData.labels.map(() => false), true],
      }
    : { ...baseData, estimated: baseData.labels.map((_, index) => lastLabelIsEstimate && index === baseData.labels.length - 1) };
  $("#estimate-legend").hidden = selectedPeriod !== "quarterly";
  const width = 700;
  const height = 245;
  const pad = { top: 18, right: 34, bottom: 30, left: 42 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const revenueValues = data.revenue.filter(Number.isFinite);
  const epsValues = data.eps.filter(Number.isFinite);
  const maxRevenue = Math.max(...revenueValues) * 1.18;
  const minEps = Math.min(0, ...epsValues);
  const maxEps = Math.max(...epsValues) * 1.25;
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
    const isEstimate = data.estimated[i];
    const hasRevenue = Number.isFinite(data.revenue[i]);
    const barHeight = hasRevenue ? (data.revenue[i] / maxRevenue) * chartH : 18;
    const bar = svgEl("rect", hasRevenue ? {
      x: centerX - barW / 2, y: pad.top + chartH - barHeight, width: barW, height: barHeight, rx: 3,
      fill: isEstimate ? forecastColor : "#1f6657", opacity: isEstimate ? 0.72 : 0.92, "data-index": i,
      ...(isEstimate ? { stroke: "#8f642d", "stroke-width": 1, "stroke-dasharray": "4 3" } : {}),
    } : {
      x: centerX - barW / 2, y: pad.top + chartH - barHeight, width: barW, height: barHeight, rx: 3,
      fill: "transparent", stroke: forecastColor, "stroke-width": 1.4, "stroke-dasharray": "4 3", "data-index": i,
    });
    svg.appendChild(bar);

    if (!hasRevenue) {
      const unavailable = svgEl("text", { x: centerX, y: pad.top + chartH - 23, "text-anchor": "middle", fill: "#758580", "font-size": 7, "font-family": "DM Mono" });
      unavailable.setAttribute("fill", forecastColor);
      unavailable.textContent = "N/A";
      svg.appendChild(unavailable);
    }

    if (Number.isFinite(data.eps[i])) {
      const epsRange = maxEps - minEps || 1;
      const epsY = pad.top + chartH - ((data.eps[i] - minEps) / epsRange) * chartH;
      epsPoints.push({ x: centerX, y: epsY, estimated: isEstimate });
    }

    const label = svgEl("text", { x: centerX, y: height - 8, "text-anchor": "middle", fill: "#758580", "font-size": 8, "font-family": "DM Mono" });
    label.textContent = labelText;
    svg.appendChild(label);

    const hit = svgEl("rect", { x: pad.left + groupW * i, y: pad.top, width: groupW, height: chartH, fill: "transparent", "data-index": i });
    hit.addEventListener("mousemove", (event) => showFundamentalsTooltip(event, i, data));
    hit.addEventListener("mouseleave", hideTooltips);
    svg.appendChild(hit);
  });

  const reportedPoints = epsPoints.filter((point) => !point.estimated);
  const pathData = reportedPoints.map(({ x, y }, i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  if (pathData) svg.appendChild(svgEl("path", { d: pathData, fill: "none", stroke: "#e77d61", "stroke-width": 2.2, "stroke-linecap": "round", "stroke-linejoin": "round" }));
  const forecastPoint = epsPoints.find((point) => point.estimated);
  const priorPoint = reportedPoints.at(-1);
  if (forecastPoint && priorPoint) {
    svg.appendChild(svgEl("path", { d: `M ${priorPoint.x} ${priorPoint.y} L ${forecastPoint.x} ${forecastPoint.y}`, fill: "none", stroke: forecastColor, "stroke-width": 2.2, "stroke-dasharray": "5 4" }));
  }
  epsPoints.forEach(({ x, y, estimated }) => {
    svg.appendChild(svgEl("circle", { cx: x, cy: y, r: 3.4, fill: "#fffefa", stroke: estimated ? forecastColor : "#e77d61", "stroke-width": 2, ...(estimated ? { "stroke-dasharray": "3 2" } : {}) }));
  });
}

function showFundamentalsTooltip(event, index, data) {
  const tooltip = $("#fundamentals-tooltip");
  const rect = event.currentTarget.ownerSVGElement.getBoundingClientRect();
  const revenue = Number.isFinite(data.revenue[index]) ? `$${data.revenue[index].toFixed(1)}B` : "N/A";
  const eps = Number.isFinite(data.eps[index]) ? `$${data.eps[index].toFixed(2)}` : "N/A";
  const estimateLabel = data.estimated?.[index] ? ` · ${tr("Estimate")}` : "";
  tooltip.innerHTML = `<strong>${data.labels[index]}${estimateLabel}</strong><br>${tr("Revenue")} ${revenue}<br>EPS ${eps}`;
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

function selectCompany(ticker, updateUrl = true) {
  if (!companies[ticker]) return;
  selectedTicker = ticker;
  metricManagerOpen = false;
  localStorage.setItem(selectedTickerStorageKey, ticker);
  if (updateUrl) updateTickerUrl(ticker);
  syncMetricDisplayControls();
  renderCompany();
  renderScatter();
  syncWatchlistButton();
}

function setupInteractions() {
  $("#account-button").addEventListener("click", () => {
    const panel = $("#account-panel");
    const expanded = panel.hidden;
    panel.hidden = !expanded;
    $("#account-button").setAttribute("aria-expanded", String(expanded));
  });

  $("#signin-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button");
    const previous = button.textContent;
    button.disabled = true;
    button.textContent = tr("Signing in...");
    try {
      await signIn($("#signin-email").value, $("#signin-code").value);
      $("#account-panel").hidden = true;
      $("#account-button").setAttribute("aria-expanded", "false");
      showWatchlistStatus(tr("Cloud sync enabled"));
    } catch (error) {
      $("#account-status").textContent = error.message;
    } finally {
      button.disabled = false;
      button.textContent = previous;
    }
  });

  $("#signout-button").addEventListener("click", async () => {
    await signOut();
    closeAccountPanel();
  });

  $("#language-selector").addEventListener("click", (event) => {
    const button = event.target.closest("[data-language]");
    if (!button || button.dataset.language === currentLanguage) return;
    currentLanguage = button.dataset.language;
    localStorage.setItem("northstar-language", currentLanguage);
    applyLanguage();
  });
  $("#period-control").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || !validReportingPeriod(button.dataset.period) || button.dataset.period === selectedPeriod) return;
    selectedPeriod = button.dataset.period;
    localStorage.setItem(selectedPeriodStorageKey, selectedPeriod);
    syncPeriodControl();
    schedulePreferenceSave();
    renderFundamentals();
    renderSummaryMetrics(companies[selectedTicker]);
  });

  $("#sort-peers").addEventListener("click", () => {
    peerDescending = !peerDescending;
    renderPeers();
  });

  $("#copy-ticker-link").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(tickerUrl(selectedTicker).toString());
      showResearchStatus("Link copied");
    } catch {
      showResearchStatus("Copy failed");
    }
  });

  $("#export-company-data").addEventListener("click", () => exportCompanyData(companies[selectedTicker]));

  $("#refresh-company-data").addEventListener("click", () => {
    refreshCompanyData(selectedTicker);
  });

  $("#refresh-ticker-content").addEventListener("click", () => {
    $("#refresh-ticker-content").textContent = tr("Refreshing...");
    tickerContentCache.delete(selectedTicker);
    renderTickerContent(selectedTicker, true).finally(() => {
      $("#refresh-ticker-content").textContent = tr("Refresh news");
    });
  });

  $("#add-watchlist").addEventListener("click", () => {
    openWatchlistSearch();
  });

  $("#manage-metrics").addEventListener("click", () => {
    metricManagerOpen = !metricManagerOpen;
    renderMetricManager(companies[selectedTicker]);
  });

  $("#toggle-metric-display").addEventListener("click", () => {
    toggleMetricDisplayPanel();
  });

  $("#metric-group-mode").addEventListener("change", (event) => {
    setMetricDisplaySetting("groupMode", event.target.value);
  });

  $("#metric-sort-mode").addEventListener("change", (event) => {
    setMetricDisplaySetting("sortMode", event.target.value);
  });

  $("#metric-chart-mode").addEventListener("change", (event) => {
    setMetricDisplaySetting("chartMode", event.target.value);
  });

  ["#metrics-grid", "#financial-metrics-grid", "#custom-metrics-grid"].forEach((selector) => {
    $(selector).addEventListener("click", (event) => {
      const button = event.target.closest("[data-hide-metric]");
      if (button) setMetricHidden(decodeURIComponent(button.dataset.hideMetric), true);
    });
  });

  $("#hidden-metrics-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-restore-metric]");
    if (button) setMetricHidden(decodeURIComponent(button.dataset.restoreMetric), false);
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
    if (event.key === "Escape") {
      closeSearchResults();
      closeAccountPanel();
      return;
    }
    if (event.key === "/" && document.activeElement !== $("#stock-search")) {
      event.preventDefault();
      $("#stock-search").focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-control")) closeSearchResults();
    if (!event.target.closest(".account-control")) closeAccountPanel();
  });

  window.addEventListener("popstate", () => {
    const ticker = new URL(window.location.href).searchParams.get("ticker")?.toUpperCase();
    if (ticker && companies[ticker]) selectCompany(ticker, false);
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
  const providerPe = realCompany.analytics?.pe;
  const fiscalYearEps = realCompany.guidance?.fiscalYear?.epsValue;
  const calculatedPe = !Number.isFinite(providerPe) && Number.isFinite(realCompany.price) && fiscalYearEps > 0
    ? realCompany.price / fiscalYearEps
    : null;
  const forwardPe = Number.isFinite(providerPe) ? providerPe : calculatedPe;
  const patchForwardPe = (metrics = []) => metrics.map((metric) => metric[0] === "Forward P/E" && Number.isFinite(forwardPe)
    ? [metric[0], `${forwardPe.toFixed(1)}x`, calculatedPe ? "[CALCULATED]" : metric[2], calculatedPe ? "Price / fiscal-year EPS consensus" : metric[3], metric[4]]
    : metric);
  return {
    ...fallback,
    ...realCompany,
    price: Number.isFinite(realCompany.price) ? realCompany.price : null,
    change: Number.isFinite(realCompany.price) ? realCompany.change : 0,
    quoteAsOf: realCompany.quoteAsOf || realCompany.sources?.quoteAsOf || fallback.quoteAsOf || null,
    cap: realCompany.cap,
    color: realCompany.color || fallback.color || "#1f6657",
    operating: realCompany.operating || fallback.operating,
    quarterDetail: realCompany.quarterDetail || null,
    financialMetrics: realCompany.financialMetrics || [],
    guidance: realCompany.guidance || null,
    customMetrics: realCompany.customMetrics || [],
    metricProfile: realCompany.metricProfile || fallback.metricProfile || null,
    metrics: patchForwardPe(realCompany.metrics || fallback.metrics || []),
    periodMetrics: {
      annual: patchForwardPe(realCompany.periodMetrics?.annual || realCompany.metrics || fallback.metrics || []),
      quarterly: patchForwardPe(realCompany.periodMetrics?.quarterly || realCompany.metrics || fallback.metrics || []),
    },
    analytics: { ...(realCompany.analytics || {}), pe: forwardPe },
  };
}

async function loadGeneratedData() {
  try {
    const apiResponse = await fetch(`/api/dashboard?ts=${Date.now()}`, { cache: "no-store" });
    let response = apiResponse;
    if (!apiResponse.ok && [404, 405].includes(apiResponse.status)) {
      response = await fetch(`data/dashboard.json?ts=${Date.now()}`, { cache: "no-store" });
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload.companies || !Object.keys(payload.companies).length) throw new Error("No companies in generated data");

    companies = Object.fromEntries(
      Object.entries(payload.companies).map(([ticker, company]) => [ticker, mergeCompany(company)]),
    );
    peers = (payload.peers ?? []).map((peer) => ({
      ...peer,
      pe: Number.isFinite(companies[peer.ticker]?.analytics?.pe) ? companies[peer.ticker].analytics.pe : peer.pe,
    }));
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
  await loadRefreshStatus();
  await loadSession();
  await completeSupabaseAuthFromHash().catch((error) => {
    $("#account-status").textContent = error.message;
    $("#account-panel").hidden = false;
    $("#account-button").setAttribute("aria-expanded", "true");
  });
  const currentUrl = new URL(window.location.href);
  if (currentUrl.searchParams.get("signin") === "github") {
    showWatchlistStatus(tr("Cloud sync enabled"));
    currentUrl.searchParams.delete("signin");
    window.history.replaceState({}, "", currentUrl);
  }
  if (currentUrl.searchParams.get("signin_error")) {
    $("#account-status").textContent = currentUrl.searchParams.get("signin_error");
    $("#account-panel").hidden = false;
    $("#account-button").setAttribute("aria-expanded", "true");
    currentUrl.searchParams.delete("signin_error");
    window.history.replaceState({}, "", currentUrl);
  }
  const linkedTicker = new URL(window.location.href).searchParams.get("ticker")?.toUpperCase();
  const savedTicker = localStorage.getItem(selectedTickerStorageKey);
  const savedPeriod = localStorage.getItem(selectedPeriodStorageKey);
  if (validReportingPeriod(savedPeriod)) selectedPeriod = savedPeriod;
  if (linkedTicker && companies[linkedTicker]) selectedTicker = linkedTicker;
  else if (savedTicker && companies[savedTicker]) selectedTicker = savedTicker;
  if (!companies[selectedTicker]) selectedTicker = Object.keys(companies)[0];
  updateTickerUrl(selectedTicker, true);
  loadHiddenMetrics();
  loadMetricDisplaySettings();
  await loadCloudPersonalization();
  loadWatchlist();
  await loadCloudWatchlist();
  syncMetricDisplayControls();
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
