import { loadVenueRecords } from './loadVenueRecords';
import {
  convertLocalDateTimeToTimezone,
  parseDeadlineToUtcMs,
  shiftLocalDateTimeByYears,
} from '../utils/dateUtils';

export type VenueType = 'conference' | 'journal';
export type Category = 'RAS' | 'Robot Learning' | 'AI x Robotics' | 'Journal';
export type SubmissionModel = 'deadline' | 'rolling';
export type RatingFilter = 'All' | 'CCF' | 'CAAI';

interface VenueRecordBase {
  slug: string;
  title: string;
  fullTitle: string;
  summary: string;
  venueType: VenueType;
  category: Category;
  isNew?: boolean;
  organizationTags?: string[];
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
  cycleYears?: number;
}

interface RollingVenueRecord extends VenueRecordBase {
  submissionModel: 'rolling';
  rollingNote: string;
  sourceLabel: string;
  sourceUrl: string;
  specialIssueLabel?: string;
  specialIssueUrl?: string;
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
  isNew?: boolean;
  organizationTags?: string[];
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
  specialIssueLabel?: string;
  specialIssueUrl?: string;
  isEstimated: boolean;
  estimatedFromYear?: number;
  deadlineSortMs: number;
}

const records = loadVenueRecords<VenueRecord>();

export const categories: Array<'All' | Exclude<Category, 'Journal'>> = [
  'All',
  'RAS',
  'AI x Robotics',
];

export const venueTypes: Array<'All' | VenueType> = ['All', 'conference', 'journal'];
export const ratingFilters: RatingFilter[] = ['All', 'CCF', 'CAAI'];

function getDisplayTimezone(record: DeadlineVenueRecord): string {
  return record.category === 'RAS' ? 'PST' : 'AoE';
}

function resolveDeadlineVenue(record: DeadlineVenueRecord, now: Date): VenueView {
  const editions = [...record.knownEditions].sort((left, right) => left.year - right.year);
  const nowMs = now.getTime();
  const cycleYears = record.cycleYears ?? 1;
  const displayTimezone = getDisplayTimezone(record);

  const upcomingOfficial = editions.find((edition) => {
    return parseDeadlineToUtcMs(edition.paperDeadline, edition.timezone) > nowMs;
  });

  if (upcomingOfficial) {
    const paperDeadline = convertLocalDateTimeToTimezone(
      upcomingOfficial.paperDeadline,
      upcomingOfficial.timezone,
      displayTimezone,
    );
    const abstractDeadline = upcomingOfficial.abstractDeadline
      ? convertLocalDateTimeToTimezone(
          upcomingOfficial.abstractDeadline,
          upcomingOfficial.timezone,
          displayTimezone,
        )
      : undefined;
    const countdownDeadline =
      abstractDeadline && parseDeadlineToUtcMs(abstractDeadline, displayTimezone) > nowMs
        ? abstractDeadline
        : paperDeadline;
    const countdownLabel =
      abstractDeadline && parseDeadlineToUtcMs(abstractDeadline, displayTimezone) > nowMs
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
      isNew: record.isNew,
      organizationTags: record.organizationTags,
      caaiRank: record.caaiRank,
      ccfRank: record.ccfRank,
      casPartition: record.casPartition,
      jcrQuartile: record.jcrQuartile,
      homepage: record.homepage,
      dblp: record.dblp,
      keywords: record.keywords ?? [],
      submissionModel: 'deadline',
      year: upcomingOfficial.year,
      paperDeadline,
      abstractDeadline,
      timezone: displayTimezone,
      countdownLabel,
      countdownDeadline,
      conferenceDates: upcomingOfficial.conferenceDates,
      location: upcomingOfficial.location,
      link: upcomingOfficial.link,
      note: upcomingOfficial.note,
      sourceLabel: upcomingOfficial.deadlineSourceLabel,
      sourceUrl: upcomingOfficial.deadlineSourceUrl,
      isEstimated: false,
      deadlineSortMs: parseDeadlineToUtcMs(countdownDeadline, displayTimezone),
    };
  }

  const referenceEdition = editions[editions.length - 1];

  if (!referenceEdition) {
    throw new Error(`Deadline venue "${record.slug}" is missing known editions.`);
  }

  let yearsToShift = cycleYears;
  let shiftedPaperDeadline = shiftLocalDateTimeByYears(referenceEdition.paperDeadline, yearsToShift);

  while (parseDeadlineToUtcMs(shiftedPaperDeadline, referenceEdition.timezone) <= nowMs) {
    yearsToShift += cycleYears;
    shiftedPaperDeadline = shiftLocalDateTimeByYears(referenceEdition.paperDeadline, yearsToShift);
  }

  const targetYear = referenceEdition.year + yearsToShift;
  const futureHint = record.futureHints?.find((hint) => hint.year === targetYear);

  const estimatedPaperDeadline = convertLocalDateTimeToTimezone(
    shiftedPaperDeadline,
    referenceEdition.timezone,
    displayTimezone,
  );
  const estimatedAbstractDeadline = referenceEdition.abstractDeadline
    ? convertLocalDateTimeToTimezone(
        shiftLocalDateTimeByYears(referenceEdition.abstractDeadline, yearsToShift),
        referenceEdition.timezone,
        displayTimezone,
      )
    : undefined;
  const countdownDeadline =
    estimatedAbstractDeadline && parseDeadlineToUtcMs(estimatedAbstractDeadline, displayTimezone) > nowMs
      ? estimatedAbstractDeadline
      : estimatedPaperDeadline;
  const countdownLabel =
    estimatedAbstractDeadline && parseDeadlineToUtcMs(estimatedAbstractDeadline, displayTimezone) > nowMs
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
    isNew: record.isNew,
    organizationTags: record.organizationTags,
    caaiRank: record.caaiRank,
    ccfRank: record.ccfRank,
    casPartition: record.casPartition,
    jcrQuartile: record.jcrQuartile,
    homepage: record.homepage,
    dblp: record.dblp,
    keywords: record.keywords ?? [],
    submissionModel: 'deadline',
    year: targetYear,
    paperDeadline: estimatedPaperDeadline,
    abstractDeadline: estimatedAbstractDeadline,
    timezone: displayTimezone,
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
    deadlineSortMs: parseDeadlineToUtcMs(countdownDeadline, displayTimezone),
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
    isNew: record.isNew,
    organizationTags: record.organizationTags,
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
    specialIssueLabel: record.specialIssueLabel,
    specialIssueUrl: record.specialIssueUrl,
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
