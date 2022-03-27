import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, doc, FieldValue } from 'firebase/firestore';
import * as firebase from "firebase/app";



@Component({
  selector: 'app-main-interface',
  templateUrl: './main-interface.component.html',
  styleUrls: ['./main-interface.component.scss']
})
export class MainInterfaceComponent implements OnInit {
  open = true;
  value: string = '';
  messages = [];
  id: any;
  constructor(private firestore: AngularFirestore) { }
  ngOnInit(): void {
  }
  isClicked(value: any) {
    this.value = value;
    if (this.open == true) {
      this.open = false
    } else {
      this.open = true;
    }
  }
  renderContent(id: any) {
    this.firestore
      .collection('channel')
      .valueChanges()
      .subscribe((channel) => {
        console.log(channel)
        channel.filter((el: any) => {
          this.id = id;
          if (el.id == id) {
            console.log(el.messages)
            this.messages = el.messages
          }
        })
      })
  }
  pushMessage(message: string) {

    this.firestore
      .collection('channel')
      .valueChanges()
      .subscribe((channel) => {
        channel.filter((el: any) => {
          if (el.id == this.id) {
            console.log(el.id.messages)
            

          }
        })
      })


    this.renderContent(this.id);
  }
}
