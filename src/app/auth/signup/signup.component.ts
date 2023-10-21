import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
	selector: "app-signup",
	templateUrl: "./signup.component.html",
	styleUrls: ["./signup.component.css"],
})
export class SignupComponent {
	constructor(private authService: AuthService) {}
	isLoading = false;

	onSingUp(form: NgForm) {
		if (form.invalid) {
			return;
		}
		this.authService.createUser(form.value.email, form.value.password);
	}
}
