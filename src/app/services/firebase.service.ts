import { ElementRef, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { TabIndex } from '../interface/TabIndex.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogExampleComponent } from '../dialog-example/dialog-example.component';
import { AuthenticationComponent } from '../authentication/authentication.component';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  isloggedIn = false
  constructor(public firebaseAuth: AngularFireAuth,
    public backend: BackendService, private router: Router, public dialog: MatDialog,) {
  }

  async signin(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(response => {
        this.isloggedIn = true;
        localStorage.setItem('user', JSON.stringify(response.user))
        console.log('user is', response.user);
        this.router.navigate(['/main']);
      }).catch(function (error) {// Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        document.querySelector('.Loginerror').innerHTML = errorMessage;
        console.log(error);
      });
  }

  // sign up with email and password

  async signup(email: string, password: string, tabIndex: TabIndex) {
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(response => {
        this.isloggedIn = true;
        localStorage.setItem('user', JSON.stringify(response.user));
        this.dialog.open(DialogExampleComponent);
        document.querySelector('.error').innerHTML = '';
        tabIndex.index = 0;
      }).catch(function (error) {// Handle Errors here.
        var errorMessage = error.message;
        document.querySelector('.error').innerHTML = errorMessage;
      });
  }

  // logout

  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}