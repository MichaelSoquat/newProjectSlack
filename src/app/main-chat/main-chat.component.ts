import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements OnInit {
  @Input() message!: any;
  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();

  public userName: string;
  public messageSender: string;
  public userImageSource: string;

  constructor(public backend: BackendService) {
  }

  openThread(id: string) {
    this.backend.data.answers = [];
    this.buttonClicked.emit(id);
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
}
