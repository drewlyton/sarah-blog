import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getClient } from "~/lib/sanity/client";
import { getDraftOrPublished } from "~/lib/sanity/getDraftOrPublished";

interface IPost {
  _id: string;
  title: string;
  body: string;
}

type LoaderData = IPost & {
  preview: boolean;
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

  // Grab the data
  const initialData = await getClient(preview).fetch(
    `*[_type == "post" && slug.current == $slug]{ _id, title, body }`,
    { slug: params.slug }
  );
  const post = getDraftOrPublished<IPost>(initialData, preview);

  return { ...post, preview };
};

export default function PostPage() {
  let { title, body } = useLoaderData<LoaderData>();

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
}
