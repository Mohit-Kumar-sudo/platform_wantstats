import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MarqueeComponent } from './marquee/marquee.component';
import { FooterComponent } from './footer/footer.component';
import { MatCommonModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from '../app-routing.module';
import { ProfileLinksComponent } from './profile-links/profile-links.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    HeaderComponent,
    NavbarComponent,
    MarqueeComponent,
    FooterComponent,
    ProfileLinksComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    MatCommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    AppRoutingModule,
  ],
  exports: [
    HeaderComponent,
    NavbarComponent,
    MarqueeComponent,
    FooterComponent,
    ProfileLinksComponent,
    SidebarComponent
  ],
})
export class SharedModule {}
