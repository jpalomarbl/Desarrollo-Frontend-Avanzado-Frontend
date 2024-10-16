import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

import { UserDTO } from 'src/app/Models/user.dto';

import { formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface RegisterTranslation {
  name: string;
  surname1: string;
  surname2: string;
  alias: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  
  // TODO 16
  registerUser: UserDTO = new UserDTO( '', '', '', '', new Date(), '', '');

  name: FormControl;
  surname_1: FormControl;
  surname_2: FormControl;
  alias: FormControl;
  birth_date: FormControl;
  email: FormControl;
  password: FormControl;

  registerForm: FormGroup;

  isValidForm: boolean | null = null;

  translations: RegisterTranslation;

  private langSubscription: Subscription;

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    // TODO 17
    this.registerUser = new UserDTO( '', '', '', '', new Date(), '', '');

    this.translations = {
      name: '',
      surname1: '',
      surname2: '',
      alias: '',
      email: '',
      password: ''
    }

    this.attributeTranslateUpdate();

    this.langSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.attributeTranslateUpdate();
    });

    this.name = new FormControl(this.registerUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.surname_1 = new FormControl(this.registerUser.surname_1, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.surname_2 = new FormControl(this.registerUser.surname_2, [
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.alias = new FormControl(this.registerUser.alias, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.birth_date = new FormControl(this.registerUser.birth_date, [
      Validators.required
    ]);
    this.email = new FormControl(this.registerUser.email, [
      Validators.required,
      Validators.email
    ]);
    this.password = new FormControl(this.registerUser.surname_1, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16)
    ]);

    this.registerForm = this.fb.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password
    });
  }

  ngOnInit(): void {}

  async register(): Promise<void> {
    let responseOK: boolean = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.registerForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.registerUser = this.registerForm.value;

    try {
      await this.userService.register(this.registerUser);
      responseOK = true;
    } catch (error: any) {
      responseOK = false;
      errorResponse = error.error;

      const headerInfo: HeaderMenus = {
        showAuthSection: false,
        showNoAuthSection: true,
      };
      this.headerMenusService.headerManagement.next(headerInfo);

      this.sharedService.errorLog(errorResponse);
    }

    await this.sharedService.managementToast(
      'registerFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      // Reset the form
      this.registerForm.reset();
      // After reset form we set birthDate to today again (is an example)
      this.birth_date.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
      this.router.navigateByUrl('home');
    }
  }

  private attributeTranslateUpdate(): void {
    this.translate.get('LOGIN_REGISTER_PROFILE.name').subscribe((res: string) => {
      this.translations.name = res;
    });

    this.translate.get('LOGIN_REGISTER_PROFILE.surname1').subscribe((res: string) => {
      this.translations.surname1 = res;
    });

    this.translate.get('LOGIN_REGISTER_PROFILE.surname2').subscribe((res: string) => {
      this.translations.surname2 = res;
    });

    this.translate.get('LOGIN_REGISTER_PROFILE.alias').subscribe((res: string) => {
      this.translations.alias = res;
    });

    this.translate.get('LOGIN_REGISTER_PROFILE.email').subscribe((res: string) => {
      this.translations.email = res;
    });

    this.translate.get('LOGIN_REGISTER_PROFILE.password').subscribe((res: string) => {
      this.translations.password = res;
    });
  }
}
