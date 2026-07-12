// content/*.md 를 읽어 글 목록/본문을 돌려준다.
//
// ⚠️ fs 를 쓰므로 서버 컴포넌트에서만 import 할 것.
//    (클라이언트 컴포넌트는 여기서 만든 결과를 props 로 받는다)
//
// 프론트매터 형식:
//   ---
//   title: 제목
//   date: 2026-07-01
//   tags: [연구, 추천시스템]
//   summary: 목록 카드에 뜨는 한 줄 요약
//   ---

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content");

// date 가 YAML 에서 Date 객체로 파싱될 수 있어 문자열로 통일
const toDateString = (v) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? "");

function readPost(filename) {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    date: toDateString(data.date),
    tags: data.tags ?? [],
    summary: data.summary ?? "",
    content, // 아직 마크다운 원문 — 본문이 필요할 때만 렌더
  };
}

function listFiles() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
}

const toHtml = async (markdown) =>
  String(await remark().use(remarkGfm).use(remarkHtml).process(markdown));

// 글 하나 — 마크다운을 HTML 로 렌더해서 함께 돌려줌
export async function getPost(slug) {
  const file = `${slug}.md`;
  if (!listFiles().includes(file)) return null;

  const { content, ...meta } = readPost(file);
  return { ...meta, html: await toHtml(content) };
}

// 전체 글 (본문 HTML 포함), 최신 글이 먼저.
//
// 지금은 상세 화면이 클라이언트 상태로 열려서 모든 글의 본문을 한 번에 내려보낸다.
// 글이 많아지면 /report/[slug] 라우트로 옮겨 본문을 그때그때 불러오는 게 맞다.
export async function getPosts() {
  const posts = await Promise.all(
    listFiles().map(async (f) => {
      const { content, ...meta } = readPost(f);
      return { ...meta, html: await toHtml(content) };
    }),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
