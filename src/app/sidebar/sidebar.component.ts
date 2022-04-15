import { ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelDialogComponent } from '../add-channel-dialog/add-channel-dialog.component';
import { AngularFirestore, fromDocRef } from '@angular/fire/compat/firestore';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  openChannelDropdown = true;
  openDmDropdown = true;
  public screenWidth: any;

  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    public dialog: MatDialog,
    public firestore: AngularFirestore,
    public backend: BackendService,
    private cdref: ChangeDetectorRef
  ) {
  }



  ngOnInit(): void {
    this.backend.getFromFirestore('channel', 'channels');
    this.backend.getFromFirestore('user', 'users');
  }


  // open DialogComponent to add a new channel

  openDialogChannel() {
    const dialogRef = this.dialog.open(AddChannelDialogComponent, {
      width: '500px',
    });

    //if DialogComponent and if user wants to add a new channel then save the channel

    dialogRef.afterClosed().subscribe((result) => {
      //Id nötig????

      if (result) {
        this.saveChannel({
          id: 1,
          name: result.name,
          is_private: result.isPrivate,
          messages: [],
          writtenForm: [],
          timeStamps: [],
        });
      }
    });
  }

  // open/close channel dropdown

  toggleChannelDropdown() {
    this.openChannelDropdown = !this.openChannelDropdown;
  }

  // open/close direct message dropdown

  toggleDmDropdown() {
    this.openDmDropdown = !this.openDmDropdown;
  }

  // if channel gets clicked load the current channel with all data from firestore

  openChannel(id: string) {
    if (!this.backend.mobileMode) {
      this.backend.mainChatOpen = true;
      this.backend.directChatOpen = false;
    }
    else {
      this.backend.directChatOpen = false;
      this.backend.mainChatOpen = true;
      this.backend.open = false;
    }


    this.backend.getFromFirestore('messages', 'messages');
    console.log(id);
    this.backend.getCurrentChannel(id);
    this.buttonClicked.emit(id); //give Id to Interface
    // Abrufen der Messages --> ID des Channels wird übergeben
  }

  // if user for direct message gets clicked load the current chatroom with all data from firestore

  openDm(id: string, name: string) {
    if(this.backend.tabletMode) {
      this.backend.threadOpened = false;
    }
    if (!this.backend.mobileMode) {
      this.backend.mainChatOpen = false;
      this.backend.directChatOpen = true;
    } else {
      this.backend.directChatOpen = true;
      this.backend.mainChatOpen = false;
      this.backend.open = false;
    }
    this.backend.data.chatHeading = name;
    // Abrufen der Messages --> ID des Empfängers wird übergeben
    this.backend.checkFirebaseContainsChatroom(id);
    console.log('id is', id, 'loggedInUserId', this.backend.loggedInUser.id);
  }

  // save the channel

  saveChannel(channel: Object) {
    this.backend.createInFirestore('channel', channel);
  }
}
