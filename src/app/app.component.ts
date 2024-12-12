import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { MembersComponent } from "./component/members/members.component";
import { NgIf } from '@angular/common';
import { BusinessAreaComponent } from "./component/business-area/business-area.component";
import { BusinessComponent } from "./component/business/business.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MembersComponent, NgIf, BusinessComponent, BusinessAreaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DoF';
  mode = 'members';

  toMemberMode() {
    this.mode = "members";
  }

  toBusinessAreaMode() {
    this.mode = "businessArea";
  }

  toBusinessMode() {  
    this.mode = "business";
  }
}
