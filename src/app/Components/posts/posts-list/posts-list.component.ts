import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

import { PostDTO } from 'src/app/Models/post.dto';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent {
  posts!: PostDTO[];

  constructor(
    private postService: PostService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    this.loadPosts();
  }
  // TODO 12

  private async loadPosts(): Promise<void> {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.postService.getPostsByUserId(userId).subscribe({
        next: (postResults) => {
          this.posts = postResults;
        }
      });
    }
  }

  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/post/' + postId);
  }

  async deletePost(postId: string): Promise<void> {
    let errorResponse: any;

    // show confirmation popup
    let result = confirm(
      'Confirm delete post with id: ' + postId + ' .'
    );
    if (result) {
      this.postService.deletePost(postId). subscribe({
        next: (deleteResponse) => {
          if (deleteResponse.affected > 0) {
            this.loadPosts();
          }
        }
      });
    }
  }
}
