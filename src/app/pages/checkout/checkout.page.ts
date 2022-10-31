import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, IonContent, MenuController, Platform, AlertController } from '@ionic/angular';
import { AddCommonModelPage } from '../../pages/modal/add-common-model/add-common-model.page';

import { CommonUtils } from './../../services/common-utils/common-utils';
import { AuthService } from './../../services/auth/auth.service';

import { environment } from '../../../environments/environment';

declare var $ :any; //jquary declear

/* tslint:disable */ 
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit, OnDestroy {

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
  parms_action_id;
  listing_view_url;
  viewLoadData;
  viewData;
  gstCalculation;
  allTotal;
  getUserDetails;

  constructor(
    private activatedRoute : ActivatedRoute,
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

  // ------ init function call start -------
  commonFunction(){
    // get active url name
    this.current_url_path_name =  this.router.url.split('/')[1] + 'ColumnSelect';
    this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);

    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
    
    // view page url name
    this.listing_view_url = 'skill/return_edit/'+this.parms_action_id ;

    // view data call (autologin check)
    this.viewPageDataSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.viewPageData(); 
      }
    })

    // view data call (userdetails from header login only)
    this.viewPageDataSubscribe = this.commonUtils.signinCheckObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. 11>', res);
      if(res){
        this.viewPageData(); 
      }
    })

    // user details get
    this.viewPageDataSubscribe = this.commonUtils.signinStudentInfoObservable.subscribe(res => {
      if(res){
        this.getUserDetails = res;
      }
    });
    
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

  //================ Authenticate or not button click start ==================
  oneOrder(){
    // login or not check
    this.authService.autoLogin().subscribe(resData => {
      console.log('resData +++++++++++=&&&&&& (autoLogin details page)>>>>>>>>>>>>>>', resData);
      if(!resData){
        // if not login
        this.userAuthenticateModal('signUp', '', '');
      }else{
        // if login
        this.router.navigateByUrl(`personal-information/${this.parms_action_id}`);
      }
    });
  }

  // ..... userAuthenticate modal start ......
  async userAuthenticateModal(_identifier, _item, _items) {
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
      console.log('getdata >>>>>>>>>>>', getdata);
      if(getdata.data == 'submitClose'){
        /* this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);  */
      }

    });

    return await open_modal.present();
  }
  // userAuthenticate modal end 
// ----------- Authenticate or not button click end ------


  // open description
  openDescription(event, _item, _items){
    _item.isOpenDescription = !_item.isOpenDescription;

    /* _items.forEach(element => {
      element.isOpenDescription = false;
    });
    if(_item){
      _item.isOpenDescription = true;
    } */
  }

  // ================== view data fetch start =====================
    viewPageData(){
      this.viewLoadData = true;
      this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
        (res:any) => {
          this.viewLoadData = false;
          console.log("view data  res -------------------->", res.return_data);
          if(res.return_status > 0){
            this.viewData = res.return_data;

            // onClickOrderInfo services
            this.commonUtils.onClickOrderInfo(res.return_data);

            // gst calculation
            this.gstCalculation = parseFloat(res.return_data.price) * parseFloat(res.return_data.gst) / 100;

            this.allTotal = parseFloat(res.return_data.price) + parseFloat(this.gstCalculation);
          }
        },
        errRes => {
          this.viewLoadData = false;
        }
      );
    }
  // view data fetch end

  //----------- related product slick slider for angular start -----------
    /* relatedProductSlides = [
      {
        img: "assets/images/icon-1.jpg",
        title: "CAMPUS TO CORPORATE",
        eligible: 'For Freshers',
        content: 'ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
        course: 'Browse Courses',
        assessment : 'Start Assessment'
      },
      {
        img: "assets/images/icon-2.jpg",
        title: "CAMPUS TO CORPORATE",
        eligible: 'For Freshers',
        content: 'ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
        course: 'Browse Courses',
        assessment : 'Start Assessment'
      },
      {
        img: "assets/images/icon-1.jpg",
        title: "CAMPUS TO CORPORATE",
        eligible: 'For Freshers',
        content: 'ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
        course: 'Browse Courses',
        assessment : 'Start Assessment'
      },
      {
        img: "assets/images/icon-2.jpg",
        title: "CAMPUS TO CORPORATE",
        eligible: 'For Freshers',
        content: 'ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
        course: 'Browse Courses',
        assessment : 'Start Assessment'
      },
      {
        img: "assets/images/icon-2.jpg",
        title: "CAMPUS TO CORPORATE",
        eligible: 'For Freshers',
        content: 'ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
        course: 'Browse Courses',
        assessment : 'Start Assessment'
      }
    ]; */

    relatedProductSlideConfig = {
      "slidesToShow": 4, 
      "slidesToScroll": 1,
      "nextArrow":"<div class='nav-btn next-slide'></div>",
      "prevArrow":"<div class='nav-btn prev-slide'></div>",
      "dots":false,
      "infinite": true,
      "autoplay": true,
      "speed": 500,
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
  //--related product slick slider for angular end--

  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
    }
  // destroy subscription end
}

