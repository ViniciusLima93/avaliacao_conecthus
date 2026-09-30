import type { ReactNode } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Diálogo de confirmação compacto (ex.: "Deseja excluir?" com Não / Sim). */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Sim',
  cancelLabel = 'Não',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      variant="alert"
      onClose={loading ? () => undefined : onCancel}
      footer={
        <>
          <Button $variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button $variant="confirm" onClick={onConfirm} disabled={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {description}
    </Modal>
  );
}
