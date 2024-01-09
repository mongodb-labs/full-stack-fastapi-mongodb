import Link from "next/link";
import { getSortedPostsData } from "../lib/utilities/posts";
import { readableDate } from "../lib/utilities/textual";

type PostMeta = {
  id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  categories: string[];
};

const title = "Recent blog posts";
const description = "Thoughts from the world of me.";

const renderPost = (post: PostMeta) => {
  let categories = post.categories.map((category) => (
    <span
      key={`category-${category.trim()}`}
      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
    >
      {category.trim()}
    </span>
  ));

  return (
    <div key={post.id}>
      <div className="space-x-2">{categories}</div>
      <Link href={`/blog/${post.id}`} className="mt-4 block">
        <p className="text-xl font-semibold text-gray-900">{post.title}</p>
        <p className="mt-3 text-base text-gray-500">{post.description}</p>
      </Link>
      <div className="mt-4 flex items-center">
        <div>
          <p className="text-sm font-medium text-gray-900">{post.author}</p>
          <div className="flex space-x-1 text-sm text-gray-500">
            <time dateTime="blog.publishedAt">
              {readableDate(post.publishedAt)}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BlogHome() {
  const postsList: PostMeta[] = getSortedPostsData();
  const posts = postsList.map((post) => renderPost(post));

  return (
    <main className="max-w-none mx-auto sm:w-3/5 bg-white px-4 pt-10 pb-20 sm:px-6">
      <div className="relative mx-auto max-w-lg divide-y-2 divide-gray-200 lg:max-w-7xl">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">{description}</p>
        </div>
        <div className="mt-8 grid gap-16 pt-10 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
          {posts}
        </div>
      </div>
    </main>
  );
}
