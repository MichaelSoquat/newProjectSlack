import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  defaultValue: string = '';
  message: any;
  constructor() { }

  ngOnInit(): void {
  }

  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();
  pushMessage(message: any) {
    this.buttonClicked.emit(message)
    this.defaultValue = '';
  }
}
