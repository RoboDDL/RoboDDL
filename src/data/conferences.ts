import venueData from './venues.json';
import {
  convertLocalDateTimeToTimezone,
  parseDeadlineToUtcMs,
  shiftLocalDateTimeByYears,
} from '../utils/dateUtils';

export type VenueType = 'conference' | 'journal';
export type Category = 'RAS' | 'Robot Learning' | 'AI x Robotics' | 'Journal';
export type SubmissionModel = 'deadline' | 'rolling';

interface VenueRecordBase {
  slug: string;
  title: string;
  fullTitle: string;
  summary: string;
  venueType: VenueType;
  category: Category;
  rank: string;
  coreRank?: string;
  caaiRank?: string;
  ccfRank?: string;
  casPartition?: string;
  jcrQuartile?: string;
  homepage: string;
  dblp?: string;
  keywords?: string[];
}

interface KnownEdition {
  year: number;
  paperDeadline: string;
  abstractDeadline?: string;
  timezone: string;
  conferenceDates: string;
  location: string;
  link: string;
  deadlineSourceLabel: string;
  deadlineSourceUrl: string;
  note?: string;
}

interface FutureHint {
  year: number;
  conferenceDates: string;
  location: string;
  link?: string;
  note?: string;
}

interface DeadlineVenueRecord extends VenueRecordBase {
  submissionModel: 'deadline';
  knownEditions: KnownEdition[];
  futureHints?: FutureHint[];
}

interface RollingVenueRecord extends VenueRecordBase {
  submissionModel: 'rolling';
  rollingNote: string;
  sourceLabel: string;
  sourceUrl: string;
}

type VenueRecord = DeadlineVenueRecord | RollingVenueRecord;

export interface VenueView {
  id: string;
  slug: string;
  title: string;
  fullTitle: string;
  summary: string;
  venueType: VenueType;
  category: Category;
  rank: string;
  coreRank?: string;
  caaiRank?: string;
  ccfRank?: string;
  casPartition?: string;
  jcrQuartile?: string;
  homepage: string;
  dblp?: string;
  keywords: string[];
  submissionModel: SubmissionModel;
  year?: number;
  paperDeadline?: string;
  abstractDeadline?: string;
  timezone?: string;
  countdownLabel?: string;
  countdownDeadline?: string;
  conferenceDates?: string;
  location?: string;
  link: string;
  note?: string;
  sourceLabel: string;
  sourceUrl: string;
  isEstimated: boolean;
  estimatedFromYear?: number;
  deadlineSortMs: number;
}

const records = venueData as VenueRecord[];

export const categories: Array<'All' | Exclude<Category, 'Journal'>> = [
  'All',
  'RAS',
  'Robot Learning',
  'AI x Robotics',
];

export const venueTypes: Array<'All' | VenueType> = ['All', 'conference', 'journal'];

function resolveDeadlineVenue(record: DeadlineVenueRecord, now: Date): VenueView {
  const editions = [...record.knownEditions].sort((left, right) => left.year - right.year);
  const nowMs = now.getTime();

  const upcomingOfficial = editions.find((edition) => {
    return parseDeadlineToUtcMs(edition.paperDeadline, edition.timezone) > nowMs;
  });

  if (upcomingOfficial) {
    const paperDeadlineAoE = convertLocalDateTimeToTimezone(
      upcomingOfficial.paperDeadline,
      upcomingOfficial.timezone,
      'AoE',
    );
    const abstractDeadlineAoE = upcomingOfficial.abstractDeadline
      ? convertLocalDateTimeToTimezone(upcomingOfficial.abstractDeadline, upcomingOfficial.timezone, 'AoE')
      : undefined;
    const countdownDeadline =
      abstractDeadlineAoE && parseDeadlineToUtcMs(abstractDeadlineAoE, 'AoE') > nowMs
        ? abstractDeadlineAoE
        : paperDeadlineAoE;
    const countdownLabel =
      abstractDeadlineAoE && parseDeadlineToUtcMs(abstractDeadlineAoE, 'AoE') > nowMs
        ? 'Abstract deadline'
        : 'Paper deadline';

    return {
      id: `${record.slug}-${upcomingOfficial.year}`,
      slug: record.slug,
      title: record.title,
      fullTitle: record.fullTitle,
      summary: record.summary,
      venueType: record.venueType,
      category: record.category,
      rank: record.rank,
      coreRank: record.coreRank,
      caaiRank: record.caaiRank,
      ccfRank: record.ccfRank,
      casPartition: record.casPartition,
      jcrQuartile: record.jcrQuartile,
      homepage: record.homepage,
      dblp: record.dblp,
      keywords: record.keywords ?? [],
      submissionModel: 'deadline',
      year: upcomingOfficial.year,
      paperDeadline: paperDeadlineAoE,
      abstractDeadline: abstractDeadlineAoE,
      timezone: 'AoE',
      countdownLabel,
      countdownDeadline,
      conferenceDates: upcomingOfficial.conferenceDates,
      location: upcomingOfficial.location,
      link: upcomingOfficial.link,
      note: upcomingOfficial.note,
      sourceLabel: upcomingOfficial.deadlineSourceLabel,
      sourceUrl: upcomingOfficial.deadlineSourceUrl,
      isEstimated: false,
      deadlineSortMs: parseDeadlineToUtcMs(countdownDeadline, 'AoE'),
    };
  }

  const referenceEdition = editions[editions.length - 1];

  if (!referenceEdition) {
    throw new Error(`Deadline venue "${record.slug}" is missing known editions.`);
  }

  let yearsToShift = 1;
  let shiftedPaperDeadline = shiftLocalDateTimeByYears(referenceEdition.paperDeadline, yearsToShift);

  while (parseDeadlineToUtcMs(shiftedPaperDeadline, referenceEdition.timezone) <= nowMs) {
    yearsToShift += 1;
    shiftedPaperDeadline = shiftLocalDateTimeByYears(referenceEdition.paperDeadline, yearsToShift);
  }

  const targetYear = referenceEdition.year + yearsToShift;
  const futureHint = record.futureHints?.find((hint) => hint.year === targetYear);

  const estimatedPaperDeadlineAoE = convertLocalDateTimeToTimezone(
    shiftedPaperDeadline,
    referenceEdition.timezone,
    'AoE',
  );
  const estimatedAbstractDeadlineAoE = referenceEdition.abstractDeadline
    ? convertLocalDateTimeToTimezone(
        shiftLocalDateTimeByYears(referenceEdition.abstractDeadline, yearsToShift),
        referenceEdition.timezone,
        'AoE',
      )
    : undefined;
  const countdownDeadline =
    estimatedAbstractDeadlineAoE && parseDeadlineToUtcMs(estimatedAbstractDeadlineAoE, 'AoE') > nowMs
      ? estimatedAbstractDeadlineAoE
      : estimatedPaperDeadlineAoE;
  const countdownLabel =
    estimatedAbstractDeadlineAoE && parseDeadlineToUtcMs(estimatedAbstractDeadlineAoE, 'AoE') > nowMs
      ? 'Abstract deadline'
      : 'Paper deadline';

  return {
    id: `${record.slug}-${targetYear}`,
    slug: record.slug,
    title: record.title,
    fullTitle: record.fullTitle,
    summary: record.summary,
    venueType: record.venueType,
    category: record.category,
    rank: record.rank,
    coreRank: record.coreRank,
    caaiRank: record.caaiRank,
    ccfRank: record.ccfRank,
    casPartition: record.casPartition,
    jcrQuartile: record.jcrQuartile,
    homepage: record.homepage,
    dblp: record.dblp,
    keywords: record.keywords ?? [],
    submissionModel: 'deadline',
    year: targetYear,
    paperDeadline: estimatedPaperDeadlineAoE,
    abstractDeadline: estimatedAbstractDeadlineAoE,
    timezone: 'AoE',
    countdownLabel,
    countdownDeadline,
    conferenceDates: futureHint?.conferenceDates ?? 'TBA',
    location: futureHint?.location ?? 'TBA',
    link: futureHint?.link ?? record.homepage,
    note: futureHint?.note ?? referenceEdition.note,
    sourceLabel: `Estimated from ${record.title} ${referenceEdition.year} paper deadline`,
    sourceUrl: referenceEdition.deadlineSourceUrl,
    isEstimated: true,
    estimatedFromYear: referenceEdition.year,
    deadlineSortMs: parseDeadlineToUtcMs(countdownDeadline, 'AoE'),
  };
}

function resolveRollingVenue(record: RollingVenueRecord): VenueView {
  return {
    id: record.slug,
    slug: record.slug,
    title: record.title,
    fullTitle: record.fullTitle,
    summary: record.summary,
    venueType: record.venueType,
    category: record.category,
    rank: record.rank,
    coreRank: record.coreRank,
    caaiRank: record.caaiRank,
    ccfRank: record.ccfRank,
    casPartition: record.casPartition,
    jcrQuartile: record.jcrQuartile,
    homepage: record.homepage,
    dblp: record.dblp,
    keywords: record.keywords ?? [],
    submissionModel: 'rolling',
    link: record.homepage,
    note: record.rollingNote,
    sourceLabel: record.sourceLabel,
    sourceUrl: record.sourceUrl,
    isEstimated: false,
    deadlineSortMs: Number.POSITIVE_INFINITY,
  };
}

export function buildVenueViews(now = new Date()): VenueView[] {
  return records.map((record) => {
    if (record.submissionModel === 'rolling') {
      return resolveRollingVenue(record);
    }

    return resolveDeadlineVenue(record, now);
  });
}
