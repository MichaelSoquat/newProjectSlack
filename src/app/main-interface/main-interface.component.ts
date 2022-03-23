import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-main-interface',
  templateUrl: './main-interface.component.html',
  styleUrls: ['./main-interface.component.scss']
})
export class MainInterfaceComponent implements OnInit {
  open = true;
  value: string = '';
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
}
