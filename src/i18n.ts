import type { Category, RatingFilter, VenueType, VenueView } from './data/conferences';

export type Language = 'en' | 'zh-CN';

interface UiText {
  pageTitle: string;
  githubLabel: string;
  languageGroupLabel: string;
  themeToggleLight: string;
  themeToggleDark: string;
  heroTagline: string;
  heroDesktopTip: string;
  heroWipNote: string;
  topPanels: {
    calendar: string;
    timezones: string;
  };
  timezones: {
    aoe: string;
    pacific: string;
    aoeHelpLabel: string;
    aoeHelpText: string;
    aoeHelpLink: string;
  };
  search: {
    placeholder: string;
    ariaLabel: string;
  };
  filters: {
    track: string;
    ratings: string;
    sort: string;
    view: string;
    focus: string;
    favoritesOnly: string;
    rasHelpText: string;
    rasHelpLink: string;
  };
  viewLabels: {
    all: string;
    conferences: string;
    journals: string;
  };
  sortLabels: {
    deadline: string;
    title: string;
  };
  countdown: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    compactDays: string;
    compactHours: string;
    compactMinutes: string;
    compactSeconds: string;
    passed: string;
    to: string;
  };
  calendar: {
    paperShort: string;
    abstractShort: string;
  };
  venue: {
    new: string;
    status: string;
    paperDeadline: string;
    abstractDeadline: string;
    paperDdl: string;
    conferenceDates: string;
    location: string;
    normalizedToPrefix: string;
    journalMetrics: string;
    source: string;
    estimatedShort: string;
    estimatedLong: string;
    abstractDeadlinePrefix: string;
    journalPage: string;
    seriesPage: string;
    website: string;
    specialIssue: string;
    follow: string;
    unfollow: string;
    expand: string;
    collapse: string;
  };
  footer: {
    maintainedBy: string;
    contributionsWelcome: string;
  };
  backToTop: string;
}

interface VenueTranslation {
  fullTitle: string;
  summary: string;
  note?: string;
}

export interface LocalizedVenueView {
  fullTitle: string;
  summary: string;
  note?: string;
  sourceLabel: string;
  conferenceDates?: string;
  location?: string;
  countdownLabel?: string;
  venueTypeLabel: string;
  categoryLabel: string;
  normalizedTimezoneLabel: string;
  searchKeywords: string[];
}

export const uiText: Record<Language, UiText> = {
  en: {
    pageTitle: 'RoboDDL | Robotics deadlines at a glance',
    githubLabel: 'Open RoboDDL on GitHub',
    languageGroupLabel: 'Page language',
    themeToggleLight: 'Switch to light mode',
    themeToggleDark: 'Switch to dark mode',
    heroTagline: 'Your one-stop tracker for robotics conferences and journals',
    heroDesktopTip: 'Best experienced on desktop',
    heroWipNote: '[WIP] Deadlines and ratings may still contain errors!',
    topPanels: {
      calendar: 'Submission Calendar',
      timezones: 'Time Zones',
    },
    timezones: {
      aoe: 'AoE Time Zone',
      pacific: 'Pacific Time',
      aoeHelpLabel: 'What is AoE time?',
      aoeHelpText: 'AoE means "Anywhere on Earth" and follows UTC-12 for deadline cutoffs.',
      aoeHelpLink: 'Learn more on Wikipedia',
    },
    search: {
      placeholder: 'Search by names, keywords, or locations',
      ariaLabel: 'Search venues',
    },
    filters: {
      track: 'Track',
      ratings: 'Ratings',
      sort: 'Sort',
      view: 'View',
      focus: 'Focus',
      favoritesOnly: 'Followed only',
      rasHelpText: 'RAS stands for IEEE Robotics and Automation Society.',
      rasHelpLink: 'Learn more on IEEE RAS',
    },
    viewLabels: {
      all: 'All',
      conferences: 'Conferences',
      journals: 'Journals',
    },
    sortLabels: {
      deadline: 'Nearest',
      title: 'A-Z',
    },
    countdown: {
      days: 'D',
      hours: 'H',
      minutes: 'M',
      seconds: 'S',
      compactDays: 'd',
      compactHours: 'h',
      compactMinutes: 'm',
      compactSeconds: 's',
      passed: 'Deadline passed',
      to: 'Countdown to',
    },
    calendar: {
      paperShort: 'Paper',
      abstractShort: 'Abs.',
    },
    venue: {
      new: 'NEW',
      status: 'Status',
      paperDeadline: 'Paper deadline',
      abstractDeadline: 'Abstract deadline',
      paperDdl: 'Paper DDL',
      conferenceDates: 'Conference',
      location: 'Location',
      normalizedToPrefix: 'All displayed times are normalized to',
      journalMetrics: 'Journal metrics',
      source: 'Source',
      estimatedShort: 'EST.',
      estimatedLong: 'Est.',
      abstractDeadlinePrefix: 'Abstract deadline',
      journalPage: 'Journal Page',
      seriesPage: 'Series Page',
      website: 'Website',
      specialIssue: 'Special Issue',
      follow: 'Follow',
      unfollow: 'Unfollow',
      expand: 'Expand',
      collapse: 'Collapse',
    },
    footer: {
      maintainedBy: 'Maintained by',
      contributionsWelcome: 'Contributions welcome.',
    },
    backToTop: 'Back to top',
  },
  'zh-CN': {
    pageTitle: 'RoboDDL | 机器人会议与期刊截止日期追踪',
    githubLabel: '在 GitHub 上打开 RoboDDL',
    languageGroupLabel: '页面语言',
    themeToggleLight: '切换到浅色模式',
    themeToggleDark: '切换到深色模式',
    heroTagline: '一站式追踪机器人领域会议与期刊',
    heroDesktopTip: '桌面端浏览体验更佳',
    heroWipNote: '[开发中] 截止日期和评级信息可能存在错误',
    topPanels: {
      calendar: '投稿日历',
      timezones: '标准时间',
    },
    timezones: {
      aoe: 'AoE 时区',
      pacific: '太平洋时间',
      aoeHelpLabel: 'AoE 时间是什么？',
      aoeHelpText: 'AoE 是 “Anywhere on Earth” 的缩写，对应 UTC-12，常用于论文截止时间计算。',
      aoeHelpLink: '前往 Wikipedia 了解更多',
    },
    search: {
      placeholder: '按名称、关键词或地点搜索',
      ariaLabel: '搜索会议与期刊',
    },
    filters: {
      track: '方向',
      ratings: '评级',
      sort: '排序',
      view: '视图',
      focus: '关注',
      favoritesOnly: '已跟踪',
      rasHelpText: 'RAS 指的是 IEEE Robotics and Automation Society（IEEE 机器人与自动化学会）。',
      rasHelpLink: '前往 IEEE RAS 了解更多',
    },
    viewLabels: {
      all: '全部',
      conferences: '会议',
      journals: '期刊',
    },
    sortLabels: {
      deadline: '最近截止',
      title: 'A-Z',
    },
    countdown: {
      days: '天',
      hours: '时',
      minutes: '分',
      seconds: '秒',
      compactDays: '天',
      compactHours: '时',
      compactMinutes: '分',
      compactSeconds: '秒',
      passed: '已截止',
      to: '距离',
    },
    calendar: {
      paperShort: '正文',
      abstractShort: '摘要',
    },
    venue: {
      new: '新增',
      status: '状态',
      paperDeadline: '论文截止',
      abstractDeadline: '摘要截止',
      paperDdl: '论文 DDL',
      conferenceDates: '会议时间',
      location: '地点',
      normalizedToPrefix: '页面显示时间统一换算为',
      journalMetrics: '期刊指标',
      source: '来源',
      estimatedShort: '预计',
      estimatedLong: '预计',
      abstractDeadlinePrefix: '摘要截止',
      journalPage: '期刊主页',
      seriesPage: '系列主页',
      website: '官网',
      specialIssue: '专题',
      follow: '关注',
      unfollow: '取消关注',
      expand: '展开',
      collapse: '收起',
    },
    footer: {
      maintainedBy: '由',
      contributionsWelcome: '维护，欢迎贡献。',
    },
    backToTop: '回到顶部',
  },
};

const categoryLabels: Record<string, Record<Language, string>> = {
  All: { en: 'All', 'zh-CN': '全部' },
  RAS: { en: 'RAS', 'zh-CN': 'RAS' },
  'AI x Robotics': { en: 'AI x Robotics', 'zh-CN': 'AI x 机器人' },
  'Robot Learning': { en: 'Robot Learning', 'zh-CN': '机器人学习' },
  Journal: { en: 'Journal', 'zh-CN': '期刊' },
  'N/A': { en: 'N/A', 'zh-CN': '未分类' },
};

const venueTypeLabels: Record<'All' | VenueType, Record<Language, string>> = {
  All: { en: 'All', 'zh-CN': '全部' },
  conference: { en: 'Conference', 'zh-CN': '会议' },
  journal: { en: 'Journal', 'zh-CN': '期刊' },
};

const ratingFilterLabels: Record<RatingFilter, Record<Language, string>> = {
  All: { en: 'All', 'zh-CN': '全部' },
  CCF: { en: 'CCF', 'zh-CN': 'CCF' },
  CAAI: { en: 'CAAI', 'zh-CN': 'CAAI' },
  CAA: { en: 'CAA', 'zh-CN': 'CAA' },
};

const monthLabels: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const zhVenueTranslations: Record<string, VenueTranslation> = {
  aaai: {
    fullTitle: 'AAAI 人工智能大会',
    summary: '综合性 AI 顶会，机器人规划、具身智能体、决策与交互相关工作长期活跃。',
  },
  aamas: {
    fullTitle: '自主智能体与多智能体系统国际会议',
    summary: '多智能体领域重要会议，涵盖规划、决策、协同、具身智能体与机器人交互。',
  },
  aim: {
    fullTitle: 'IEEE/ASME 高级智能机电一体化国际会议',
    summary: '机电一体化旗舰会议，涵盖机器人、智能系统、感知、执行、人机交互、设计与集成应用。',
  },
  biorob: {
    fullTitle: 'IEEE RAS/EMBS 生物医学机器人与生物机电一体化国际会议',
    summary: '生物医学机器人重要会议，覆盖手术机器人、康复机器人、可穿戴机器人、触觉、神经机器人与辅助系统。',
  },
  case: {
    fullTitle: 'IEEE 自动化科学与工程国际会议',
    summary: 'IEEE RAS 自动化旗舰会议，在制造、物流、医疗、自主系统与智能自动化方向与机器人高度交叉。',
  },
  corl: {
    fullTitle: '机器人学习会议',
    summary: '机器人学习旗舰会议，连接机器人学、机器学习与具身智能。',
  },
  cvpr: {
    fullTitle: 'IEEE/CVF 计算机视觉与模式识别会议',
    summary: '顶级计算机视觉会议，在感知、具身 AI、操作、导航和多模态场景理解上与机器人紧密相关。',
  },
  eccv: {
    fullTitle: '欧洲计算机视觉会议',
    summary: '重要计算机视觉会议，在视觉感知、三维理解、具身智能体和机器人学习方向与机器人研究持续交叉。',
  },
  hri: {
    fullTitle: 'ACM/IEEE 人机-机器人交互国际会议',
    summary: '人机-机器人交互顶级会议，覆盖社交机器人、用户研究、具身 AI、辅助系统与真实部署。',
  },
  humanoids: {
    fullTitle: 'IEEE-RAS 人形机器人国际会议',
    summary: '人形机器人旗舰会议，涵盖全身控制、运动、操作、具身性、人本交互与综合人形系统。',
  },
  icar: {
    fullTitle: '高级机器人国际会议',
    summary: '历史悠久的机器人会议，涵盖先进机器人系统、操作、自主性、具身智能与真实世界应用。',
  },
  iccv: {
    fullTitle: 'IEEE/CVF 国际计算机视觉会议',
    summary: '顶级计算机视觉会议，在感知、三维场景理解、具身智能体、导航与操作方向与机器人密切相关。',
  },
  iclr: {
    fullTitle: '学习表征国际会议',
    summary: '表征学习旗舰会议，具身 AI、世界模型和机器人学习投稿活跃。',
  },
  icml: {
    fullTitle: '机器学习国际会议',
    summary: '通用机器学习顶会，在具身 AI、机器人学习、规划与世界模型方向有很强相关性。',
  },
  icra: {
    fullTitle: 'IEEE 机器人与自动化国际会议',
    summary: 'RAS 旗舰会议，覆盖机器人、自动化、控制、操作与具身系统。',
  },
  ijcai: {
    fullTitle: '国际人工智能联合会议',
    summary: '历史悠久的 AI 旗舰会议，在规划、具身智能、多智能体系统与决策方向长期有机器人相关研究。',
  },
  iros: {
    fullTitle: 'IEEE/RSJ 智能机器人与系统国际会议',
    summary: '重要 RAS 会议，聚焦智能机器人、感知、规划与综合机器人系统。',
  },
  neurips: {
    fullTitle: '神经信息处理系统会议',
    summary: '重要 AI 顶会，在机器人、具身智能、控制与模仿学习方向影响力很强。',
  },
  rcar: {
    fullTitle: 'IEEE 实时计算与机器人国际会议',
    summary: '聚焦机器人与实时计算，涵盖机器人控制、感知、传感器融合、人机交互、机器人智能与真实系统。',
  },
  robio: {
    fullTitle: 'IEEE 机器人与仿生学国际会议',
    summary: '成熟的机器人与仿生会议，涵盖仿生机器人、具身智能、人机交互、机器人视觉、康复机器人与智能制造。',
  },
  robosoft: {
    fullTitle: 'IEEE-RAS 软体机器人国际会议',
    summary: '软体机器人旗舰会议，涵盖软执行、软传感、形态设计、制造、医疗器械与具身智能。',
  },
  roman: {
    fullTitle: 'IEEE 机器人与人交互通信国际会议',
    summary: '人机-机器人交互重要会议，覆盖社交机器人、辅助机器人、远程临场与机器人通信。',
  },
  rss: {
    fullTitle: '机器人：科学与系统会议',
    summary: '顶级机器人会议，聚焦核心机器人科学、系统、规划、感知与学习。',
  },
  ijrr: {
    fullTitle: '国际机器人研究期刊',
    summary: '经典机器人顶刊，覆盖学习、控制、规划、自主性与落地系统。',
    note: '滚动投稿，不采用会议式年度截止周期。',
  },
  tfr: {
    fullTitle: 'IEEE 现场机器人汇刊',
    summary: '聚焦野外与真实环境部署的现场机器人期刊，涵盖户外、农业、海洋、空中等场景。',
    note: '滚动投稿，不设会议式年度截稿。',
  },
  tmech: {
    fullTitle: 'IEEE/ASME 机电一体化汇刊',
    summary: '成熟的机电一体化期刊，覆盖机器人、运动控制、智能控制、感知、系统集成与实际机电系统。',
    note: '滚动投稿，稿件持续处理。',
  },
  rap: {
    fullTitle: 'IEEE 机器人与自动化实践',
    summary: '面向实践的 IEEE RAS 期刊，关注可部署的机器人与自动化成果，包括算法、代码、案例研究、系统设计与真实经验。',
    note: '滚动投稿，RAP 是 2024 年推出的面向实践的 IEEE RAS 期刊。',
  },
  nc: {
    fullTitle: 'Nature Communications',
    summary: '综合性旗舰期刊，经常发表与机器人相关的具身智能、感知、控制、医疗机器人和自主系统工作。',
    note: '滚动投稿，稿件持续处理。',
  },
  nmi: {
    fullTitle: 'Nature Machine Intelligence',
    summary: '顶级机器智能期刊，在具身 AI、机器人学习、决策、多模态感知与人机交互方向与机器人研究高度相关。',
    note: '滚动投稿，稿件持续处理。',
  },
  tro: {
    fullTitle: 'IEEE 机器人汇刊',
    summary: 'IEEE 机器人旗舰期刊，覆盖理论、系统、控制、感知与操作。',
    note: '滚动投稿，稿件持续处理。',
  },
  'science-robotics': {
    fullTitle: 'Science Robotics',
    summary: '顶级机器人期刊，关注高影响力系统、基础科学与转化机器人研究。',
    note: '滚动投稿，不设固定年度论文截止时间。',
  },
  ral: {
    fullTitle: 'IEEE 机器人与自动化快报',
    summary: '机器人快速发表期刊，采用滚动投稿，并常与 ICRA/IROS 报告机会联动。',
    note: '滚动投稿，期刊本身不采用单一年度截止日期。',
  },
  tase: {
    fullTitle: 'IEEE 自动化科学与工程汇刊',
    summary: '强势自动化期刊，在智能自动化、物流与系统工程方向与机器人研究联系紧密。',
    note: '滚动投稿，稿件持续接收。',
  },
  tie: {
    fullTitle: 'IEEE 工业电子汇刊',
    summary: '工业电子旗舰期刊，在运动控制、机电一体化、传感器、执行器与智能工业系统方向与机器人研究相邻。',
    note: '滚动投稿，稿件持续处理。',
  },
  tpami: {
    fullTitle: 'IEEE 模式分析与机器智能汇刊',
    summary: '计算机视觉与模式识别旗舰期刊，在感知、场景理解、具身智能与多模态学习方向与机器人研究高度相关。',
    note: '滚动投稿，稿件持续处理。',
  },
  trl: {
    fullTitle: 'IEEE 机器人学习汇刊',
    summary: 'IEEE RAS 机器人学习期刊，关注机器人学习、具身智能与学习驱动的机器人方法。',
    note: '滚动投稿，T-RL 是 IEEE RAS 面向机器人学习研究的期刊。',
  },
};

const noteTranslations: Record<string, string> = {
  'Official page lists the submission date without a timezone; countdown uses end-of-day AoE.':
    '官网仅给出投稿日期而未注明时区；倒计时按 AoE 当天结束计算。',
  'Official page exposes the date without a timezone; countdown uses end-of-day AoE.':
    '官网给出了日期但未注明时区；倒计时按 AoE 当天结束计算。',
  'Official CFP lists the date without a timezone; countdown uses end-of-day AoE.':
    '官方 CFP 仅给出日期而未注明时区；倒计时按 AoE 当天结束计算。',
  'The official key dates page lists calendar dates without an explicit timezone; countdown uses end-of-day AoE.':
    '官网重要日期页仅给出日历日期而未明确时区；倒计时按 AoE 当天结束计算。',
  'The official dates page lists deadlines in Honolulu time (HST, UTC-10).':
    '官网日期页以檀香山时间（HST，UTC-10）标注截止时间。',
  'Paper registration closes earlier on February 26, 2026 at 23:00 CET according to the official CFP.':
    '根据官方 CFP，论文注册会更早关闭，时间为 2026 年 2 月 26 日 23:00 CET。',
  'Public CFP reposts reported the final paper deadline extension to May 15, 2025 AoE.':
    '公开转载的 CFP 信息显示，最终论文截止时间延长到了 AoE 2025 年 5 月 15 日。',
};

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const savedLanguage = window.localStorage.getItem('roboddl:language');
  if (savedLanguage === 'en' || savedLanguage === 'zh-CN') {
    return savedLanguage;
  }

  const preferredLanguage = window.navigator.languages?.[0] ?? window.navigator.language;
  return preferredLanguage.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
}

export function getLocale(language: Language): string {
  return language === 'zh-CN' ? 'zh-CN' : 'en-US';
}

export function getThemeToggleLabel(theme: 'light' | 'dark', language: Language): string {
  return theme === 'light' ? uiText[language].themeToggleDark : uiText[language].themeToggleLight;
}

export function getCategoryLabel(value: 'All' | Category | string, language: Language): string {
  return categoryLabels[value]?.[language] ?? value;
}

export function getVenueTypeLabel(value: 'All' | VenueType, language: Language): string {
  return venueTypeLabels[value][language];
}

export function getRatingFilterLabel(value: RatingFilter, language: Language): string {
  return ratingFilterLabels[value][language];
}

export function getCountdownLabel(value: string | undefined, language: Language): string | undefined {
  if (!value) {
    return value;
  }

  if (value === 'Abstract deadline') {
    return uiText[language].venue.abstractDeadline;
  }

  if (value === 'Paper deadline') {
    return uiText[language].venue.paperDeadline;
  }

  return value;
}

export function getTimezoneDisplayLabel(timezone: string | undefined, language: Language): string {
  if (!timezone) {
    return '';
  }

  if (timezone === 'PST') {
    return language === 'zh-CN' ? '太平洋时间' : 'Pacific Time';
  }

  if (timezone === 'AoE') {
    return 'AoE';
  }

  return timezone;
}

export function getFavoriteButtonLabel(isFavorite: boolean, title: string, language: Language): string {
  return `${isFavorite ? uiText[language].venue.unfollow : uiText[language].venue.follow} ${title}`;
}

export function getExpandButtonLabel(isExpanded: boolean, title: string, language: Language): string {
  return `${isExpanded ? uiText[language].venue.collapse : uiText[language].venue.expand} ${title}`;
}

export function getEstimatedSourceNote(year: number, language: Language): string {
  if (language === 'zh-CN') {
    return `官方截止日期尚未公布，当前日期根据 ${year} 年论文截止时间估算。`;
  }

  return `No official deadline is out yet. This date is estimated from the ${year} paper deadline.`;
}

export function getAbstractDeadlineNote(deadline: string, language: Language): string {
  return `${uiText[language].venue.abstractDeadlinePrefix}: ${deadline}`;
}

export function localizeConferenceDate(value: string | undefined, language: Language): string | undefined {
  if (!value || language === 'en') {
    return value;
  }

  if (value === 'TBA') {
    return '待定';
  }

  const sameMonthMatch = value.match(/^([A-Za-z]+) (\d{1,2})-(\d{1,2}), (\d{4})$/);
  if (sameMonthMatch) {
    const [, monthName, startDay, endDay, year] = sameMonthMatch;
    const month = monthLabels[monthName];

    if (month) {
      return `${year}年${month}月${startDay}日-${endDay}日`;
    }
  }

  const crossMonthMatch = value.match(/^([A-Za-z]+) (\d{1,2})-([A-Za-z]+) (\d{1,2}), (\d{4})$/);
  if (crossMonthMatch) {
    const [, startMonthName, startDay, endMonthName, endDay, year] = crossMonthMatch;
    const startMonth = monthLabels[startMonthName];
    const endMonth = monthLabels[endMonthName];

    if (startMonth && endMonth) {
      return `${year}年${startMonth}月${startDay}日-${endMonth}月${endDay}日`;
    }
  }

  return value;
}

export function localizeLocation(value: string | undefined, language: Language): string | undefined {
  if (!value || language === 'en') {
    return value;
  }

  return value === 'TBA' ? '待定' : value;
}

export function localizeSourceLabel(label: string, language: Language): string {
  if (language === 'en') {
    return label;
  }

  const estimatedMatch = label.match(/^Estimated from (.+) (\d{4}) paper deadline$/);
  if (estimatedMatch) {
    const [, title, year] = estimatedMatch;
    return `根据 ${title} ${year} 论文截止时间估算`;
  }

  return label
    .replace(/\bMain Track\b/g, '主会')
    .replace(/\bCall for Contributions\b/g, '征稿说明')
    .replace(/\bCall for Papers\b/g, '论文征集')
    .replace(/\bcall for papers\b/g, '论文征集')
    .replace(/\bCalls page\b/g, '征稿页面')
    .replace(/\bkey dates\b/g, '重要日期')
    .replace(/\bauthor instructions\b/g, '作者指南')
    .replace(/\bdates page\b/g, '日期页面')
    .replace(/\bpaper submission page\b/g, '论文投稿页面')
    .replace(/\bsubmission page\b/g, '投稿页面')
    .replace(/\bfull papers page\b/g, '长文投稿页面')
    .replace(/\bofficial website\b/g, '官方网站')
    .replace(/\bjournal home\b/g, '期刊主页')
    .replace(/\bjournal page\b/g, '期刊页面')
    .replace(/\bcatalog page\b/g, '目录页面')
    .replace(/\bhomepage\b/g, '主页')
    .replace(/\bpage\b/g, '页面')
    .replace(/\bCFP summary\b/g, 'CFP 汇总');
}

export function localizeVenueNote(
  venue: Pick<VenueView, 'slug' | 'submissionModel' | 'note'>,
  language: Language,
): string | undefined {
  if (!venue.note || language === 'en') {
    return venue.note;
  }

  if (venue.submissionModel === 'rolling') {
    return zhVenueTranslations[venue.slug]?.note ?? venue.note;
  }

  return noteTranslations[venue.note] ?? venue.note;
}

export function getLocalizedVenue(venue: VenueView, language: Language): LocalizedVenueView {
  if (venue.venueType === 'conference') {
    const normalizedTimezoneLabel = getTimezoneDisplayLabel(venue.timezone, 'en');

    return {
      fullTitle: venue.fullTitle,
      summary: venue.summary,
      note: venue.note,
      sourceLabel: venue.sourceLabel,
      conferenceDates: venue.conferenceDates,
      location: venue.location,
      countdownLabel: venue.countdownLabel,
      venueTypeLabel: getVenueTypeLabel(venue.venueType, 'en'),
      categoryLabel: venue.category,
      normalizedTimezoneLabel,
      searchKeywords: [
        venue.fullTitle,
        venue.summary,
        venue.note ?? '',
        venue.sourceLabel,
        venue.conferenceDates ?? '',
        venue.location ?? '',
        venue.category,
        normalizedTimezoneLabel,
      ].filter(Boolean),
    };
  }

  const venueTranslation = language === 'zh-CN' ? zhVenueTranslations[venue.slug] : undefined;
  const fullTitle = venue.fullTitle;
  const summary = venueTranslation?.summary ?? venue.summary;
  const note = localizeVenueNote(venue, language);
  const sourceLabel = localizeSourceLabel(venue.sourceLabel, language);
  const conferenceDates = localizeConferenceDate(venue.conferenceDates, language);
  const location = localizeLocation(venue.location, language);
  const countdownLabel = getCountdownLabel(venue.countdownLabel, language);
  const venueTypeLabel = getVenueTypeLabel(venue.venueType, language);
  const categoryLabel = getCategoryLabel(venue.category, language);
  const normalizedTimezoneLabel = getTimezoneDisplayLabel(venue.timezone, language);

  return {
    fullTitle,
    summary,
    note,
    sourceLabel,
    conferenceDates,
    location,
    countdownLabel,
    venueTypeLabel,
    categoryLabel,
    normalizedTimezoneLabel,
    searchKeywords: [
      fullTitle,
      summary,
      note ?? '',
      sourceLabel,
      conferenceDates ?? '',
      location ?? '',
      venueTypeLabel,
      categoryLabel,
      venueTranslation?.note ?? '',
    ].filter(Boolean),
  };
}
