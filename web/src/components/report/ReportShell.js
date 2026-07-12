import Link from "next/link";

import { getTags } from "@/lib/tags";

import PotatoPlayground from "./PotatoPlayground";

// Report 화면의 껍데기 — 헤더 + 태그 사이드바 + 본문 자리.
// 목록/상세, 오버레이/단독 페이지가 모두 이걸 두르고 그 안에 children 을 넣는다.
//
// 태그가 클라이언트 상태가 아니라 링크(/report?tag=…)라서 이 컴포넌트는 서버 컴포넌트다.
// 덕분에 필터 결과도 주소로 공유된다.

const BTN = "rounded-md border-2 border-black px-6 py-2 font-pixel text-2xl text-black hover:bg-black hover:text-white";

function TagLink({ href, label, count, selected }) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center justify-between rounded-md border-2 border-black px-3 py-2 font-paperlogy text-sm transition-colors ${
        selected ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100"
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`ml-2 shrink-0 rounded-full px-1.5 text-xs ${
          selected ? "bg-white text-black" : "bg-black text-white"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}

export default function ReportShell({ posts, activeTag = null, children }) {
  const tags = getTags(posts);

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* 상단 바 — 제목은 바 정가운데, 버튼들은 오른쪽에 */}
      <header className="relative flex shrink-0 items-center justify-end gap-2 border-b-2 border-black px-8 py-5">
        {/* 양옆 요소 폭과 무관하게 항상 가운데 — pointer-events-none 이라 클릭을 막지 않음 */}
        <h1 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-pixel text-5xl text-black">
          <Link href="/report" className="pointer-events-auto">
            Report
          </Link>
        </h1>

        {/* 오버레이에서 누르면 @report 슬롯만 비워져 잔디가 그대로 드러남 */}
        <Link href="/" className={BTN}>
          Home
        </Link>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* 왼쪽 태그 사이드바 */}
        <aside className="relative flex w-56 shrink-0 flex-col border-r-2 border-black">
          {/* 헤더 아래 선 위에서 캐릭터가 감자를 걷어차며 노는 곳.
              -translate-y-full 이라 박스 바닥이 곧 헤더 테두리선 = 캐릭터 발밑.
              inset-x-* 가 곧 좌우 벽 위치 — 줄이면 노는 범위가 넓어짐 */}
          <div className="pointer-events-none absolute inset-x-1 top-0 -translate-y-full">
            <PotatoPlayground />
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-5">
            <h2 className="mb-4 font-pixel text-xl text-black">Tags</h2>

            <div className="flex flex-col gap-2">
              <TagLink href="/report" label="전체" count={posts.length} selected={!activeTag} />
              {tags.map(({ tag, count }) => (
                <TagLink
                  key={tag}
                  // 같은 태그를 다시 누르면 필터 해제
                  href={activeTag === tag ? "/report" : `/report?tag=${encodeURIComponent(tag)}`}
                  label={`# ${tag}`}
                  count={count}
                  selected={activeTag === tag}
                />
              ))}
            </div>
          </div>
        </aside>

        <main className="min-h-0 flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
