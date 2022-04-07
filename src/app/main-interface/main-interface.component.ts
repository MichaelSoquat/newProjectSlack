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

  open = true;
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

  }

  // if menu got clicked => open/close sidebar

  isClicked(value: any) {
    this.value = value;
    if (this.open == true) {
      this.open = false;
    } else {
      this.open = true;
    }
  }

  // open thread

  openThread(id) {
    this.message_id = id;
    this.backend.threadOpened = true;
    this.basedMessage = this.backend.data.channelMessages.filter(
      (message) => message.id == this.message_id
    )[0];
    console.log('BasedMessage: ', this.basedMessage);

    this.backend.openThread(id);
  }

  // close thread

  closeThread() {
    this.backend.threadOpened = false;
  }

  // logout(){
  //   this.firebaseService.logout();
  //   this.isLogout.emit()
  // }


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
