import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() isLogout = new EventEmitter<void>();

  constructor(public backend: BackendService, public firebaseService: FirebaseService) { }
  ngOnInit(): void {
  }

  // open and close the sidebar

  openCloseSidebar() {
    this.buttonClicked.emit('clicked');

  }

  // logout

  public logout() {
    this.firebaseService.logout();
    this.isLogout.emit();
  }
}
