import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, Platform, NavParams, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Observable, Subscription, from } from 'rxjs';
import { take } from 'rxjs/operators';


import { CommonUtils } from '../../../services/common-utils/common-utils';
import { environment } from '../../../../environments/environment';

// for login
import { AuthService } from '../../../services/auth/auth.service';


/* tslint:disable */ 
@Component({
  selector: 'app-add-common-model',
  templateUrl: './add-common-model.page.html',
  styleUrls: ['./add-common-model.page.scss'],
})
export class AddCommonModelPage implements OnInit, OnDestroy {
  
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  
  // variable declar
  model: any = {};
  form_submit_text = 'Submit';
  private formSubmitSubscribe: Subscription;
  private editDataSubscribe: Subscription;
  private getListSubscribe: Subscription;
  setStartdate;
  api_url;

  get_identifier;
  get_item;
  get_array;
  heder_title;
  onEditField = 'PUT';
  jobApplyStatus = 'true';
  showSubmitButton = true;
  previewOtherUrl;
  principleStartdate;
  get_identifier_type;
  onHiddenFieldIdentifire;
  get_hidden_type;
  onHiddenFieldStatus;
  selectLoading;
  site_url_name;
  senduserId;
  senduserIdStatus = false;

  parentList;
  isLoading = false;

  // @Input() identifire;
  
  constructor(
    private plt: Platform,
    private modalController : ModalController,
    private http : HttpClient,
    private navParams : NavParams,
    private commonUtils: CommonUtils, // common functionlity come here
    private authService:AuthService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {

    // today select
    let curentDate = new Date();
    this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

    // this.model.setStartdate = moment(curentDate).format('DD/MM/YYYY');

    this.get_identifier =  this.navParams.get('identifier');
    this.get_identifier_type =  this.navParams.get('identifier_type');
    this.get_hidden_type =  this.navParams.get('hidden_type');

    this.get_item =  this.navParams.get('modalForm_item');
    this.get_array =  this.navParams.get('modalForm_array');
    console.log('this.get_item >>>>>>>>>>>>>>', this.get_item);

    if(this.get_identifier == 'signUp')
    {
      this.heder_title = 'Sign Up';
      this.onEditField = 'PUT';
      this.api_url = 'student/signup';
    }else if(this.get_identifier == 'signIn'){
      this.heder_title = 'Sign In';
      this.onEditField = 'PUT';
      this.api_url = 'student/signin';
    }else if(this.get_identifier == 'forgotPassword'){
      this.heder_title = 'Forgot Password';
      this.onEditField = 'PUT';
      this.api_url =  'student/forget_password';
    }else if(this.get_identifier == 'change_password_modal'){
      this.heder_title = 'Change Password';
      this.onEditField = 'PUT';
      this.api_url = 'login/change_password/'+ this.get_item.id;
    }else if(this.get_identifier == 'apply_query'){
      this.heder_title = this.get_item.name;
      this.onEditField = 'PUT';
      this.api_url = 'job_applicant/return_add/'+ this.get_item.id;
      this.form_submit_text = 'Apply';
    }else if(this.get_identifier == 'onpay'){
      this.heder_title = 'Pay';
      this.onEditField = 'PUT';
      this.api_url = 'job_applicant/return_add/'+ this.get_item.id;
    }else if(this.get_identifier == 'get_in_touch'){
      this.heder_title = 'Pre-Counseling Form';
      this.onEditField = 'PUT';
      

      // signin student  data call
      this.commonUtils.signinStudentInfoObservable.pipe(
        take(1)
      ).subscribe(res =>{
        console.log('signinStudentInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
        if(res){
          this.api_url = 'student/pre_counseling_update/'+res.id;
          this.senduserId = res.id;
          this.senduserIdStatus = true;

          // ================== view data fetch start =====================
            this.editDataSubscribe = this.http.get('student/dashboard').subscribe(
              (res:any) => {
                // this.viewLoadData = false;
                console.log("view data  res -------------------header ss ->", res.return_data);
                if(res.return_status > 0){
                  // this.get_user_dtls = res.return_data.studentinfo;

                  this.model.fname = res.return_data.studentinfo.fname;
                  this.model.lname = res.return_data.studentinfo.lname;
                  this.model.mobile = res.return_data.studentinfo.mobile;
                  this.model.email = res.return_data.studentinfo.email;
                  this.model.resume = res.return_data.studentinfo.resume;

                  // user details set
                  this.commonUtils.onSigninStudentInfo(res.return_data.studentinfo);
                }
              },
              errRes => {
                // this.viewLoadData = false;
              }
            );
          // view data fetch end

        }else{
          this.api_url = 'student/pre_counseling_signup';
        }
      })

    }

  }

  // ======================== form submit start ===================
    onSubmit(form:NgForm){
      this.form_submit_text = 'Submitting';

      // get form value
      let fd = new FormData();

      // get_in_touch
      if(this.get_identifier == 'get_in_touch'){
        if(this.fileValResume) {
          // normal file upload
          fd.append('resume', this.fileValResume, this.fileValResume.name);
        }else{
          fd.append('resume', '');
        }
      }
      
      for (let val in form.value) {
        if(form.value[val] == undefined){
          form.value[val] = '';
        }
        fd.append(val, form.value[val]);

      };

      if(!form.valid){
        return;
      }
      this.formSubmitSubscribe = this.http.post(this.api_url, fd).subscribe(
        (response:any) => {
          if(this.get_identifier == 'apply_query'){
            this.form_submit_text = 'Apply';
          }else{
            this.form_submit_text = 'Submit';
          }
          if(response.return_status > 0){

            this.commonUtils.presentToast('success', response.return_message);
            form.reset();
            
            if(this.get_identifier == 'get_in_touch'){
              this.model = {};
              this.model.resume = '';
              this.model.resume2 = '';
              this.fileValResume = '';

              // user details set
              if(response.return_data.user){
                this.commonUtils.onSigninStudentInfo(response.return_data.user);
              }
            }

            if(this.get_identifier == 'apply_query'){
              this.modalController.dismiss('applyQuerysubmitClose');
              this.get_item.job_applied = 1;
            }else{
              this.modalController.dismiss('submitClose');
              
            }
          }
        },
        errRes => {
          if(this.get_identifier == 'apply_query'){
            this.form_submit_text = 'Apply';
          }else{
            this.form_submit_text = 'Submit';
          }
        }
      );

    }
  // form submit end


  //---------------- login form submit start-----------------
    onSubmitSingInForm(form:NgForm){
      this.isLoading = true;
      console.log('form >>', form.value);
      if(!form.valid){
        return;
      }

      this.authenticate(form, form.value);
      // form.reset();

    }

    // authenticate function
    authenticate(_form, form_data) {
      this.isLoading = true;
      this.loadingController
        .create({ keyboardClose: true, message: 'Logging in...' })
        .then(loadingEl => {
          loadingEl.present();
          let authObs: Observable<any>;
          authObs = this.authService.login(this.api_url, form_data, '')
          
          this.formSubmitSubscribe = authObs.subscribe(
            resData => {
              console.log('resData ============= (sign in) ))))))))))))))>', resData);
              if(resData.return_status > 0)
              {
                console.log('user Type =============))))))))))))))>', resData.return_data.user_type);
                
                // this.router.navigateByUrl('/dashboard');
                // service 
                
                this.commonUtils.onClicksigninCheck(resData.return_data.user_info);

                // user details set
                this.commonUtils.onSigninStudentInfo(resData.return_data.user_info);
                
                setTimeout(() => {
                  _form.reset();
                  loadingEl.dismiss();
                  this.modalController.dismiss('submitClose');
                  this.commonUtils.presentToast('success', resData.return_message);
                }, 2000);
      
              }else{
                loadingEl.dismiss();
                this.commonUtils.presentToast('error', resData.return_message);
              }
              
              // console.log("data login after resData ++++++>", resData);
              this.isLoading = false;
              // loadingEl.dismiss();
              // this.router.navigateByUrl('/places/tabs/discover');
            },
            errRes => {
              loadingEl.dismiss();
            }
          );
        });
    }
  // login form submit end

  // ..... userAuthenticate modal start ......
    async userAuthenticateModal(_identifier, _item, _items) {
      // console.log('_identifier >>', _identifier);

      this.modalController.dismiss(); //click file first close

      let open_modal;
      let myclass;
      if(_identifier == 'forgotPassword' || _identifier == 'signIn'){
        myclass = 'mymodalClass signin';
      }else{
        myclass = 'mymodalClass';
      }

      open_modal = await this.modalController.create({
        component: AddCommonModelPage,
        cssClass: myclass,
        componentProps: { 
          identifier: _identifier,
          modalForm_item: _item,
          modalForm_array: _items
        }
      });
      
      // modal data back to Component
      open_modal.onDidDismiss()
      .then((getdata) => {
        // console.log('getdata >>>>>>>>>>>', getdata);
        if(getdata.data == 'submitClose'){
          /* this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);  */
        }

      });

      return await open_modal.present();
    }
  // userAuthenticate modal end 

  // onChange dropdown
  onChange(event){

  }

  // close modal
  closeModal() {
    // this.modalController.dismiss(this.arrayList);
    this.modalController.dismiss();
  }

  // -----datepicker start------

    datePickerObj: any = {
      dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
      toDate: new Date(),
      closeOnSelect: true,
      yearInAscending: true
    };

    principledatePickerObj: any = {
      dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
      closeOnSelect: true,
      yearInAscending: true
    };

    // get selected date
    myFunction(){
      console.log('get seleted date')
    }
// datepicker 

  // -------------- edit page api call start  ------------
    profileLoading;
    allClient;
    editPagaDataCall(api_name, _item){
      // console.log('aa _item >', _item.toString());
      this.onEditField = 'PUT';
      this.profileLoading = true;
      //edit data call
      this.editDataSubscribe = this.http.get(api_name+'/'+_item.id).subscribe(
        (res:any) => {
          this.profileLoading = false;
          console.log("Edit data  res profile >", res.return_data);
          if(res.return_status > 0){

            this.model = {
              name : res.return_data.name,
              // borrower : JSON.parse(res.return_data.client[0].id),
              // enable : res.return_data.status,
              is_login : res.return_data.is_login,
              description : res.return_data.description
            };

            // status
            if(res.return_data.status){
              if(res.return_data.status == '1'){
                  this.model.enable = 'true';
              }else{
                  this.model.enable = '';
              }
            }
            
            if(res.return_data.user_info){
              this.model.username = res.return_data.user_info[0].email;
              this.model.password = res.return_data.user_info[0].password;
            }

            // console.log('country >', this.model.country);
            this.allClient = [];
            res.return_data.client.forEach(element => {
              this.allClient.push(element);
            });
            // this.selectedPeople = [this.people[0].id, this.people[1].id
          }
        },
        errRes => {
          // this.selectLoadingDepend = false;
          this.profileLoading = false;
        }
      );

    }
  // edit page api call end

// getlist data fetch start
  getlist(_getlistUrl){
    this.plt.ready().then(() => {
      this.selectLoading = true;
      this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
        resData => {
          this.selectLoading = false;
          this.parentList = resData.parent;
        },
        errRes => {
          this.selectLoading = false;
        }
      );
    });
  }
// getlist data fetch end

// Normal file upload
  fileVal;
  fileValResume;
  uploadresumePathShow = false;
  normalFileUpload(event) {
    this.fileVal =  event.target.files[0];
    this.model.csvFile =  event.target.files[0].name;

    this.fileValResume =  event.target.files[0];
    this.model.resume =  event.target.files[0].name;
    this.uploadresumePathShow = true;
  }
  fileCross(){
    this.model.csvFile = '';
    this.model.image2 = '';
    
    this.model.resume = '';
    this.model.resume2 = '';
    this.fileValResume = '';
  }
// Normal file upload end

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

  // destroy call
  ngOnDestroy(){
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
    if(this.editDataSubscribe !== undefined){
      this.editDataSubscribe.unsubscribe();
    }
    if(this.getListSubscribe !== undefined){
      this.getListSubscribe.unsubscribe();
    }
  }

}

