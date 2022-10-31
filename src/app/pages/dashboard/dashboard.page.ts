import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ModalController, IonContent, MenuController, Platform, AlertController } from '@ionic/angular';
import { AddCommonModelPage } from '../../pages/modal/add-common-model/add-common-model.page';

import { CommonUtils } from './../../services/common-utils/common-utils';
import { AuthService } from './../../services/auth/auth.service';

import { environment } from '../../../environments/environment';
import { query } from '@angular/animations';
import { PaginationService } from './../../services/pagination.service';

declare var $ :any; //jquary declear

/* tslint:disable */ 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

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
  skilltableHeaderData;
  tableHeaderDataDropdown;
  current_url_path_name;
  tableheaderDropdown;
  tableheaderDropdownChecked;
  private viewPageDataSubscribe: Subscription;
  private itemsHeaderSubscribe: Subscription;
  private jobHeaderSubscribe : Subscription;
  private formSubmitSearchSubscribe: Subscription;
  parms_action_id;
  listing_view_url;
  viewLoadData;
  viewData;
  disableApplyButton = false;
  headerUrlapi;
  headerSkillapi;
  headerJobapi;
  listing_url;

  // ......check uncheck start....
  itemcheckClick = false;
  checkedList = [];
  allselectModel;
  // check uncheck end

  // api parms
  api_parms: any = {};
  urlIdentifire = '';

  constructor(
    private plt: Platform,
    private storage: Storage,
    private pagerService: PaginationService,
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

    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');

    // table header data url name
    this.headerSkillapi = 'student/dashboard_skill_header';

    this.headerJobapi = 'student/dashboard_job_header';

    
    // view page url name
    this.listing_view_url = 'student/dashboard' ;

    // view data call (autologin check)
    this.viewPageDataSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.viewPageData(); 
      }
    })

    this.jobHeaderSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.onHeaderSkillData(); 
      }
    })

    this.itemsHeaderSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.onHeaderData(); 
      }
    })

    // view data call (userdetails from header login only)
    this.viewPageDataSubscribe = this.commonUtils.signinCheckObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>..11111 >', res);
      if(res){
        this.viewPageData(); 
      }
    })

  }


  ngOnInit() {
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

  // ion View Will Enter call
  ionViewWillEnter() {
    this.commonFunction();
  }

  ionViewDidEnter(){
    // go to scroll top in mozila browser
    this.content.scrollToTop(0);
  }

  // --------- table header function -----------
  onHeaderData() {
      this.itemsHeaderSubscribe = this.http.get(this.headerSkillapi).subscribe(
        (res:any) => {

        // console.log('resData1', resData);
        this.tableHeaderData = res.return_data;
        console.log('tableHeaderData', this.tableHeaderData);
      },
      errRes => {
        // this.isLoading = false;
      }
      );
  }

  onHeaderSkillData() {
      this.jobHeaderSubscribe = this.http.get(this.headerJobapi).subscribe(
        (res:any) => {

        console.log('resData', res);
        this.skilltableHeaderData = res.return_data;
      },
      errRes => {
        // this.isLoading = false;
      }
      );
  }

  /*==========Goto view page button==========*/

  form_submit_text = 'Surging Employability';
  form_api = 'skill/return_index';
  onclickNext(_identifire){

    let fd = new FormData();
    // login or not check
    if(_identifire == 'skill'){
      this.formSubmitSearchSubscribe = this.http.post(this.form_api, fd).subscribe(
        (response:any) => {
          this.form_submit_text = 'Surging Employability';
          console.log("add form response >", response);

          if(response.return_status > 0){

              this.router.navigateByUrl(`skill-list?qualification_id=${this.viewData.qualification_data.qualification_id}&degree_id=${this.viewData.qualification_data.degree_id}`);
          }
        },
        errRes => {
          this.form_submit_text = 'Surging Employability';
        }
      );
    }else if(_identifire == 'job'){
      this.formSubmitSearchSubscribe = this.http.post(this.form_api, fd).subscribe(
        (response:any) => {
          this.form_submit_text = 'Surging Employability';
          console.log("add form response >", response);

          if(response.return_status > 0){

              this.router.navigateByUrl(`job-list?qualification_id=${this.viewData.qualification_data.qualification_id}&degree_id=${this.viewData.qualification_data.degree_id}`);
          }
        },
        errRes => {
          this.form_submit_text = 'Surging Employability';
        }
      );
    }
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


  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
      if(this.itemsHeaderSubscribe !== undefined){
        this.itemsHeaderSubscribe.unsubscribe();
      }
      if(this.jobHeaderSubscribe !== undefined) {
        this.jobHeaderSubscribe.unsubscribe();
      }
      if(this.formSubmitSearchSubscribe !== undefined){
      this.formSubmitSearchSubscribe.unsubscribe();
    }
    }
  // destroy subscription end
}

