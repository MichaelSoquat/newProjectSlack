import { Message } from '../models/message.js';
import { Answer } from '../models/answer.js';
import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, fromDocRef } from '@angular/fire/compat/firestore';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage'; //for storage
import { doc } from 'firebase/firestore';
import { resourceLimits } from 'worker_threads';

@Injectable({
  providedIn: 'root',
})
export class BackendService implements OnInit {
  file: any = {};
  url: any = '';
  loggedInUser = {
    id: '',
    name: '',
    email: '',
    image: '',
  };
  currentChannelIndex = 0;
  currentChannelId: string = '';
  currentChannel = {
    id: '',
    is_private: false,
    name: '',
    messages: [],
    writtenFrom: [],
    timeStamps: [],
  };
  data = {
    channels: [
      {
        id: '',
        is_private: false,
        name: '',
        messages: [],
        writtenFrom: [],
        timeStamps: [],
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
    messages: [],
    channelMessages: [],
    answers: [],
  };
  ngOnInit(): void {
    this.getFromFirestore('user', 'users'),
      this.getFromFirestore('channel', 'channels');
    this.getFromFirestore('messages', 'messages');

    //this.getChannelMessages(this.currentChannelId);
  }
  constructor(public firestore: AngularFirestore, public storage: Storage) {}

  // get the actual channel

  getCurrentChannel(id: any) {
    for (let i = 0; i < this.data.channels.length; i++) {
      console.log('id is ', id, 'id of channel is', this.data.channels[i].id);
      if (id == this.data.channels[i].id) {
        this.currentChannel = this.data.channels[i];
        this.currentChannelIndex = i;
        this.currentChannelId = id;
      }
    }

    //this.getFromFirestore('messages', 'messages');
    //this.getChannelMessages(this.currentChannelId);
    this.getFromFirestoreById(
      'messages',
      'channelMessages',
      this.currentChannelId
    );
  }

  openThread(message_id) {
    this.getFromFirestoreById2('answers', 'answers', message_id);
    console.log('Right Data', this.data.answers);
  }
  F2;
  getChannelMessages(messages, channel_id) {
    return messages.filter((message) => {
      return message.channel_id === channel_id;
    });
  }

  saveMessage(message: string) {
    let name = this.loggedInUser.name ? this.loggedInUser.name : 'Guest';
    let messageObj = new Message(name, message, this.currentChannelId);
    this.createInFirestore('messages', messageObj.toJson());
  }
  saveAnswer(message: string, message_id: string) {
    let name = this.loggedInUser.name ? this.loggedInUser.name : 'Hugo';
    let answerObj = new Answer(name, message, message_id);
    this.createInFirestore('answers', answerObj.toJson());
  }

  // save the actual channel and update it to firestore

  saveCurrentChannel() {
    this.data.channels[this.currentChannelIndex] = this.currentChannel;
    this.updateInFirestore(
      'channel',
      this.data.channels[this.currentChannelIndex],
      this.currentChannelId
    );
  }

  // get the logged in user

  public setTheLoggedInUser(email: any) {
    for (let i = 0; i < this.data.users.length; i++) {
      if (email == this.data.users[i].email) {
        this.loggedInUser = this.data.users[i];
      }
    }
  }

  //create smth. new in Firestore

  public createInFirestore(category: string, objectToSave: any) {
    this.firestore
      .collection(category)
      .add(objectToSave)
      .then((result: any) => {
        if (category == 'channel') {
          this.updateDocumentIdToId(objectToSave, result);
        }
        if (category === 'messages') {
          let obj = objectToSave;
          obj.id = result.id;
          this.updateInFirestore('messages', obj, result.id);
        }
      });
  }

  // get same id like document id

  updateDocumentIdToId(objectToSave, result) {
    this.currentChannel = objectToSave;
    this.currentChannel.id = result.id;
    let get = this.data.channels.findIndex((el) => {
      return el.name == this.currentChannel.name;
    });
    this.currentChannelIndex = get;
    this.data.channels[this.currentChannelIndex].id = this.currentChannel.id;

    this.updateInFirestore(
      'channel',
      this.data.channels[this.currentChannelIndex],
      this.data.channels[this.currentChannelIndex].id
    );
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
  }

  //
  public getFromFirestoreById(category: string, dataToChange: any, id: any) {
    this.firestore
      .collection(category)
      .valueChanges()
      .subscribe((messages: any) => {
        let filteredMessages = this.getChannelMessages(messages, id);
        filteredMessages.sort((m1, m2) => m1.time > m2.time);
        this.data[dataToChange as keyof typeof this.data] = filteredMessages;
        console.log('Gefilterten Nachrichten: ', filteredMessages);
        console.log(this.data[dataToChange as keyof typeof this.data]);
        console.log(this.data['channelMessages']);
      });
  }

  public getFromFirestoreById2(category: string, dataToChange: any, id: any) {
    this.firestore
      .collection(category)
      .valueChanges()
      .subscribe((messages: any) => {
        let filteredMessages = this.getFilteredAnswers(messages, id);
        filteredMessages.sort((m1, m2) => m1.time > m2.time);
        this.data[dataToChange as keyof typeof this.data] = filteredMessages;
        console.log('2::::', this.data.answers);
      });
  }

  getFilteredAnswers(answers, message_id) {
    return answers.filter((answer) => {
      console.log(answer.message_id, '   ', message_id);

      return answer.message_id == message_id;
    });
  }

  //Select file name

  chooseFile(event: any) {
    console.log(this.file);
    this.file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.url = reader.result;
    };

    console.log(this.file.name);
    this.addData();
  }

  //Save file in Firebase Storage

  addData() {
    const storageRef = ref(this.storage, this.file.name);
    const uploadTask = uploadBytesResumable(storageRef, this.file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
  }
}
