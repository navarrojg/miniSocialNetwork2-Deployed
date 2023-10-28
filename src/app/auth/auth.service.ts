import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
	private isAuthenticated = false;
	private token: string;
	private authStatusListener = new Subject<boolean>();
	private tokenTimer: any;
	private userId: string;

	constructor(
		private http: HttpClient,
		private router: Router,
		private route: ActivatedRoute
	) {}

	getToken() {
		return this.token;
	}

	getIsAuth() {
		return this.isAuthenticated;
	}

	getAuthStatusListener() {
		return this.authStatusListener.asObservable();
	}

	getUserId() {
		return this.userId;
	}

	createUser(email: string, password: string) {
		const authData: AuthData = { email: email, password: password };
		this.http.post("http://localhost:3000/api/user/signup", authData).subscribe(
			() => {
				this.router.navigate["/"];
			},
			(error) => {
				this.authStatusListener.next(false);
			}
		);
	}

	login(email: string, password: string) {
		const authData: AuthData = { email: email, password: password };
		this.http
			.post<{ token: string; expiresIn: number; userId: string }>(
				"http://localhost:3000/api/user/login",
				authData
			)
			.subscribe(
				(response) => {
					const token = response.token;
					this.token = token;
					if (token) {
						const expiresInDuration = response.expiresIn;
						this.setAuthTimer(expiresInDuration);
						this.isAuthenticated = true;
						this.userId = response.userId;
						this.authStatusListener.next(true);
						const now = new Date();
						const expirationDate = new Date(
							now.getTime() + expiresInDuration * 1000
						);
						this.saveAuthData(token, expirationDate, this.userId);
						this.router.navigate(["/"]);
					}
				},
				(error) => {
					this.authStatusListener.next(false);
				}
			);
	}

	autoAuthUser() {
		const authInformation = this.getAuthData();
		if (!authInformation) {
			return;
		}
		const now = new Date();
		const expiressIn = authInformation.expirationDate.getTime() - now.getTime();
		if (expiressIn > 0) {
			this.token = authInformation.token;
			this.isAuthenticated = true;
			this.userId = authInformation.userId;
			this.setAuthTimer(expiressIn / 1000);
			this.authStatusListener.next(true);
		}
	}

	logout() {
		this.token = null;
		this.isAuthenticated = false;
		this.authStatusListener.next(false);
		clearTimeout(this.tokenTimer);
		this.clearAuthData();
		this.userId = null;
		this.router.navigate(["/login"]);
	}

	private setAuthTimer(duration: number) {
		this.tokenTimer = setTimeout(() => {
			this.logout();
		}, duration * 1000);
	}

	private saveAuthData(token: string, expirationData: Date, userId: string) {
		localStorage.setItem("token", token);
		localStorage.setItem("expiration", expirationData.toISOString());
		localStorage.setItem("userId", userId);
	}

	private clearAuthData() {
		localStorage.removeItem("token");
		localStorage.removeItem("expiration");
		localStorage.removeItem("userId");
	}

	private getAuthData() {
		const token = localStorage.getItem("token");
		const expirationDate = localStorage.getItem("expiration");
		const userId = localStorage.getItem("userId");
		if (!token || !expirationDate) {
			return;
		}
		return {
			token: token,
			expirationDate: new Date(expirationDate),
			userId: userId,
		};
	}
}
