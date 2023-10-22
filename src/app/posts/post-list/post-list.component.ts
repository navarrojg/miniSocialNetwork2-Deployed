import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";

@Component({
	selector: "app-post-list",
	templateUrl: "./post-list.component.html",
	styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
	// posts = [
	//   { title: "First Post", content: "This is the first post's content" },
	//   { title: "Second Post", content: "This is the second post's content" },
	//   { title: "Third Post", content: "This is the third post's content" }
	// ];
	posts: Post[] = [];
	private postsSub: Subscription;
	isLoading = false;
	totalPosts = 0;
	postsPerPage = 2;
	currentPage = 1;
	pageSizeOptions = [1, 2, 5, 10];
	private authStatusSub: Subscription;
	userIsAuthenitcated = false;

	constructor(
		public postsService: PostsService,
		private authService: AuthService
	) {}

	ngOnInit() {
		this.isLoading = true;
		this.postsService.getPosts(this.postsPerPage, this.currentPage);
		this.postsSub = this.postsService
			.getPostUpdateListener()
			.subscribe((postData: { posts: Post[]; postCount: number }) => {
				this.isLoading = false;
				this.totalPosts = postData.postCount;
				this.posts = postData.posts;
			});
			
		this.userIsAuthenitcated = this.authService.getIsAuth();
		this.authStatusSub = this.authService
			.getAuthStatusListener()
			.subscribe((isAuthenticated) => {
				this.userIsAuthenitcated = isAuthenticated;
			});
	}

	onDeletePost(id: string) {
		this.isLoading = true;
		this.postsService.deletePost(id).subscribe(() => {
			this.postsService.getPosts(this.postsPerPage, this.currentPage);
		});
	}

	onChangePage(pageData: PageEvent) {
		this.isLoading = true;
		this.currentPage = pageData.pageIndex + 1;
		this.postsPerPage = pageData.pageSize;
		this.postsService.getPosts(this.postsPerPage, this.currentPage);
	}

	ngOnDestroy() {
		this.postsSub.unsubscribe();
		this.authStatusSub.unsubscribe();
	}
}
