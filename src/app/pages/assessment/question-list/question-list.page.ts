import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Platform, IonContent} from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { Options, LabelType } from 'ng5-slider'; //range slider

import { PaginationService } from '../../../services/pagination.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { CommonUtils } from '../../../services/common-utils/common-utils';

import { environment } from '../../../../environments/environment';

declare var $ :any; //jquary declear

/* tslint:disable */ 
@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.page.html',
  styleUrls: ['./question-list.page.scss'],
})

export class QuestionListPage implements OnInit, OnDestroy {

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
  checkedList = [];
  fetchItems = [];
  fetchItemsAll = [];
  isListLoading = false;
  listing_url;
  itemcheckClick = false;
  allselectModel;
  getlistData;
  filterOnValue: any = {};
  parms_action_id;
  parms_action_name;

  // price filter variable
  minValueRange: number ;
  maxValueRange: number ;
  selectMinValue;
  selectMaxValue;
  selectedCompanyId;
  selectedQualificationId;
  selectedCategoryIds = [];

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
  commonPageData;
  question_submit_api;
  perPageGivenQuestionAnswer = [];

  // skeleton loading
  skeletonArray = [
    {},{},{},{},{},{}
  ]

  constructor(
    private responsiveService : ResponsiveService,
    private http : HttpClient,
    private activatedRoute : ActivatedRoute,
    private plt: Platform,
    private pagerService: PaginationService,
    private commonUtils : CommonUtils,
    private router: Router
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
    // this.getlist('question/getlist');

    // question submit api
    this.question_submit_api ="question_result/return_add";

    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
    console.log('this.parms_action_name nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn >',this.parms_action_name);


    if(this.parms_action_name == 'result'){
      // list data url name
      this.listing_url = 'question/question_result/'+ this.parms_action_id;
    }else{
      // list data url name
      this.listing_url = 'question/frontend_return_index/'+ this.parms_action_id;
    }

    /* this.api_parms = {
      type:'gggggg',
      id:'5'
    } */
    

    // get Site Info
    this.itemsSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 
        //(api_url, display_record, page, apiParms)
      }
    })

    // this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 

    // get data from commoninfo api
    this.itemsSubscribe = this.commonUtils.commonDataobservable.subscribe((res:any) =>{
      console.log('commonPageData data res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.commonPageData = res;
      }
    })
    

  }

  ionViewDidEnter(){
    // go to scroll top in mozila browser
    this.content.scrollToTop(0);
  }


  // ----------range slider start-------------
    /* minValue: number = 100;
    maxValue: number = 400; 
    ceil: 500,*/
    
    valueChangeRangeSlider(value: number, minvalue: number, maxvalue: number): void {
      console.log('value price min range >>>>>>>', minvalue);
      console.log('value price max range >>>>>>>', maxvalue);

      this.selectMinValue = minvalue;
      this.selectMaxValue = maxvalue;

      this.filterOnValue = {
        company_id: this.selectedCompanyId,
        qualification_id: this.selectedQualificationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join()
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

  // onCheckboxSelect
  onCheckboxSelect(option, event) {
    console.log('option >>>> >', option);

    if (event.target.checked) {

      for (let i = 0 ; i < this.fetchItems.length; i++) {
        if (this.checkedList[i] == option) {
            this.checkedList.splice(i, 1);
        }
      }
      
      if (this.checkedList.indexOf(option) === -1) {
        this.checkedList.push(option);
      }
    }

    console.log('option checkedList >>>> >', this.checkedList);

    this.selectedCategoryIds = this.checkedList;

    this.filterOnValue = {
      company_id: this.selectedCompanyId,
      qualification_id: this.selectedQualificationId,
      start_price: this.selectMinValue,
      end_price: this.selectMaxValue,
      category: this.selectedCategoryIds.join()
    }
    this.advanceSearchParms = this.filterOnValue;

    this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 

  }

  // Dropdown change
  onChangeselectDropdown(_id, _identifire){
    console.log('onChangeselectDropdown _id >', _id);
    console.log('onChangeselectDropdown _identifire >', _identifire);
    
    if(_identifire == 'company'){
      this.selectedCompanyId = _id;
      this.filterOnValue = {
        company_id: this.selectedCompanyId,
        qualification_id: this.selectedQualificationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join()
      }
    }else if(_identifire == 'qualification'){
      this.selectedQualificationId = _id;
      this.filterOnValue = {
        company_id: this.selectedCompanyId,
        qualification_id: this.selectedQualificationId,
        start_price: this.selectMinValue,
        end_price: this.selectMaxValue,
        category: this.selectedCategoryIds.join()
      }
    }
  
    this.advanceSearchParms = this.filterOnValue;

    this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire); 
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
            console.log('skill getlist resData >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', resData);
            this.getlistData = resData;


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

        // per page given question answer list blank
        this.perPageGivenQuestionAnswer = [];
        
        this.isListLoading = false;
        this.fetchItems = resData[0];
        this.listAlldata = resData[1];

        // all question id push unique array
        resData[0].forEach(element => {
          if(this.fetchItemsAll.indexOf(element.id) === -1){
            this.fetchItemsAll.push(element.id);
          }
        });
        
       
        console.log('this.fetchItemsAll >>>>>>>>', this.fetchItemsAll);

        // selectQuestion
        //---------  check item show start ----------
        /* if(this.fetchItems && this.checkedList){
          for (let i = 0 ; i < this.fetchItems.length; i++) {
            for (let j = 0 ; j < this.checkedList.length; j++) {
              if(this.checkedList[j].id ==  this.fetchItems[i].id){
                this.fetchItems[i].isSelected = true;
                // console.log('this.fetchItems[i] >>', this.fetchItems[i]);
              }
            }
          }
        } */
        // check item show end
        

        // answer question selected show back button click start
        if(this.fetchItems && this.selectQuestion){
          for (let i = 0 ; i < this.fetchItems.length; i++) {
            for (let j = 0 ; j < this.selectQuestion.length; j++) {
              if(this.selectQuestion[j].id ==  this.fetchItems[i].id){
                // console.log('this.fetchItems[i] ############# >', this.selectQuestion[j]);

                // this.selectQuestion.splice(i, 1);

                this.fetchItems[i].options.forEach(element => {
                  
                  element.givenAnswer = this.selectQuestion[j].selectOptionIndex; // select radio item should not string value

                  // if(element.option_id == this.selectQuestion[j].selectOptionIndex){
                  //   console.log('eeeeeeeee >', element);
                  // element.givenAnswer = "2";
                  // }

                });
              }
            }
          }
        }
        // answer question selected show back button click end
        

        if(this.parms_action_name == 'result'){
          // select question answer show 
          if(this.fetchItems){
            for (let i = 0 ; i < this.fetchItems.length; i++) {
              this.fetchItems[i].options.forEach(element => {
                element.givenAnswer = JSON.parse(this.fetchItems[i].answer_given); // select radio item should not string value
                // console.log('element.givenAnswer >>>>>>>>>>', element.givenAnswer);
              });
            }
          }

        }


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
    this.model.qualification_id = {};

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

  //------------  click to radio button select question answer start --------------
    selectQuestion = [];
    OnselectRadioQuestionAnswer(event, _itemIndex, _item, mainItem){

      console.log('iiiiiiiiiiiiiiiiiiiii radio select _item >', _item);

      for (let i = 0 ; i < this.fetchItems.length; i++) {
        console.log('this.selectQuestion[i] >>', this.selectQuestion[i]);
        // console.log('this.mainItem >>', mainItem);
        /* if (this.selectQuestion[i] == mainItem) {
          console.log('match idddddddddddddddd >', mainItem.id);
            this.selectQuestion.splice(i, 1);
        } */
        if(this.selectQuestion[i] && this.selectQuestion[i].id ){
          if(this.selectQuestion[i].id == mainItem.id) {
            this.selectQuestion.splice(i, 1);

            // per page given answer list
            this.perPageGivenQuestionAnswer.splice(i, 1);
          }
        }
      }
      
      if (this.selectQuestion.indexOf(mainItem) === -1) {
        mainItem.itemIndex = _itemIndex;
        mainItem.selectOptionIndex = _item;
        this.selectQuestion.push(mainItem);

        // per page given answer list
        this.perPageGivenQuestionAnswer.push(mainItem);
      }

      

      console.log('this.selectQuestion >>>>>>>>>>', this.selectQuestion);


      // unique array (one time) push
    /*  const result = [];
      const map = new Map();
      for (const item of this.selectQuestion) {
          if(!map.has(item.questionNo)){
            map.set(item.questionNo, true);    // set any value to Map
            result.push({
              questionNo: item.questionNo,
              answerGiven: item.answerGiven
            });
          }
      }
      console.log('result>', result) */

      /* console.log('this.fetchItems lengthhhhhhhhhhhh >', this.fetchItems.length);
      console.log('this.selectQuestion lengthhhhhhhhhhhh >', this.selectQuestion.length);
      console.log('this.perPageGivenQuestionAnswer lengthhhhhhhhhhhh perPageGivenQuestionAnswer >>>', this.perPageGivenQuestionAnswer.length); */


    }
  // -- click to radio button select question answer end --

  // ======================== question answer submit form start ===================
    form_submit_text = 'SUBMIT';

    onSubmitQuestionAnswer(form:NgForm){
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

      // if not attempt all question form will not be submit
      if(this.selectQuestion.length != this.listAlldata.total)
      {
        this.form_submit_text = 'SUBMIT';
        this.commonUtils.presentToast('info', 'Please Attempt All Question First');
        return;
      }

      this.formSubmitSearchSubscribe = this.http.post(this.question_submit_api, fd).subscribe(
        (response:any) => {
          console.log("add form response >", response.return_data.subject_id);

          if(response.return_status > 0){
            // this.commonUtils.presentToast(response.return_message);
            this.commonUtils.presentToast('success', response.return_message);

              this.form_submit_text = 'SUBMIT';

              // array blank after form submit
              this.fetchItemsAll = [];
              this.selectQuestion = [];

              this.router.navigateByUrl(`/result/${response.return_data.subject_id}`);
              
          }

        },
        errRes => {
          this.form_submit_text = 'SUBMIT';
        }
      );

    }
  //--- question answer submit form  end ---


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