import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  isSignedIn = false;
  constructor(public firebaseService: FirebaseService) {}

  ngOnInit(): void {
    if(localStorage.getItem('user')!== null)
    this.isSignedIn = true
    else
    this.isSignedIn = false
  }

  async onSignup(email: string, password: string){
    await this.firebaseService.signup(email, password)
    if(this.firebaseService.isloggedIn)
    this.isSignedIn = true;
  }
  async onSignin(email: string, password: string){
    await this.firebaseService.signin(email, password)
    if(this.firebaseService.isloggedIn)
    this.isSignedIn = true;
  }
}




