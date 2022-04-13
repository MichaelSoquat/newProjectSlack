import { ElementRef, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { TabIndex } from '../interface/TabIndex.interface';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  signupTrue:boolean;
  isloggedIn = false
  constructor(public firebaseAuth: AngularFireAuth,
    public backend: BackendService, private router: Router) {
  }

  async signin(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(response => {
        this.isloggedIn = true;
        localStorage.setItem('user', JSON.stringify(response.user))
        console.log('user is', response.user);
        this.router.navigate(['/main']);
      }).catch(function(error) {// Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
          this.signupTrue = false;
        } else {
          alert(errorMessage);
          this.signupTrue = false;
        }
        this.signupTrue = false;
        console.log(error);
      });}

  // sign up with email and password

  async signup(email: string, password: string, tabIndex: TabIndex) {
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(response => {
        this.isloggedIn = true;
        localStorage.setItem('user', JSON.stringify(response.user))
        this.signupTrue = true;
        alert('you are now signed up');
        tabIndex.index = 0;
      }).catch(function(error) {// Handle Errors here.
        var errorMessage = error.message;
        alert(errorMessage);
        console.log(error);
  });}

  // logout

  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}