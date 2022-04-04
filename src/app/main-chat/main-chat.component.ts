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

  openThread(id: string) {
    this.backend.data.answers = [];
    this.buttonClicked.emit(id);
    console.log('data is', this.backend.data)
  }

  getMessageImageSource(){
    this.userName = this.message.from;
    for (let i = 0; i < this.backend.data.users.length; i++) {
      const user = this.backend.data.users[i];
      if(user.name == this.userName){
        return user.image;
      }
    }
    return "https://i.pravatar.cc/24?img=1";
  }

  ngOnInit(): void {
    console.log('hier die Nachricht: ', this.message);
    this.userImageSource = this.getMessageImageSource();
  }
  getDate() {
    let date = new Date(this.message.time);
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
