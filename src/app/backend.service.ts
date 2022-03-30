import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  [x: string]: any;
  loggedInUser: string = '';
  channels = [
    {
      id: '',
      is_private: false,
      name: '',
      messages: [],
    },
  ];

  constructor(public firestore: AngularFirestore) { }

  public setTheLoggedInUser(user: string) {
    this.loggedInUser = user;

  }

  public createInFirestore(category: string, objectToSave: any) {

    this.firestore
      .collection(category)
      .add(objectToSave)
      .then((result: any) => {
        console.log(result);
      });
  }


  public updateInFirestore(category: string, objectToUpdate: any, elementId: string) {

    this.firestore
      .collection(category)
      .doc(elementId)
      .update(objectToUpdate)
      .then((result) => {
        console.log(result);
      });
  }

  public getFromFirestore(category: string, x: any) {

    this.firestore
      .collection(category)
      .valueChanges()
      .subscribe((channels: any) => {
        console.log(channels)
      });
  }
}
