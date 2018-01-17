import { Directive, OnInit , ElementRef} from '@angular/core';
declare var jquery: any;
declare var $: any;

@Directive({
  selector: '[appDropDown]'
})
export class DropDownDirective implements OnInit{

  constructor() {
  }
  ngOnInit() {
    $('.ui.dropdown').dropdown();
    // $('#dropdown-menu-list-header').dropdown()
  }

}
