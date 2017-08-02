import { Component, OnInit } from '@angular/core';
import { UserService } from "app/users.service";
import { GridData } from "app/griddata.model";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styles: []
})
export class UserListComponent implements OnInit {
  gridData:GridData = new GridData();
  constructor(private _userService: UserService) { }

  ngOnInit() {
    this._userService.getUsers()
      .subscribe(userData => this.gridData = userData);
   

  }

}
