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

/* tslint:disable */ 
@Component({
  selector: 'app-college-list',
  templateUrl: './college-list.page.html',
  styleUrls: ['./college-list.page.scss'],
})
export class CollegeListPage implements OnInit, OnDestroy {

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
  private formSubmitSearchSubscribe: Subscription;
  private getListSubscribe : Subscription;
  private itemsSubscribe : Subscription;
  isSelected;
  checkedListLocation = [];
  checkedListCompany = [];
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
  selectedQualificationId;
  selectedLocationIds = [];
  selectedCompanyIds = [];
  selectedindustryId;
  selectedjobTypeId;

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
  parms_action_name;
  commonPageData;

  // skeleton loading
  skeleton = [
    {},{},{},{},{},{}
  ]

  constructor(
    private responsiveService : ResponsiveService,
    private http : HttpClient,
    private plt: Platform,
    private pagerService: PaginationService,
    private commonUtils : CommonUtils,
    private activatedRoute : ActivatedRoute,
    private router: Router,
  ) {}

  // init
  ngOnInit() {
    this.onResize();
    this.responsiveService.checkWidth();
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

  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
      // console.log('this.isMobile >', this.isMobile);
    });
  }

  // ion View Will Enter call
  ionViewWillEnter() {

    // getlist data url name
    // this.getlist('job/getlist');


    this.parms_action_name = this.router.url.split('/')[1];
    console.log('this.parms_action_name >>>>>>>>>>>>>', this.parms_action_name);

    if(this.parms_action_name == 'coe'){
      // list data url name
      this.listing_url = 'college/return_index?college_type_id=1';
    }else{
      // list data url name
      this.listing_url = 'college/return_index?college_type_id=2';
    }

    /* this.api_parms = {
      type:'gggggg',
      id:'5'
    } */
    

    // get Site Info


    // not login      
    this.itemsSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 
        //(api_url, display_record, page, apiParms)
      }
    })


    // get data from commoninfo api
    this.itemsSubscribe = this.commonUtils.commonDataobservable.subscribe((res:any) =>{
      console.log('commonPageData data res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.commonPageData = res;
      }
    })

    // login
    /* this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire);  */

  }

  ionViewDidEnter(){
    // go to scroll top in mozila browser
    this.content.scrollToTop(0);
  }

  //--------------  getlist data fetch start -------------
    onChange(_item){
      console.log("dropdown selected item >", _item);
    }

    getlist(_getlistUrl){
      this.plt.ready().then(() => {
        this.getlistLoading = true;
        this.selectLoading = true;
        this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
          resData => {
            this.selectLoading = false;
            this.getlistLoading = false;
            console.log('job getlist resData >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', resData);
            this.getlistData = resData;

          },
          errRes => {
            this.selectLoading = false;
            this.getlistLoading = false;
          }
        );
      });
    }
  // getlist data fetch end

  // ---------  list data function ---------
  onListData(_list_url, _displayRecord, _page, _apiParms, _search, _advSearchParms, _identifire) {
    this.plt.ready().then(() => {
      this.isListLoading = true;
      this.itemsSubscribe = this.commonUtils.fetchList(_list_url, _displayRecord, _page, _apiParms,  _search, _advSearchParms, _identifire).subscribe(
        resData => {
        this.isListLoading = false;
        this.fetchItems = resData[0];
        this.listAlldata = resData[1];

        //---------  check item show start ----------
        if(this.fetchItems && this.checkedListLocation){
          for (let i = 0 ; i < this.fetchItems.length; i++) {
            for (let j = 0 ; j < this.checkedListLocation.length; j++) {
              if(this.checkedListLocation[j].id ==  this.fetchItems[i].id){
                this.fetchItems[i].isSelected = true;
                // console.log('this.fetchItems[i] >>', this.fetchItems[i]);
              }
            }
          }
        }
        // check item show end

        // show pager 
        if(resData[1] != undefined || resData[1] != null){
          this.pager = this.pagerService.getPager(resData[1].total, _page, _displayRecord);
        }
    
      },
      errRes => {
        this.isListLoading = false;
      }
      );
    });
  }
  

  // -------- pagination -------------
    pageNo = 1;
    setPage(page: number) {
      // get pager object from service
      this.pageNo = page;

      this.pager = this.pagerService.getPager(this.listAlldata.total, page, this.displayRecord);

      this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire)

    }
  // pagination end

  // ------- display record start-------
    displayRecord = this.commonUtils.displayRecord;
    displayRecords = this.commonUtils.displayRecords;
    displayRecordChange(_record) {
      this.displayRecord = _record;

      this.onListData(this.listing_url, this.displayRecord, '', this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire)

    }
  // display record end

  // ------------searchbar start------------------
    searchList(event){
      this.searchTerm = event.target.value;

      this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire)

    }
  // searchbar end

  //------------  custom refresh page start ----------
  onRefreshPage(event){
    event.preventDefault();
    event.stopPropagation();

    this.checkedListLocation = [];
    this.checkedListCompany = [];

    this.allselectModel = false;

    this.advanceSearchParms = '';
    this.searchTerm = '';
    // this.displayRecord =this.commonUtils.displayRecord;
    this.sortColumnName = '';
    this.sortOrderName = '';

    this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire)

  }
  // custom refresh page end

  //------------ custom clear filter page start ----------
  onClearFilterPage(event){
    event.preventDefault();
    event.stopPropagation();

    this.checkedListLocation = [];
    this.checkedListCompany = [];
    this.allselectModel = false;

    this.advanceSearchParms = '';
    this.searchTerm = '';
    // this.displayRecord =this.commonUtils.displayRecord;
    this.sortColumnName = '';
    this.sortOrderName = '';

    // clear filter value
    this.selectedCompanyId = '';
    this.selectedQualificationId = '';
    this.selectMinValue = '';
    this.selectMaxValue = '';
    this.selectedLocationIds = [];
    this.model.company_id = {};
    this.model.qualification_id = {};
    this.model.jobType_id = {};
    this.model = {};
    this.selectedjobTypeId = '';
    this.selectedindustryId = '';

    // list
    this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire)

  }
  // custom clear filter page end

  // ----- click item hilight back start ----
    activeHighlightIndex;
    clickItemHighlight(index){
      this.activeHighlightIndex = index;
    }
  //click item hilight back end 

  //--- mobile serch start-----
  isMobileSearch;
  mobileSearch(){
    this.isMobileSearch = !this.isMobileSearch;
  }
  // mobile search end

  // ----------- destroy subscription ---------
  ngOnDestroy() {
    if(this.getListSubscribe !== undefined){
      this.getListSubscribe.unsubscribe();
    }
    if(this.itemsSubscribe !== undefined){
      this.itemsSubscribe.unsubscribe();
    }
    if(this.formSubmitSearchSubscribe !== undefined){
      this.formSubmitSearchSubscribe.unsubscribe();
    }
  }

}

