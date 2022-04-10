import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {
  @Input() message!: any;
  @Input() chat!: any;
  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();

  public userName: string;
  public messageSender: string;
  public userImageSource: string;

  constructor(public backend: BackendService) {
  }


  // open thread

  openThread(id: string) {
    this.backend.data.answers = [];
    this.buttonClicked.emit(id);
  }


  getMessageImageSource() {
<<<<<<< HEAD
      // this.userName = this.message.from;
      // for (let i = 0; i < this.backend.data.users.length; i++) {
      //   const user = this.backend.data.users[i];
      //   if (user.name == this.userName) {
      //     return user.image;
      //   }
      // }
=======
    if (this.backend.mainChatOpen) {
      this.userName = this.message.from;
      for (let i = 0; i < this.backend.data.users.length; i++) {
        const user = this.backend.data.users[i];
        if (user.name == this.userName) {
          return user.image;
        }
      }
    }
    else if (this.backend.directChatOpen) {
      this.userName = this.chat.from;
      for (let i = 0; i < this.backend.data.users.length; i++) {
        const user = this.backend.data.users[i];
        if (user.name == this.userName) {
          return user.image;
        }
      }
    }
>>>>>>> 918f4858967dfdcad7b21616efe672970048668b
    return "https://i.pravatar.cc/24?img=1";
  }

  ngOnInit(): void {
    this.userImageSource =
      this.getMessageImageSource();
  }

  // display the correct date

  getDate() {
    let date: Date;
    if (this.backend.mainChatOpen) {
      date = new Date(this.message.time);
    } else if (this.backend.directChatOpen) {
      date = new Date(this.chat.time);
    }

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

  /**
   * if pictures are there get the url to load it from storage
   * @param url url is here the name of the picture to get the url from storage
   * @returns if there are files to load
   */

  getUrl(url: string | number) {
    if (this.backend.allFiles[url]) {
      return this.backend.allFiles[url];
    }

  }
}
