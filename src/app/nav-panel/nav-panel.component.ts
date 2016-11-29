import {
  Component,
  Input,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
import { PanelComponent } from './panel/panel.component';

@Component({
  selector: 'app-nav-panel',
  templateUrl: './nav-panel.component.html',
  styleUrls: ['./nav-panel.component.css'],

  animations: [
    trigger('flyInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 100})),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ]),
    ])
  ]
})
export class NavPanelComponent<T> {

  state: string;

  panels: number[][] = [
    [1, 2],
    [5, 7],
  ];

  constructor() { }

  newRandomPanel(): void {
    this.panels.push([1, 2]);
  }

  removeFirstPanel(): void {
    this.panels.splice(0, 1);
  }

  calculatePanelWidth(index: number): string {
    let total = this.panels.length;

    var x1 = Math.pow(2, total) - 1;
    var x2 = (100 / x1);
    var x3 = Math.pow(2, index) * x2;

    console.log('Setting width of panel ' + index + '/' + total + ' to ' + x3 + '%');

    return x3 + '%';
  }
}