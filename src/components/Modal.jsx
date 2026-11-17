import { useEffect, useRef } from 'react';

export default function Modal({ children, labelledBy, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (trigger?.isConnected) trigger.focus();
      else document.querySelector('[data-add-task]')?.focus();
    };
  }, []);
  return <dialog ref={ref} aria-labelledby={labelledBy}
    onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const controls = [...ref.current.querySelectorAll('button, input, textarea, select, a[href], [tabindex]')]
        .filter(element => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
    }}
    onCancel={event => { event.preventDefault(); onClose(); }}
    className="task-modal m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-6 text-gray-800 shadow-xl backdrop:bg-black/50">
    {children}
  </dialog>;
}
