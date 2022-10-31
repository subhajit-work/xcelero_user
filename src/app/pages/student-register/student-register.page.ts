import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, ModalController, AlertController, IonContent } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';

import { CommonUtils } from '../../services/common-utils/common-utils';
import { AuthService } from '../../services/auth/auth.service';

import { environment } from '../../../environments/environment';

/* tslint:disable */ 
@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.page.html',
  styleUrls: ['./student-register.page.scss'],
})

export class StudentRegisterPage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content: IonContent;

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  
  constructor(
    private plt: Platform,
    private modalController : ModalController,
    private authService: AuthService,
    private storage: Storage,
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
    private alertController : AlertController,
    private commonUtils: CommonUtils // common functionlity come here
  ) { }

  // variable declartion section
  model: any = {};
  private getListSubscribe: Subscription;
  private uploadSubscribe: Subscription;
  private stateByCitySubscribe: Subscription;
  private formSubmitSubscribe: Subscription;
  private contactByCompanySubscribe: Subscription;
  private editDataSubscribe: Subscription;
  private viewPageDataSubscribe : Subscription;
  private logoutDataSubscribe : Subscription;
  curentDate;
  // select checkbox end

//--------------  getlist data fetch start -------------
  setStartdate;
  setEnddate;
  servicesList;
  selectLoading;
  selectLoadingDepend;
  form_submit_text = 'Submit';
  form_api;
  companyByContact_api;
  uploadURL;
  gender = '1';
  parms_action_name;
  parms_action_id;
  actionHeaderText;
  toggleShow;
  companyList;
  countryList;
  stateList;
  cityList;
  onEditField = 'PUT';
  onHiddenRole;
  editLoading;
  allEditData;
  stateByCity_api;
  getCountryId;
  firstDate;
  secondDate;
  getlistData;
  user_status = true;
  genderArry;
  default_qualification_id;
  qualificationList;
  degreeList;

  // ------ init function call start ------

    commonFunction(){

      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
      
      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
      
      // getlist data
      this.getlist('student/getlist');

      if( this.parms_action_name == 'edit'){
        // form submit api edit
        this.form_api = 'student/return_edit/'+this.parms_action_id;

        console.log('edit data<><><><>', this.form_api);
      }else{
        // form submit api add
        this.form_api = 'student/return_edit';
        console.log('edit data@@@@@@@@@@@@', this.form_api);

        
      }

      //stateByCity_api
      this.stateByCity_api = 'ajaxs_post/'

      // company by contact api
      this.companyByContact_api = 'ajaxs_post/'

      // view data call (autologin check)
      this.viewPageDataSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
        console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
        if(res){
          // this.viewPageData(); 
        }
      })

      // view data call (userdetails from header login only)
      this.viewPageDataSubscribe = this.commonUtils.signinCheckObservable.subscribe(res =>{
        console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. 11>', res);
        if(res){
          // getlist data
          // this.getlist('student/getlist');

        }
      })

      // file upload url
      this.uploadURL = `fileupload?identifier=registration`;

      let curentDate = new Date();
      this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

      setInterval(() => {
        this.curentDate = new Date();
      }, 1);

      // init call
      this.init();

      // multiple qualification
      this.model.qualification = [
        {
          "is_default":true
        }
      ];
      
      // multiple Certification
      this.model.certification = [
        {
          "is_default":true
        }
      ];

      // multiple Experience
      this.model.experience = [
        {
          "is_default":true
        }
      ];
      
    }

  // init
  ngOnInit() {
  //  this.commonFunction();
  }

  // scroll event detect
  isFixedHeader;
  onScrollHedearFix(event) {
    // console.log('scroll onnnnnnnnn', event.detail.scrollTop);
    if (event.detail.scrollTop > 56) {
      // console.log("scrolling down, hiding footer...iffffffffffff");
      this.isFixedHeader = true;
    } else {
      // console.log("scrolling up, revealing footer...elseeeeeeeeeeeeeee");
      this.isFixedHeader = false;
    };
  }

  ionViewWillEnter() {
    this.commonFunction();
  }
  
  ionViewDidEnter(){
    // go to scroll top in mozila browser
    this.content.scrollToTop(0);
  }
  
  // ---------- init start ----------
  init(){
    
    if( this.parms_action_name == 'edit'){
      this.actionHeaderText = 'Edit';
      this.onEditField = 'PUT';
      this.editLoading = true;
      //edit data call
      this.editDataSubscribe = this.http.get(this.form_api).subscribe(
        (res:any) => {
          this.editLoading = false;
          console.log("Edit data  res >", res.return_data);
          if(res.return_status > 0){

            this.model = {
              fname : res.return_data.fname,
              lname : res.return_data.lname,
              mobile : res.return_data.mobile,
              pin : res.return_data.pin,
              email : res.return_data.email,
              password : res.return_data.password,
              gender : res.return_data.gender,
              image : res.return_data.image,
              resume : res.return_data.resume,
              country_id : res.return_data.country_id,
              state_id : res.return_data.state_id,
              city_id : res.return_data.city_id,
              address_1 : res.return_data.address_1,
              address_2 : res.return_data.address_2,
              user_id : res.return_data.id
              /* certification : res.return_data.certification,
              experience : res.return_data.experience,
              qualification : res.return_data.qualification, */
            };

            if(res.return_data.dob == null){
              this.model.dob = null;
            }else{
              this.model.dob =  moment(res.return_data.dob).format('DD/MM/YYYY');
            }

            // gender selected
            this.genderArry = res.return_data.gender_arr;
            if(res.return_data.gender_arr){
              res.return_data.gender_arr.forEach(element => {
                element.gender = res.return_data.gender;
              });
            }

            if(res.return_data.country_id){
              this.stateByCity(res.return_data.country_id , 'return_getState', '' );
            }
            if(res.return_data.state_id){
              this.stateByCity(res.return_data.state_id , 'return_getCity', '' );
            }

            // multiple qualification
            if(res.return_data.qualification.length > 0){
              this.model.qualification = res.return_data.qualification;
              console.log('Qualification>>>', this.model.qualification);
            }else{
              // qualification multiple
              this.model.qualification = [
                {
                  "is_default":true
                }
              ];
              console.log('Qualification<<<<<<<<<<<<<', this.model.qualification);
            } 

            // if(res.return_data.qualification.length == 0){
            //   this.model.qualification = [
            //     {
            //       "is_default":true
            //     }
            //   ];
            // }else{
            //   this.model.qualification = res.return_data.qualification
            // }

            if(res.return_data.certification.length == 0){
              this.model.certification = [
                {
                  "is_default":true
                }
              ];
            }else{
              this.model.certification = res.return_data.certification
            }

            if(res.return_data.experience.length == 0){
              this.model.experience = [
                {
                  "is_default":true
                }
              ];
            }else{
              this.model.experience = res.return_data.experience
            }
            

            // edit data
            this.allEditData = res;
          }
        },
        errRes => {
          // this.selectLoadingDepend = false;
          this.editLoading = false;
        }
      );

    }else{
      this.actionHeaderText = 'Add';
      this.reloadPage();
      
    }
  }
  // ---------- init end ----------

  // ----------------- file upload start -------------
    files: any = [];
    uploadResponseProgress;
    
    // file upload
    uploadFile(_type, e) {
      console.log('e >>>>>>>>>>>>>>>>>>>', e);
      if(_type == 'single'){
        this.files = [];
        let singleFile = e[0];
        this.goForUpload(this.uploadURL, singleFile, this.files);
      }else{
        for (let index = 0; index < e.length; index++) {
          const element = e[index];
          this.goForUpload(this.uploadURL, element, this.files);
        }  
      }
    }
    // goForUpload call
    goForUpload(_url, _getvalue, _filesArray){
      const fd = new FormData();
      fd.append('files', _getvalue, _getvalue.name);

      this.uploadSubscribe = this.http.post<any>(_url, fd, {
        reportProgress: true,
        observe: 'events'
        }).subscribe( event => {
          if(event.type === HttpEventType.UploadProgress){
            this.uploadResponseProgress = Math.round( event.loaded / event.total * 100 );
          }else if(event.type === HttpEventType.Response){
            // console.log('event.body >>>>>', event.body);
            event.body.return_data_mobile.files.id = '';
            _filesArray.push(event.body.return_data_mobile.files);
            this.uploadResponseProgress = 0;
          }
      })
    }
  // file upload end


  onChange(_item){
    // console.log("dropdown selected item >", _item);
  }

  // select state
  OnChangeSelect(_item){
    // this.stateByCity(_item );
  }

  onChangeLocation(_item, _identifire, colon_item){
    let identy;
    if(_identifire == 'state'){
      identy = 'return_getState';

      colon_item.state_id = null;
      colon_item.city_id = null;

      /* this.model.pages_address.forEach(element => {
        if(element.country_id == _item){
          colon_item.state_id = null;
          colon_item.city_id = null;
        }
      }); */
    }else{
      identy = 'return_getCity';
      colon_item.city_id = null;
    }
    this.stateByCity(_item,  identy, colon_item);
  }

  //stateByCity
  stateByCity = function( _id , _name, _colon_item){
    this.selectLoadingDepend = true;
    this.stateByCitySubscribe = this.http.get(this.stateByCity_api+ _name + '/' + _id).subscribe(
      (res:any) => {
        this.selectLoadingDepend = false;
        if(res.return_status > 0){

          if(_name == 'return_getState'){
            this.stateList = res.return_data.state;
          }else{
            this.cityList = res.return_data.city;
          }
        }
    },
    errRes => {
      this.selectLoadingDepend = false;
    }
    );
  }

  onChangeStudy(_item, _identifire, colon_item){

    console.log('onChangeselectDropdown _item >', _item);
    let identy;
    if(_identifire == 'degree'){
      identy = 'return_getDegree?qualification';

      colon_item.degree_id = null;
      colon_item.qual_interest = null;
    }else{
      identy = 'return_getInterest?degree';
      colon_item.qual_interest = null;
    }
    this.contactByCompany(_item,  identy, colon_item);
  } 

  //contactByCompany
  contactByCompany = function( _id , _name, _colon_item){

    if(_colon_item == ''){
      this.model.qualification.forEach(element => {
        // console.log('element country >>', element);
        _colon_item = element;
      });
    }

    this.selectLoadingDepend = true;
    this.contactByCompanySubscribe = this.http.get(this.companyByContact_api+ _name + '=' +_id).subscribe(
      (res:any) => {
      this.selectLoadingDepend = false;

      if(res.return_status > 0){

        if(_name == 'return_getDegree?qualification'){
          _colon_item.degreeList = res.return_data.degree;
        }else{
          _colon_item.interestList = res.return_data.interest;
        }
      }
    },
    errRes => {
      this.selectLoadingDepend = false;
    }
    );
  }

  getlist(_getlistUrl){
    this.plt.ready().then(() => {
      this.selectLoading = true;
      this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
        resData => {
          this.selectLoading = false;

          //------ city/state data fetch start -------
          this.countryList = resData.country;
          this.getlistData = resData;
          this.qualificationList = resData.qualification;

          // this.getlistData
         /*  if(resData.gender){
            resData.gender.forEach(element => {
              element.gender = this.allEditData.return_data.gender;
            });
          } */

          if(resData.country.list){
            resData.country.list.forEach(value => {
              if(value.id == resData.country.default){
                
                this.model.country_id = value.id;
                this.getCountryId = value.id;
                this.stateByCity(this.model.country_id , 'return_getState', '' );
              }
            });
          }


          if(resData.qualification && this.parms_action_name == 'add'){

            resData.qualification.forEach(value => {
              if(value.id !== resData.qualification.default){
                this.model.qualification.forEach(value1 => {
                  value1.qualification_id = value.id;
                  this.default_qualification_id = value.id;
                  this.contactByCompany(this.default_qualification_id , 'return_getDegree?qualification', '' );
                });
               }
            });
          }

          
          /* if(resData.userinfo){
            this.model.fname = resData.userinfo.fname;
            this.model.lname =  resData.userinfo.lname;
            this.model.mobile =  resData.userinfo.mobile;
            this.model.email =  resData.userinfo.email;
            this.model.password =  resData.userinfo.password;

            if(resData.userinfo.state_id){
              this.model.state_id = resData.userinfo.state_id;
              this.stateByCity(this.model.country_id , 'return_getCity', '' );
            }
            
            if(resData.userinfo.city_id){
              this.model.city_id = resData.userinfo.city_id;
              
            }
          } */
          //-city/state data fetch end -

        },
        errRes => {
          this.selectLoading = false;
        }
      );
    });
  }
// getlist data fetch end

// ========= datepicker start =======
  datePickerObj: any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  };

  // get selected date
  myFunction(){
    console.log('get seleted date');
  }

  startdatePickerObj: any = {
    dateFormat: 'DD/MM/YYYY',
    closeOnSelect: true,
    yearInAscending: true
    //inputDate: new Date('2018-08-10'), // default new Date()
  };

  endDatePickerObj:any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  };

  certificationEndDatePickerObj:any ={
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  }

  experienceEndDatePickerObj:any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  }

  // --- start date select ---
  selectCycleDate;
  getStartDate;
  onDateChangeDate(_identifire, _item,  _itemDate){

    console.log('onDateChangeDate _identifire>', _identifire);
    console.log('onDateChangeDate _item >', _item);
    console.log('onDateChangeDate _itemDate >', _itemDate);

    if(_itemDate){
      // ----- original date format convert start -----
        let myFormatDate = _itemDate.split(" ")[0].split("/");
        let _mynewdate = myFormatDate[2] + "-" + myFormatDate[1] + "-" + myFormatDate[0];
      // original date format convert end

      console.log('_itemDate  start date select >>>', _itemDate);
      this.model.end_date = '';

      
      if(_identifire == 'certification_start_date'){
        _item.end_date = '';
        _item.duration = '';
        this.certificationEndDatePickerObj = {
          dateFormat: 'DD/MM/YYYY',
          fromDate: new Date(_mynewdate),
          closeOnSelect: true,
          yearInAscending: true
        };
      }else if(_identifire == 'experience_start_date'){
        _item.end_date = '';
        _item.duration = '';
        this.experienceEndDatePickerObj = {
          dateFormat: 'DD/MM/YYYY',
          fromDate: new Date(_mynewdate),
          closeOnSelect: true,
          yearInAscending: true
        };
      }

      // ----- no of day calculate start --------
      /* const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const firstDate = new Date(2008, 1, 12);
      const secondDate = new Date(2008, 1, 22);

      const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); */
      
      if(_identifire == 'certification_end_date' || _identifire == 'experience_end_date'){
        // ----- original date format convert start -----
        let myFormatDateStart
        if(_item.start_date){
          myFormatDateStart = _item.start_date.split(" ")[0].split("/");
        }
        // original date format convert end
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        this.firstDate = new Date(myFormatDateStart[2], myFormatDateStart[1], myFormatDateStart[0]);
        this.secondDate = new Date(myFormatDate[2], myFormatDate[1], myFormatDate[0]);

        _item.duration = Math.round(Math.abs((this.firstDate - this.secondDate) / oneDay));
        console.log('diffDays >>>>>>>>>>>>>>>>>>>>>>>>>>>>////////////>>>>>>', _item.duration);
      }
      // no fo day calculate end

    }else{
      _item.end_date = '';
      _item.duration = '';
    }
    
  }


// datepicker  end

//======= datepicker  end ==============

// radiobutton change
radioButtonChange(_val){
  console.log('radio button change value >', _val);
}


// ======================== form submit start ===================
  clickButtonTypeCheck = '';
  form_submit_text_save = 'Save';
  form_submit_text_save_another = 'Save & Add Another' ;

  // click button type 
  clickButtonType( _buttonType ){
    this.clickButtonTypeCheck = _buttonType;
  }

  onSubmit(form:NgForm){
    console.log("add form submit >", form.value);
    
    if(this.clickButtonTypeCheck == 'Save'){
      this.form_submit_text_save = 'Submitting';
    }else{
      this.form_submit_text_save_another = 'Submitting';
    }

    this.form_submit_text = 'Submitting';

    // get form value
    let fd = new FormData();

    if(this.fileValResume) {
      // normal file upload
      fd.append(this.normalFileNameResume, this.fileValResume, this.fileValResume.name);
    }else if(this.fileValResumeCross == 'cross_resume'){
      fd.append('resume', 'removed');
    }else{
      fd.append('resume', '');
    }
  

    // fileValprofile
    if(this.fileValprofile) {
      // normal file upload
      fd.append(this.normalFileNameProfile, this.fileValprofile, this.fileValprofile.name);
    }else if(this.fileValprofileCross == 'cross_image'){
      fd.append('image', 'removed');
    }else{
      fd.append('image', '');
    }

    for (let val in form.value) {
      if(form.value[val] == undefined){
        form.value[val] = '';
      }
      fd.append(val, form.value[val]);
    };

    console.log('value >', fd);

    if(!form.valid){
      return;
    }

    this.formSubmitSubscribe = this.http.post(this.form_api, fd).subscribe(
      (response:any) => {

        if(this.clickButtonTypeCheck == 'Save'){
          this.form_submit_text_save = 'Save';
        }else{
          this.form_submit_text_save_another = 'Save & Add Another';
        }

        // this.authService.getTokenSessionMaster();

        console.log("add form response >", response);

        if(response.return_status > 0){

          this.form_submit_text = 'Submit';
          
          this.router.navigateByUrl(`profile/${response.return_data.user.id}`);
          
          // user details set
          if(response.return_data.user){
            this.commonUtils.onSigninStudentInfo(response.return_data.user);
          }
          
          this.files = [];
          // this.commonUtils.presentToast(response.return_message);
          this.commonUtils.presentToast('success', response.return_message);

          if(this.clickButtonTypeCheck == 'Save'){

            // this.router.navigate(['/student-list']);

          }

          // this.notifier.notify( type, 'aa' );
    
          if( this.parms_action_name == 'add'){
            // form.reset();
            this.model = {};
            this.model = {
              enable : 'true',
              sms: 'true',
              emailcheck: 'true'
            };
          }
          
        }else{
          this.form_submit_text = 'Submit';
        }
      },
      errRes => {
        if(this.clickButtonTypeCheck == 'Save'){
          this.form_submit_text_save = 'Save';
        }else{
          this.form_submit_text_save_another = 'Save & Add Another';
        }
        this.form_submit_text = 'Submit';
      }
    );

  }
// form submit end

// delete uploaded file Aleart Start

  @ViewChild('fileInput') fileInputVariable: ElementRef;

  async deleteAlertConfirm(_itemsArray, _index) {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Do you really want to delete selected item ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'popup-cancel-btn',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          cssClass: 'popup-ok-btn',
          handler: () => {
            // console.log('Confirm Okay');
            _itemsArray.splice(_index, 1);
            this.fileInputVariable.nativeElement.value = "";

          }
        }
      ]
    });

    await alert.present();
  }
// delete  Aleart End

// Normal file upload
  fileValResume;
  fileValprofile;
  fileValprofileCross;
  fileValResumeCross;
  normalFileNameResume;
  normalFileNameProfile;
  uploadImagePathShow = false;
  uploadresumePathShow = false;
  imgaePreview;
  normalFileUpload(event, _item, _name) {
    console.log('nomal file upload _item => ', _item);
    console.log('nomal file upload _name => ', _name);

    if(_name == 'resume'){
      this.fileValResume =  event.target.files[0];
      _item =  event.target.files[0].name;
      this.normalFileNameResume = _name;
      this.uploadresumePathShow = true;
    }else{
      this.fileValprofile =  event.target.files[0];

      const render = new FileReader();
      render.onload = () =>{
        this.imgaePreview = render.result;
        // console.log('this.imgaePreview >>', this.imgaePreview);
      }
      render.readAsDataURL(this.fileValprofile);

      _item =  event.target.files[0].name;
      this.normalFileNameProfile = _name;
      this.uploadImagePathShow = true;
    }
  }
  fileCross(_item, _identifire){
    if(_identifire == 'resume'){
      this.model.resume = null;
      this.model.resume2 = null;
      this.normalFileNameResume = '';
      this.fileValResumeCross = 'cross_resume';

    }else{
      this.model.image = null;
      this.model.image2 = null;
      this.normalFileNameProfile = '';
      this.fileValprofileCross = 'cross_image';
      this.uploadImagePathShow = false;
    }
  }
// Normal file upload end

//----------- reload page start ------------
  reloadPage(){
    if( this.parms_action_name == 'add'){
      this.files = [];
      this.model = {
        enable : 'true',
        sms: 'true',
        emailcheck: 'true'
      };
    }else{
      console.log('this.allEditData.return_data.dob >>>>>>>>>>>> ####################################################### 222', this.allEditData.return_data.dob);
      this.model = {
        fname : this.allEditData.return_data.fname,
        lname : this.allEditData.return_data.lname,
        mobile : this.allEditData.return_data.mobile,
        pin : this.allEditData.return_data.pin,
        email : this.allEditData.return_data.email,
        password : this.allEditData.return_data.password,
        gender : this.allEditData.return_data.gender,
        image : this.allEditData.return_data.image,
        resume : this.allEditData.return_data.resume,
        country_id : this.allEditData.return_data.country_id,
        state_id : this.allEditData.return_data.state_id,
        city_id : this.allEditData.return_data.city_id,
        address_1 : this.allEditData.return_data.address_1,
        address_2 : this.allEditData.return_data.address_2,
        user_id : this.allEditData.return_data.id
      };

      if(this.allEditData.return_data.dob == null){
        this.model.dob = null;
      }else{
        this.model.dob =  moment(this.allEditData.return_data.dob).format('DD/MM/YYYY');
      }

      // gender selected
      this.genderArry = this.allEditData.return_data.gender_arr;
      if(this.allEditData.return_data.gender_arr){
        this.allEditData.return_data.gender_arr.forEach(element => {
          element.gender = this.allEditData.return_data.gender;
        });
      }

      if(this.allEditData.return_data.country_id){
        this.stateByCity(this.allEditData.return_data.country_id , 'return_getState', '' );
      }
      if(this.allEditData.return_data.state_id){
        this.stateByCity(this.allEditData.return_data.state_id , 'return_getCity', '' );
      }

      // if(this.allEditData.return_data.qualification.length == 0){
      //   this.model.qualification = [
      //     {
      //       "is_default":true
      //     }
      //   ];
      // }else{
      //   this.model.qualification = this.allEditData.return_data.qualification
      // }

      if(this.allEditData.return_data.certification.length == 0){
        this.model.certification = [
          {
            "is_default":true
          }
        ];
      }else{
        this.model.certification = this.allEditData.return_data.certification
      }

      if(this.allEditData.return_data.experience.length == 0){
        this.model.experience = [
          {
            "is_default":true
          }
        ];
      }else{
        this.model.experience = this.allEditData.return_data.experience
      }

    }
  }
  // reload alert
  async reloadPageAlert() {
    const reload = await this.alertController.create({
      header: 'Clear',
      message: 'Do you really want to Clear?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'popup-cancel-btn',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          cssClass: 'popup-ok-btn',
          handler: () => {
            // console.log('Confirm Okay');
            this.reloadPage();

          }
        }
      ]
    });

    await reload.present();
  }
// reload page end
// addItem
  addItem(_items){
    console.log('_items >', _items);
    this.commonUtils.addToItem(_items);

    // _items.push({"is_default":true,"qualification_id":this.default_qualification_id});
    // console.log('_items >>>>>>>>.', _items);

    // this.contactByCompany(this.default_qualification_id , 'return_getDegree', '' );
  }

  // remove item
  removeItem(index, event, items, action, isDefault){
    this.commonUtils.removeToItem(index, event, items, action, isDefault);
  }

  // ------ export function call start ------
   export_url;
   onExport(_identifier, _item){
      this.getListSubscribe = this.authService.globalparamsData.subscribe(res => {
      //  this.export_url = this.main_url+'/transaction_print/'+_item+'?token='+res.token+'&master='+res.master;
        this.export_url = this.file_url+'/'+_item;
      });
      window.open(this.export_url);
   }
   // export function call end

// ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.getListSubscribe !== undefined){
      this.getListSubscribe.unsubscribe();
    }
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
    if(this.stateByCitySubscribe !== undefined){
      this.stateByCitySubscribe.unsubscribe();
    }
    if(this.uploadSubscribe !== undefined){
      this.uploadSubscribe.unsubscribe();
    }
    if(this.editDataSubscribe !== undefined ){
      this.editDataSubscribe.unsubscribe();
    }
    if(this.viewPageDataSubscribe !== undefined ){
      this.viewPageDataSubscribe.unsubscribe();
    }
    if(this.contactByCompanySubscribe !== undefined){
      this.contactByCompanySubscribe.unsubscribe();
    }
    if(this.logoutDataSubscribe !== undefined ){
      this.logoutDataSubscribe.unsubscribe();
    }
  }
// destroy subscription end
}