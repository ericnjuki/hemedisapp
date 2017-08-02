import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
    private _url: string = "http://localhost:58303/api/values/getgriddata";
    constructor(private _http: Http) {

    }
     getUsers() {
        return this._http.get(this._url)
        .map((response: Response) => response.json());
      
    }
}