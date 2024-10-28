import { HttpClient } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PostDTO } from '../Models/post.dto';
import { SharedService } from 'src/app/Services/shared.service';

interface updateResponse {
  affected: number;
}

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) {
    this.controller = 'posts';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  getPosts(): Observable<PostDTO[]> {
    return this.http.get<PostDTO[]>(this.urlBlogUocApi).pipe(
      catchError((error) => {
          this.sharedService.errorLog(error.error);

          return of([new PostDTO('', '', 0, 0, new Date())]);
      })
    );
  }

  getPostsByUserId(userId: string): Observable<PostDTO[]> {
    // TODO 22
    return this.http.get<PostDTO[]>('http://localhost:3000/users/posts/' + userId).pipe(
      catchError((error) => {
          this.sharedService.errorLog(error.error);

          return of([new PostDTO('', '', 0, 0, new Date())]);
      })
    );
  }

  createPost(post: PostDTO): Observable<PostDTO> {
    return this.http.post<PostDTO>(this.urlBlogUocApi, post).pipe(
      catchError((error) => {
          this.sharedService.errorLog(error.error);

          return of(new PostDTO('', '', 0, 0, new Date()));
      })
    );
  }

  getPostById(postId: string): Observable<PostDTO> {
    return this.http.get<PostDTO>(this.urlBlogUocApi + '/' + postId).pipe(
      catchError((error) => {
          this.sharedService.errorLog(error.error);

          return of(new PostDTO('', '', 0, 0, new Date()));
      })
    );
  }

  updatePost(postId: string, post: PostDTO): Observable<PostDTO> {
    return this.http.put<PostDTO>(this.urlBlogUocApi + '/' + postId, post).pipe(
      catchError((error) => {
          this.sharedService.errorLog(error.error);

          return of(new PostDTO('', '', 0, 0, new Date()));
      })
    );
  }

  likePost(postId: string): Observable<updateResponse> {
    return this.http.put<updateResponse>(this.urlBlogUocApi + '/like/' + postId, NONE_TYPE).pipe(
      catchError((error) => {
          this.sharedService.errorLog(error.error);

          return of({ affected: -1 } as updateResponse);
      })
    );
  }

  dislikePost(postId: string): Observable<updateResponse> {
    return this.http.put<updateResponse>(this.urlBlogUocApi + '/dislike/' + postId, NONE_TYPE).pipe(
      catchError((error) => {
          this.sharedService.errorLog(error.error);

          return of({ affected: -1 } as updateResponse);
      })
    );
  }

  deletePost(postId: string): Observable<deleteResponse> {
    return this.http.delete<deleteResponse>(this.urlBlogUocApi + '/' + postId).pipe(
      catchError((error) => {
          this.sharedService.errorLog(error.error);

          return of({ affected: -1 } as deleteResponse);
      })
    );
  }
}
