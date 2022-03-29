import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailAuthCredential } from 'firebase/auth';
import { BackendService } from '../backend.service';
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {


  isSignedIn = false;
  email: string = '';
  password: string = '';

  constructor(private router: Router, public backend: BackendService, public firebaseService: FirebaseService) { }

  ngOnInit(): void {
    if (localStorage.getItem('user') !== null)
      this.isSignedIn = true
    else
      this.isSignedIn = false
  }

  async onSignup(email: string, password: string) {
    await this.firebaseService.signup(email, password)
    if (this.firebaseService.isloggedIn)
      this.isSignedIn = true;
  }
  async onSignin(email: string, password: string) {
    await this.firebaseService.signin(email, password)
    if (this.firebaseService.isloggedIn)
      this.isSignedIn = true;
    this.email = email;
    this.getUserInfos();
  }

  getUserInfos() {
    this.backend.setTheLoggedInUser(this.email)
    this.router.navigate(['/'])  //login navigate to main side
  }



  handleLogout() {
    this.isSignedIn = false;
  }
}




