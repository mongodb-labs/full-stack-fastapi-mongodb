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
  title: "Authentication with Magic and Oauth2",
};

export default async function Authentication() {
  const data: Post = await getPostData("authentication", aboutPath);

  return (
    <>
      <div className="max-w-none mx-auto sm:w-3/5 prose prose-reader-light prose-reader-base prose-reader-compact px-4 pt-10 pb-20 sm:px-6">
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
    </>
  );
}
