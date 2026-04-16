// @file app/wishlist/page.tsx
import { ToastProvider } from '@/components/ui/toast';
import { WishlistBoard } from '@/components/wishlist/wishlist-board';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feature Wishlist',
  description:
    'Vote for and submit feature requests for OathMesh. Community-driven, transparent, and open.',
};

export const revalidate = 60;

export default function WishlistPage() {
  return (
    <div className="min-h-screen pt-32 bg-transparent relative">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 relative z-10">
        <WishlistBoard />
      </div>
      <ToastProvider />
      </div>
  );
}
