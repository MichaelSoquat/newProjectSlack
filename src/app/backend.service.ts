import { Message } from '../models/message.js';
import { Answer } from '../models/answer.js';
import { Injectable, Input, OnInit, ɵɵclassMapInterpolate1 } from '@angular/core';
import { AngularFirestore, fromDocRef } from '@angular/fire/compat/firestore';
import {
  Storage,
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage'; //for storage
import { Chatroom } from 'src/models/chatroom.class';

@Injectable({
  providedIn: 'root',
})
export class BackendService implements OnInit {
  pictureUploadedFromMainChat = false;
  threadOpened = false;
  mainChatOpen = false;
  directChatOpen = false;
  file: any = {};
  allFiles: any = {};
  url: any = '';
  chatroom!: Chatroom;
  loggedInUser: any = {
    name: '',
    id: '',
    email: '',
    image: ''
  }
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
    chatHeading: '',
  };
  chatroomExists = [];
  currentChatroomIndex = 0;
  currentChatroom: any = [];
  currentChatroomId = '';


  ngOnInit(): void {

    this.getFromFirestore('user', 'users');
    this.getFromFirestore('channel', 'channels');
  }
  constructor(public firestore: AngularFirestore, public storage: Storage) {



  }

  //check if chatroom is already there

  async checkFirebaseContainsChatroom(id) {
    this.chatroomExists = [];
    await this.getFromFirestore('chatroom', 'chatroom');
    console.log(this.data.chatroom)
    await this.chatroomAlreadyThere(id);

    this.chatroomCreate(id);
  }

  //if chatroom is already there get data to show the messages of the chatroom

  chatroomAlreadyThere(id) {
    for (
      let i = 0;
      i < this.data.chatroom.length ? this.data.chatroom.length : 0;
      i++
    ) {
      if (
        (this.data.chatroom[i].from_user == id ||
          this.data.chatroom[i].from_user == this.loggedInUser.id) &&
        (this.data.chatroom[i].to_user == id ||
          this.data.chatroom[i].to_user == this.loggedInUser.id)
          
      ) {
        console.log('from user gleich id', this.data.chatroom[i].from_user == id)
        console.log('from user gleich logged id', this.data.chatroom[i].from_user == this.loggedInUser.id)
        console.log('to user gleich id', this.data.chatroom[i].to_user == id)
        console.log('to user gleich logged id', this.data.chatroom[i].to_user == this.loggedInUser.id)
        console.log('its true')
        this.chatroomExists = this.data.chatroom[i];
        this.currentChatroom = this.chatroomExists;
        this.currentChatroomIndex = i;
      }
    }
  }

  //if chatroom is not there already, create a new chatroom

  chatroomCreate(id) {
    console.log('chatroom exists', this.chatroomExists)
    if (this.chatroomExists.length == 0) {
      this.chatroom = new Chatroom(this.loggedInUser.id, id);
      setTimeout(() => {
        this.getFromFirestore('chatroom', 'chatroom');
        this.chatroomAlreadyThere(id);
      }, 250);
      this.createInFirestore('chatroom', this.chatroom.toJson()); //Funktionsabbruch
    }
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
    this.data.chatHeading = this.currentChannel.name;
    this.getFromFirestoreById(
      'messages',
      'channelMessages',
      this.currentChannelId
    );
  }

  // open the thread and get the actual data / answers

  openThread(message_id) {
    this.getFromFirestoreById2('answers', 'answers', message_id);
    console.log('Right Data', this.data.answers);
  }

  // get messages for the actual channel

  getChannelMessages(messages, channel_id) {
    return messages.filter((message) => {
      return message.channel_id === channel_id;
    });
  }

  /**
   * Save the direct message to the Firestore in collection chatroom
   * @param message it's the current message to save in object new Message
   */

  saveDirectMessage(message: string) {
    let name = this.loggedInUser.name ? this.loggedInUser.name : 'Guest';
    let url = this.file.name ? this.file.name : '';
    let messageObj = new Message(
      name,
      message,
      this.currentChatroom.id,
      1,
      url
    );
    this.currentChatroom.messages.push(messageObj.toJson());
    this.data.chatroom[this.currentChatroomIndex].messages =
      this.currentChatroom.messages;
    this.updateInFirestore(
      'chatroom',
      this.data.chatroom[this.currentChatroomIndex],
      this.currentChatroom.id
    );
    this.url = '';
  }

  /**
   * Save the message to the Firestore in collection messages
   * @param message it's the current message to save in object new Message
   */

  saveMessage(message: string) {
    let name = this.loggedInUser.name ? this.loggedInUser.name : 'Guest';
    let url = this.file.name ? this.file.name : '';
    let messageObj = new Message(
      name,
      message,
      this.currentChannelId,
      this.loggedInUser.id,
      url
    );
    this.createInFirestore('messages', messageObj.toJson());
    this.url = '';
  }

  /**
   * Save the answer written in thread to the Firestore in collection answer
   * @param message it's the current message to save in object new Answer
   * @param message_id its the current message id to save in object new Answer
   */

  saveAnswer(message: string, message_id: string) {
    let name = this.loggedInUser.name ? this.loggedInUser.name : 'Guest';
    let url = this.file.name ? this.file.name : '';
    let answerObj = new Answer(name, message, message_id, url);
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
        filteredMessages.sort((m1, m2) => {
          return m1.time - m2.time;
        });
        console.log('Main Messages: ', filteredMessages);
        this.data[dataToChange as keyof typeof this.data] = filteredMessages;
      });
  }

  public getFromFirestoreById2(category: string, dataToChange: any, id: any) {
    this.firestore
      .collection(category)
      .valueChanges()
      .subscribe((messages: any) => {
        let filteredMessages = this.getFilteredAnswers(messages, id);
        filteredMessages.sort((m1, m2) => {
          return m1.time - m2.time;
        });
        console.log('Thread Messages: ', filteredMessages);
        this.data[dataToChange as keyof typeof this.data] = filteredMessages;
        console.log('2::::', this.data.answers);
        this.filterForUrl();
      });
  }

  // get filtered answers for the actual thread

  getFilteredAnswers(answers, message_id) {
    return answers.filter((answer) => {
      return answer.message_id == message_id;
    });
  }

  //Select file name

  chooseFile(event: any) {
    if (event.path.length < 15) {
      console.log('we are in mainchat');
      this.pictureUploadedFromMainChat = true; //importent for checking if pic chosen from mainchat or thread!!!
    } else {
      this.pictureUploadedFromMainChat = false;
    }
    this.file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    };
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

  // check if url is set, url is here the pic name

  filterForUrl() {
    if (this.threadOpened) {
      this.data.answers.forEach((answer) => {
        if (answer.url) {
          this.getData(answer.url);
        }
      });
    }
    if (this.mainChatOpen) {
      this.data.messages.forEach((message) => {
        if (message.url) {
          this.getData(message.url);
        }
      });
    } else if (this.directChatOpen && this.currentChatroom.messages) {
      this.currentChatroom.messages.forEach((message) => {
        if (message.url) {
          this.getData(message.url);
        }
      });
    }

  }

  /**
   * If the name of pic is set then assign it to the url
   * @param picName  it's the name of the pic checking in storage to get the download url
   */

  async getData(picName) {
    const storage = getStorage();
    await getDownloadURL(ref(storage, 'image/' + picName)).then((url) => {
      this.allFiles[picName] = url;
      // `url` is the download URL for 'images/stars.jpg'
      console.log('allFiles are', this.allFiles);
    });
  }
}
