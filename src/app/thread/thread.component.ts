import { Component, OnInit } from '@angular/core';


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

  constructor() { }

  ngOnInit(): void {
  }



}




