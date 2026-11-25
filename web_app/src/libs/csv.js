// Minimal CSV reading for the simple tables on S3: no quoted commas or newlines.

// Rows as objects keyed by the header's columns.
export const parseRows = (text) => {
  // The file may start with a UTF-8 BOM (saved from Excel).
  const [header, ...lines] = text
    .replace(/^﻿/, '')
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim());
  // An empty file has no rows.
  if (!header) return [];
  const columns = header.split(',').map((c) => c.replace(/"/g, '').trim());
  return lines.map((line) => {
    const values = line.split(',').map((v) => v.replace(/"/g, '').trim());
    return Object.fromEntries(columns.map((c, i) => [c, values[i]]));
  });
};

// A number, or null for 'NA', blank or anything else non-numeric.
export const toNumber = (value) => {
  if (value == null || String(value).trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};
