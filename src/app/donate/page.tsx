// @file app/donate/page.tsx
import { DonateClientForm } from '@/components/donate/donate-client-form';
import { DonorWall } from '@/components/donate/donor-wall';
import { ToastProvider } from '@/components/ui/toast';
import { Suspense } from 'react';

export default function DonatePage() {
  return (
    <div className="min-h-screen pt-32 bg-transparent relative">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <DonateClientForm />

        {/* Donor wall */}
        <div className="mt-20 border-t border-white/[0.04] pt-16">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-white text-center">
            Supporters
          </h2>
          <Suspense
            fallback={
              <p className="text-center text-[14px] text-white/40 py-8 animate-pulse">
                Loading supporters…
              </p>
            }
          >
            <DonorWall />
          </Suspense>
        </div>
      </div>
      <ToastProvider />
    </div>
  );
}
