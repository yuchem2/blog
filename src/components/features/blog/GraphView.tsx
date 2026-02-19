'use client';

import { useEffect, useState, useRef, useMemo, memo } from 'react';
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
  color: string;
  type: 'post' | 'project';
  category?: string;
}

interface GraphLink {
  source: string;
  target: string;
  color: string;
}

const CATEGORY_COLORS = [
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

const GRAPH_WIDTH = 254;

function GraphViewComponent({ height = 200, posts = [] }: GraphViewProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const { nodes, links, categoryColorMap } = useMemo(() => {
    if (posts.length === 0) return { nodes: [], links: [], categoryColorMap: {} };

    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
    const categoryColorMap: Record<string, string> = {};
    categories.forEach((cat, index) => {
      categoryColorMap[cat] = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
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
        color: resolvedTheme === 'dark' ? '#444' : '#ccc',
        type: 'project',
      });
    });

    posts.forEach((post) => {
      nodes.push({
        id: post.id,
        name: post.title,
        category: post.category,
        val: 5,
        color: post.category ? categoryColorMap[post.category] : resolvedTheme === 'dark' ? '#888' : '#999',
        type: 'post',
      });

      if (post.project) {
        links.push({
          source: `proj-${post.project}`,
          target: post.id,
          color: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        });
      }
    });

    const categoryGroups: Record<string, BlogPost[]> = {};
    posts.forEach((post) => {
      if (post.category) {
        if (!categoryGroups[post.category]) categoryGroups[post.category] = [];
        categoryGroups[post.category].push(post);
      }
    });

    Object.values(categoryGroups).forEach((group) => {
      for (let i = 0; i < group.length - 1; i++) {
        links.push({
          source: group[i].id,
          target: group[i + 1].id,
          color: 'rgba(0,0,0,0)',
        });
      }
    });

    return { nodes, links, categoryColorMap };
  }, [posts, resolvedTheme]);

  if (!mounted) return <div className="w-full h-[200px] bg-bg-sub rounded-xl animate-pulse" />;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="rounded-xl overflow-hidden border border-border-main bg-bg-sub relative max-w-full" style={{ width: GRAPH_WIDTH, height }}>
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <ForceGraph2D
            ref={fgRef}
            width={GRAPH_WIDTH}
            height={height}
            graphData={{ nodes, links }}
            nodeLabel="name"
            nodeColor="color"
            nodeRelSize={4}
            linkColor={(link: object) => (link as GraphLink).color}
            backgroundColor={isDark ? '#2D2D2D' : '#f3f4f6'}
            enableZoomInteraction={true}
            enableNodeDrag={false}
            cooldownTicks={100}
            onEngineStop={() => fgRef.current?.zoomToFit(400)}
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
