export function EducationSection() {
  return (
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
  );
}
