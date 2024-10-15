import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  total_likes: number;
  total_dislikes: number;

  private posts: PostDTO[];

  constructor(
    private postService: PostService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    this.total_likes = 0;
    this.total_dislikes = 0;

    this.posts = [];
  }

  async ngOnInit(): Promise<void> {
    await this.loadPosts()
    
    this.calculate();
  }

  private calculate(): void {
    this.total_likes = this.sum_likes();
    this.total_dislikes = this.sum_dislikes();
  }

  private async loadPosts(): Promise<void> {
    // TODO 2
    let errorResponse: any;

    try {
      this.posts = await this.postService.getPosts();
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }

  private sum_likes(): number {
    if (this.posts.length === 0) {
      return 0;
    }

    return this.posts.reduce((acc, post) => acc + post.num_likes, 0);
  }

  private sum_dislikes(): number {
    if (this.posts.length === 0) {
      return 0;
    }

    return this.posts.reduce((acc, post) => acc + post.num_dislikes, 0);
  }

}
