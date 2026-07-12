import Link from "next/link";

// 카드 그리드 — 카드 한 장이 곧 /report/<slug> 로 가는 링크

function PostCard({ post }) {
  return (
    <Link
      href={`/report/${post.slug}`}
      className="flex h-full flex-col rounded-xl border-2 border-black bg-white p-5 transition-transform hover:-translate-y-1"
    >
      <h3 className="font-pixel text-2xl leading-snug text-black">{post.title}</h3>

      <p className="mt-3 flex-1 font-paperlogy text-sm leading-relaxed text-neutral-600">
        {post.summary}
      </p>

      <div className="mt-4 flex items-center justify-between border-t-2 border-black pt-3">
        <time className="font-paperlogy text-xs text-neutral-500">{post.date}</time>
        <div className="flex gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black px-2 py-0.5 font-paperlogy text-xs text-black"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function PostList({ posts }) {
  if (posts.length === 0) {
    return <p className="font-paperlogy text-neutral-500">이 태그를 가진 글이 아직 없습니다.</p>;
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
