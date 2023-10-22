import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
	private authListenerSubs: Subscription;
	userIsAuthenitcated = false;
	constructor(private authService: AuthService) {}

	ngOnInit() {
		this.authListenerSubs = this.authService
			.getAuthStatusListener()
			.subscribe((isAuthenticated) => {
				this.userIsAuthenitcated = isAuthenticated;
			});
	}

	ngOnDestroy(): void {
		this.authListenerSubs.unsubscribe();
	}
}
