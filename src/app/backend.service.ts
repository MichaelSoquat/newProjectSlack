import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  [x: string]: any;
  loggedInUser: string = '';

  data = {
    channels: [
      {
        id: '',
        is_private: false,
        name: '',
        messages: [],
      },
    ],
    users: [
      {
        id: '1',
        first_name: 'Max',
        last_name: 'Mustermann',
        email: 'xy@gmail.com',
        image: 'https://i.pravatar.cc/24?img=1',
      },
    ],
  };

  constructor(public firestore: AngularFirestore) {}

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

  public updateInFirestore(
    category: string,
    objectToUpdate: any,
    elementId: string
  ) {
    this.firestore
      .collection(category)
      .doc(elementId)
      .update(objectToUpdate)
      .then((result) => {
        console.log(result);
      });
  }

  public getFromFirestore(category: string, dataToChange: any) {
    this.firestore
      .collection(category)
      .valueChanges()
      .subscribe((channels: any) => {
        this.data[dataToChange as keyof typeof this.data] = channels;
      });
  }
}
