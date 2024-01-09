import { Metadata } from "next";
import { getPostData } from "../lib/utilities/posts";

type Post = {
  id: string;
  content: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
};

const aboutPath = "app/content/";

export const metadata: Metadata = {
  title: "Getting started with a base project",
};

export default async function About() {
  const data: Post = await getPostData("about", aboutPath);

  return (
    <>
      <div className="max-w-none mx-auto sm:w-3/5 prose prose-reader-light prose-reader-base prose-reader-compact px-4 pt-10 pb-20 sm:px-6">
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
    </>
  );
}
