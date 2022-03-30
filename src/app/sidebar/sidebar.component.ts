import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  constructor(
    public dialog: MatDialog,
    public firestore: AngularFirestore,
    public backend: BackendService
  ) {}

  ngOnInit(): void {
    // this.firestore
    //   .collection('channel')
    //   .valueChanges()
    //   .subscribe((channels: any) => {
    //     this.channels = channels;
    //   });

    this.backend.getFromFirestore('channel', 'channels');

    this.backend.getFromFirestore('user', 'users');
    // this.firestore
    //   .collection('user')
    //   .valueChanges()
    //   .subscribe((users: any) => {
    //     this.users = users;
    //   });
  }
  openDialogChannel() {
    const dialogRef = this.dialog.open(AddChannelDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      //Id nötig????

      if (result) {
        this.saveChannel({
          id: 1,
          name: result.name,
          is_private: result.isPrivate,
          messages: [],
        });
      }
    });
  }

  toggleChannelDropdown() {
    this.openChannelDropdown = !this.openChannelDropdown;
  }
  toggleDmDropdown() {
    this.openDmDropdown = !this.openDmDropdown;
  }
  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();
  openChannel(id: string) {
    this.buttonClicked.emit(id); //give Id to Interface
    // Abrufen der Messages --> ID des Channels wird übergeben
  }
  openDm(id: string) {
    // Abrufen der Messages --> ID des Empfängers wird übergeben
    console.log(id);
  }
  saveChannel(channel: Object) {
    // this.firestore
    //   .collection('channel')
    //   .add(channel)
    //   .then((fromDocRef) => {
    //     this.firestore.collection('channel').doc(fromDocRef.id).update({
    //       id: fromDocRef.id,
    //     });
    //   });
    this.backend.createInFirestore('channel', channel);
  }
}
function channels(arg0: string, channels: any) {
  throw new Error('Function not implemented.');
}

function users(arg0: string, users: any) {
  throw new Error('Function not implemented.');
}
