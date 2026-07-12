import PostList from "@/components/report/PostList";
import ReportOverlay from "@/components/report/ReportOverlay";
import ReportShell from "@/components/report/ReportShell";
import { getPosts } from "@/lib/posts";

// 홈에서 /report 로 이동할 때 이 라우트가 가로채서 잔디 위 오버레이로 띄운다.
export default async function ReportListOverlay({ searchParams }) {
  const { tag } = await searchParams;
  const posts = await getPosts();
  const visible = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  return (
    <ReportOverlay>
      <ReportShell posts={posts} activeTag={tag ?? null}>
        <PostList posts={visible} />
      </ReportShell>
    </ReportOverlay>
  );
}
