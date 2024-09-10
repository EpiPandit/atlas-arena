// lib/loadContent.js
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

export function loadContent(fileName) {
  const filePath = path.join(process.cwd(), `/src/data/${fileName}`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const content = yaml.parse(fileContents);
  return content;
}