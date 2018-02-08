import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-discussions',
  templateUrl: 'discussions.component.html',
  //styleUrls: ['discussions.component.css']
})
export class DiscussionsComponent implements OnInit {
  isError = false;
  showLoader = true;
  data = {
    headerMessage: '',
    loaderMessage: 'Loading discussions ...',
    showLoader: true
  };


  ngOnInit() {
  }

}
