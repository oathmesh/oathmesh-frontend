// @file app/wishlist/page.tsx
import type { Metadata } from 'next';
import { WishlistBoard } from '@/components/wishlist/wishlist-board';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'Feature Wishlist',
  description:
    'Vote for and submit feature requests for OathMesh. Community-driven, transparent, and open.',
};

export const revalidate = 60;

export default function WishlistPage() {
  return (
    <div className="min-h-screen pt-14">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <WishlistBoard />
      </div>
      <ToastProvider />
    </div>
  );
}
