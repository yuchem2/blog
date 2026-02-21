function ProjectItem({
  title,
  period,
  role,
  techStack,
  description,
  isLast = false,
}: {
  title: string;
  period: string;
  role: string;
  techStack: string[];
  description: string[];
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-6 group">
      {/* 타임라인 선과 원 */}
      <div className="relative flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-border-main group-hover:bg-primary transition-colors z-10 flex-shrink-0 mt-1.5" />
        <div
          className={
            isLast
              ? 'flex-1 w-0.5 bg-gradient-to-b from-border-main to-transparent group-hover:from-primary/50 group-hover:to-transparent transition-colors -mt-1'
              : 'flex-1 w-0.5 bg-border-main group-hover:bg-primary/50 transition-colors -mt-1'
          }
        />
      </div>

      {/* 내용 */}
      <div className={isLast ? 'pb-0' : 'pb-12'}>
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="flex flex-wrap gap-2 items-center mt-2 mb-3 text-sm">
          <span className="text-text-sub">{period}</span>
          <span className="w-1 h-1 rounded-full bg-text-sub" />
          <span className="text-primary font-medium">{role}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech) => (
            <span key={tech} className="px-2 py-0.5 bg-bg-sub rounded text-xs text-text-sub border border-border-main">
              {tech}
            </span>
          ))}
        </div>
        <ul className="list-disc list-outside ml-4 space-y-1 text-text-main">
          {description.map((desc, i) => (
            <li key={i}>{desc}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold border-b border-border-main pb-4">Projects</h2>
      <div className="space-y-0">
        <ProjectItem
          title="Express용 클래스 기반 데이터 바인딩 라이브러리 (express-cargo)"
          period="2025.06 - 현재"
          role="Core Logic Developer"
          techStack={['TypeScript', 'Reflect-metadata']}
          description={[
            'TypeScript 데코레이터를 활용한 선언적 데이터 바인딩 구조 설계, 반복 코드 50% 감소',
            '재귀 로직 기반의 통합 데이터 처리 시스템 구축',
            'NPM 오픈소스 배포 및 오픈소스 개발자 대회 동상 수상',
          ]}
        />
        <ProjectItem
          title="실시간 온라인 교육 플랫폼 (plum)"
          period="2025.12 - 2026.02"
          role="Backend Developer"
          techStack={['Nest.js', 'React', 'Redis', 'mediasoup']}
          description={[
            'mediasoup 기반 SFU 미디어 서버 및 WebSocket 게이트웨이 구축 (40명+ 동시 접속)',
            '음성 데이터 배치 처리로 STT 부하 분산 및 요약 대기 시간 단축',
            'Redis를 활용한 동적 데이터 전담 처리 아키텍처 설계',
          ]}
        />
        <ProjectItem
          title="행사 축제 커뮤니티 서비스 (Fienmee)"
          period="2024.08 - 2025.12"
          role="Full Stack Developer"
          techStack={['Express', 'Next.js', 'React Native', 'MongoDB']}
          description={[
            '외부 데이터 수집·가공 및 통합 스키마 기반 자동화 배치 로직 구현',
            'Next.js 웹뷰와 React Native 간 Bridge 통신 구현',
            'express-cargo 도입을 통한 데이터 검증 로직 리팩토링',
          ]}
        />
        <ProjectItem
          title="문서 관계 그래프 생성 extension (Doculink)"
          period="2024.12 - 2025.06"
          role="Full Stack Developer"
          techStack={['Forge', 'Node.js', 'React', 'Three.js']}
          description={[
            'Atlassian Rovo 도입으로 문서 연관성 분석 정확도 개선',
            'Three.js 기반 2D/3D 그래프 노드 시각화 재설계',
            '키워드 가중치 기반 연관성 계산 로직 최적화',
          ]}
          isLast={true}
        />
      </div>
    </section>
  );
}
