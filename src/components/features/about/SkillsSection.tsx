export function SkillsSection() {
  return (
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
  );
}
