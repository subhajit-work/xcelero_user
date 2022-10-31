import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';

/* tslint:disable */ 
const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  { 
    path: 'home', 
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  { 
    path: 'skill-list', 
    loadChildren: './pages/skill-list/skill-list.module#SkillListPageModule' 
  },
  { 
    path: 'skill-list-free', 
    loadChildren: './pages/skill-list/skill-list.module#SkillListPageModule' 
  },
  { 
    path: 'skill-list-underserved', 
    loadChildren: './pages/skill-list/skill-list.module#SkillListPageModule' 
  },
  { 
    path: 'skill-list-continuous', 
    loadChildren: './pages/skill-list/skill-list.module#SkillListPageModule' 
  },
  { 
    path: 'job-list', 
    loadChildren: './pages/job-list/job-list.module#JobListPageModule' 
  },
  { 
    path: 'associate-with-us', 
    loadChildren: './pages/associate-form/associate-form.module#AssociateFormPageModule' 
  },
  { 
    path: 'skill-details/:action/:id', 
    loadChildren: './pages/skill-details/list-details.module#ListDetailsPageModule' 
  },
  { 
    path: 'job-details/:action/:id', 
    loadChildren: './pages/job-details/job-details.module#JobDetailsPageModule' 
  },
  { 
    path: 'dashboard', 
    loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'checkout/:id', 
    loadChildren: './pages/checkout/checkout.module#CheckoutPageModule',
  },
  { 
    path: 'student-register/:action/:id', 
    loadChildren: './pages/student-register/student-register.module#StudentRegisterPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'assessments/:id', 
    loadChildren: './pages/assessment/question-list/question-list.module#QuestionListPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'assessments/:action/:id', 
    loadChildren: './pages/assessment/question-list/question-list.module#QuestionListPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'result/:id', 
    loadChildren: './pages/assessment/result-list/result-list.module#ResultListPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'choose-assessment', 
    loadChildren: './pages/assessment/choose-assessment/choose-assessment.module#ChooseAssessmentPageModule' 
  },
  { 
    path: 'assessment-subject/:qualification_id/:degree_id/:interest_id/:subject_id', 
    loadChildren: './pages/assessment/assessment-subject/assessment-subject.module#AssessmentSubjectPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'attempted-assessment', 
    loadChildren: './pages/assessment/attempted-assessment/attempted-assessment.module#AttemptedAssessmentPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'personal-information/:id', 
    loadChildren: './pages/personal-information/personal-information.module#PersonalInformationPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'order-list', 
    loadChildren: './pages/order-list/order-list.module#OrderListPageModule',
    canLoad: [AuthGuard]  
  },
  { 
    path: 'job-apply-list', 
    loadChildren: './pages/job-apply-list/job-apply-list.module#JobApplyListPageModule',
    canLoad: [AuthGuard] 
  },
  { 
    path: 'profile/:id', 
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'contact', 
    loadChildren: './pages/contact-us/contact-us.module#ContactUsPageModule' 
  },
  { 
    path: 'about-us', 
    loadChildren: './pages/about-us/about-us.module#AboutUsPageModule' 
  },
  { 
    path: 'faq', 
    loadChildren: './pages/faq/faq.module#FaqPageModule' 
  },
  { 
    path: 'campus-to-corporate', 
    loadChildren: './pages/campus-to-corporate/campus-to-corporate.module#CampusToCorporatePageModule' 
  },
  { 
    path: 'coe', 
    loadChildren: './pages/college-list/college-list.module#CollegeListPageModule' 
  },
  { 
    path: 'incubation-centre', 
    loadChildren: './pages/college-list/college-list.module#CollegeListPageModule' 
  },
  { 
    path: 'cms/:action', 
    loadChildren: './pages/cms/cms.module#CmsPageModule' 
  },
  { 
    path: 'compare',
    loadChildren: './pages/compare/compare.module#ComparePageModule'
   },
  {
    path: '**',   // redirects all other routes to the main page
    redirectTo: 'home'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }