import { Message } from '../models/message.js';
import { Answer } from '../models/answer.js';
import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, fromDocRef } from '@angular/fire/compat/firestore';
import {
  Storage,
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage'; //for storage
import { doc } from 'firebase/firestore';
import { resourceLimits } from 'worker_threads';
import { Chatroom } from 'src/models/chatroom.class';

@Injectable({
  providedIn: 'root',
})
export class BackendService implements OnInit {
  mainChatOpen = false;
  directChatOpen = false;
  file: any = {};
  allFiles: any = {};
  url: any = '';
  chatroom!: Chatroom;
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
    chatroom: [],
    channelMessages: [],
    answers: [],
  };
  chatroomExists = [];
  currentChatroomIndex = 0;
  currentChatroom: any = [];
  currentChatroomId = '';
  ngOnInit(): void {
    this.getFromFirestore('user', 'users')
    this.getFromFirestore('channel', 'channels')


  }
  constructor(public firestore: AngularFirestore, public storage: Storage) { }

  // get the actual channel 
  async checkFirebaseContainsChatroom(id) {
    this.chatroomExists = [];
    await this.getFromFirestore('messages', 'messages');
    await this.chatroomAlreadyThere(id);
    if (this.chatroomExists.length == 0) {
      this.chatroom = new Chatroom(this.loggedInUser.id, id);
      setTimeout(() => {
        this.getFromFirestore('chatroom', 'chatroom');
        this.chatroomAlreadyThere(id);

      }, 250)
      this.createInFirestore('chatroom', this.chatroom.toJson());          //Funktionsabbruch
    }
    console.log('currentChatroom is', this.currentChatroom)
  }

  //if chatroom is already there
  chatroomAlreadyThere(id) {
    for (let i = 0; i < this.data.chatroom.length ? this.data.chatroom.length : 0; i++) {
      if (((this.data.chatroom[i].from_user == id || this.data.chatroom[i].from_user == this.loggedInUser.id) &&
        (this.data.chatroom[i].to_user == id || this.data.chatroom[i].to_user == this.loggedInUser.id))) {
        this.chatroomExists = this.data.chatroom[i];
        this.currentChatroom = this.chatroomExists;
        this.currentChatroomIndex = i;
        console.log('currentChatroom is', this.currentChatroom)
      }
    }
    console.log('currentChatroom is', this.currentChatroom)
  }

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

  saveDirectMessage(message: string) {
    let name = this.loggedInUser.name ? this.loggedInUser.name : 'Guest';
    let url = this.file.name ? this.file.name : '';
    let messageObj = new Message(name, message, this.currentChatroom.id, 1, url);
    this.currentChatroom.messages.push(messageObj.toJson());
    this.data.chatroom[this.currentChatroomIndex].messages = this.currentChatroom.messages;
    this.updateInFirestore('chatroom', this.data.chatroom[this.currentChatroomIndex],
      this.currentChatroom.id)
    this.url = '';
  }
  saveMessage(message: string) {
    let name = this.loggedInUser.name ? this.loggedInUser.name : 'Guest';
    let url = this.file.name ? this.file.name : '';
    let messageObj = new Message(name, message, this.currentChannelId, this.loggedInUser.id, url);
    this.createInFirestore('messages', messageObj.toJson());
    this.url = '';
  }
  saveAnswer(message: string, message_id: string) {
    let name = this.loggedInUser.name ? this.loggedInUser.name : 'Guest';
    let answerObj = new Answer(name, message, message_id);
    this.createInFirestore('answers', answerObj.toJson());
    this.url = '';
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

  public async createInFirestore(category: string, objectToSave: any) {
    await this.firestore
      .collection(category)
      .add(objectToSave)
      .then((result: any) => {
        let obj = objectToSave;
        obj.id = result.id;
        this.updateInFirestore(category, obj, result.id);
      });
  }

  //update the Firestore

  public async updateInFirestore(
    category: string,
    objectToUpdate: any,
    elementId: string
  ) {
    await this.firestore
      .collection(category)
      .doc(elementId)
      .update(objectToUpdate)
      .then((result) => {
        console.log(result);
      });
  }

  // get data from Firestore

  public async getFromFirestore(category: string, dataToChange: any) {
    await this.firestore
      .collection(category)
      .valueChanges()
      .subscribe((channels: any) => {
        console.log('channels', channels);
        this.data[dataToChange as keyof typeof this.data] = channels;
        this.filterForUrl();
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
      console.log(reader.result)
    };

    console.log(this.file.name);

    this.addData();
  }

  //Save file in Firebase Storage

  async addData() {
    const storageRef = ref(this.storage, 'image/' + this.file.name);
    const uploadTask = uploadBytesResumable(storageRef, this.file);
    await uploadTask.on(
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

  filterForUrl() {
    if (this.mainChatOpen) {
      this.data.messages.forEach((message) => {
        if (message.url) {
          this.getData(message.url)
        }
      })
    } else if (this.directChatOpen && this.currentChatroom.messages) {
      this.currentChatroom.messages.forEach((message) => {
        if (message.url) {
          this.getData(message.url)
        }
      })
    }

  }
  async getData(picName) {
    const storage = getStorage();
    await getDownloadURL(ref(storage, 'image/' + picName))
      .then((url) => {
        this.allFiles[picName] = url;
        // `url` is the download URL for 'images/stars.jpg'
        console.log('allFiles are', this.allFiles)
      })
  }
}
