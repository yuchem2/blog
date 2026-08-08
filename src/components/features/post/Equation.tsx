import katex from 'katex';

interface EquationProps {
  expression: string;
  displayMode?: boolean;
}

/**
 * Notion의 수식(equation)을 KaTeX로 렌더링한다.
 * renderToString은 SSR 단계에서 실행되므로 하이드레이션 전에도 수식이 그대로 보이며,
 * 본문 중간에 끼어드는 인라인 수식에서 레이아웃이 흔들리지 않는다.
 */
export function Equation({ expression, displayMode = false }: EquationProps) {
  // throwOnError: false → 잘못된 문법은 예외 대신 errorColor로 원문을 표시해 본문 렌더가 중단되지 않는다.
  const html = katex.renderToString(expression, {
    displayMode,
    throwOnError: false,
    strict: false,
    output: 'htmlAndMathml',
    errorColor: 'var(--destructive)',
  });

  if (displayMode) {
    // 긴 수식이 본문 폭을 넘어가면 잘리지 않도록 가로 스크롤을 허용한다.
    return <div className="my-6 py-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
