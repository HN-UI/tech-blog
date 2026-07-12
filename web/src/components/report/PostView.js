import Link from "next/link";

// 글 상세 — posts.js 가 마크다운을 렌더해 준 HTML 을 그린다.
// 본문 태그(h2, p, ul, pre …)의 생김새는 globals.css 의 .markdown 에서 관리.

export default function PostView({ post }) {
  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/report"
        className="mb-8 inline-block rounded-md border-2 border-black px-4 py-1.5 font-pixel text-lg text-black hover:bg-black hover:text-white"
      >
        ← List
      </Link>

      {/* 제목 블록 — 목록 카드와 같은 검은 선 톤 */}
      <header className="border-b-2 border-black pb-5">
        <h1 className="font-pixel text-3xl leading-snug text-black">{post.title}</h1>

        <div className="mt-4 flex items-center gap-3">
          <time className="font-paperlogy text-sm text-neutral-500">{post.date}</time>
          <div className="flex gap-1.5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/report?tag=${encodeURIComponent(tag)}`}
                className="rounded-full border border-black px-2 py-0.5 font-paperlogy text-xs text-black hover:bg-black hover:text-white"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* 마크다운에서 나온 HTML. 글은 내 저장소의 파일이므로 신뢰할 수 있는 출처 */}
      <div className="markdown pb-16" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
