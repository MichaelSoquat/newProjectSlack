import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage'; //for storage
import { doc } from 'firebase/firestore';
import { resourceLimits } from 'worker_threads';


@Injectable({
  providedIn: 'root',
})
export class BackendService implements OnInit {
  file: any = {};
  loggedInUser = {
    id: '',
    name: '',
    email: '',
    image: ''
  };
  currentChannelIndex = 0;
  currentChannelId: string = '';
  currentChannel = {
    id: '',
    is_private: false,
    name: '',
    messages: [],
    writtenForm: [],
    timeStamps: []


  }
  data = {
    channels: [
      {
        id: '',
        is_private: false,
        name: '',
        messages: [],
        writtenForm: [],
        timeStamps: []
      },
    ],
    users: [
      {
        id: '1',
        name: '',
        email: 'xy@gmail.com',
        image: 'https://i.pravatar.cc/24?img=1',
      },
    ],
  };
  ngOnInit(): void {
    this.getFromFirestore('user', 'users'),
      this.getFromFirestore('channel', 'channels')


  }
  constructor(public firestore: AngularFirestore, public storage: Storage) { }


  // get the actual channel

  getCurrentChannel(id: any) {
    for (let i = 0; i < this.data.channels.length; i++) {
      console.log('id is ', id, 'id of channel is', this.data.channels[i].id)
      if (id == this.data.channels[i].id) {
        this.currentChannel = this.data.channels[i];
        this.currentChannelIndex = i;
        this.currentChannelId = id;
      }
    }
  }

  // save the actual channel and update it to firestore

  saveCurrentChannel() {
    this.data.channels[this.currentChannelIndex] = this.currentChannel;
    this.updateInFirestore('channel', this.data.channels[this.currentChannelIndex], this.currentChannelId)
  }

  // get the logged in user

  public setTheLoggedInUser(email: any) {
    console.log('user is', email, 'all users are', this.data.users)
    for (let i = 0; i < this.data.users.length; i++) {
      if (email == this.data.users[i].email) {
        this.loggedInUser = this.data.users[i];
      }
      console.log('logged in user is', this.loggedInUser)
    }
  }

  //create smth. new in Firestore

  public createInFirestore(category: string, objectToSave: any) {

    this.firestore
      .collection(category)
      .add(objectToSave)
      .then((result: any) => {
        if (category == "channel") {
          this.updateDocumentIdToId(objectToSave, result)
        }
      });
  }

  // get same id like document id

  updateDocumentIdToId(objectToSave, result) {
    this.currentChannel = objectToSave;
    this.currentChannel.id = result.id;
    let get = this.data.channels.findIndex((el) => {
      return el.name == this.currentChannel.name
    })
    this.currentChannelIndex = get;
    this.data.channels[this.currentChannelIndex].id = this.currentChannel.id;
    console.log(this.data.channels)
    this.updateInFirestore('channel', this.data.channels[this.currentChannelIndex], this.data.channels[this.currentChannelIndex].id)

  }

  //update the Firestore 

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

  // get data from Firestore

  public getFromFirestore(category: string, dataToChange: any) {
    this.firestore
      .collection(category)
      .valueChanges()
      .subscribe((channels: any) => {
        this.data[dataToChange as keyof typeof this.data] = channels;
      });
    console.log(this.data.channels)
  }





  //Select file name

  chooseFile(event: any) {
    console.log(this.file)
    this.file = event.target.files[0];
    console.log(this.file.name)
    this.addData();

  }

  //Save file in Firebase Storage

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
