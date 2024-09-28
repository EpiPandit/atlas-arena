import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import html from 'remark-html';
import { remark } from 'remark';

export const getMetadataMd = (customPath, mdContent = false) => {
  const markdownDirectory = path.join(process.cwd(), ...customPath);
  const filenames = fs.readdirSync(markdownDirectory);

  return filenames
    .filter((i) => i.endsWith('.md'))
    .map(async (filename) => {
      try {
        const filePath = path.join(markdownDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        if (mdContent) {
          const { data, content } = matter(fileContents);
          // const processedContent = await remark().use(html).process(content);
          // const regex = /src="\.\/images\//g;

          // const contentHtml = processedContent.toString();
          // const contentHtmlFix = contentHtml.replace(
          //   regex,
          //   'src="/markdown/images/'
          // );

          return {
            path: customPath,
            filename,
            ...data,
            contentHtml: content,
          };
        }
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
