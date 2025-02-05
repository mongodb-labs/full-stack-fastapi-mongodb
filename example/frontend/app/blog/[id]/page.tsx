import { getPostData } from "../../lib/utilities/posts";
import { readableDate } from "../../lib/utilities/textual";

type Params = {
  id: string;
};

type Props = {
  params: Params;
};

type Post = {
  title: string;
  publishedAt: string;
  content: string;
  author: string;
};

export async function generateMetadata({ params }: Props) {
  const postData: Post = await getPostData(params.id);

  return {
    title: postData.title,
  };
}

// -< Post >-
export default async function Post({ params }: Props) {
  const data: Post = await getPostData(params.id);

  return (
    <>
      <div className="max-w-none mx-auto sm:w-3/5 prose prose-reader-light prose-reader-base prose-reader-compact px-4 pt-10 pb-20 sm:px-6">
        <p>
          <em>
            {data.author}, {readableDate(data.publishedAt)}
          </em>
        </p>
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
    </>
  );
}
