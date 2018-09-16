import { ErrorHandler } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NpServerError, NpClientError } from './np.errors';

export class NpErrorHandler extends ErrorHandler {

  constructor() {
    super();
  }

  handleError(error) {
    if (error instanceof Observable) {
      error.subscribe(realError => {
        switch (true) {
          case realError instanceof NpClientError:
            console.log('Try restarting the app');
            break;
          case realError instanceof NpServerError:
            console.log('Contact Eric')
            break;
          default:
            console.error(realError);
            break;
        }
      })
    } else {
      super.handleError(error);
    }
  }
}
