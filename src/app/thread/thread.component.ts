import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
  @Output() sideNavOpened = new EventEmitter;
  test = ['sidaflöajasdf',
    'asdöfiöasdifj', 'disaföljsdiaölf', 'disaföljsdiaölf',
    'djsaiföjasdi', 'disaföljsdiaölf', 'disaföljsdiaölf',
    'disaföljsdiaölf']

  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
  }
  onSideNavOpened() {
    this.sideNavOpened.emit();
  }


}




