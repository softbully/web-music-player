import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavPanelComponent } from './nav-panel/nav-panel.component';
import { PanelComponent } from './nav-panel/panel/panel.component';

@NgModule({
  declarations: [
    AppComponent,
    NavPanelComponent,
    PanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
