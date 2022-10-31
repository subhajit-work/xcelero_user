import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ResponsiveService } from '../../services/responsive.service';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { IonContent, MenuController, Platform, AlertController, ModalController } from '@ionic/angular';

import { CommonUtils } from '../../services/common-utils/common-utils';
import { AddCommonModelPage } from '../../pages/modal/add-common-model/add-common-model.page';
import { environment } from '../../../environments/environment';

declare var $ :any; //jquary declear

/* tslint:disable */ 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content: IonContent;

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  
  // variable
  public isMobile: Boolean;
  skilsList;
  jobTypeList;
  careersList;
  locationList;
  selectLoading;
  model: any = {};
  private formSubmitSearchSubscribe: Subscription;
  private homePageDataSubscribe : Subscription;
  private commonPageDataSubscribe : Subscription;
  private contactByCompanySubscribe: Subscription;
  private autoCompliteSubscribe : Subscription;
  homeLoadData;
  homePageData;
  home_page_url;
  commonPageContent;
  degreeList;
  interestList;
  companyByContact_api;
  default_degree_id;
  selectLoadingDepend;
  qual_interest_with_data;


  isReadmoreCollapsed;

  constructor(
    private responsiveService : ResponsiveService,
    private http : HttpClient,
    private commonUtils : CommonUtils,
    private router : Router,
    private modalController : ModalController,
  ) {}

  // init
  ngOnInit() {
    this.onResize();
    this.responsiveService.checkWidth();

    // common Data Fetch
    this.commonDataFetch();
  }

  // scroll event detect
  isFixedHeader;
  onScrollHedearFix(event) {
    console.log('scroll onnnnnnnnn', event.detail.scrollTop);
    if (event.detail.scrollTop > 35) {
      console.log("scrolling down, hiding footer...iffffffffffff");
      this.isFixedHeader = true;
    } else {
      console.log("scrolling up, revealing footer...elseeeeeeeeeeeeeee");
      this.isFixedHeader = false;
    };
  }

  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
      // console.log('this.isMobile >', this.isMobile);
    });
  }

  // ion View Will Enter call
  ionViewWillEnter() {

    // common Data Fetch
    this.commonDataFetch();

    // =========== process 1 responsive ==========
    /* this.isMobileResolution = this.responsiveService.getIsMobileResolution();
    console.log('this.isMobileResolution @ >', this.isMobileResolution); */

    // =========== process 2 responsive ==========
    /* var width = window.innerWidth;
    if (width <= 768) {
      console.log('mobile device detected')
    } else if (width > 768 && width <= 992) {
      console.log('tablet detected')
    } else {
      console.log('desktop detected')
    } */

    // view page url name
    this.home_page_url = 'login/homeinfo' ;

    // company by contact api
    this.companyByContact_api = 'ajaxs_post/'

    // view data call
    this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.homePagesData();
      }
    })

    
  }

  ionViewDidEnter(){
    // go to scroll top in mozila browser
    // this.content.scrollToTop(0);
  }

  // common data fetch
  commonDataFetch(){
    // get footer data from commoninfo api
    this.commonPageDataSubscribe = this.commonUtils.commonDataobservable.subscribe((res:any) =>{
      console.log('footer data res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.commonPageContent = res.variable;
      }
    })
  }

  // ================== view data fetch start =====================
    homePagesData(){
      this.homeLoadData = true;
      this.homePageDataSubscribe = this.http.get(this.home_page_url).subscribe(
        (res:any) => {
          this.homeLoadData = false;
          
          console.log("HOME INFO  data  res -------------------->", res.return_data);
          if(res.return_status > 0){
            this.homePageData = res.return_data;

            this.interestList = res.return_data.search_bar.qual_interest_with_data;
            /* this.homePageContent = res.return_data.variable;
            this.commonUtils.setFooterData(res.return_data); */
          }

          if(res.degree){

                console.log('Edit Data>>>>>>>>>>>>>', res.degree);

                res.degree.forEach(value => {
                  if(value.id == res.degree.default){
                    this.default_degree_id = value.id;
                    this.model.degree_id = value.id;
                    this.contactByCompany(this.default_degree_id , 'return_getDegree');
                  }
                });
              }
        },
        errRes => {
          this.homeLoadData = false;
        }
      );
    }
  // view data fetch end

  //----------- banner slick slider for angular start -----------
    title = 'ngSlick';
  
    /* slides = [
      {img: "assets/images/banner-1.jpg"},
      {img: "assets/images/banner-1.jpg"},
      {img: "assets/images/banner-1.jpg"},
      {img: "assets/images/banner-1.jpg"},
    ]; */
  
    slideConfig = {
      "slidesToShow": 1, 
      "slidesToScroll": 1,
      "nextArrow":"<div class='nav-btn next-slide'></div>",
      "prevArrow":"<div class='nav-btn prev-slide'></div>",
      "dots":true,
      "infinite": true,
      "autoplay": true,
      "speed": 1000,
      "fade": true,
      "cssEase": 'linear',
    };

    notificationConfig = {
      "slidesToShow": 1, 
      "slidesToScroll": 1,
      "infinite": true,
      "autoplay": true,
      "speed": 1000,
      "fade": true,
      "cssEase": 'linear',
    };
    
    /* addSlide() {
      this.slides.push({img: ""});
    }
    
    removeSlide() {
      this.slides.length = this.slides.length - 1;
    } */
    
    slickInit(e) {
      // console.log('........ slick initialized ......');
    }
    
    breakpoint(e) {
      // console.log('breakpoint');
    }
    
    afterChange(e) {
      // console.log('afterChange');
    }
    
    beforeChange(e) {
      // console.log('beforeChange');
    }
  //--banner slick slider for angular end--

  //----------- note slick slider for angular start -----------
  noteSlideConfig = {
      "slidesToShow": 2, 
      "slidesToScroll": 1,
      "nextArrow":"<div class='nav-btn next-slide'></div>",
      "prevArrow":"<div class='nav-btn prev-slide'></div>",
      "dots":false,
      "infinite": true,
      "autoplay": false,
      "speed": 500,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]

    };
  //--note slick slider for angular end--

  //----------- product slick slider for angular start -----------
    productSlideConfig = {
      "slidesToShow": 4, 
      "slidesToScroll": 1,
      "nextArrow":"<div class='nav-btn next-slide'></div>",
      "prevArrow":"<div class='nav-btn prev-slide'></div>",
      "dots":false,
      "infinite": true,
      "autoplay": true,
      "speed": 800,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: true,
          }
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]

    };

    countItemSlideConfig = {
      "slidesToShow": 4, 
      "slidesToScroll": 1,
      "nextArrow":"<div class='nav-btn next-slide'></div>",
      "prevArrow":"<div class='nav-btn prev-slide'></div>",
      "dots":false,
      "autoplay": true,
      "speed": 800,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: true,
          }
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]

    };
  //--product slick slider for angular end--

  // ======================== search submit start ===================
    form_submit_text = 'Surging Employability';
    form_api = 'skill/return_index';

    onSubmitSearch(form:NgForm){
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

      this.formSubmitSearchSubscribe = this.http.post(this.form_api, fd).subscribe(
        (response:any) => {
          this.form_submit_text = 'Surging Employability';
          console.log("add form response >", response);

          if(response.return_status > 0){
            // this.commonUtils.presentToast(response.return_message);
            // this.commonUtils.presentToast('success', response.return_message);

            // this.notifier.notify( type, 'aa' );
              // form.reset();

              this.router.navigateByUrl(`skill-list?location=${form.value.location}&degree_id=${form.value.degree_id}&interest_id=${form.value.interest_id}`);
            
          }
        },
        errRes => {
          this.form_submit_text = 'Surging Employability';
        }
      );

    }
  // search submit end

  // category click got to skill page for filter data
  goToFilterPage(_identifire, _id){
    this.router.navigateByUrl(`skill-list?interest_id=${_id}`);
  }

  // ..... open modal start ......
    async openModalForm(_identifier, _item, _items) {
      // console.log('_identifier >>', _identifier);
      let open_modal;
      let myclass;
      if(_identifier == 'signIn'){
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
  // open modal end 

  // readmore collapsed
  readmoreCollapsed(_item){
    console.log('readmoreCollapsed item >>', _item);
    _item.isReadmoreCollapsed = ! _item.isReadmoreCollapsed;
  }

  //------------- autocomplite start------------
    inputChangedAuto;
    autoCompliteItem: any[] = [];
    testItem;
    isLoadingAutoComplite;

    onSelectAutoSelect(val: string) {
      this.inputChangedAuto = val;
      console.log('onSelectAutoSelect val >', val);
    }

    // configer
    autoCompliteConfig: any = {'placeholder': 'search', 'sourceField': ['name']};

    autoCompliteSearch (term: string) {
     console.log('autoCompliteSearch term >', term);
      this.isLoadingAutoComplite = true;
      this.autoCompliteSubscribe = this.http.get(`skill/return_index?search=${term}`).subscribe(
        (res:any) => {
          this.isLoadingAutoComplite = false;
          if(res.return_status > 0){
            this.autoCompliteItem = res.return_data.data;
            console.log('autoCompliteSearch  res >', this.autoCompliteItem);
          }
      },
      errRes => {
        this.isLoadingAutoComplite = false;
      }
      );
    }
  //-- auto complite end--

  // On change degree start

  onChangeDegree(_id, _identifire){

    let identy;
    if(_identifire == 'degree'){
      identy = 'return_getInterestWithData?degree';

      this.model.interest_id = null;
    }

    this.contactByCompany(_id,  identy);
  } 
  // On change degree end

  //contactByCompany
  contactByCompany = function( _id , _name){
    this.selectLoadingDepend = true;
    this.contactByCompanySubscribe = this.http.get(this.companyByContact_api+ _name + '=' +_id +'&identifier=skill').subscribe(
      (res:any) => {
      this.selectLoadingDepend = false;

      if(res.return_status > 0){

        if(_name == 'return_getInterestWithData?degree'){
          this.interestList = res.return_data.interest;

          if (this.interestList == 0) {
            console.log('null>>>>>>>>>>>>');
            this.homePagesData();
          }
        }
      }
    },
    errRes => {
      this.selectLoadingDepend = false;
    }
    );
  }

  // ----------- destroy subscription ---------
  ngOnDestroy() {
    if(this.commonPageDataSubscribe !== undefined){
      this.commonPageDataSubscribe.unsubscribe();
    }
    if(this.homePageDataSubscribe !== undefined){
      this.homePageDataSubscribe.unsubscribe();
    }
    if(this.formSubmitSearchSubscribe !== undefined){
      this.formSubmitSearchSubscribe.unsubscribe();
    }
    if(this.contactByCompanySubscribe !== undefined){ 
      this.contactByCompanySubscribe.unsubscribe();
    }
    if(this.autoCompliteSubscribe !== undefined){
      this.autoCompliteSubscribe.unsubscribe();
    }
  }

  /* jquary working demo
  title1 = 'angular 4 with jquery';
  toggleTitle(){
    $('.title').slideToggle(); //
  } */

}
