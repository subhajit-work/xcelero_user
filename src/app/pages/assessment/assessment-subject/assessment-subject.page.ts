import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ModalController, IonContent, MenuController, Platform, AlertController } from '@ionic/angular';
import { AddCommonModelPage } from '../../../pages/modal/add-common-model/add-common-model.page';

import { CommonUtils } from '../../../services/common-utils/common-utils';
import { AuthService } from '../../../services/auth/auth.service';

import { environment } from '../../../../environments/environment';
import { query } from '@angular/animations';

declare var $ :any; //jquary declear

/* tslint:disable */ 
@Component({
  selector: 'app-assessment-subject',
  templateUrl: './assessment-subject.page.html',
  styleUrls: ['./assessment-subject.page.scss'],
})
export class AssessmentSubjectPage implements OnInit, OnDestroy {

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
  private getListSubscribe: Subscription;
  parms_action_id;
  listing_view_url;
  viewLoadData;
  viewData;
  disableApplyButton = false;
  getlistLoading;
  getlistData;
  parms_qualification_id;
  parms_industry_id;
  parms_interest_id;
  parms_degree_id;
  parms_subject_id;
  subjectList;
  commonPageData;

  skeletonArray = [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {}
  ]

  constructor(
    private plt: Platform,
    private activatedRoute : ActivatedRoute,
    private router: Router,
    private http : HttpClient,
    private modalController : ModalController,
    private commonUtils : CommonUtils,
    private authService : AuthService,
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

    this.parms_qualification_id = this.activatedRoute.snapshot.paramMap.get('qualification_id');
    this.parms_degree_id = this.activatedRoute.snapshot.paramMap.get('degree_id');
    this.parms_interest_id = this.activatedRoute.snapshot.paramMap.get('interest_id');
    this.parms_subject_id = this.activatedRoute.snapshot.paramMap.get('subject_id');
    
    // view page url name
    this.listing_view_url = 'question_subject/return_index?qualification_id='+ this.parms_qualification_id + '&degree_id='+ this.parms_degree_id + '&interest_id='+ this.parms_interest_id + '&subject_id='+ this.parms_subject_id;

    // getlist data url name
    this.getlist('question_subject/getlist');

    // view data call (autologin check)
    this.viewPageDataSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.viewPageData(); 
      }
    })

    // view data call (userdetails from header login only)
    this.viewPageDataSubscribe = this.commonUtils.signinCheckObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>..11111 >', res);
      if(res){
        this.viewPageData(); 
      }
    })

    // get data from commoninfo api
    this.viewPageDataSubscribe = this.commonUtils.commonDataobservable.subscribe((res:any) =>{
      console.log('commonPageData data res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.commonPageData = res;
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

  //--------------  getlist data fetch start -------------
    getlist(_getlistUrl){
      this.plt.ready().then(() => {
        this.getlistLoading = true;
        this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
          resData => {
            this.getlistLoading = false;
            this.getlistData = resData;
          },
          errRes => {
            this.getlistLoading = false;
          }
        );
      });
    }
  // getlist data fetch end

  //================ Authenticate or not button click start ==================
    onApplyJob(event, _item){
      // login or not check
      this.authService.autoLogin().subscribe(resData => {
        console.log('resData +++++++++++++++++++++++++++++++=&&&&&& (autoLogin details page)>>>>>>>>>>>>>>>>>', resData);
        if(!resData){
          //if not login
          this.userAuthenticateModal('signUp', '', '');
        }else{
          // if login
          this.userAuthenticateModal('apply_query', _item, '');
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
      }else if(_identifier == 'apply_query'){
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
          // console.log('submitClose');
          /* this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);  */
          this.viewPageData(); 
        }
        if(getdata.data == 'applyQuerysubmitClose'){
          // console.log('applyQuerysubmitClose');
          this.disableApplyButton = true;

        }

      });

      return await open_modal.present();
    }
    // userAuthenticate modal end 
  // ----------- Authenticate or not button click end ------

  // ================== view data fetch start =====================
    viewPageData(){
      this.viewLoadData = true;
      this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
        (res:any) => {
          this.viewLoadData = false;
          console.log("view data  res -------------------->", res.return_data);
          if(res.return_status > 0){
            this.subjectList = res.return_data.data;
          }
        },
        errRes => {
          this.viewLoadData = false;
        }
      );
    }
  // view data fetch end

  // ----- click item hilight back start ----
  activeHighlightIndex;
  clickItemHighlight(index){
    this.activeHighlightIndex = index;
  }
  //click item hilight back end 

  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.getListSubscribe !== undefined){
        this.getListSubscribe.unsubscribe();
      }
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
    }
  // destroy subscription end
}

