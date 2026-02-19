import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-[50vh]">
      <h2 className="text-6xl font-extrabold text-primary mb-4">404</h2>
      <p className="text-2xl font-semibold text-text-main mb-2">Page Not Found</p>
      <p className="text-text-sub mb-8">Could not find the requested page.</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
