import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

import { UserDTO } from 'src/app/Models/user.dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface ProfileTranslation {
  name: string;
  surname1: string;
  surname2: string;
  alias: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  // TODO 4
  profileUser: UserDTO;

  name: FormControl;
  surname_1: FormControl;
  surname_2: FormControl;
  alias: FormControl;
  birth_date: FormControl;
  email: FormControl;
  password: FormControl;

  profileForm: FormGroup;

  isValidForm: boolean | null = null;

  translations: ProfileTranslation;

  private langSubscription: Subscription;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService
  ) {
    // TODO 5
    this.profileUser = new UserDTO( '', '', '', '', new Date(), '', '');

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

    this.name = new FormControl(this.profileUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.surname_1 = new FormControl(this.profileUser.surname_1, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.surname_2 = new FormControl(this.profileUser.surname_2, [
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.alias = new FormControl(this.profileUser.alias, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25)
    ]);
    this.birth_date = new FormControl(this.profileUser.birth_date, [
      Validators.required
    ]);
    this.email = new FormControl(this.profileUser.email, [
      Validators.required,
      Validators.email
    ]);
    this.password = new FormControl(this.profileUser.surname_1, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16)
    ]);

    this.profileForm = this.formBuilder.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password
    });
  }

  async ngOnInit(): Promise<void> {
    let errorResponse: any;

    // load user data
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      try {
        const userData = await this.userService.getUSerById(userId);

        this.name.setValue(userData.name);
        this.surname_1.setValue(userData.surname_1);
        this.surname_2.setValue(userData.surname_2);
        this.alias.setValue(userData.alias);
        this.birth_date.setValue(
          formatDate(userData.birth_date, 'yyyy-MM-dd', 'en')
        );
        this.email.setValue(userData.email);

        this.profileForm = this.formBuilder.group({
          name: this.name,
          surname_1: this.surname_1,
          surname_2: this.surname_2,
          alias: this.alias,
          birth_date: this.birth_date,
          email: this.email,
          password: this.password,
        });
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  async updateUser(): Promise<void> {
    let responseOK: boolean = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.profileForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.profileUser = this.profileForm.value;

    const userId = this.localStorageService.get('user_id');

    if (userId) {
      try {
        await this.userService.updateUser(userId, this.profileUser);
        responseOK = true;
      } catch (error: any) {
        responseOK = false;
        errorResponse = error.error;

        this.sharedService.errorLog(errorResponse);
      }
    }

    await this.sharedService.managementToast(
      'profileFeedback',
      responseOK,
      errorResponse
    );
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
