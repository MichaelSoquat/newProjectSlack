import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.scss'],
})
export class AddChannelDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddChannelDialogComponent>) { }

  channel = {
    name: '',
    isPrivate: false,
  };
  name: String = '';
  isPrivate: boolean = false;
  ngOnInit(): void { }


  // checks if channel is private or not

  onChange(checked: boolean) {
    this.channel.isPrivate = checked;
  }

  // closes the dialog if user doesnt submit

  onNoClick() {
    this.dialogRef.close();
  }
}
