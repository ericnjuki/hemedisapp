// https://hackernoon.com/global-http-request-error-catching-in-angular-486a319f59ab
// with a few mods..

import { Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend } from '@angular/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx'

// operators
// import 'rxjs/add/observable/throw'
// import 'rxjs/add/operator/map'
import { catchError, delayWhen, tap, retryWhen } from 'rxjs/operators'
import { timer } from 'rxjs/observable/timer';
import { HttpErrorResponse } from '@angular/common/http';
import { NpServerError, NpClientError } from './np.errors';
import { ToastyService, ToastOptions, ToastData } from 'ng2-toasty';

@Injectable()
export class HttpInterceptor extends Http {

  constructor(
      backend: XHRBackend,
      options: RequestOptions,
      // public http: Http,
      private toastyService: ToastyService
  ) {
      super(backend, options)
  }

  public request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options)
      .pipe(
        catchError( (err, caught) => {
          return this.handleError(err);
        })
      )
  }

  public handleError (error: HttpErrorResponse) {
    const errorTitle = 'ERROR';
    // seperating client and server errors as the former causes me to suggest a page reload
    // the latter tell the client to contact me...
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      // log this to my error logging system (I don't have one at the moment)

      // tell the user
      const clientErrorMessage = 'There seems to be an error, please restart the app'
      this.addToast('error', errorTitle, clientErrorMessage, 100000);
      // pass an app-specific error to the error handler
      return Observable.throw(new NpClientError());
    } else {
      // // The backend returned an unsuccessful response code.
      // // The response body may contain clues as to what went wrong,
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error}`);

      // should probably switch the error.status with all http error types expected
      // from my backend, and handle them in different ways (best case I see here is custom messages
      // ...much help that is if the error causes my app to be unusable :( )
      // but to hell with that, I'm logging them on the server anyway

      const serverErrorMessage = 'Please restart the app. If this error persists, please contact Eric'
      this.addToast('error', errorTitle, serverErrorMessage, 10000);
      return Observable.throw(new NpServerError());
    }
  }

  addToast(toastType: string, title: string, message: string, timeout = 3000) {
    let toastId;
    const toastOptions: ToastOptions = {
      title: '',
      onAdd: (toast: ToastData) => {
        toastId = toast.id
      }
    };
    toastOptions.title = title;
    toastOptions.msg = message;
    toastOptions.timeout = timeout;
    toastOptions.theme = 'bootstrap';

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
}
