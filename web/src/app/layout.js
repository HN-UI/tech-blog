import localFont from "next/font/local";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const pokemonPixel = localFont({
  src: "./fonts/pokemon-dppt.otf",
  variable: "--font-pokemon-pixel",
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
      className={`${pokemonPixel.variable} ${notoSansKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
