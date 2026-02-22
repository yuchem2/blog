'use client';

import { useEffect, useState, useRef, useMemo, memo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import type { ForceGraphMethods } from 'react-force-graph-2d';
import { BlogPost } from '@/lib/notion-server';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

interface GraphViewProps {
  height?: number;
  posts?: BlogPost[];
}

interface GraphNode {
  id: string;
  name: string;
  val: number;
  type: 'post' | 'project';
  category?: string;
  categoryIndex?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type?: 'project' | 'related';
}

const LIGHT_COLORS = [
  '#FF9AA2',
  '#FFB7B2',
  '#FFDAC1',
  '#E2F0CB',
  '#B5EAD7',
  '#C7CEEA',
  '#F8BBD0',
  '#D291BC',
  '#957DAD',
  '#E0BBE4',
  '#FEC8D8',
  '#FFDFD3',
];

const DARK_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEEAD',
  '#D4A5A5',
  '#9B59B6',
  '#3498DB',
  '#E67E22',
  '#2ECC71',
  '#F1C40F',
  '#E74C3C',
];

const THEME_COLORS = {
  light: {
    textMain: '#1B1B1B',
    linkBase: '31, 41, 55',
  },
  dark: {
    textMain: '#E0E0E0',
    linkBase: '162, 169, 176',
  },
};

const GRAPH_WIDTH = 254;

function GraphViewComponent({ height = 200, posts = [] }: GraphViewProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const router = useRouter();

  const resolvedThemeRef = useRef(resolvedTheme);
  const categoryColorMapRef = useRef<Record<string, string>>({});
  const themeColorsRef = useRef<Record<string, string>>({});

  const { graphData, categories } = useMemo(() => {
    if (posts.length === 0) {
      return { graphData: { nodes: [], links: [] }, categories: [] };
    }

    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
    const categoryIndexMap: Record<string, number> = {};
    categories.forEach((cat, index) => {
      categoryIndexMap[cat] = index;
    });

    const projects = new Set<string>();
    posts.forEach((post) => {
      if (post.project) {
        projects.add(post.project);
      }
    });

    projects.forEach((project) => {
      nodes.push({
        id: `proj-${project}`,
        name: project,
        val: 3,
        type: 'project',
      });
    });

    posts.forEach((post) => {
      nodes.push({
        id: post.id,
        name: post.title,
        category: post.category,
        val: 4,
        type: 'post',
        categoryIndex: post.category ? categoryIndexMap[post.category] : -1,
      });

      if (post.project) {
        links.push({
          source: `proj-${post.project}`,
          target: post.id,
          type: 'project',
        });
      }

      if (post.relatedPosts && post.relatedPosts.length > 0) {
        post.relatedPosts.forEach((relatedId) => {
          const relatedPostExists = posts.some((p) => p.id === relatedId);
          if (relatedPostExists) {
            links.push({
              source: post.id,
              target: relatedId,
              type: 'related',
            });
          }
        });
      }
    });

    return { graphData: { nodes, links }, categories };
  }, [posts]);

  const categoryColorMap = useMemo(() => {
    const colors = resolvedTheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
    const map: Record<string, string> = {};
    categories.forEach((cat, index) => {
      map[cat] = colors[index % colors.length];
    });
    return map;
  }, [categories, resolvedTheme]);

  const themeColors = useMemo(() => {
    return resolvedTheme === 'dark' ? THEME_COLORS.dark : THEME_COLORS.light;
  }, [resolvedTheme]);

  const getNodeColor = useCallback((node: object) => {
    const n = node as GraphNode;

    if (n.category) return categoryColorMapRef.current[n.category];
    return themeColorsRef.current.textMain;
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    resolvedThemeRef.current = resolvedTheme;
    categoryColorMapRef.current = categoryColorMap;
    themeColorsRef.current = themeColors;
  }, [resolvedTheme, categoryColorMap, themeColors]);

  if (!mounted) return <div className="w-full h-[200px] bg-bg-sub rounded-xl animate-pulse" />;

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="rounded-xl overflow-hidden border border-border-main bg-bg-sub relative max-w-full" style={{ width: GRAPH_WIDTH, height }}>
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <ForceGraph2D
            ref={fgRef}
            width={GRAPH_WIDTH}
            height={height}
            graphData={graphData}
            nodeLabel="name"
            nodeColor={getNodeColor}
            nodeVal="val"
            nodeRelSize={4}
            linkCanvasObjectMode={() => 'replace'}
            linkCanvasObject={(link, ctx) => {
              const l = link as GraphLink;
              const { linkBase } = themeColorsRef.current;

              if (typeof link.source === 'object' && typeof link.target === 'object') {
                const { x: sx, y: sy } = link.source;
                const { x: tx, y: ty } = link.target;

                if (sx == null || sy == null || tx == null || ty == null) return;

                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(tx, ty);

                ctx.strokeStyle = l.type === 'project' ? `rgba(${linkBase}, 0.7)` : `rgba(${linkBase}, 0.5)`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }}
            backgroundColor="rgba(0,0,0,0)"
            enableZoomInteraction={true}
            enableNodeDrag={false}
            cooldownTicks={200}
            warmupTicks={100}
            onEngineStop={() => {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  fgRef.current?.zoomToFit(400, 20);
                }, 50);
              });
            }}
            onNodeClick={(node: object) => {
              const graphNode = node as GraphNode;
              if (graphNode.type === 'post') {
                router.push(`/post/${graphNode.id}`);
              } else if (graphNode.type === 'project') {
                router.push(`/?project=${graphNode.name}`);
              }
            }}
          />
        </div>
        <div className="absolute bottom-2 right-2 text-[10px] text-text-sub opacity-50 pointer-events-none">Scroll to Zoom</div>
      </div>

      <div className="flex flex-wrap gap-2 px-1 justify-start w-full">
        {Object.entries(categoryColorMap).map(([category, color]) => (
          <div key={category} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-text-sub">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const GraphView = memo(GraphViewComponent, (prevProps, nextProps) => {
  const prevPosts = prevProps.posts || [];
  const nextPosts = nextProps.posts || [];

  if (prevPosts.length !== nextPosts.length) return false;
  if (prevPosts.length > 0 && nextPosts.length > 0) {
    if (prevPosts[0].id !== nextPosts[0].id) return false;
  }

  if (prevProps.height !== nextProps.height) return false;

  return true;
});
