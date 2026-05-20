import { Component } from '@angular/core';
import HeaderComponent from '../../components/header/header.component';

@Component({
    selector: 'app-profile',
    imports: [HeaderComponent],
    template: ` <app-header></app-header>`
})
export class ProfilePage {}
