import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-main-interface',
  templateUrl: './main-interface.component.html',
  styleUrls: ['./main-interface.component.scss']
})
export class MainInterfaceComponent implements OnInit {
  open = true;
  value: string = '';
  messages = [];
  ngOnInit(): void {
  }

  constructor(private firestore: AngularFirestore) { }
  isClicked(value: any) {
    this.value = value;
    if (this.open == true) {
      this.open = false
    } else {
      this.open = true;
    }
  }

  renderContent(id: any) {
    console.log(id)
    this.firestore.
      collection('channel')
      .valueChanges()
      .subscribe((channel: any) => {
        channel.forEach((el: any) => {
          if (el.id == id) {
            this.messages = el.messages;
          }
        })
      });
  }

  pushMessage(id: any) {
    console.log(id)

    //push message into array
  }
}
