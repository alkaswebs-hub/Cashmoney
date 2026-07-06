'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-[#0A0F24] group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-white/60',
          actionButton:
            'group-[.toast]:bg-brand-500 group-[.toast]:text-ink-900',
          cancelButton:
            'group-[.toast]:bg-white/10 group-[.toast]:text-white/60',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
