import { ProfileSection } from '@/components/features/about/ProfileSection';

export const metadata = {
  title: 'About',
  description: 'About Jaehyun Yoon (Yunio)',
  alternates: {
    canonical: '/about',
  },
};

const SKILLS: { category: string; items: string[] }[] = [
  { category: 'Language', items: ['JavaScript', 'TypeScript', 'Python', 'C/C++'] },
  { category: 'Backend', items: ['Express', 'NestJS', 'Django', 'FastAPI'] },
  { category: 'Frontend', items: ['Next.js', 'React', 'React Native'] },
  { category: 'Infra', items: ['AWS', 'Docker'] },
  { category: 'Database', items: ['MongoDB', 'Redis', 'MySQL'] },
];

const PROJECTS: { title: string; period: string; meta: string; description: string[]; isLast?: boolean }[] = [
  {
    title: 'convene — 동아리 내부 협업용 화상회의·AI 회의록 플랫폼',
    period: '2026.05 - 현재',
    meta: '1인 풀스택',
    description: [
      '기획부터 배포까지 전 과정을 직접 수행하고, 규약 문서와 TDD를 이용해 품질 일관성 유지',
      '백엔드를 DDD 4계층 + Bounded Context로 구조화하고 도메인 이벤트·Port로 격리해 핵심 로직 수정 없이 교체·확장 가능한 구조 확보',
    ],
  },
  {
    title: 'express-cargo — Express 클래스 기반 요청 바인딩 라이브러리',
    period: '2025.06 - 현재',
    meta: '오픈소스 · 코어 로직 · 5인',
    description: [
      '재귀 바인딩 파이프라인과 변환·바인딩·검증 관심사 분리를 설계하고, 검증 책임을 DTO로 옮겨 컨트롤러 검증 코드 약 80% 제거',
      '데코레이터 오용을 서버 시작 시점에 차단하는 정적 검증 시스템 설계, npm 공개 후 2025 오픈소스 개발자 대회 동상 수상',
    ],
  },
  {
    title: 'Plum — 실시간 온라인 화상강의 플랫폼',
    period: '2025.12 - 2026.02',
    meta: '백엔드 · 4인 · 네이버 부스트캠프',
    description: [
      '기능 흐름도·데이터 스키마 설계를 맡고, Mediasoup 기반 SFU 미디어 서버로 50명 이상 동시 접속 데모 검증',
      '온프레미스 Faster-whisper + 5분 배치·1분 스트림 이중 구조로 강의 종료 후 3분 내 요약 제공',
    ],
  },
  {
    title: 'Fienmee — 행사·축제 커뮤니티 플랫폼',
    period: '2024.08 - 2025.12',
    meta: '풀스택 · 7인',
    description: [
      '공공데이터 통합 스키마 자동 갱신 배치와 Next.js, React Native 브릿지 인증 동기화',
      'FCM 푸시 크로스 플랫폼 구조 설계',
      'Windows 전용 빌드 실패를 CMake 로그 분석으로 RN 자체 결함으로 규명, 패치 마이그레이션으로 팀 개발 환경 일치',
    ],
  },
  {
    title: 'Doculink — Confluence 문서 관계 그래프 확장 프로그램',
    period: '2024.12 - 2025.06',
    meta: '풀스택 · 4인 · Atlassian Codegeist',
    description: [
      'Forge 실행 시간·보안 제약 아래 전통 NLP + Rovo AI 프롬프트 이중 트랙 키워드 추출 설계',
      '비동기 액션 워크플로우로 실행 시간 제한을 해결하고 Three.js로 문서 관계 그래프 시각화',
    ],
    isLast: true,
  },
];

const ACTIVITIES: { title: string; period: string; description: string }[] = [
  {
    title: 'Beyond_Imagination',
    period: '2024.09 - 현재 · 팀·개인 프로젝트',
    description:
      '칸반보드와 스크럼으로 이슈를 관리하고, PR 코드 리뷰와 Conventional Commits로 협업. 세미나·스터디·멘토링 등 활동에 참여하여 개발 역량 성장',
  },
  {
    title: 'Programming Language Center',
    period: '2023.03 - 2024.12 · 운영진 · 학부 대표',
    description: '2년간 전공·언어 질의응답 멘토링, 마지막 1년은 학부 대표로 근무·상담 기록 관리와 운영 총괄',
  },
  {
    title: 'AML 연구실 (구 ICPS 연구실)',
    period: '2022.03 - 2022.12 · 학부연구생',
    description:
      '청각장애인 대상 수어 동시통역 연구에서 데이터 수집·전처리 파이프라인을 구축하고, CNN 기반 인식 모델을 파인튜닝하며 여러 모델을 비교 실험해 인식 성능을 검증',
  },
];

const EDUCATION: { title: string; period: string; description: string }[] = [
  {
    title: '네이버 부스트캠프 웹 풀스택 10기 · 네이버커넥트재단',
    period: '2025.07 - 2026.02',
    description: 'JS/TS 기반 웹 풀스택 과정 이수',
  },
  {
    title: '고려대학교 세종캠퍼스 · 컴퓨터융합소프트웨어학과 학사 졸업',
    period: '2019.03 - 2025.02',
    description: 'GPA 4.4 / 4.5',
  },
  {
    title: '마포고등학교 · 졸업',
    period: '2015.03 - 2018.02',
    description: '',
  },
];

const AWARDS: { title: string; detail: string; date: string }[] = [
  { title: '2025 오픈소스 개발자 대회 동상', detail: 'express-cargo', date: '2025' },
  { title: '졸업 특대생 표창', detail: '고려대학교 과학기술대학 졸업 특대생 선정', date: '2025.02' },
];

export default function AboutPage() {
  return (
    <div className="py-12 space-y-20">
      <ProfileSection />

      {/* Skills Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold border-b border-border-main pb-4">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          {SKILLS.map((group) => (
            <div key={group.category} className="flex items-baseline gap-4">
              <h3 className="w-24 flex-shrink-0 font-bold text-primary">{group.category}</h3>
              <p className="text-text-main">{group.items.join(' · ')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold border-b border-border-main pb-4">Projects</h2>
        <div className="space-y-0">
          {PROJECTS.map((project) => (
            <ProjectItem key={project.title} {...project} />
          ))}
        </div>
      </section>

      {/* Activities Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold border-b border-border-main pb-4">Activities</h2>
        <div className="space-y-8">
          {ACTIVITIES.map((activity) => (
            <ActivityItem key={activity.title} {...activity} />
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold border-b border-border-main pb-4">Education</h2>
        <div className="space-y-6">
          {EDUCATION.map((edu) => (
            <div key={edu.title}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-lg font-bold">{edu.title}</h3>
                <span className="text-sm text-text-sub">{edu.period}</span>
              </div>
              {edu.description && <p className="text-sm text-primary mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Awards Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold border-b border-border-main pb-4">Awards</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AWARDS.map((award) => (
            <li key={award.title}>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <p className="font-semibold">{award.title}</p>
                {award.date && <span className="text-sm text-text-sub">{award.date}</span>}
              </div>
              {award.detail && <p className="text-sm text-text-sub">{award.detail}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ProjectItem({
  title,
  period,
  meta,
  description,
  isLast = false,
}: {
  title: string;
  period: string;
  meta: string;
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
        <div className="flex flex-wrap gap-2 items-center mt-2 mb-4 text-sm">
          <span className="text-text-sub">{period}</span>
          <span className="w-1 h-1 rounded-full bg-text-sub" />
          <span className="text-primary font-medium">{meta}</span>
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

function ActivityItem({ title, period, description }: { title: string; period: string; description: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-text-sub mb-1">{period}</p>
      <p className="text-text-main">{description}</p>
    </div>
  );
}
