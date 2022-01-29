export { Icon, Button, TextInput, Modal, Select, Popover } from './components';
export { CrossProvider } from './providers';

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a + b * 1000);
}
