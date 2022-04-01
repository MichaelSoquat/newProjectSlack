import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements OnInit {
  @Output() buttonClicked = new EventEmitter<void>();
  @Input() message_id;

  test = [
    'sidaflöajasdf',
    'asdöfiöasdifj',
    'disaföljsdiaölf',
    'disaföljsdiaölf',
    'djsaiföjasdi',
    'disaföljsdiaölf',
    'disaföljsdiaölf',
    'disaföljsdiaölf',
  ];

  message: string[] = [];
  defaultValue: string = '';
  constructor(private firestore: Firestore, public backend: BackendService) {}

  ngOnInit(): void {}
  closeThread() {
    this.buttonClicked.emit();
  }

  showMessage(message: any) {
    // this.message.push(message);
    this.backend.saveAnswer(message, this.message_id);
    this.defaultValue = '';
  }
}
