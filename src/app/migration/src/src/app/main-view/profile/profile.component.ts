import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  posts: any;
    constructor() {
    }
    ngOnInit() {
    }
}
