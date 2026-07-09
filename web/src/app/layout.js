import localFont from "next/font/local";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const pokemonPixel = localFont({
  src: "./fonts/pokemon-dppt.otf",
  variable: "--font-pokemon-pixel",
  display: "swap",
});

// Paperlogy — 굵기별 등록. 실제 화면에 쓰이는 굵기만 브라우저가 내려받음.
// fontWeight 400/500/600/700 로 바꿔가며 쓸 수 있음 (파일은 1~9 굵기 다 있음)
const paperlogy = localFont({
  src: [
    { path: "./fonts/Paperlogy/Paperlogy-4Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Paperlogy/Paperlogy-5Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Paperlogy/Paperlogy-6SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Paperlogy/Paperlogy-7Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-paperlogy-medium",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tech Blog",
  description: "레트로 게임 UI 느낌의 개인 테크 블로그",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ko"
      className={`${pokemonPixel.variable} ${paperlogy.variable} ${notoSansKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
