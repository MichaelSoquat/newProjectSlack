import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailAuthCredential } from 'firebase/auth';
import { Channel } from 'src/models/channel.class';
import { Chatroom } from 'src/models/chatroom.class';
import { User } from 'src/models/user.class';
import { BackendService } from '../backend.service';
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  user!: User;
  chatroom!: Chatroom;
  isSignedIn = false;
  email: string = '';
  password: string = '';
  username: any;

  constructor(private router: Router, public backend: BackendService, public firebaseService: FirebaseService) { }

  ngOnInit(): void {
    if (localStorage.getItem('user') !== null)
      this.isSignedIn = true
    else
      this.isSignedIn = false
  }

  // register

  async onSignup(email: string, password: string, username: string) {
    this.username = username;
    this.email = email;
    await this.firebaseService.signup(email, password)
    if (this.firebaseService.isloggedIn)
      this.isSignedIn = true;
    await this.createUserJson();
  }

  // sign in and get user infos

  async onSignin(email: string, password: string) {
    await this.firebaseService.signin(email, password)
    if (this.firebaseService.isloggedIn)
      this.isSignedIn = true;
    this.email = email;
    this.getUserInfos();
  }

  // checks if email is part of all user emails and selects the logged in user

  async getUserInfos() {
    await this.backend.setTheLoggedInUser(this.email)
    this.router.navigate(['/'])  //login navigate to main side
  }

  //if logout the user is not signed in anymore
  
  handleLogout() {
    this.isSignedIn = false;
  }

  // creates a new user json with user module
  createUserJson() {
    this.user = new User(this.username, this.email);
    this.addNewUserToFirebase();
  }


  // saves user json in Firestore

  addNewUserToFirebase() {
    this.backend.createInFirestore('user', this.user.toJson())
  }

}




