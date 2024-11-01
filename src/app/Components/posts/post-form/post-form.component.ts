import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

import { PostDTO } from 'src/app/Models/post.dto';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { formatDate } from '@angular/common';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface PostFormTranslation {
  title: string;
  description: string;
}

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  post: PostDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  publication_date: UntypedFormControl;
  categories: UntypedFormControl;

  postForm: UntypedFormGroup;
  isValidForm: boolean | null;
  userCategories: CategoryDTO[];

  translations: PostFormTranslation;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private postId: string | null;
  private langSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private categoryService: CategoryService,
    private translate: TranslateService
  ) {
    this.isValidForm = null;
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.post = new PostDTO('', '', 0, 0, new Date());
    this.isUpdateMode = false;
    this.validRequest = false;
    this.userCategories = [];

    this.translations = {
      title: '',
      description: ''
    };

    this.attributeTranslateUpdate();

    this.langSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.attributeTranslateUpdate();
    });

    this.title = new UntypedFormControl(this.post.title, [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.description = new UntypedFormControl(this.post.description, [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.publication_date = new UntypedFormControl(this.post.publication_date, [
      Validators.required,
    ]);

    this.categories = new UntypedFormControl(this.post.categories);

    this.postForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      publication_date: this.publication_date,
      categories: this.categories
    });

    this.loadCategories();
  }
  // TODO 13
  async ngOnInit(): Promise<void> {
    let errorResponse: any;

    // update
    if (this.postId) {
      this.isUpdateMode = true;
      this.postService.getPostById(this.postId).subscribe({
        next: (postResult) => {
          this.post = postResult;
        },
        complete: () => {
          this.title.setValue(this.post.title);
          this.description.setValue(this.post.description);
          this.publication_date.setValue(formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en'));
          this.categories.setValue(this.post.categories.map((category: CategoryDTO) => category.categoryId));

          this.postForm = this.formBuilder.group({
            title: this.title,
            description: this.description,
            publication_date: this.publication_date,
            categories: this.categories
          });
        }
      });
    }
  }

  private attributeTranslateUpdate(): void {
    this.translate.get('POST_ATTRIBUTES.title').subscribe((res: string) => {
      this.translations.title = res;
    });

    this.translate.get('POST_ATTRIBUTES.description').subscribe((res: string) => {
      this.translations.description = res;
    });
  }
  private async loadCategories(): Promise<void> {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      try {
        this.userCategories = await this.categoryService.getCategoriesByUserId(
          userId
        );
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  private async editPost(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;
    if (this.postId) {
      const userId = this.localStorageService.get('user_id');
      if (userId) {
        this.post.userId = userId;

        this.postService.updatePost(this.postId, this.post).subscribe({
          complete: () => {
              responseOK = true;

              this.sharedService.managementToast(
                'postFeedback',
                responseOK,
                errorResponse
              ).then(() => {
                if (responseOK) {
                  this.router.navigateByUrl('posts');
                }
              })
          },
        });
      }
    }

    return responseOK;
  }

  private async createPost(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.post.userId = userId;

      this.postService.createPost(this.post).subscribe({
        complete: () => {
          responseOK = true;

          this.sharedService.managementToast(
            'postFeedback',
            responseOK,
            errorResponse
          ).then(() => {
            if (responseOK) {
              this.router.navigateByUrl('posts');
            }
          })
        }
      });
    }

    return responseOK;
  }

  async savePost() {
    this.isValidForm = false;

    if (this.postForm.invalid) {
      return;
    }

    this.isValidForm = true;

    this.post.title = this.postForm.value.title;
    this.post.description = this.postForm.value.description;
    this.post.publication_date = this.postForm.value.publication_date;
    this.post.categories = this.postForm.value.categories;

    if (this.isUpdateMode) {
      this.validRequest = await this.editPost();
    } else {
      this.validRequest = await this.createPost();
    }
  }
}
