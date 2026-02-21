import Image from 'next/image';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GithubIcon } from '@/components/icons/GithubIcon';

export const metadata = {
  title: 'About | Yunio',
  description: 'About Jaehyun Yoon (Yunio)',
};

export default function AboutPage() {
  return (
    <div className="py-12 space-y-20">
      {/* Profile Section */}
      <section className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-bg-sub shadow-xl flex-shrink-0">
          <Image src="/profile.jpg" alt="Profile" fill className="object-cover" priority />
        </div>
        <div className="space-y-5">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Yunio (Jaehyun Yoon)</h1>
            <p className="text-xl text-primary font-medium mt-1">Full Stack Developer</p>
          </div>
          <p className="text-text-main leading-relaxed text-lg">
            호기심을 기술로 실체화하며, 필요한 도구를 신속하게 습득하여 결과를 만드는 개발자입니다.
            <br className="hidden md:block" />
            실행 중심의 학습을 통해 낯선 기술도 빠르게 내재화하며, 지식 공유를 통한 동반 성장을 지향합니다.
          </p>
          <div className="flex justify-center md:justify-start gap-3">
            <Button variant="outline" size="icon" asChild className="rounded-full hover:text-primary hover:border-primary transition-colors">
              <a href="https://github.com/yuchem2" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GithubIcon className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild className="rounded-full hover:text-primary hover:border-primary transition-colors">
              <a href="mailto:yuchem2@gmail.com" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold border-b border-border-main pb-4">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-bg-sub p-6 rounded-xl border border-border-main">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">Backend & Infra</h3>
            <div className="flex flex-wrap gap-2">
              {['Node.js', 'Express', 'Nest.js', 'MongoDB', 'MySQL', 'Redis', 'AWS (S3, EC2, CloudFront, Lambda)'].map((skill) => (
                <span key={skill} className="px-3 py-1 bg-bg-main rounded-md text-sm font-medium border border-border-main">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-bg-sub p-6 rounded-xl border border-border-main">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">Frontend</h3>
            <div className="flex flex-wrap gap-2">
              {['JavaScript', 'TypeScript', 'React.js', 'Next.js'].map((skill) => (
                <span key={skill} className="px-3 py-1 bg-bg-main rounded-md text-sm font-medium border border-border-main">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
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

      {/* Experience & Activities Section */}
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

      {/* Education & Awards Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold border-b border-border-main pb-4">Education & Awards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">Education</h3>
            <div className="space-y-2">
              <p className="font-semibold">고려대학교 세종캠퍼스</p>
              <p className="text-text-sub">컴퓨터융합소프트웨어학과</p>
              <p className="text-sm text-text-sub">2019.03 - 2025.02</p>
              <p className="text-sm text-primary mt-1">전공 평점 4.4/4.5</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">Awards</h3>
            <ul className="space-y-3">
              <li>
                <p className="font-semibold">2025 오픈소스 개발자 대회 동상</p>
                <p className="text-sm text-text-sub">한국오픈소스협회</p>
              </li>
              <li>
                <p className="font-semibold">졸업 특대생 표창</p>
                <p className="text-sm text-text-sub">고려대학교</p>
              </li>
              <li>
                <p className="font-semibold">학기 최우등생 학장상 (2회)</p>
              </li>
              <li>
                <p className="font-semibold">학기 학과 최우등생 표창 (7회)</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

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
        {/* 마지막 아이템이어도 선을 그림. 단, isLast일 때는 그라데이션으로 사라지게 하거나 짧게 처리할 수도 있음. 여기서는 그냥 유지. */}
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

function ActivityItem({ title, period, description }: { title: string; period: string; description: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-text-sub mb-1">{period}</p>
      <p className="text-text-main">{description}</p>
    </div>
  );
}
