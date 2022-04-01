import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  defaultValue: string = '';
  constructor(public backend: BackendService) { }

  ngOnInit(): void {
  }


  pushMessage(textarea: any) {

    this.defaultValue = '';
    this.backend.currentChannel.timeStamps.push(new Date())
    this.backend.currentChannel.messages.push(textarea.value)
    // console.log(new Date, this.backend.loggedInUser.name)
    // console.log(this.backend.currentChannel.writtenForm,this.backend.loggedInUser.name )
    this.backend.currentChannel.writtenForm.push(this.backend.loggedInUser.name)
    

    this.backend.saveCurrentChannel();

  }

  click(value: any) {
    console.log(value)
  }
}
