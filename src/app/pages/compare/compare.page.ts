import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Platform, IonContent} from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { Options, LabelType } from 'ng5-slider'; //range slider

import { PaginationService } from './../../services/pagination.service';
import { ResponsiveService } from '../../services/responsive.service';
import { CommonUtils } from '../../services/common-utils/common-utils';

import { environment } from '../../../environments/environment';

declare var $ :any; //jquary declear

/* tslint:disable */ @Component({
  selector: 'app-compare',
  templateUrl: './compare.page.html',
  styleUrls: ['./compare.page.scss'],
})

export class ComparePage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content: IonContent;

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  
  // variable
  public isMobile: Boolean;
  skilsList;
  careersList;
  locationList;
  selectLoading;
  getlistLoading = true;
  model: any = {};
  private homePageDataSubscribe : Subscription;
  private viewPageDataSubscribe : Subscription;
  isSelected;
  checkedList = [];
  checkedListLocation = [];
  selectedLocationIds = [];
  fetchItems = [];
  isListLoading = false;
  listing_url;
  itemcheckClick = false;
  allselectModel;
  getlistData;
  filterOnValue: any = {};

  // price filter variable
  minValueRange: number ;
  maxValueRange: number ;
  selectMinValue;
  selectMaxValue;
  selectedCompanyId;
  selectedLocationId;
  selectedDegreeId;
  selectedInterestId;
  selectedSubjectId;
  selectedQualificationId;
  selectedCategoryIds = [];
  selectedRatingId;
  selectedBranchId;
  selectLoadingDepend;
  homeLoadData;
  homePageData;

  // default set
  public priceOptions: Options = {
  floor: 0,
  ceil: 200
  };

  //---- list page variable --
  // pager object
  pager: any = {};
  // paged items
  pageItems: any[];
  listAlldata;
  // api parms
  api_parms: any = {};
  urlIdentifire = '';
  searchTerm:string = '';
  cherecterSearchTerm:string = '';
  sortColumnName = '';
  sortOrderName = '';
  advanceSearchParms = '';
  current_url_path_name;
  selectedindustryId;
  parms_action_name_category;
  parms_action_name_degree;
  parms_action_name_qualification;
  parms_action_name_interest;
  parms_action_name_location;
  parms_action_name_skill;


  // skeleton loading
  skeleton = [
    {},{},{},{},{},{}
  ]

  qualificationList;
  degreeList;
  interestList;
  subjectList;
  companyByContact_api;
  default_qualification_id;
  getlistUrl;
  home_page_url;
  listing_view_url;
  location;
  viewLoadData;
  viewData;

  constructor(
    private responsiveService : ResponsiveService,
    private http : HttpClient,
    private plt: Platform,
    private pagerService: PaginationService,
    private commonUtils : CommonUtils,
    private router: Router,
    private activatedRoute : ActivatedRoute,
  ) {}

  // init
  ngOnInit() {
    this.onResize();
    this.responsiveService.checkWidth();
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

  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
      // console.log('this.isMobile >', this.isMobile);
    });
  }

  // ion View Will Enter call
  ionViewWillEnter() {

    // view page url name
    this.home_page_url = 'skill/return_index' ;

    this.listing_view_url = 'skill/comparison_fields';

    this.viewPageData();

    this.checkUrlId();

    // view data call
    this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        
      }
    })

    // list data url name
    // this.listing_url = 'skill/return_index';

    /* this.api_parms = {
      type:'gggggg',
      id:'5'
    } */

  }


  ionViewDidEnter(){

    // go to scroll top in mozila browser
    this.content.scrollToTop(0);
  }

  checkUrlId() {
    this.activatedRoute.queryParams.subscribe(params => {
    this.parms_action_name_skill = params['skill'];

    this.homePagesData();
    
    });
  }

  // ================== view data fetch start by skill id =====================
    homePagesData(){
      this.homeLoadData = true;
      this.homePageDataSubscribe = this.http.get(this.home_page_url+'?id='+this.parms_action_name_skill).subscribe(
        (res:any) => {
          this.homeLoadData = false;
          console.log("HOME INFO  data  res -------------------->", res.return_data);
          if(res.return_status > 0){
            this.homePageData = res.return_data.data;
            /* this.homePageContent = res.return_data.variable;
            this.commonUtils.setFooterData(res.return_data); */
          }
        },
        errRes => {
          this.homeLoadData = false;
        }
      );
    }
  // view data fetch end by skill id 

  // ================== view data fetch start =====================
    viewPageData(){
      this.viewLoadData = true;
      this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
        (res:any) => {
          this.viewLoadData = false;
          console.log("view data  res -------------------->", res.return_data);
          if(res.return_status > 0){
            this.viewData = res.return_data;

          }
        },
        errRes => {
          this.viewLoadData = false;
        }
      );
    }
  // view data fetch end


  

  // ----------- destroy subscription ---------
  ngOnDestroy() {
    if(this.homePageDataSubscribe !== undefined){
      this.homePageDataSubscribe.unsubscribe();
    }
    if(this.viewPageDataSubscribe !== undefined){
      this.viewPageDataSubscribe.unsubscribe();
    }
  }

}