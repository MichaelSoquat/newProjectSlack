import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.scss'],
})
export class AddChannelDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddChannelDialogComponent>) {}

  channel = {
    name: '',
    isPrivate: false,
  };
  name: String = '';
  isPrivate: boolean = false;
  ngOnInit(): void {}

  onChange(checked: boolean) {
    this.channel.isPrivate = checked;
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
