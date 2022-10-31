import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, IonContent,  MenuController, Platform, AlertController } from '@ionic/angular';
import { AddCommonModelPage } from '../../pages/modal/add-common-model/add-common-model.page';

import { CommonUtils } from './../../services/common-utils/common-utils';
import { AuthService } from './../../services/auth/auth.service';

import { environment } from '../../../environments/environment';
import { NgForm } from '@angular/forms';


declare var $ :any; //jquary declear

declare var Razorpay: any;   //Razorpay payment getway declar and file index.html(<script src="https://checkout.razorpay.com/v1/checkout.js"></script>)

/* tslint:disable */ 
@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.page.html',
  styleUrls: ['./personal-information.page.scss'],
})
export class PersonalInformationPage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content: IonContent;

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  // variable declartion section
  model: any = {};
  isListLoading = false;
  page = 1;
  noDataFound = true;
  fetchItems;
  tableHeaderData;
  tableHeaderDataDropdown;
  current_url_path_name;
  private viewPageDataSubscribe: Subscription;
  private getListSubscribe : Subscription;
  private stateByCitySubscribe : Subscription;
  private formSubmitSubscribe : Subscription;
  parms_action_id;
  listing_view_url;
  viewLoadData;
  viewData;
  gstCalculation;
  allTotal;
  selectLoading;
  countryList;
  stateList;
  cityList;
  selectLoadingDepend;
  state_by_city;
  getCountryId;
  paymentoptions;
  paymentUser;
  orderInfoData;
  order_image;

  constructor(
    private activatedRoute : ActivatedRoute,
    private plt: Platform,
    private router: Router,
    private http : HttpClient,
    private commonUtils : CommonUtils,
    private authService : AuthService,
    private modalController : ModalController,
  ) { }

  // tslint:disable-next-line: comment-format
  // pager object
  pager: any = {};
  // paged items
  pageItems: any[];

  listAlldata;
  form_api;
  parms_action_name;
  stateByCity_api;

  // ------ init function call start -------
  commonFunction(){
    // get active url name
    this.current_url_path_name =  this.router.url.split('/')[1] + 'ColumnSelect';
    this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);

    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
    
    // getlist data
    this.getlist('student/getlist');

    // form submit api add
    this.form_api = 'student/return_edit_personalinfo/'+this.parms_action_id;

    //stateByCity_api
    this.stateByCity_api = 'ajaxs_post/'

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
        this.getlist('student/getlist');

      }
    })

    //oredr information get
    this.viewPageDataSubscribe = this.commonUtils.orderInfoObservable.subscribe(res =>{
      console.log('order information >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', res);
      if(res){
        // this.viewPageData(); 
        this.orderInfoData = res;
      }
    })

  }

  ngOnInit() {
  }

  // scroll event detect
  isFixedHeader;
  onScrollHedearFix(event) {
    console.log('scroll onnnnnnnnn', event.detail.scrollTop);
    if (event.detail.scrollTop > 56) {
      console.log("scrolling down, hiding footer...iffffffffffff");
      this.isFixedHeader = true;
    } else {
      console.log("scrolling up, revealing footer...elseeeeeeeeeeeeeee");
      this.isFixedHeader = false;
    };
  }

  // ion View Will Enter call
  ionViewWillEnter() {
    this.commonFunction();
  }

  ionViewDidEnter(){
    // go to scroll top in mozila browser
    this.content.scrollToTop(0);
  }

  onChange(_item){
    console.log("dropdown selected item >", _item);
  }

  // select company
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

  getlist(_getlistUrl){
    this.plt.ready().then(() => {
      this.selectLoading = true;
      this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
        resData => {
          this.selectLoading = false;
          this.countryList = resData.country;

          if(resData.country.list){
            resData.country.list.forEach(value => {
              if(value.id == resData.country.default){
                this.model.country_id = value.id;
                this.getCountryId = value.id;
                this.stateByCity(this.model.country_id , 'return_getState', '' );
              }
            });
          }

          if(resData.userinfo){
            this.model.fname = resData.userinfo.fname;
            this.model.lname =  resData.userinfo.lname;
            this.model.mobile =  resData.userinfo.mobile;
            this.model.email =  resData.userinfo.email;

            if(resData.userinfo.state_id){
              this.model.state_id = resData.userinfo.state_id;
              this.stateByCity(this.model.state_id , 'return_getCity', '' );
            }
            
            if(resData.userinfo.city_id){
              this.model.city_id = resData.userinfo.city_id;
              
            }
          }
          

          // this.stateList = resData.state;
          // this.cityList = resData.city;
        },
        errRes => {
          this.selectLoading = false;
        }
      );
    });
  }
  // getlist data fetch end

  // -----datepicker start------
  datePickerObj: any = {
    dateFormat: 'DD/MM/YYYY' // default DD MMM YYYY
  };

  // get selected date
  onChangeDateTime(_val){
    console.log('get seleted time >', _val);
    this.model.time_preffer = _val;
  }

  startdatePickerObj: any = {
    dateFormat: 'DD/MM/YYYY',
    closeOnSelect: true,
    yearInAscending: true
    //inputDate: new Date('2018-08-10'), // default new Date()
  };

  timePickerObj: any = {
    timeFormat: '', // default 'hh:mm A'
    setLabel: 'Set', // default 'Set'
    closeLabel: 'Close', // default 'Close'
    titleLabel: 'Select a Time', // default 'Time'
    clearButton: false, // default true
    btnCloseSetInReverse: false, // default false
    momentLocale: 'pt-BR', //  default 'en-US'
  };
  
  // datepicker 

  // ======================== form submit start ===================
    form_submit_text = 'Proceed to Pay';
    onSubmit(form:NgForm){
      console.log("add form submit >", form.value);

      this.form_submit_text = 'Submitting';

      // get form value
      let fd = new FormData();
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
        (res:any) => {

          console.log("add form response >", res);
          console.log("add form response.return_data >", res.return_data);

          if(res.return_status > 0){

            this.form_submit_text = 'Proceed to Pay';
            // bank object
            // this.model = {};
            if(res.return_data.skill.image){
              this.order_image = this.file_url+'/'+res.return_data.skill.image;
            }else {
              this.order_image = "assets/images/no-bg-img.jpg";
            }

            this.commonUtils.presentToast('success', res.return_message);

            // getlist data
            this.getlist('student/getlist');

            
            // -----------------razorpay payment getwat call start-------------------
              /* this.paymentoptions = {
                "key": 'rzp_test_oBBldknGgfDRpv', // Enter the Key ID generated from the Dashboard
                "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
                "currency": "INR",
                "name": "Acme Corp",
                "description": "A Wild Sheep Chase is the third novel by Japanese author  Haruki Murakami",
                "image": "https://example.com/your_logo",
                "handler": function (response) {
                  //alert(response.razorpay_payment_id); error alert
            
                  console.log('my api call');
                  // bank object
                  this.model = {};
                },
                "prefill": {
                  "name": "amin uddin",
                  "email": "amidenf9701@gmail.com",
                  "contact": "7992239847"
                },
                "notes": {
                  "address": "note value"
                },
                "theme": {
                  "color": "#56b9e0"
                }
              }; */

              var paymentSucessVariable = 0;

              this.paymentoptions = {
                "key": res.return_data.site.razorpay_key, //(rzp_test_oBBldknGgfDRpv) Enter the Key ID generated from the Dashboard
                "amount": res.return_data.final_price * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
                "currency": "INR",
                "name": res.return_data.skill.name,
                "description": res.return_data.skill.short_description,
                "image": this.order_image,
                "handler": function (response) {
                  //alert(response.razorpay_payment_id); //error alert
            
                  console.log('===================== my api call ================');
                  // bank object
                  this.model = {};

                  // order sucess data fetch start
                  // this.orderSuccessPageData();
                  /* this.viewPageDataSubscribe = this.http.get('order_details/return_add').subscribe(
                    (res:any) => {
                      this.viewLoadData = false;
                      console.log("order success view data  res -------------------->", res.return_data);
                      if(res.return_status > 0){
                        // this.viewData = res.return_data;
                      }
                    },
                    errRes => {
                      this.viewLoadData = false;
                    }
                  ); */
                  
                  //------ api call only javascript work start---------
                  var opts = {
                    method: 'GET',      
                    headers: {}
                  };
                  var order_api = res.return_data.site_full_api+'&payment_id='+response.razorpay_payment_id;
                  fetch(order_api, opts).then(function (responsee) {
                    // return response.json();
                  })
                  .then(function (body) {
                    //doSomething with body;
                    console.log('body >>>>>>>>>>>>>>>>>>>>', body);
                    paymentSucessVariable = 1;
                    // this.router.navigateByUrl(`dashboard`);
                  });
                  //-api call only javascript work end-

                  // this.router.navigateByUrl(`dashboard`);
                  
                },
                "prefill": {
                  "name": res.return_data.full_name,
                  "email": res.return_data.email,
                  "contact": res.return_data.mobile
                },
                "notes": {
                  "address": res.return_data.address
                },
                "theme": {
                  "color": "#56b9e0"
                }
              };
              // initPay() {
                var rzp1 = new Razorpay(this.paymentoptions);
                rzp1.open();
                console.log("payment works");
              // }
            //------ razorpay payment getwat call end -----

           
            // this.router.navigateByUrl(`dashboard`);
            
            // payment success then redirect to dashboard
            let prevNowPlaying = setInterval(() => {
              if(paymentSucessVariable == 1){
                clearInterval(prevNowPlaying);
                this.router.navigateByUrl(`dashboard`);

              }
            }, 1000);


          }
        },
        errRes => {
          this.form_submit_text = 'Proceed to Pay';
        }
      );

    }
  // form submit end

  // payment getway function call
    async onPaySkill(_identifier, _item, _items) {
      // console.log('_identifier >>', _identifier);
      let open_modal;
      let myclass;
      if(_identifier == 'onpay'){
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
        console.log('getdata >>>>>>>>>>>', getdata);
        if(getdata.data == 'submitClose'){
          // this.viewPageData(); 
        }
        if(getdata.data == 'applyQuerysubmitClose'){
          // console.log('applyQuerysubmitClose');
          // this.disableApplyButton = true;

        }

      });

      return await open_modal.present();
    }
  // userAuthenticate modal end 


  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.getListSubscribe !== undefined){
        this.getListSubscribe.unsubscribe();
      }
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
      if(this.stateByCitySubscribe !== undefined){
        this.stateByCitySubscribe.unsubscribe();
      }
      if(this.formSubmitSubscribe !== undefined){
        this.formSubmitSubscribe.unsubscribe();
      }
    }
  // destroy subscription end
}

