import { Component, EventEmitter, Inject, OnInit, PLATFORM_ID, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MenuItem } from 'primeng/api';
import $ from 'jquery';
import { PrimengtoolsModule } from '../primengtools/primengtools.module';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-docker',
  standalone: true,
  imports: [PrimengtoolsModule],
  templateUrl: './docker.component.html',
  styleUrl: './docker.component.css'
})
export class DockerComponent implements OnInit {

  dockItems!: MenuItem[];

  constructor(public _AppComponent: AppComponent) {
  }

  ngOnInit() {
    this.dockItems = [
/*       {
        label: 'Whatsapp',
        tooltipOptions: {
          tooltipLabel: 'Whatsapp',
          tooltipPosition: 'bottom',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 100
        },
        url: 'https://wa.me/+201008161832',
        icon: '/assets/images/whatsapp.png'
      }, */
      {
        label: 'Colors',
        tooltipOptions: {
          tooltipLabel: 'Colors',
          tooltipPosition: 'bottom',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 100
        },
        command: (event) => {
          const settingsBox = $(".settings-box");
          if (settingsBox.css('width') === '200px') {
            settingsBox.fadeOut(500).css("width", "50px");
          } else {
            settingsBox.css("width", "200px").fadeIn(1000);
          }
        },
        icon: '/assets/images/palette.png'
      },
    /*   {
        label: 'GitHub',
        tooltipOptions: {
          tooltipLabel: 'GitHub',
          tooltipPosition: 'bottom',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 100
        },
        url: 'https://github.com/MostafaPro0/',
        icon: '/assets/images/github.svg'
      },
      {
        label: 'LinkedIn',
        tooltipOptions: {
          tooltipLabel: 'LinkedIn',
          tooltipPosition: 'bottom',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 100
        },
        url: 'https://www.linkedin.com/in/mostafapro/',
        icon: '/assets/images/linked.svg'
      } */
    ];
  }
}