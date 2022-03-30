import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root',
})
export class BackendService {
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

  constructor(public firestore: AngularFirestore, public storage: Storage) { }

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

  file: any = {};

  chooseFile(event: any) {
    console.log(this.file)
    this.file = event.target.files[0];
    console.log(this.file.name)
    this.addData();

  }
  addData() {
    const storageRef = ref(this.storage, this.file.name);
    const uploadTask = uploadBytesResumable(storageRef, this.file)
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
      });
    }
    )
  }

}
