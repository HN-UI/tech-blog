import PostList from "@/components/report/PostList";
import ReportShell from "@/components/report/ReportShell";
import { getPosts } from "@/lib/posts";

// /report — 글 목록. ?tag=… 로 태그 필터가 걸린다 (필터 결과도 주소로 공유됨).
// 홈에서 클릭해 들어오면 @report/(.)report 가 가로채서 오버레이로 뜸.
export default async function ReportPage({ searchParams }) {
  const { tag } = await searchParams; // 이 버전 Next 에선 searchParams 가 Promise
  const posts = await getPosts();
  const visible = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  return (
    <div className="h-screen w-full">
      <ReportShell posts={posts} activeTag={tag ?? null}>
        <PostList posts={visible} />
      </ReportShell>
    </div>
  );
}
