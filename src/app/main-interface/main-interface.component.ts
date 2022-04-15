import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { FirebaseService } from '../services/firebase.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-interface',
  templateUrl: './main-interface.component.html',
  styleUrls: ['./main-interface.component.scss'],
})
export class MainInterfaceComponent implements OnInit {

  basedMessage = {};


  value: string = '';
  messages = [];
  //? Gedanke dahinter
  answers = [];
  message_id = '';

  constructor(
    private firestore: AngularFirestore,
    public firebaseService: FirebaseService,
    public backend: BackendService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userAlreadyHere();

  }

  userAlreadyHere() {
    let userAlreadyThere = JSON.parse(localStorage.getItem('user'))
    if (userAlreadyThere) {
      let checkCurrentUser = setInterval(() => {
        for (let i = 0; i < this.backend.data.users.length; i++) {

          if (userAlreadyThere.email == this.backend.data.users[i].email) {
            this.backend.loggedInUser = this.backend.data.users[i];
          }
          if (this.backend.loggedInUser == this.backend.data.users[i]) {
            clearInterval(checkCurrentUser)
          }
        }
      }, 100)
    }
  }

  // if menu got clicked => open/close sidebar

  isClicked(value: any) {
    this.value = value;
    if (this.backend.mobileMode && this.backend.threadOpened) {
      this.backend.open = true;
      this.backend.threadOpened = false;
    }
    else if (this.backend.open) {
      this.backend.open = false;
    } else {
      this.backend.open = true;
    }
  }


  // open thread

  openThread(id) {
    if (!this.backend.mobileMode && !this.backend.tabletMode) {
      this.backend.threadOpened = true;
    } else if (this.backend.tabletMode) {
      this.backend.threadOpened = true;
      this.backend.mainChatOpen = false;
      console.log('main chat', this.backend.mainChatOpen)
      console.log('thread chat', this.backend.threadOpened)
    }
    else {
      this.backend.threadOpened = true;
      this.backend.mainChatOpen = false;
    }
    this.message_id = id;
    this.basedMessage = this.backend.data.channelMessages.filter(
      (message) => message.id == this.message_id
    )[0];
    console.log('BasedMessage: ', this.basedMessage);

    this.backend.openThread(id);
  }

  // close thread

  closeThread() {

    if (this.backend.mobileMode || this.backend.tabletMode) {
      this.backend.mainChatOpen = true;
    }
    this.backend.threadOpened = false;
  }

  // update the content in sidebar

  renderContent(id: any) {
    console.log(id);
    this.firestore
      .collection('channel')
      .valueChanges()
      .subscribe((channel: any) => {
        channel.forEach((el: any) => {
          if (el.id == id) {
            this.messages = el.messages;
            // this.backend.updateInFirestore(
            //   'channel',
            //   this.messages,
            //   id
            // )
          }
        });
      });
  }
}
