import { Component, EventEmitter, Output, OnInit, HostListener } from '@angular/core';
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
    this.onResize(event);

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.backend.screenWidth = window.innerWidth;
    console.log(this.backend.screenWidth)
    if (window.innerWidth > 600 && window.innerWidth <= 860) {
      this.backend.tabletMode = true;
      this.backend.mobileMode = false;
      console.log('tablet',this.backend.tabletMode)
    }
    else if (window.innerWidth > 860) {
      this.backend.mobileMode = false;
      this.backend.tabletMode = false;
    }
    else if (window.innerWidth <= 600) {
      this.backend.mobileMode = true;
      this.backend.tabletMode = false;
    }
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
