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
    selector: 'app-choose-assessment',
    templateUrl: './choose-assessment.page.html',
    styleUrls: ['./choose-assessment.page.scss'],
  })
  export class ChooseAssessmentPage implements OnInit, OnDestroy {
  
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
    private contactByCompanySubscribe: Subscription;
    parms_action_id;
    listing_view_url;
    viewLoadData;
    viewData;
    disableApplyButton = false;
    getlistLoading;
    getlistData;
    selectLoading;
    commonPageData;
    selectedDegreeId;
    selectedInterestId;
    selectedSubjectId;
    selectedQualificationId;
    qualificationList;
    degreeList;
    interestList;
    subjectList;
    companyByContact_api;
    default_qualification_id;
  
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
  
      this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
      
      // view page url name
      // this.listing_view_url = 'job/return_edit/'+this.parms_action_id ;
  
      // company by contact api
      this.companyByContact_api = 'ajaxs_post/'

      // view data call (autologin check)
      this.viewPageDataSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
        console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
        if(res){
          // this.viewPageData(); 
          // getlist data url name
           this.getlist('question_subject/getlist');
        }
      })
  
      // view data call (userdetails from header login only)
      this.viewPageDataSubscribe = this.commonUtils.signinCheckObservable.subscribe(res =>{
        console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>..11111 >', res);
        if(res){
          // this.viewPageData(); 
          
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
              this.qualificationList = resData.qualification_with_data;
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
              this.getlistLoading = false;
            }
          );
        });
      }
    // getlist data fetch end
  
    //================ Authenticate or not button click start ==================
      onclickNext(event, _item){

        console.log('onclickNext',event);
        // login or not check
        this.authService.autoLogin().subscribe(resData => {
          console.log('resData +++++++++++++++++++++++++++++++=&&&&&& (autoLogin details page)>>>>>>>>>>>>>>>>>', resData);
          if(!resData){
            //if not login
            this.userAuthenticateModal('signUp', '', '');
          }else{
            console.log('routing',_item.qualification_with_data,_item.qual_degree_with_data,_item.qual_interest_with_data,_item.qual_subject_with_data);
            // if login
            // this.userAuthenticateModal('apply_query', _item, '');
            if(_item.qual_degree_with_data == null){
              _item.qual_degree_with_data = '';
            }
            if(_item.qual_interest_with_data == null){
              _item.qual_interest_with_data = '';
            }
            this.router.navigate(['/assessment-subject',_item.qualification_with_data,_item.qual_degree_with_data,_item.qual_interest_with_data,_item.qual_subject_with_data]);


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
            console.log('submitClose');
            /* this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);  */
            // this.viewPageData(); 
          }
        });
  
        return await open_modal.present();
      }
      // userAuthenticate modal end 
    // ----------- Authenticate or not button click end ------
  
    // ================== view data fetch start =====================
      viewLoadDataDropdown;
      selectData;
      dropDownData(_url){
        this.viewLoadDataDropdown = true;
        this.viewPageDataSubscribe = this.http.get(_url).subscribe(
          (res:any) => {
            this.viewLoadDataDropdown = false;
            console.log("DataDropdown data  res -------------------->", res.return_data);
            if(res.return_status > 0){
              this.selectData = res.return_data;
            }
          },
          errRes => {
            this.viewLoadDataDropdown = false;
          }
        );
      }
    // view data fetch end
  

    // get dropdown select value
    /*nextButtonDisable = true;
    onChangeSelectBox(_identifire, _qualification, _industry){
      console.log('_identifire >', _identifire);
      console.log('_qualification >', _qualification);
      console.log('_insustry >', _industry);

      if(_identifire == 'qualification'){
        let dropurl = 'question_subject/return_getIndustry/'+ _qualification;
        this.model.industry_type_id = null;
        this.dropDownData(dropurl);
      }

      if(_qualification && _industry && this.model.industry_type_id != null){
        this.nextButtonDisable = false;
      }else{
        this.nextButtonDisable = true;
      }
    }*/

    nextButtonDisable = true;
    onChangeStudy(_id, _identifire){

      let identy;
      if(_identifire == 'qualification'){
        identy = 'return_getDegreeWithData?qualification';
        this.contactByCompany(_id,  identy);

        this.model.qual_degree_with_data = null;
        this.model.qual_interest_with_data = null;
        this.model.qual_subject_with_data = null;

        if (identy = 'return_getDegreeWithData?qualification') {
          identy = 'return_getSubjectWithData?qualification';
        }

      }else if(_identifire == 'degree'){
        identy = 'return_getInterestWithData?degree';
        // this.model.qual_interest_with_data = null;
      }

      if(this.model.qualification_with_data && this.model.qual_subject_with_data  != null){
        this.nextButtonDisable = false;
      }else{
        this.nextButtonDisable = true;
      }
      this.contactByCompany(_id,  identy);
    } 

    //contactByCompany
    contactByCompany = function( _id , _name){
      this.selectLoadingDepend = true;
      this.contactByCompanySubscribe = this.http.get(this.companyByContact_api+ _name + '=' +_id +'&identifier=question_subject').subscribe(
        (res:any) => {
        this.selectLoadingDepend = false;

        if(res.return_status > 0){

          if(_name == 'return_getDegreeWithData?qualification'){
            this.degreeList = res.return_data.degree;
          }else if(_name == 'return_getInterestWithData?degree'){
            this.interestList = res.return_data.interest;
          }else if(_name == 'return_getSubjectWithData?qualification'){
            this.subjectList = res.return_data.subject;
          }
        }
      },
      errRes => {
        this.selectLoadingDepend = false;
      }
      );
    }
  
  
    // ----------- destroy subscription start ---------
      ngOnDestroy() {
        if(this.getListSubscribe !== undefined){
          this.getListSubscribe.unsubscribe();
        }
        if(this.viewPageDataSubscribe !== undefined){
          this.viewPageDataSubscribe.unsubscribe();
        }
        if(this.contactByCompanySubscribe !== undefined){
          this.contactByCompanySubscribe.unsubscribe();
        }
      }
    // destroy subscription end
  }
  
  

