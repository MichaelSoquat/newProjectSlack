import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  defaultValue: string = '';
  message: any;
  constructor(public backend: BackendService) { }

  ngOnInit(): void {
  }

  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();
  pushMessage(message: any) {
    this.buttonClicked.emit(message)
    this.defaultValue = '';
  }

  click(value:any) {
    console.log(value)
  }
}
