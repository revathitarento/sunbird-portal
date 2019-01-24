import { Component, OnInit } from '@angular/core';
import { RssfeedService } from './../../services';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  readMore = false;
  homepageContent: any;
  homepageContentP1: any;
  homepageContentP2: any;
  homepageContentP3: any;
  rssFeedNews: any;
  rssFeedOpportunities: any;

  constructor(public rssfeedService: RssfeedService) { }

  ngOnInit() {
    this.getHomepageContent();
    this.getNewsRssFeed();
    this.getOpportunitiesRssFeed();
  }

  getHomepageContent() {
    this.homepageContent = 'Estimates suggest that India will fully utilize its water resources by 2050.'
    + 'The largest consumer of groundwater is agriculture which forms the mainstay of livelihood for almost'
    + 'half the country (49% as of 2011-12) especially in the decades following the green revolution.'
    + 'Groundwater contributes 62.4% of water used for irrigation & close to 90% of rural drinking water supply.'
    + ' This dependence on groundwater is only bound to increase as we adopt ambitious irrigation and drinking water supply targets.'
    + 'It is thus no surprise that we are the largest abstractors of groundwater in the world – with extraction exceeding the combined'
    + ' withdrawals of USA and China.';
    this.homepageContentP1 = 'Large-scale societal challenges call for a new way of thinking that enables rapid sustainable development.'
    + 'An approach that creates a shared infrastructure that lets every actor in the society to participate in social innovation.';
    this.homepageContentP2 = 'Societal Platforms are one of many ways forward to resolve complex societal challenges.'
    + 'They are imagined as a public good aimed at extending citizen services across our demographics and facilitating meaningful '
    + 'collaboration, amplified by technology.';
    this.homepageContentP3 = 'Societal Platforms are built on elegant yet light digital infrastructure; they create spaces for co-creation'
    + ' and participation by all entities with a stake in positive change – from state institutions and entrepreneurs to non-profits'
    + 'or individual citizens. Developed with the right design principles and methods, Societal Platforms present a significant '
    + 'opportunity to reimagine societal transformation. The aim is to answer, for a specific mission: How might we design and develop '
    + 'Societal Platforms, as public goods, that enable open innovation for societal development? How can such a societal infrastructure '
    + 'amplify the benefits of societal initiatives across all segments of our society? How can a digital infrastructure support rapid'
    + ' evolution and adoption of innovations in multiple sectors such as education, healthcare, and financial inclusion? '
    + 'How can Societal Platforms help the network of societal actors move from their existing equilibrium to the desired one?';
  }

  getNewsRssFeed() {
    this.rssfeedService.getNewsFeed().subscribe(
      (data) => {
          console.log('rss feed', data.result);
          this.rssFeedNews = data.result;
       });
  }

  getOpportunitiesRssFeed() {
    this.rssfeedService.getOpportunitiesRssFeed().subscribe(
      (data) => {
          this.rssFeedOpportunities = data.result;
       });
  }

}
