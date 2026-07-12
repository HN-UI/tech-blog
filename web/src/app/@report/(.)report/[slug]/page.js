import { notFound } from "next/navigation";

import PostView from "@/components/report/PostView";
import ReportOverlay from "@/components/report/ReportOverlay";
import ReportShell from "@/components/report/ReportShell";
import { getPost, getPosts } from "@/lib/posts";

// 오버레이 안에서 카드를 눌러 /report/<slug> 로 이동할 때 이 라우트가 가로챔.
// 잔디는 계속 뒤에 남아 있으므로 뒤로가기로 목록 → 잔디까지 되짚어 나갈 수 있다.
export default async function PostOverlay({ params }) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();

  return (
    <ReportOverlay>
      <ReportShell posts={posts}>
        <PostView post={post} />
      </ReportShell>
    </ReportOverlay>
  );
}
