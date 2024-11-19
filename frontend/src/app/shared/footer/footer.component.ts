import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
isLoggedIn: any;

  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.isLogin.subscribe((d)=>{
      this.isLoggedIn = d;
    })
  }

  handleClick(){
    window.scroll(0,0)
    if(this.isLoggedIn){
      this.router.navigate(['/top-bar-charts'])
    }else{
      this.router.navigate(['/login'])
    }
  }

}
