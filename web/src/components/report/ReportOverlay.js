// 잔디 위를 덮는 전체화면 껍데기.
// 홈(children 슬롯)은 언마운트되지 않고 뒤에 그대로 남아 있어서,
// Home 링크나 뒤로가기로 @report 슬롯만 비우면 독 상태 그대로 돌아온다.
export default function ReportOverlay({ children }) {
  return <div className="fixed inset-0 z-60">{children}</div>;
}
