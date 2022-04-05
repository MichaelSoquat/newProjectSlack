import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent implements OnInit {
  defaultValue: string = '';
  constructor(public backend: BackendService) { }

  ngOnInit(): void { }

  pushMessage(textarea: any) {
    console.log('mainChat', this.backend.mainChatOpen, 'dM', this.backend.directChatOpen)
    if (this.backend.mainChatOpen) {
      this.defaultValue = '';
      // this.backend.currentChannel.messages.push(textarea.value)
      this.backend.saveMessage(textarea.value);
      //console.log(textarea.value);
      //this.backend.saveCurrentChannel();

    } else if (this.backend.directChatOpen) {
      this.defaultValue = '';

      this.backend.saveDirectMessage(textarea.value)

    }

  }



  click(value: any) {
    console.log(value);
  }
}
