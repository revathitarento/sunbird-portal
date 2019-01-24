// Import modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DataPrivacyPolicyComponent, TermsOfUserComponent, AboutForWaterComponent} from './component/index';
// Import component

const telemetryEnv = 'guideline';
const objectType = 'guideline';
const routes: Routes = [
  {
     path: 'guideline/privacypolicy', data: {
      telemetry: {
        env: telemetryEnv, pageid: 'guideline', uri: '/data-privacy-policy', subtype: 'guideline',
        type: 'view', object: { type: objectType, ver: '1.0' }
      }
    },
    component: DataPrivacyPolicyComponent
  },
  {
    path: 'guideline/termsofuse', data: {
      telemetry: {
        env: telemetryEnv, pageid: 'guideline', uri: '/terms-of-use', subtype: 'guideline',
        type: 'view', object: { type: objectType, ver: '1.0' }
      }
    },
    component: TermsOfUserComponent
  },
  {
    path: 'guideline/aboutforwater', data: {
      telemetry: {
        env: telemetryEnv, pageid: 'guideline', uri: '/about-for-water', subtype: 'guideline',
        type: 'view', object: { type: objectType, ver: '1.0' }
      }
    },
    component: AboutForWaterComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class GuidelineRoutingModule { }
