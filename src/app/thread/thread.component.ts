import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
  
  test = ['sidaflöajasdf',
    'asdöfiöasdifj', 'disaföljsdiaölf', 'disaföljsdiaölf',
    'djsaiföjasdi', 'disaföljsdiaölf', 'disaföljsdiaölf',
    'disaföljsdiaölf']
  message: string[] = [];
  defaultValue: string = '';
  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
  }
  

  showMessage(message: any) {
    this.message.push(message);
    this.defaultValue = '';
  }


}




