import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelDialogComponent } from '../add-channel-dialog/add-channel-dialog.component';
import { AngularFirestore, fromDocRef } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  openChannelDropdown = true;
  openDmDropdown = true;
  channels = [
    {
      id: '1',
      is_private: false,
      name: 'Coffee',
      messages: [],
    },
    { id: '2', is_private: true, name: '2. Coffee', messages: [] },
    { id: '3', is_private: false, name: '3. Coffee', messages: [] },
    { id: '4', is_private: false, name: '4. Coffee', messages: [] },
  ];

  users = [
    {
      id: '1',
      first_name: 'Max',
      last_name: 'Mustermann',
      email: 'xy@gmail.com',
      image: 'https://i.pravatar.cc/24?img=1',
    },
    {
      id: '2',
      first_name: 'Erika',
      last_name: 'Mustermann',
      email: 'xy@gmail.com',
      image: 'https://i.pravatar.cc/24?img=2',
    },
    {
      id: '3',
      first_name: 'Jana',
      last_name: 'Mustermann',
      email: 'xy@gmail.com',
      image: 'https://i.pravatar.cc/24?img=3',
    },
    {
      id: '4',
      first_name: 'Niklas',
      last_name: 'Mustermann',
      email: 'xy@gmail.com',
      image: 'https://i.pravatar.cc/24?img=4',
    },
  ];

  constructor(public dialog: MatDialog, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.firestore
      .collection('channel')
      .valueChanges()
      .subscribe((channels: any) => {
        this.channels = channels;
      });

    this.firestore
      .collection('user')
      .valueChanges()
      .subscribe((users: any) => {
        this.users = users;
      });
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
  openChannel(id: string) {
    // Abrufen der Messages --> ID des Channels wird übergeben
    console.log(id);
  }
  openDm(id: string) {
    // Abrufen der Messages --> ID des Empfängers wird übergeben
    console.log(id);
  }
  saveChannel(channel: Object) {
    this.firestore
      .collection('channel')
      .add(channel)
      .then((fromDocRef) => {
        this.firestore.collection('channel').doc(fromDocRef.id).update({
          id: fromDocRef.id,
        });
      });
  }
}
