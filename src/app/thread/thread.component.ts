import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements OnInit {
  @Output() buttonClicked = new EventEmitter<void>();
  @Input() message_id;
  @Input() basedMessage;
  currentMessage: any;
  message: string[] = [];
  defaultValue: string = '';
  constructor(private firestore: Firestore, public backend: BackendService) { }

  ngOnInit(): void {
    this.currentMessage = this.backend.data.channelMessages.filter(
      (message) => message.id == this.message_id
    );
    console.log('die Aktuelle Message: ', this.currentMessage);
  }

  // close the thread

  closeThread() {
    this.buttonClicked.emit();
  }

  //show messages/answers

  showMessage(message: any) {
    this.backend.saveAnswer(message, this.message_id);
    this.defaultValue = '';
    this.backend.file = '';
  }

  // get the url if any pictures are loaded in

  getUrl(url) {
    if (this.backend.allFiles[url]) {
      return this.backend.allFiles[url];
    }
  }

  // show the right date/time

  getDate(exactDate) {
    let date = new Date(exactDate);
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var year = date.getFullYear();
    var month = months[date.getMonth()];
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var formattedDate =
      day + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;

    return formattedDate;
  }

}
