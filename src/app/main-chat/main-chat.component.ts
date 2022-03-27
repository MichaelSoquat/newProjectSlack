import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent implements OnInit {
  @Input() message!: string;
  currentTime = new Date();
  constructor() { }

  ngOnInit(): void {
  }

}
