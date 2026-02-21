function ActivityItem({ title, period, description }: { title: string; period: string; description: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-text-sub mb-1">{period}</p>
      <p className="text-text-main">{description}</p>
    </div>
  );
}

export function ExperienceSection() {
  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold border-b border-border-main pb-4">Experience & Activities</h2>
      <div className="space-y-8">
        <ActivityItem
          title="네이버 부스트캠프 웹 풀스택 10기"
          period="2025.06 - 2026.02"
          description="설계 우선 개발 프로세스 경험, CS 지식 심화 학습, 코드 리뷰 및 팀 협업 경험"
        />
        <ActivityItem
          title="Programming Language Center"
          period="2023.03 - 2024.12"
          description="학기별 100명 이상의 수강생 대상 기술 멘토링, 디버깅 지원 및 운영 가이드라인 마련"
        />
        <ActivityItem
          title="ICPS 연구실 학부연구생"
          period="2023.03 - 2023.12"
          description="수어 인식 모델 고도화를 위한 데이터 수집 및 전처리, 모델 정확도 검증 실험 주도"
        />
      </div>
    </section>
  );
}
