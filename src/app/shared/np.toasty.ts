import { ToastOptions, ToastData } from 'ng2-toasty';

export enum toastOpts {

}
export function addToast(toastType: string, message: string, timeout = 3000) {
  let toastId;
  const toastOptions: ToastOptions = {
    title: '',
    onAdd: (toast: ToastData) => {
      toastId = toast.id
    }
  };
  toastOptions.title = '';
  toastOptions.msg = message;
  toastOptions.theme = 'bootstrap';
  toastOptions.timeout = timeout;

  switch (toastType) {
    case 'wait':
      this.toastyService.wait(toastOptions);
      break;
    case 'info':
      this.toastyService.info(toastOptions);
      break;
    case 'success':
      this.toastyService.success(toastOptions);
      break;
    case 'warning':
      this.toastyService.warning(toastOptions);
      break;
    case 'error':
      this.toastyService.error(toastOptions);
      break;
    default:
      this.toastyService.default(toastOptions);
  }
  return toastId;
}
