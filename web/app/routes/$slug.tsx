import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getClient } from "~/lib/sanity/client";
import { getDraftOrPublished } from "~/lib/sanity/getDraftOrPublished";
import Preview from "~/lib/sanity/Preview";

interface IPost {
  _id: string;
  title: string;
  body: string;
}

type LoaderData = {
  post: IPost;
  preview: boolean;
  query: string;
  queryParams: Record<string, unknown>;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  const requestUrl = new URL(request?.url);
  //   See if preview token is present
  const preview =
    requestUrl?.searchParams?.get("preview") ===
    process.env.SANITY_PREVIEW_SECRET;

  const query = `*[_type == "post" && slug.current == $slug]{ _id, title, body }`;
  const queryParams = { slug: params.slug };
  // Grab the data
  const post = await getClient(preview).fetch(query, queryParams);

  return {
    post: getDraftOrPublished(post, preview),
    preview,
    // If `preview` mode is active, we'll need these for live updates
    query: query,
    queryParams: queryParams,
  };
};

export default function PostPage() {
  let { post, preview } = useLoaderData<LoaderData>();

  return (
    <>
      {preview && <Preview />}
      <div style={{ textAlign: "center", padding: 20 }}>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </div>
    </>
  );
}
