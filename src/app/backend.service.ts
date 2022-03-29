import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  loggedInUser: string = '';
  constructor() { }

  public setTheLoggedInUser(user: string) {
    this.loggedInUser = user;

  }
}
