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

  /**
   * The function is there to push the current value of textarea into the right
   * object and save it in the right collection
   * @param textarea this is the textfield
   */
  pushMessage(textarea: any) {
    console.log('mainChat', this.backend.mainChatOpen, 'dM', this.backend.directChatOpen)
    if (this.backend.mainChatOpen) {
      this.defaultValue = '';
      this.backend.saveMessage(textarea.value);
    } else if (this.backend.directChatOpen) {
      this.defaultValue = '';
      this.backend.saveDirectMessage(textarea.value)
    }
  }
}
