import { Link, useLoaderData } from "@remix-run/react";
import { getClient } from "~/lib/sanity/client";

type LoaderData = {
  posts: Array<{ _id: string; title: string; slug: { current: string } }>;
};

export async function loader(): Promise<LoaderData> {
  const posts = await getClient().fetch(
    `*[_type == "post"]{ _id, title, slug }`
  );

  return { posts };
}

export default function Index() {
  let { posts } = useLoaderData<LoaderData>();

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      {posts?.length >= 1
        ? posts.map((post) => (
            <div style={{ padding: 10 }} key={post._id}>
              <Link to={post.slug.current}>{post.title}</Link>
            </div>
          ))
        : null}
    </div>
  );
}
