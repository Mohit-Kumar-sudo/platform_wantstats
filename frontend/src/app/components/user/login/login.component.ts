import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpError } from "src/app/models/http-error";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: HttpError;
  redirectUrl: string;
  searchText: any = "";
  titleData: any = [];
  searchSubscription: any;
  meChartsData: any;
  redirectMessage: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private spinner: NgxSpinnerService,
  )
  {
    this.redirectUrl = this.activatedRoute.snapshot.queryParams["redirectTo"];
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required),
    });
    this.spinner.hide();
  }

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.spinner.show();
      this.authService.login(this.loginForm.value).subscribe(
        (resp) => {
          if (resp && resp.data && resp.data.token) {
            // console.log("resp resp.data resp.data.token",resp)
            this.spinner.hide();
            this.authService.setSession(resp);
            this.authService.isLoggedIn(true);
            localStorage.setItem("isLoggedIn", "true");
            const userData = localStorage.setItem(
              "userLoggedIn",
              JSON.stringify(resp.data)
            );
            this.router.navigateByUrl('/home')
          } else {
            this.spinner.hide();
            this.snackbar.open(resp.data.data, "Close", {
              duration: 5000,
            });
          }
        },
        (err) => {
          this.spinner.hide();
          this.snackbar.open("Invalid username or password.", "Close", {
            duration: 5000,
          });
          this.error = err.message;
        }
      );
    }
  }
}
