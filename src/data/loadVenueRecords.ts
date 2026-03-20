type VenueType = 'conference' | 'journal';

type YamlScalar = string | number | boolean | null;
type YamlValue = YamlScalar | YamlValue[] | { [key: string]: YamlValue };

export interface VenueDataIssue {
  path: string;
  venueType: VenueType;
  message: string;
}

interface YamlLine {
  indent: number;
  content: string;
  lineNumber: number;
}

const conferenceModules = import.meta.glob('./conference/*.yaml', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const journalModules = import.meta.glob('./journal/*.yaml', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const venueDataIssues: VenueDataIssue[] = [];

function parseScalar(raw: string): YamlScalar {
  return JSON.parse(raw) as YamlScalar;
}

function splitKeyValue(content: string, lineNumber: number) {
  const separatorIndex = content.indexOf(':');

  if (separatorIndex === -1) {
    throw new Error(`Invalid YAML at line ${lineNumber}: expected a key/value pair.`);
  }

  const key = content.slice(0, separatorIndex).trim();
  const remainder = content.slice(separatorIndex + 1).trim();

  if (!key) {
    throw new Error(`Invalid YAML at line ${lineNumber}: missing key name.`);
  }

  return { key, remainder };
}

function parseBlock(lines: YamlLine[], startIndex: number, indent: number): [YamlValue, number] {
  const line = lines[startIndex];

  if (!line) {
    throw new Error('Invalid YAML: unexpected end of document.');
  }

  if (line.indent !== indent) {
    throw new Error(
      `Invalid YAML at line ${line.lineNumber}: expected indent ${indent}, got ${line.indent}.`,
    );
  }

  if (line.content.startsWith('- ')) {
    return parseSequence(lines, startIndex, indent);
  }

  return parseMapping(lines, startIndex, indent);
}

function parseKeyValueLine(
  lines: YamlLine[],
  lineIndex: number,
  baseIndent: number,
  content = lines[lineIndex]?.content,
): [{ key: string; value: YamlValue }, number] {
  const line = lines[lineIndex];

  if (!line || content === undefined) {
    throw new Error('Invalid YAML: missing mapping entry.');
  }

  const { key, remainder } = splitKeyValue(content, line.lineNumber);

  if (remainder.length > 0) {
    return [{ key, value: parseScalar(remainder) }, lineIndex + 1];
  }

  const nextLine = lines[lineIndex + 1];

  if (!nextLine || nextLine.indent <= baseIndent) {
    return [{ key, value: null }, lineIndex + 1];
  }

  const [value, nextIndex] = parseBlock(lines, lineIndex + 1, nextLine.indent);
  return [{ key, value }, nextIndex];
}

function parseMapping(lines: YamlLine[], startIndex: number, indent: number): [YamlValue, number] {
  const result: Record<string, YamlValue> = {};
  let currentIndex = startIndex;

  while (currentIndex < lines.length) {
    const line = lines[currentIndex];

    if (line.indent < indent) {
      break;
    }

    if (line.indent > indent) {
      throw new Error(
        `Invalid YAML at line ${line.lineNumber}: unexpected indent ${line.indent} in mapping.`,
      );
    }

    if (line.content.startsWith('- ')) {
      throw new Error(`Invalid YAML at line ${line.lineNumber}: unexpected list item in mapping.`);
    }

    const [{ key, value }, nextIndex] = parseKeyValueLine(lines, currentIndex, indent);
    result[key] = value;
    currentIndex = nextIndex;
  }

  return [result, currentIndex];
}

function parseSequence(lines: YamlLine[], startIndex: number, indent: number): [YamlValue, number] {
  const items: YamlValue[] = [];
  let currentIndex = startIndex;

  while (currentIndex < lines.length) {
    const line = lines[currentIndex];

    if (line.indent < indent) {
      break;
    }

    if (line.indent > indent) {
      throw new Error(
        `Invalid YAML at line ${line.lineNumber}: unexpected indent ${line.indent} in list.`,
      );
    }

    if (!line.content.startsWith('- ')) {
      break;
    }

    const remainder = line.content.slice(2).trim();

    if (remainder.length === 0) {
      const nextLine = lines[currentIndex + 1];

      if (!nextLine || nextLine.indent <= indent) {
        items.push(null);
        currentIndex += 1;
        continue;
      }

      const [value, nextIndex] = parseBlock(lines, currentIndex + 1, nextLine.indent);
      items.push(value);
      currentIndex = nextIndex;
      continue;
    }

    if (/^[A-Za-z][A-Za-z0-9]*\s*:/.test(remainder)) {
      const item: Record<string, YamlValue> = {};
      let mappingIndex = currentIndex;
      let entryContent = remainder;
      let entryIndent = indent;

      while (true) {
        const [{ key, value }, nextIndex] = parseKeyValueLine(
          lines,
          mappingIndex,
          entryIndent,
          entryContent,
        );
        item[key] = value;
        currentIndex = nextIndex;

        const continuationLine = lines[currentIndex];

        if (!continuationLine) {
          break;
        }

        if (continuationLine.indent < indent + 2) {
          break;
        }

        if (continuationLine.indent > indent + 2) {
          throw new Error(
            `Invalid YAML at line ${continuationLine.lineNumber}: unexpected indent ${continuationLine.indent} in list item.`,
          );
        }

        if (continuationLine.content.startsWith('- ')) {
          throw new Error(
            `Invalid YAML at line ${continuationLine.lineNumber}: nested list entries must belong to a key.`,
          );
        }

        mappingIndex = currentIndex;
        entryContent = continuationLine.content;
        entryIndent = indent + 2;
      }

      items.push(item);
      continue;
    }

    items.push(parseScalar(remainder));
    currentIndex += 1;
  }

  return [items, currentIndex];
}

function parseYamlDocument(raw: string): YamlValue {
  const lines = raw
    .split(/\r?\n/)
    .map((line, index) => {
      const indent = line.match(/^ */)?.[0].length ?? 0;
      return {
        indent,
        content: line.slice(indent),
        lineNumber: index + 1,
      };
    })
    .filter((line) => line.content.trim().length > 0);

  if (lines.length === 0) {
    throw new Error('Invalid YAML: document is empty.');
  }

  const [document, nextIndex] = parseBlock(lines, 0, lines[0].indent);

  if (nextIndex !== lines.length) {
    const line = lines[nextIndex];
    throw new Error(`Invalid YAML at line ${line.lineNumber}: trailing content was not parsed.`);
  }

  return document;
}

function loadYamlCollection(modules: Record<string, string>, expectedVenueType: VenueType) {
  return Object.entries(modules)
    .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
    .flatMap(([path, source]) => {
      try {
        const document = parseYamlDocument(source);

        if (!document || Array.isArray(document) || typeof document !== 'object') {
          throw new Error(`expected a top-level object.`);
        }

        const venueType = document.venueType;
        if (venueType !== expectedVenueType) {
          throw new Error(
            `expected venueType "${expectedVenueType}", received "${String(venueType)}".`,
          );
        }

        return [document];
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        venueDataIssues.push({ path, venueType: expectedVenueType, message });
        console.error(`[venue-data] Skipping invalid ${expectedVenueType} YAML "${path}": ${message}`);
        return [];
      }
    });
}

export function getVenueDataIssues(): VenueDataIssue[] {
  return [...venueDataIssues];
}

export function loadVenueRecords<T>(): T[] {
  venueDataIssues.length = 0;
  return [
    ...loadYamlCollection(conferenceModules, 'conference'),
    ...loadYamlCollection(journalModules, 'journal'),
  ] as T[];
}
