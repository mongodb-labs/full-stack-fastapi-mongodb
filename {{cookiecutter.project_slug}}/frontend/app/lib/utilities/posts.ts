import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";

const postsDirectory = path.join(process.cwd(), "app/content/blog");

/**
 * Get the data of all posts in sorted order by date
 * @return {List[Object]}     Returns an array that looks like this:
  [
    {
      id: 'ssg-ssr',
      title: 'When to Use Static Generation v.s. Server-side Rendering',
      date: '2020-01-01'
    },
    {
      id: 'pre-rendering',
      title: 'Two Forms of Pre-rendering',
      date: '2020-01-02'
    }
  ]
 */
export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory); // [ 'pre-rendering.md', 'ssg-ssr.md' ]

  // Get the data from each file
  const allPostsData = fileNames.map((filename) => {
    // Remove ".md" from file name to get id
    const id = filename.replace(/\.md$/, ""); // id = 'pre-rendering', 'ssg-ssr'

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, filename);
    // /Users/ef/Desktop/nextjs-blog/posts/pre-rendering.md
    const fileContents = fs.readFileSync(fullPath, "utf8"); // .md string content

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    const categories: string[] = matterResult.data.categories.split(",");

    return {
      id,
      ...(matterResult.data as {
        publishedAt: string;
        title: string;
        author: string;
        description: string;
      }),
      categories,
    };
  });

  // Sort posts by date and return
  return allPostsData.sort((a, b) => {
    if (a.publishedAt < b.publishedAt) {
      return 1;
    } else {
      return -1;
    }
  });
}

// ------------------------------------------------
// GET THE IDs OF ALL POSTS FOR THE DYNAMIC ROUTING
/*
  Returns an array that looks like this:
  [
    {
      params: {
        id: 'ssg-ssr'
      }
    },
    {
      params: {
        id: 'pre-rendering'
      }
    }
  ]
  */

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

// The returned array must have the params key otherwise `getStaticPaths` will fail

// --------------------------------
// GET THE DATA OF A SINGLE POST FROM THE ID
export async function getPostData(
  id: string,
  directory: string = postsDirectory,
) {
  const fullPath = path.join(directory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .use(remarkGfm)
    .use(remarkToc)
    .process(matterResult.content);
  const content = processedContent.toString();

  // Combine the data with the id
  return {
    id,
    content,
    ...(matterResult.data as {
      publishedAt: string;
      title: string;
      author: string;
      description: string;
    }),
  };
}
