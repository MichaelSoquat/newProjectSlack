import { Component, Input, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent implements OnInit {
  @Input() message!: string;
  @Input() index!: number;
  currentTime = new Date();
  constructor(public backend: BackendService) { }

  openThread() {
    console.log('thread opened');
  }

  ngOnInit(): void {
  }

}
