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
  selector: 'app-skill-list',
  templateUrl: './skill-list.page.html',
  styleUrls: ['./skill-list.page.scss'],
})
export class SkillListPage implements OnInit, OnDestroy {

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
  location;

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
    console.log('Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii@@@@@@@')
    // view page url name
    this.home_page_url = 'login/homeinfo' ;

    // getlist data url name
    this.getlist('skill/getlist');

    // company by contact api
    this.companyByContact_api = 'ajaxs_post/'

    // view data call
    this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.homePagesData();
      }
    })

    // list data url name
    // this.listing_url = 'skill/return_index';

    /* this.api_parms = {
      type:'gggggg',
      id:'5'
    } */
    

    // get Site Info
    this.itemsSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.urlQueryParmaterCheck();
        // this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 
        //(api_url, display_record, page, apiParms)
      }
    })

    // this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 
    this.checkedList = [];
  }


  ionViewDidEnter(){

    // go to scroll top in mozila browser
    this.content.scrollToTop(0);
  }

  urlQueryParmaterCheck(){
    // this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('skill');
    this.activatedRoute.queryParams.subscribe(params => {
      // console.log('query parmsssssssssssssssssssssss >', params);
      this.parms_action_name_category = params['category'];
      this.parms_action_name_degree = params['degree_id'];
      this.parms_action_name_qualification = params['qualification_id'];
      this.parms_action_name_interest = params['interest_id'];
      this.parms_action_name_location = params['location'];

      
      console.log('Data>>>>>>>>>>########>>>>>>>>><<<<<<<<<<', this.parms_action_name_degree);
      // Selected data
    
      this.model.qual_degree_with_data = this.parms_action_name_degree;
      this.model.qual_interest_with_data = this.parms_action_name_interest;
      
      // this.homePagesData();
      // console.log('hiiiiiiiiiiiiii@@@@@@@@@');

      if (this.parms_action_name_location) {
        this.location = params.location.split(",");
        if(this.location){
          
          this.model.location_id = [];
          this.location.forEach(element => {
            this.model.location_id.push(element.id);
          });
        }
      }

    

      if(this.parms_action_name_qualification || this.parms_action_name_degree || this.parms_action_name_location){
        // list data url name

        this.listing_url = 'skill/return_index';
        this.api_parms = {
          qualification_id: this.parms_action_name_qualification,
          degree_id: this.parms_action_name_degree,
          location: this.parms_action_name_location,
          interest_id: this.parms_action_name_interest
        }
      }else{
        // list data url name
        this.listing_url = 'skill/return_index';
      }

      if(this.parms_action_name_interest){
        // list data url name
        this.listing_url = 'skill/return_index';
        this.api_parms = {
          interest_id: this.parms_action_name_interest,
          price:'1',
        }
        this.current_url_path_name = 'skill-list';
      }else{
        this.current_url_path_name =  this.router.url.split('/')[1];
        console.log('this.current_url_path_name >SSSSSSSSSSSSSSSSs >>>>>>', this.current_url_path_name);
        if(this.current_url_path_name == 'skill-list'){
          this.listing_url = 'skill/return_index';
          this.api_parms = {
            price:'1',
          }
        }else if(this.current_url_path_name == 'skill-list-underserved'){
          this.listing_url = 'skill/return_index';
          this.api_parms = {
            price:'1',
          }
        }else if(this.current_url_path_name == 'skill-list-continuous'){
          this.model.branch_id = '1';
          this.listing_url = 'skill/return_index';
          this.api_parms = {
            branch:this.model.branch_id,
            price:'1',
          }
        }else if(this.current_url_path_name == 'skill-list-free'){
          this.listing_url = 'skill/return_index';
          this.api_parms = {
            price:'0',
          }
        }
      }
      
      // listing url
      this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 
    });
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
        company_id: this.selectedCompanyId,
        location: this.selectedLocationId,
        qualification_id: this.selectedQualificationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join(),
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        rating: this.selectedRatingId,
        branch: this.selectedBranchId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
      this.advanceSearchParms = this.filterOnValue;

      this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 
      
    }
  //-- range slider end--

  // opensubCategory
  isChildOpen: Boolean = false;
  opensubCategory(event, _item){
    _item.isChildOpen = !_item.isChildOpen;
  }

  // ================== select checkbox start =====================
    onCheckboxSelect(option, event) {
      console.log('option', option.id);
      // console.log('event', event);

      if (event.target.checked) {
        if (this.checkedList.indexOf(option.id) === -1) {
          this.checkedList.push(option.id);
        }
      } else {
          for (let i = 0 ; i < this.fetchItems.length; i++) {
            if (this.checkedList[i] == option.id) {
              this.checkedList.splice(i, 1);
          }
        }
      }

      if (this.fetchItems.length <= this.checkedList.length) {
      this.allselectModel = true;
      // console.log('length 4');
      } else {
        // console.log('length 0');
        this.allselectModel = false;
        this.itemcheckClick = true;

      }

      if(this.checkedList.length > 5){
        console.log('Max0');
        this.commonUtils.presentToast('error', ' You can add maximum 5 Skills. ');
      }

      
      console.log('checked item single >>', this.checkedList);
    }
  // select checkbox end

  /* Goto Compare start */
    gotoCompare(event) {
      console.log('gotoCompare', event);
      console.log('this.checkedList.length', this.checkedList.length);
      if(this.checkedList.length < 2){

        this.commonUtils.presentToast('info', '  Minimum two courses required. ');
      }else {
        this.router.navigateByUrl(`compare?skill=${event}`);
      }
    }
  // Goto compare end

  // onCheckboxSelect
  // onCheckboxSelect(option, event, _identifire) {
  //   console.log('option >>>> >', option);
  //   this.router.navigate([]);
  //   this.api_parms = {};

  //   if(_identifire == 'location'){
      

  //     if (event.target.checked) {
  //       console.log('only push');

  //       if (this.checkedListLocation.indexOf(option) === -1) {
  //         this.checkedListLocation.push(option);
  //       }
  //     } else{
  //       console.log('not push');
  //       for (let i = 0 ; i < this.checkedListLocation.length; i++) {
  //         if (this.checkedListLocation[i] == option) {
  //           this.checkedListLocation.splice(i, 1);
  //         }
  //       }
  //     }
  
  //     console.log('option checkedListLocation >>>> >', this.checkedListLocation);
  
  //     this.selectedLocationIds = this.checkedListLocation;
  //   }else{

  //     if (event.target.checked) {
  //       if (this.checkedList.indexOf(option) === -1) {
  //         this.checkedList.push(option);
  //       }
  //     }else{
  //       for (let i = 0 ; i < this.checkedListLocation.length; i++) {
  //         if (this.checkedList[i] == option) {
  //           this.checkedList.splice(i, 1);
  //         }
  //       }
  //     }
  //   }
    
  //   console.log('option checkedList >>>> >', this.checkedList);

  //   this.selectedCategoryIds = this.checkedList;

  //   this.filterOnValue = {
  //     company_id: this.selectedCompanyId,
  //     location: this.selectedLocationId,
  //     qualification_id: this.selectedQualificationId,
  //     start_price: this.selectMinValue,
  //     end_price: this.selectMaxValue,
  //     category: this.selectedCategoryIds.join(),
  //     industry_type_id: this.selectedindustryId,
  //     location: this.selectedLocationIds.join(),
  //     rating: this.selectedRatingId,
  //     degree_id: this.selectedDegreeId,
  //     interest_id: this.selectedInterestId,
  //     subject_id: this.selectedSubjectId
  //   }
  //   this.advanceSearchParms = this.filterOnValue;

  //   this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 

  //   // this.router.navigateByUrl('skill-list');

  // }

  // Dropdown branch (online = 2/offline = 1) check
  skill_offline = true;

  onChangeselectDropdownBranch(_id, _identifire){

    //query params remove from url
    this.router.navigate([]);
    this.api_parms = {};

    if(_identifire == 'branch'){
      
      this.api_parms = {
        branch:_id,
      }

      /* this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire);  */

      this.onClearFilterPage('event');
      
      if(_id == '1'){
        this.skill_offline = true;
      }else{
        this.skill_offline = false;
      }
    }
  }

  // Dropdown change
  onChangeselectDropdown(_id, _identifire){
    let identy;
    //query params remove from url
    this.router.navigate([]);
    this.api_parms = {};

    console.log('onChangeselectDropdown _id >', _id);
    console.log('onChangeselectDropdown _identifire >', _identifire);
    
    if(_identifire == 'company'){
      this.selectedCompanyId = _id;
      this.filterOnValue = {
        company_id: this.selectedCompanyId,
        location: this.selectedLocationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join(),
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        rating: this.selectedRatingId,
        branch: this.selectedBranchId,
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
        company_id: this.selectedCompanyId,
        location: this.selectedLocationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join(),
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        rating: this.selectedRatingId,
        branch: this.selectedBranchId,
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
      if(this.selectedQualificationId == null){

        this.filterOnValue.degree_id = '';

        console.log('Hi',this.selectedDegreeId);
       
        this.getlist('skill/getlist');
      }
    }else if(_identifire == 'degree'){
      identy = 'return_getInterestWithData?degree';
      this.model.qual_interest_with_data = null;

      this.selectedDegreeId = _id;
      console.log('selectedDegreeId', this.selectedDegreeId);
      this.filterOnValue = {
        company_id: this.selectedCompanyId,
        location: this.selectedLocationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join(),
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        rating: this.selectedRatingId,
        branch: this.selectedBranchId,
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
      if(this.selectedDegreeId == null){

        /*this.selectedInterestId = null;
        this.getlist('skill/getlist');*/
      }
    }else if(_identifire == 'interest'){
      // identy = 'return_getSubjectWithData?subject';

      this.selectedInterestId = _id;
      this.filterOnValue = {
        company_id: this.selectedCompanyId,
        location: this.selectedLocationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join(),
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        rating: this.selectedRatingId,
        branch: this.selectedBranchId,
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
      
    }else if(_identifire == 'subject'){
      // identy = 'return_getInterestWithData?subject';

      this.selectedSubjectId = _id;
      this.filterOnValue = {
        company_id: this.selectedCompanyId,
        location: this.selectedLocationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join(),
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        rating: this.selectedRatingId,
        branch: this.selectedBranchId,
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
      
    }else if(_identifire == 'industry'){
      this.selectedindustryId = _id;
      this.filterOnValue = {
        company_id: this.selectedCompanyId,
        location: this.selectedLocationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join(),
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        rating: this.selectedRatingId,
        branch: this.selectedBranchId,
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
    }else if(_identifire == 'rating'){
      this.selectedRatingId = _id;
      this.filterOnValue = {
        company_id: this.selectedCompanyId,
        location: this.selectedLocationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join(),
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        rating: this.selectedRatingId,
        branch: this.selectedBranchId,
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
    }else if(_identifire == 'branch'){
      this.selectedBranchId = _id;
      this.filterOnValue = {
        company_id: this.selectedCompanyId,
        location: this.selectedLocationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join(),
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        rating: this.selectedRatingId,
        branch: this.selectedBranchId,
        qualification_id: this.selectedQualificationId,
        degree_id: this.selectedDegreeId,
        interest_id: this.selectedInterestId,
        subject_id: this.selectedSubjectId
      }
    }else if(_identifire == 'location'){
      console.log('location');
      this.selectedLocationId = _id;
      this.filterOnValue = {
        company_id: this.selectedCompanyId,
        location: this.selectedLocationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join(),
        industry_type_id: this.selectedindustryId,
        // location: this.selectedLocationIds.join(),
        rating: this.selectedRatingId,
        branch: this.selectedBranchId,
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
      this.contactByCompanySubscribe = this.http.get(this.companyByContact_api+ _name + '=' +_id +'&identifier=skill').subscribe(
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
            console.log('skill getlist resData >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', resData);
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

            // range slider start....
            this.minValueRange = resData.price.min;
            this.maxValueRange = resData.price.max;

            this.priceOptions = {
              floor: 0,
              ceil: resData.price.max,
              translate: (value: number, label: LabelType): string => {
                switch (label) {
                  case LabelType.Low:
                    return '<b>Min:</b> &#8377;' + value;
                  case LabelType.High:
                    return '<b>Max:</b> &#8377;' + value;
                  default:
                    return '&#8377;' + value;
                }
              }
            };
            //--- range slider end------

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

        //---------  check item category show start ----------
        if(this.fetchItems && this.checkedList){
          for (let i = 0 ; i < this.fetchItems.length; i++) {
            for (let j = 0 ; j < this.checkedList.length; j++) {
              if(this.checkedList[j].id ==  this.fetchItems[i].id){
                this.fetchItems[i].isSelected = true;
                // console.log('this.fetchItems[i] >>', this.fetchItems[i]);
              }
            }
          }
        }
        // check item category show end

        //---------  check item  location show start ----------
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
        // check item location show end

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

    this.checkedList = [];
    this.checkedListLocation = [];
    this.allselectModel = false;

    this.advanceSearchParms = '';
    this.searchTerm = '';
    // this.displayRecord =this.commonUtils.displayRecord;
    this.sortColumnName = '';
    this.sortOrderName = '';

    if(this.current_url_path_name == 'skill-list-free'){
      /* this.api_parms = {
        start_price:'0',
        end_price:'0'
      } */
    }

    this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire)

  }
  // custom refresh page end

  //------------ custom clear filter page start ----------
  onClearFilterPage(event){
    /* event.preventDefault();
    event.stopPropagation(); */

    //query params remove from url
    this.router.navigate([]);
    this.api_parms = {};

    if(this.current_url_path_name == 'skill-list-free'){
      /* this.api_parms = {
        start_price:'0',
        end_price:'0'
      } */
    }

    this.checkedListLocation = [];
    this.checkedList = [];
    this.allselectModel = false;

    this.advanceSearchParms = '';
    this.searchTerm = '';
    // this.displayRecord =this.commonUtils.displayRecord;
    this.sortColumnName = '';
    this.sortOrderName = '';

    //---------  check item clear  ----------
    if(this.getlistData.category){
      for (let i = 0 ; i < this.getlistData.category.length; i++) {
        this.getlistData.category[i].isSelected = false;
        if(this.getlistData.category[i].child){
          for (let j = 0 ; j < this.getlistData.category[i].child.length; j++) {
            this.getlistData.category[i].child[j].isSelected = false;
          }
        }
      }
    }
    // check item show end

    //---------  check location item clear  ----------
    if(this.getlistData.city){
      for (let i = 0 ; i < this.getlistData.city.length; i++) {
        this.getlistData.city[i].isSelected = false;
      }
    }
    // check item show end

    // range slider start....
    this.minValueRange = this.getlistData.price.min;
    this.maxValueRange = this.getlistData.price.max;

    // clear filter value
    this.selectedCompanyId = '';
    this.selectedQualificationId = '';
    this.selectMinValue = '';
    this.selectMaxValue = '';
    this.selectedCategoryIds = [];
    this.model.company_id = {};
    this.model.location = {};
    this.model.qualification_with_data = {};
    this.model.industry_id = {};
    this.model.industry_type_id = {};
    this.selectedLocationIds = [];
    this.selectedindustryId = '';
    this.selectedRatingId ='';
    this.selectedBranchId ='';
    this.model.rating_id = {};
    this.model.branch_id = {};
    this.selectedDegreeId = '';
    this.selectedInterestId = '';
    this.selectedSubjectId = '';
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

  //---- rating click function call  start ----
  ratingClicked: number;
  ratingComponentClick(clickObj: any): void {
    console.log('clickObj >>', clickObj);
    const item = this.fetchItems.find(((i: any) => i.id === clickObj.itemId));
    if (!!item) {
      item.rating = clickObj.rating;
    }
  }
  // --rating click function call  end--

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
    if(this.contactByCompanySubscribe !== undefined){ 
      this.contactByCompanySubscribe.unsubscribe();
    }
    if(this.formSubmitSearchSubscribe !== undefined){
      this.formSubmitSearchSubscribe.unsubscribe();
    }
  }

}

