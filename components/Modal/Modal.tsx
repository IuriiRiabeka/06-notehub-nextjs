'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onCancel?: () => void; // Optional onCancel prop
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
     if (!isOpen) return;
     
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
     document.body.style.overflow = "hidden";
    return () => {
       document.body.style.overflow = "";
      window.removeEventListener('keydown', handler);}
  }, [isOpen, onClose]);
  

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) onClose();
  };
  if (!isOpen) return null;

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdrop}>
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
}
