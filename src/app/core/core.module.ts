import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// primeng
import { SharedModule as PrimeSharedModule } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelModule } from 'primeng/panel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipsModule } from 'primeng/chips';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';

import { NgxSpinnerModule } from 'ngx-spinner';

import { AccountDropdownComponent } from './components/account-dropdown/account-dropdown.component';
import { HeaderToolbarComponent } from './components/header-toolbar/header-toolbar.component';
import { ShowIfUserDirective } from './directives/user-role.directive';
import { ElectionsListComponent } from './components/elections-list/elections-list.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AccountDropdownComponent,
    HeaderToolbarComponent,
    ElectionsListComponent,

    ShowIfUserDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    NgxSpinnerModule,

    // primeng
    PrimeSharedModule,
    MenubarModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    OverlayPanelModule,
    MenuModule,
    BreadcrumbModule,
    PanelModule,
    InputTextareaModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    RatingModule,
    AutoCompleteModule,
    ChipsModule,
    CalendarModule,
    RadioButtonModule,
  ],
  exports: [
    // angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // components
    AccountDropdownComponent,
    HeaderToolbarComponent,
    ElectionsListComponent,

    ShowIfUserDirective,

    NgxSpinnerModule,

    // primeng
    PrimeSharedModule,
    MenubarModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    OverlayPanelModule,
    MenuModule,
    BreadcrumbModule,
    PanelModule,
    InputTextareaModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    RatingModule,
    AutoCompleteModule,
    ChipsModule,
    CalendarModule,
    RadioButtonModule
  ]
})
export class CoreModule { }
