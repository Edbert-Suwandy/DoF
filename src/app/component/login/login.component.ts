import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NgFor } from '@angular/common';

export type form = {
  name: string,
  type: string,
  label: string
}

export interface loginFunc {
  (event: any): void;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgFor],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fields:form[];
  func:loginFunc;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.fields = data.fields;
    this.func = data.func;
  }

  ngOnInit(): void {
  }

  handler(event: any) {
    this.func(event);
  }
}
