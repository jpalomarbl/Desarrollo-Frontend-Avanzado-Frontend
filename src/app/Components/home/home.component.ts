import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

import { FormatDatePipe } from 'src/app/Pipes/format-date.pipe';
import { TranslateService } from '@ngx-translate/core';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryDTO } from 'src/app/Models/category.dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  posts!: PostDTO[];
  allCategories: CategoryDTO[];

  titleFilter: FormControl;
  descriptionFilter: FormControl;
  publicationDateFilter: FormControl;
  aliasFilter: FormControl;
  categoriesFilter: FormControl;
  filterForm: FormGroup;

  showButtons: boolean;
  constructor(
    private postService: PostService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private fb: FormBuilder,
    // private translate: TranslateService
  ) {
    this.showButtons = false;
    this.allCategories = [];

    this.titleFilter = new FormControl();
    this.descriptionFilter = new FormControl();
    this.publicationDateFilter = new FormControl();
    this.aliasFilter = new FormControl();
    this.categoriesFilter = new FormControl();

    this.filterForm = this.fb.group({
      titleFilter: this.titleFilter,
      descriptionFilter: this.descriptionFilter,
      publicationDateFilter: this.publicationDateFilter,
      aliasfilter: this.aliasFilter,
      categoriesFilter: this.categoriesFilter
    });

    this.loadPosts();
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showButtons = headerInfo.showAuthSection;
        }
      }
    );
  }


  async like(postId: string): Promise<void> {
    let errorResponse: any;
    this.postService.likePost(postId).subscribe({
      complete: () => {
        this.loadPosts();
      }
    });
  }

  async dislike(postId: string): Promise<void> {
    let errorResponse: any;

    this.postService.dislikePost(postId).subscribe({
      complete: () => {
        this.loadPosts();
      }
    });
  }

  async applyFilters(): Promise<void> {
    const filters = [
      { filter: this.titleFilter.value, method: () => this.titleFilterMethod() },
      { filter: this.descriptionFilter.value, method: () => this.descriptionFilterMethod() },
      { filter: this.publicationDateFilter.value, method: () => this.publicationDateFilterMethod() },
      { filter: this.aliasFilter.value, method: () => this.aliasFilterMethod() },
      { filter: this.categoriesFilter.value, method: () => this.categoriesFilterMethod() },
    ];

    filters.forEach(({ filter, method }) => {
      if (filter) {
        method();
      }
    });
  }

  private titleFilterMethod(): void {
    this.posts = this.posts.filter((post: PostDTO) => post.title.includes(this.titleFilter.value));
  }

  private descriptionFilterMethod(): void {
    this.posts = this.posts.filter((post: PostDTO) => post.description.includes(this.descriptionFilter.value));
  }

  private publicationDateFilterMethod(): void {
    let tmpPosts: PostDTO[] = [];

    this.posts.forEach((post: PostDTO, index: number) => {
      const postDate: Date = new Date(post.publication_date);
      let stringDate = '';

      stringDate += postDate.getFullYear() + '-'

      if ((+postDate.getMonth() + 1) < 10) {
        stringDate += '0';
      }

      stringDate += (postDate.getMonth() + 1) + '-' + postDate.getDate();

      if (stringDate === this.publicationDateFilter.value) {
        tmpPosts.push(post);
      }

      if (index === this.posts.length - 1) {
        this.posts = tmpPosts;
      }
    });
  }

  private aliasFilterMethod(): void {
    this.posts = this.posts.filter((post: PostDTO) => post.userAlias.includes(this.aliasFilter.value));
  }

  private categoriesFilterMethod(): void {
    let tmpPosts: PostDTO[] = [];

    this.posts.forEach((post: PostDTO, index: number) => {
      let postCategoriesUID: string[] = post.categories.map((category: CategoryDTO) => category.categoryId);

      if (this.categoriesFilter.value.every((uid: string) => postCategoriesUID.includes(uid))) {
        tmpPosts.push(post);
      }

      if (index === this.posts.length - 1) {
        this.posts = tmpPosts;
      }
    });
  }

  private async loadPosts(): Promise<void> {
    // TODO 2

    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');

    if (userId) {
      this.showButtons = true;
    }

    this.postService.getPosts().subscribe({
      next: (postResult) => {
        this.posts = postResult;
      },
      complete: () => {
        const tmpCategories: CategoryDTO[][] = [...this.posts.map(post => post.categories)];
        let allCategoriesUID: string[] = [];

        tmpCategories.forEach((array: CategoryDTO[]) => {
          array.forEach((category: CategoryDTO) => {
            if (!allCategoriesUID.includes(category.categoryId)) {
              this.allCategories.push(category);
              allCategoriesUID.push(category.categoryId);
            }
          })
        })
      }
    });
  }
}
