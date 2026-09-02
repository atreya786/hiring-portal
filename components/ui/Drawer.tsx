'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'bottom' | 'right';
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'bottom',
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {position === 'bottom' ? (
        <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5" />
          <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">{title || 'Filters'}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-5 overflow-y-auto flex-1">{children}</div>
        </div>
      ) : (
        <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl border-l border-slate-200 flex flex-col z-10 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-5 overflow-y-auto flex-1">{children}</div>
        </div>
      )}
    </div>
  );
}
