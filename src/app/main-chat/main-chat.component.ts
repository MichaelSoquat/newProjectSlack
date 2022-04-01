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

  constructor(public backend: BackendService) {}

  openThread(id: string) {
    this.backend.data.answers = [];
    this.buttonClicked.emit(id);
  }

  ngOnInit(): void {
    console.log('hier die Nachricht: ', this.message);
  }
}
