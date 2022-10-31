import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getPostNames() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map(name => ({
        params: {
            id: name.replace(/\.md$/, '')
        }
    }));
}

function getPostMatter(fileId) {
    // Remove ".md" from file name to get id
    const fileName = `${fileId}.md`;

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    return matterResult;
}

export async function getPostData(fileId) {
    // Use gray-matter to parse the post metadata section
    const matterResult = getPostMatter(fileId);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the id
    return {
        ...matterResult.data,
        id: fileId,
        content: contentHtml
    };
}


export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = getPostNames();
    const allPostsData = fileNames.map(({ params }) => {
        // Remove ".md" from file name to get id
        const id = params.id;

        // Use gray-matter to parse the post metadata section
        const matterResult = getPostMatter(id);

        // Combine the data with the id
        return {
            id,
            ...matterResult.data,
        };
    });

    // Sort posts by date
    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    });
}