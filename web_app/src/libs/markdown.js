import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import html from 'remark-html';
import { remark } from 'remark';

export const getMetadataMd = (customPath) => {
  const markdownDirectory = path.join(process.cwd(), ...customPath);
  const filenames = fs.readdirSync(markdownDirectory);

  return filenames
    .filter((i) => i.endsWith('.md'))
    .map(async (filename) => {
      try {
        const filePath = path.join(markdownDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);

        return {
          path: customPath,
          filename,
          ...data,
        };
      } catch (error) {
        console.error(error);
        return {
          filename,
        };
      }
    });
};

// export const getAllMarkdownSlugs = (customPath) => {
//   const markdownDirectory = path.join(process.cwd(), ...customPath);
//   const filenames = fs.readdirSync(markdownDirectory);
//   return filenames
//     .filter((i) => i.endsWith('.md'))
//     .map((filename) => {
//       return filename.replace(/\.md$/, '');
//     });
// };

// export async function getMdFileData(customPath, slug, imageFix) {
//   const fullPath = path.join(process.cwd(), ...customPath, `${slug}.md`);
//   const fileContents = fs.readFileSync(fullPath, 'utf8');

//   const { data, content } = matter(fileContents);
//   const processedContent = await remark().use(html).process(content);
//   const regex = /src="\.\/images\//g;

//   const contentHtml = processedContent.toString();
//   const contentHtmlFix = contentHtml.replace(regex, imageFix);
//   return {
//     slug,
//     ...data,
//     contentHtml: contentHtmlFix,
//   };
// }
