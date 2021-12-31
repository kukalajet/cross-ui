export type ModalSize = 'small' | 'medium' | 'large';
export type ModalProps = {
  open: boolean;
  label?: string;
  description?: string;
  size?: ModalSize;
  children: React.ReactElement;
  withClose?: boolean;
  onDismiss?: () => void;
  onRemove?: () => void;
};
