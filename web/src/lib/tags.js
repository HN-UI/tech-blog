// 글 목록에서 태그를 집계한다. fs 를 쓰지 않는 순수 함수라 클라이언트에서도 호출 가능.

// 글에 실제로 쓰인 태그만 모아 [{ tag, count }] 로.
// 글이 많은 태그가 먼저, 같으면 가나다순
export function getTags(posts) {
  const counts = new Map();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
