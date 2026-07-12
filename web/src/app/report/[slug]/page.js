import { notFound } from "next/navigation";

import PostView from "@/components/report/PostView";
import ReportShell from "@/components/report/ReportShell";
import { getPost, getPosts } from "@/lib/posts";

// /report/<slug> — 글 상세. 주소를 직접 치거나 링크를 공유하면 이 페이지가 뜬다.
// 홈에서 카드를 눌러 들어오면 @report/(.)report/[slug] 가 가로채서 오버레이로 뜸.

// 빌드 시 모든 글을 미리 만들어 둠
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

export default async function PostPage({ params }) {
  const { slug } = await params; // 이 버전 Next 에선 params 가 Promise
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();

  return (
    <div className="h-screen w-full">
      <ReportShell posts={posts}>
        <PostView post={post} />
      </ReportShell>
    </div>
  );
}
