import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Routes } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    const activeEl = document.getElementsByClassName('active');
    const $activeEl = $(activeEl);
    // remove side bar in the record transacs tab
    if ($activeEl.attr('np-rt') === 'np-rt') {
      $('#content').addClass('content-lg');
    }
    $('a').on('click', () => {
      $('.app-header').addClass('bx-shadow');
    });
    $('[routerLink="/record"]').parent('li').addClass('active');
  }

  sidenavClicked(anchorElement: HTMLInputElement, np_rt?) {
    $('li').removeClass('active');
    $(anchorElement).parent().addClass('active');

    if (np_rt === 'np-rt') {
        $('#content').addClass('content-lg');
    }
  }
}
