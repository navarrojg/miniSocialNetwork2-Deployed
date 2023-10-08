import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { Post } from "../post.model";

@Component({
	selector: "app-post-create",
	templateUrl: "./post-create.component.html",
	styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit, OnDestroy {
	enteredTitle = "";
	enteredContent = "";
	private subscription: Subscription;
	private postId: string;
	private mode = "create";
	private post: Post;

	constructor(
		public postsService: PostsService,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.subscription = this.route.params.subscribe((paramMap: ParamMap) => {
			if (paramMap.has("postId")) {
				this.mode = "edit";
				this.postId = paramMap.get("postId");
				this.post = this.postsService.getPost(this.postId);
			} else {
				this.mode = "create";
				this.postId = null;
			}
		});
	}

	onAddPost(form: NgForm) {
		if (form.invalid) {
			return;
		}
		this.postsService.addPost(form.value.title, form.value.content);
		form.resetForm();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
