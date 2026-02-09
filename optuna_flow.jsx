// React의 상태 훅을 가져온다.
import { useState } from "react";

// Optuna 전체 흐름을 표현할 단계 데이터 배열이다.
const steps = [
  {
    id: 1, // 단계 고유 번호
    title: "Study 생성", // 단계 제목
    code: 'study = optuna.create_study(direction="maximize")', // 표시할 예시 코드
    desc: "최적화 세션을 시작한다\ndirection: minimize(손실) or maximize(정확도)", // 단계 설명(개행 포함)
    icon: "🎯", // 카드 아이콘
    color: "#6366f1", // 단계 대표 색상
    detail: "Study = 전체 최적화 실험 공간" // 펼쳤을 때 보여줄 추가 설명
  },
  {
    id: 2, // 단계 고유 번호
    title: "Trial 시작", // 단계 제목
    code: "study.optimize(objective, n_trials=100)", // 표시할 예시 코드
    desc: "Trial 1회 = 파라미터 조합 1세트 시도\n100번 반복하며 최적값 탐색", // 단계 설명
    icon: "🔄", // 카드 아이콘
    color: "#8b5cf6", // 단계 대표 색상
    detail: "Trial #1 → #2 → ... → #100" // 추가 설명
  },
  {
    id: 3, // 단계 고유 번호
    title: "파라미터 제안 (Suggest)", // 단계 제목
    code: 'trial.suggest_float("lr", 1e-5, 1e-1, log=True)\ntrial.suggest_int("max_depth", 2, 32)', // 표시할 예시 코드
    desc: "Sampler(TPE)가 이전 결과를 학습해서\n유망한 파라미터 영역을 집중 제안", // 단계 설명
    icon: "💡", // 카드 아이콘
    color: "#a855f7", // 단계 대표 색상
    detail: "GridSearch와의 핵심 차이점!" // 추가 설명
  },
  {
    id: 4, // 단계 고유 번호
    title: "모델 학습 & 평가", // 단계 제목
    code: "model.fit(X_train, y_train)\nscore = cross_val_score(model, X, y, cv=5).mean()", // 표시할 예시 코드
    desc: "제안받은 파라미터로 모델을 학습하고\n성능(accuracy, F1 등)을 측정", // 단계 설명
    icon: "⚙️", // 카드 아이콘
    color: "#ec4899", // 단계 대표 색상
    detail: "objective 함수 안에서 실행" // 추가 설명
  },
  {
    id: 5, // 단계 고유 번호
    title: "결과 기록 & 학습", // 단계 제목
    code: "return score  # Optuna가 자동 기록", // 표시할 예시 코드
    desc: "이번 Trial 결과를 저장하고\n다음 Trial의 Suggest에 반영", // 단계 설명
    icon: "📊", // 카드 아이콘
    color: "#f43f5e", // 단계 대표 색상
    detail: "베이지안 최적화의 핵심 루프" // 추가 설명
  },
  {
    id: 6, // 단계 고유 번호
    title: "최적 결과 확인", // 단계 제목
    code: "study.best_params\nstudy.best_value", // 표시할 예시 코드
    desc: "모든 Trial 중 가장 좋은\n파라미터 조합과 성능을 반환", // 단계 설명
    icon: "🏆", // 카드 아이콘
    color: "#ef4444", // 단계 대표 색상
    detail: "최종 결과!" // 추가 설명
  }
];

// Pruning(성능이 낮은 trial 조기 중단) 설명 박스 데이터다.
const pruningInfo = {
  title: "⚡ Pruning (조기 중단)", // 박스 제목
  desc: "학습 중간에 성능이 안 나오면 해당 Trial을 중단하고 다음으로 넘어간다", // 박스 설명
  code: "if trial.should_prune(): raise optuna.TrialPruned()" // 박스 코드 예시
};

// Optuna 흐름 시각화 컴포넌트
export default function OptunaFlow() {
  // 현재 펼쳐진 단계 id(null이면 아무 것도 안 펼침)
  const [activeStep, setActiveStep] = useState(null);
  // GridSearch 비교 섹션 표시 여부
  const [showComparison, setShowComparison] = useState(false);

  // 컴포넌트 화면 반환 시작
  return (
    // 전체 페이지 래퍼(배경, 글자색, 패딩, 글꼴)
    <div className="min-h-screen bg-gray-950 text-white p-6" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* 상단 헤더 영역 */}
      <div className="text-center mb-8">
        {/* 로고와 제목을 가로 정렬 */}
        <div className="inline-flex items-center gap-3 mb-3">
          {/* 동그라미 로고 배지 */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}>
            O
          </div>
          {/* 메인 타이틀 */}
          <h1 className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #a78bfa, #f472b6)" }}>
            Optuna 실행 흐름도
          </h1>
        </div>
        {/* 서브 타이틀 */}
        <p className="text-gray-400 text-sm">하이퍼파라미터 최적화가 이루어지는 과정</p>
      </div>

      {/* 단계 흐름 본문 */}
      <div className="max-w-4xl mx-auto">
        {/* 단계 배열을 순회하며 카드 생성 */}
        {steps.map((step, i) => (
          // 각 단계를 감싸는 래퍼(div key 필수)
          <div key={step.id}>
            {/* 클릭 가능한 단계 카드 */}
            <div
              className="relative cursor-pointer transition-all duration-300"
              onClick={() => setActiveStep(activeStep === step.id ? null : step.id)} // 같은 카드는 닫고, 다른 카드는 연다.
              style={{ marginBottom: i < steps.length - 1 ? 0 : 0 }} // 현재 로직상 항상 0(자리만 남김)
            >
              {/* 실제 카드 박스 */}
              <div
                className="rounded-2xl p-5 border transition-all duration-300"
                style={{
                  background: activeStep === step.id
                    ? `linear-gradient(135deg, ${step.color}15, ${step.color}08)` // 펼침 상태 배경
                    : "rgba(255,255,255,0.03)", // 기본 배경
                  borderColor: activeStep === step.id ? step.color + "60" : "rgba(255,255,255,0.06)", // 펼침 상태 테두리 강조
                  transform: activeStep === step.id ? "scale(1.02)" : "scale(1)", // 펼침 상태 확대 효과
                  boxShadow: activeStep === step.id ? `0 8px 32px ${step.color}20` : "none" // 펼침 상태 그림자
                }}
              >
                {/* 아이콘 영역 + 내용 영역 가로 배치 */}
                <div className="flex items-start gap-4">
                  {/* 왼쪽: 단계 번호/아이콘 */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    {/* 단계 아이콘 박스 */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}aa)` }} // 단계별 그라데이션
                    >
                      {step.icon}
                    </div>
                    {/* STEP 텍스트 */}
                    <span className="text-xs mt-1 font-bold" style={{ color: step.color }}>
                      STEP {step.id}
                    </span>
                  </div>

                  {/* 오른쪽: 제목/코드/설명 */}
                  <div className="flex-1 min-w-0">
                    {/* 단계 제목 */}
                    <h3 className="text-lg font-bold mb-2" style={{ color: step.color }}>
                      {step.title}
                    </h3>

                    {/* 코드 예시 박스 */}
                    <div className="rounded-lg p-3 mb-2" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      {/* 코드 프리포맷(가로 스크롤 허용) */}
                      <pre className="text-xs leading-relaxed overflow-x-auto" style={{ color: "#e2e8f0" }}>
                        <code>{step.code}</code>
                      </pre>
                    </div>

                    {/* 단계 설명 텍스트(개행 보존) */}
                    <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                      {step.desc}
                    </p>

                    {/* 해당 단계가 active일 때만 추가 설명 노출 */}
                    {activeStep === step.id && (
                      <div
                        className="mt-3 px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ background: step.color + "18", color: step.color, border: `1px dashed ${step.color}40` }} // 단계 색상 기반 강조
                      >
                        💬 {step.detail}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 마지막 단계 전까지는 단계 사이 화살표/보조 배지를 보여준다 */}
            {i < steps.length - 1 && (
              <div className="flex items-center justify-center py-2 relative">
                {/* 가운데 아래 방향 화살표 */}
                <div className="flex flex-col items-center">
                  <svg width="24" height="28" viewBox="0 0 24 28">
                    <path d="M12 0 L12 20 M6 14 L12 22 L18 14" stroke={steps[i + 1].color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* 2~5단계 구간에서 Trial 반복 루프 배지 노출 */}
                {i >= 1 && i <= 3 && (
                  <div className="absolute right-8 md:right-16">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: "rgba(168,85,247,0.1)", // 배경색
                        border: "1px solid rgba(168,85,247,0.25)", // 테두리색
                        color: "#c084fc" // 글자색
                      }}
                    >
                      {/* 반복 루프 아이콘 */}
                      <svg width="14" height="14" viewBox="0 0 14 14">
                        <path d="M7 1 C10.3 1 13 3.7 13 7 C13 10.3 10.3 13 7 13 C3.7 13 1 10.3 1 7 C1 5 2 3.2 3.5 2" stroke="#c084fc" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        <path d="M1.5 2 L3.8 1.8 L3.5 4" stroke="#c084fc" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {/* 단계 위치에 따라 문구 변경 */}
                      {i === 1 ? "Trial 루프 시작" : i === 3 ? "n_trials만큼 반복" : "반복"}
                    </div>
                  </div>
                )}

                {/* 4->5 단계 사이에서는 Pruning 가능 배지를 추가로 노출 */}
                {i === 3 && (
                  <div className="absolute left-8 md:left-16">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: "rgba(251,191,36,0.1)", // 배경색
                        border: "1px solid rgba(251,191,36,0.25)", // 테두리색
                        color: "#fbbf24" // 글자색
                      }}
                    >
                      ⚡ Pruning 가능
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pruning 설명 박스 */}
      <div className="max-w-4xl mx-auto mt-8">
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.05), rgba(251,191,36,0.02))", // 박스 배경
            borderColor: "rgba(251,191,36,0.2)" // 박스 테두리
          }}
        >
          {/* Pruning 제목 */}
          <h3 className="text-base font-bold mb-2" style={{ color: "#fbbf24" }}>
            {pruningInfo.title}
          </h3>
          {/* Pruning 설명 문장 */}
          <p className="text-sm text-gray-400 mb-3">{pruningInfo.desc}</p>
          {/* Pruning 코드 예시 */}
          <div className="rounded-lg p-3" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <code className="text-xs" style={{ color: "#fde68a" }}>{pruningInfo.code}</code>
          </div>
        </div>
      </div>

      {/* GridSearch와 Optuna 비교 섹션 */}
      <div className="max-w-4xl mx-auto mt-6">
        <button
          onClick={() => setShowComparison(!showComparison)} // 클릭 시 비교 섹션 토글
          className="w-full rounded-2xl p-4 border text-left transition-all duration-300"
          style={{
            background: showComparison ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.03)", // 열림/닫힘 배경
            borderColor: showComparison ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)" // 열림/닫힘 테두리
          }}
        >
          {/* 비교 카드 헤더 */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-300">🆚 GridSearchCV vs Optuna 탐색 방식 비교</span>
            <span className="text-gray-500 text-xl">{showComparison ? "−" : "+"}</span>
          </div>

          {/* 토글이 열렸을 때만 2열 비교 콘텐츠 렌더링 */}
          {showComparison && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {/* 왼쪽: GridSearch 예시 */}
              <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <h4 className="font-bold text-red-400 mb-3 text-sm">GridSearchCV</h4>
                <div className="space-y-2">
                  {/* 사전에 정한 모든 후보값을 순서대로 시도 */}
                  {["C=0.1", "C=1.0", "C=10", "C=100", "...모든 조합"].map((v, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5" }}>
                        {i + 1}
                      </div>
                      <span className="text-xs text-gray-400">{v}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-red-300 mt-3 opacity-70">→ 순서대로 전부 시도 (무식한 탐색)</p>
              </div>

              {/* 오른쪽: Optuna(TPE) 예시 */}
              <div className="rounded-xl p-4" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <h4 className="font-bold text-indigo-400 mb-3 text-sm">Optuna (TPE)</h4>
                <div className="space-y-2">
                  {/* 이전 결과를 바탕으로 유망 구간 중심 탐색 */}
                  {[
                    { v: "C=5.2", note: "랜덤 시작" },
                    { v: "C=8.1", note: "↑ 좋았으니 근처 탐색" },
                    { v: "C=7.3", note: "↑ 더 좁혀봄" },
                    { v: "C=7.8", note: "✓ 최적 근처 집중!" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>
                        {i + 1}
                      </div>
                      <span className="text-xs text-gray-400">{item.v}</span>
                      <span className="text-xs" style={{ color: "#818cf8" }}>{item.note}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-indigo-300 mt-3 opacity-70">→ 결과를 학습해서 똑똑하게 탐색</p>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* 하단 안내 문구 */}
      <div className="text-center mt-8 text-gray-600 text-xs">
        각 단계를 클릭하면 추가 설명을 볼 수 있습니다
      </div>
    </div>
  );
}
