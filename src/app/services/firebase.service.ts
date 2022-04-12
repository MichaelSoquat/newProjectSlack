import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth";
import { BackendService } from '../backend.service';


@Injectable({
  providedIn: 'root'
})


export class FirebaseService {


  isloggedIn = false
  constructor(public firebaseAuth: AngularFireAuth,
    public backend: BackendService) {

  }




  async signin(email: string, password: string) {
    // this.firebaseAuth.onAuthStateChanged(function (user) {
    //   if (user) {

    //     this.isloggedIn = true;

    //   } else {

    //     this.isloggedIn = false;
    //   }
    //   console.log(this.isloggedIn)
    // });
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(response => {
        this.isloggedIn = true;
        localStorage.setItem('user', JSON.stringify(response.user))
        console.log('user is', response.user)
      })
  }

  // sign up with email and password

  async signup(email: string, password: string) {
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(response => {
        this.isloggedIn = true;
        localStorage.setItem('user', JSON.stringify(response.user))
      })
  }

  // logout

  logout() {
    // this.firebaseAuth.signOut();
    // localStorage.removeItem('user')
  }
}