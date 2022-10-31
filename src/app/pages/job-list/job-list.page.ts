import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Platform, IonContent} from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { Options, LabelType } from 'ng5-slider'; //range slider
import { Router, ActivatedRoute } from '@angular/router';

import { PaginationService } from './../../services/pagination.service';
import { ResponsiveService } from '../../services/responsive.service';
import { CommonUtils } from '../../services/common-utils/common-utils';

import { environment } from '../../../environments/environment';

declare var $ :any; //jquary declear

/* tslint:disable */ 
@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.page.html',
  styleUrls: ['./job-list.page.scss'],
})
export class JobListPage implements OnInit, OnDestroy {

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
  private contactByCompanySubscribe: Subscription;
  private homePageDataSubscribe : Subscription;
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
  parms_action_name;

  // price filter variable
  minValueRange: number ;
  maxValueRange: number ;
  selectMinValue;
  selectMaxValue;
  selectedCompanyId;
  selectedLocationId
  selectedQualificationId;
  selectedLocationIds = [];
  selectedCompanyIds = [];
  selectedindustryId;
  selectedjobTypeId;
  selectedDegreeId;
  selectedInterestId;
  selectedSubjectId;
  parms_action_name_skill;
  parms_action_name_location;
  parms_action_name_jobtype;

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
  selectLoadingDepend;
  homeLoadData;
  homePageData;
  home_page_url;

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
    
    // main category accordion start
    /* $(".main-category").click(function(){
      console.log('click --->');
      if($(this).hasClass('active'))
      {
        $(this).removeClass('active');
        $(this).next("ul").stop(true,true).slideUp();
        $(this).children('i').removeClass('fa-minus open');
      }
      else{
        $(".list-content-accordian ul li").find('.active').next('ul').stop(true,true).slideUp();
        $(".list-content-accordian ul li").find('.active').removeClass('active');
        $(".list-content-accordian ul li i").removeClass('fa-minus open');
        $(this).addClass('active');
        $(this).next("ul").stop(true,true).slideDown();
        $(this).children('i').addClass('fa-minus open');
      }
    }); */
    //main category accordion end
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
    this.getlist('job/getlist');

    // company by contact api
    this.companyByContact_api = 'ajaxs_post/'

    // view page url name
    this.home_page_url = 'login/homeinfo' ;
    // view data call
    this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.homePagesData();
      }
    })

    // list data url name
    // this.listing_url = 'job/return_index';

    /* this.api_parms = {
      type:'gggggg',
      id:'5'
    } */
    

    // get Site Info


    // not login      
    this.itemsSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.urlQueryParmaterCheck();
        // this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 
        //(api_url, display_record, page, apiParms)
      }
    })

  }

  ionViewDidEnter(){
    // go to scroll top in mozila browser
    this.content.scrollToTop(0);
  }


  urlQueryParmaterCheck(){
    // this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('skill');
    this.activatedRoute.queryParams.subscribe(params => {
      // console.log('query parmsssssssssssssssssssssss >', params);
      this.parms_action_name_skill = params['skill'];
      this.parms_action_name_location = params['location'];
      this.parms_action_name_jobtype = params['job_type_id'];
    });

    if(this.parms_action_name_skill || this.parms_action_name_location || this.parms_action_name_jobtype){
      // list data url name
      this.listing_url = 'job/return_index';
      this.api_parms = {
        skill: this.parms_action_name_skill,
        location: this.parms_action_name_location,
        job_type_id: this.parms_action_name_jobtype
      }
    }else{
      // list data url name
      this.listing_url = 'job/return_index';
    }
    // listing url
    this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 

  }


  // ----------range slider start-------------
    /* minValue: number = 100;
    maxValue: number = 400; 
    ceil: 500,*/
    
    valueChangeRangeSlider(value: number, minvalue: number, maxvalue: number): void {

      //query params remove from url
      this.router.navigate([]);
      this.api_parms = {};

      console.log('value price min range >>>>>>>', minvalue);
      console.log('value price max range >>>>>>>', maxvalue);

      this.selectMinValue = minvalue;
      this.selectMaxValue = maxvalue;

      this.filterOnValue = {
        job_type_id: this.selectedjobTypeId,
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        company: this.selectedCompanyIds.join(),
        qualification_id: this.selectedQualificationId,
        location: this.selectedLocationId,
      }
      this.advanceSearchParms = this.filterOnValue;

      this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 
      
    }
  //-- range slider end--

  // ================== view data fetch start =====================
    homePagesData(){
      this.homeLoadData = true;
      this.homePageDataSubscribe = this.http.get(this.home_page_url).subscribe(
        (res:any) => {
          this.homeLoadData = false;
          console.log("HOME INFO  data  res -------------------->", res.return_data);
          if(res.return_status > 0){
            this.homePageData = res.return_data;
            /* this.homePageContent = res.return_data.variable;
            this.commonUtils.setFooterData(res.return_data); */
          }
        },
        errRes => {
          this.homeLoadData = false;
        }
      );
    }
  // view data fetch end


  // opensubCategory
  isChildOpen: Boolean = false;
  opensubCategory(event, _item){
    _item.isChildOpen = !_item.isChildOpen;
  }

  // onCheckboxSelect
  onCheckboxSelect(option, event, _identifire) {

    //query params remove from url
    this.router.navigate([]);
    this.api_parms = {};

    console.log('option >>>> >', option);
    console.log('_identifire >>>> >', _identifire);

    if(_identifire == 'location'){
      
      if (event.target.checked) {
        if (this.checkedListLocation.indexOf(option) === -1) {
          this.checkedListLocation.push(option);
        }
      }else{
        for (let i = 0 ; i < this.checkedListLocation.length; i++) {
          if (this.checkedListLocation[i] == option) {
            this.checkedListLocation.splice(i, 1);
          }
        }
      }
  
      console.log('option checkedListLocation >>>> >', this.checkedListLocation);
  
      this.selectedLocationIds = this.checkedListLocation;
    }else if(_identifire == 'company'){
      
      if (event.target.checked) {
        if (this.checkedListCompany.indexOf(option) === -1) {
          this.checkedListCompany.push(option);
        }
      }else{
        for (let i = 0 ; i < this.checkedListLocation.length; i++) {
          if (this.checkedListCompany[i] == option) {
            this.checkedListCompany.splice(i, 1);
          }
        }
      }
  
      console.log('option checkedListCompany >>>> >', this.checkedListCompany);
  
      this.selectedCompanyIds = this.checkedListCompany;
    }
  

    this.filterOnValue = {
      job_type_id: this.selectedjobTypeId,
      industry_type_id: this.selectedindustryId,
      // location: this.selectedLocationIds.join(),
      location: this.selectedLocationId,
      company: this.selectedCompanyIds.join(),
      qualification_id: this.selectedQualificationId,
    }
    this.advanceSearchParms = this.filterOnValue;

    this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 

  }

  // Dropdown change
  onChangeselectDropdown(_id, _identifire){

    let identy;

    //query params remove from url
    this.router.navigate([]);
    this.api_parms = {};

    console.log('onChangeselectDropdown _id >', _id);
    console.log('onChangeselectDropdown _identifire >', _identifire);
    
    if(_identifire == 'jobType'){
      this.selectedjobTypeId = _id;
      this.filterOnValue = {
        job_type_id: this.selectedjobTypeId,
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        location: this.selectedLocationId,
        company: this.selectedCompanyIds.join(),
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
    }else if(_identifire == 'qualification'){
      identy = 'return_getDegreeWithData?qualification';

      this.model.qual_degree_with_data = null;
      this.selectedQualificationId = _id;
      this.filterOnValue = {
        job_type_id: this.selectedjobTypeId,
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        location: this.selectedLocationId,
        company: this.selectedCompanyIds.join(),
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
      if(this.selectedQualificationId == null){

        // this.selectedDegreeId = null;

        degree_id:this.selectedDegreeId;
        console.log('Hi',this.selectedDegreeId);

        this.getlist('job/getlist');
      }
    }else if(_identifire == 'degree'){
      identy = 'return_getInterestWithData?degree';
      this.model.qual_interest_with_data = null;

      this.selectedDegreeId = _id;
      this.filterOnValue = {
        job_type_id: this.selectedjobTypeId,
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        location: this.selectedLocationId,
        company: this.selectedCompanyIds.join(),
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
    }else if(_identifire == 'interest'){
      this.selectedInterestId = _id;
      this.filterOnValue = {
        job_type_id: this.selectedjobTypeId,
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        location: this.selectedLocationId,
        company: this.selectedCompanyIds.join(),
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
    }else if(_identifire == 'subject'){
      this.selectedSubjectId = _id;
      this.filterOnValue = {
        job_type_id: this.selectedjobTypeId,
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        location: this.selectedLocationId,
        company: this.selectedCompanyIds.join(),
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
    }else if(_identifire == 'location'){
      this.selectedLocationId = _id;
      this.filterOnValue = {
        job_type_id: this.selectedjobTypeId,
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        location: this.selectedLocationId,
        company: this.selectedCompanyIds.join(),
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
    }
  
    this.advanceSearchParms = this.filterOnValue;

    this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 
    this.contactByCompany(_id,  identy);
  }

  //--------------  getlist data fetch start -------------

    //contactByCompany
    contactByCompany = function( _id , _name){
      this.selectLoadingDepend = true;
      this.contactByCompanySubscribe = this.http.get(this.companyByContact_api+ _name + '=' +_id +'&identifier=job').subscribe(
        (res:any) => {
        this.selectLoadingDepend = false;

        if(res.return_status > 0){

          if(_name == 'return_getDegreeWithData?qualification'){
            this.degreeList = res.return_data.degree;
          }else if(_name == 'return_getInterestWithData?degree'){
            this.interestList = res.return_data.interest;
          }
        }
      },
      errRes => {
        this.selectLoadingDepend = false;
      }
      );
    }

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

            this.qualificationList = resData.qualification_with_data;
            this.degreeList = resData.qual_degree_with_data;
            this.interestList = resData.qual_interest_with_data;
            this.subjectList = resData.qual_subject_with_data;

            if(resData.qualification_with_data){

              console.log('Edit Data>>>>>>>>>>>>>', resData.qualification_with_data );

              resData.qualification_with_data.forEach(value => {
                if(value.id == resData.qualification_with_data.default){
                  this.default_qualification_id = value.id;
                  this.model.qualification_with_data = value.id;
                  this.contactByCompany(this.default_qualification_id , 'return_getDegree');
                }
              });
            }

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

    //query params remove from url
    this.router.navigate([]);
    this.api_parms = {};

    this.checkedListLocation = [];
    this.checkedListCompany = [];
    this.allselectModel = false;

    this.advanceSearchParms = '';
    this.searchTerm = '';
    // this.displayRecord =this.commonUtils.displayRecord;
    this.sortColumnName = '';
    this.sortOrderName = '';

    //---------  check location item clear  ----------
    if(this.getlistData.city){
      for (let i = 0 ; i < this.getlistData.city.length; i++) {
        this.getlistData.city[i].isSelected = false;
      }
    }
    // check item show end

    //---------  check company item clear  ----------
    if(this.getlistData.company){
      for (let i = 0 ; i < this.getlistData.company.length; i++) {
        this.getlistData.company[i].isSelected = false;
      }
    }
    // check item show end

    // clear filter value
    this.selectedCompanyId = '';
    this.selectedLocationId = '';
    this.selectedQualificationId = '';
    this.selectMinValue = '';
    this.selectMaxValue = '';
    this.selectedLocationIds = [];
    this.model.company_id = {};
    this.model.location_id = {};
    this.model.jobType_id = {};
    this.model = {};
    this.selectedjobTypeId = '';
    this.selectedindustryId = '';
    this.selectedQualificationId = '';
    this.selectedDegreeId = '';
    this.selectedInterestId = '';
    this.selectedSubjectId = '';
    this.model.qualification_with_data = {};
    this.model.qual_degree_with_data = {};
    this.model.qual_interest_with_data = {};
    this.model.qual_subject_with_data = {};

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

  // ----------- destroy subscription ---------
  ngOnDestroy() {
    if(this.getListSubscribe !== undefined){
      this.getListSubscribe.unsubscribe();
    }
    if(this.itemsSubscribe !== undefined){
      this.itemsSubscribe.unsubscribe();
    }
    if(this.homePageDataSubscribe !== undefined){
      this.homePageDataSubscribe.unsubscribe();
    }
    if(this.formSubmitSearchSubscribe !== undefined){
      this.formSubmitSearchSubscribe.unsubscribe();
    }
  }

}

