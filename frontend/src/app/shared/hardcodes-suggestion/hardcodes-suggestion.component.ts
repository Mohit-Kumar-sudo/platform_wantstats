import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HardCodedData } from 'src/app/constants/hardcoded-data';
import { ConstantKeys } from 'src/app/constants/mfr.constants';
import { YoutubeDailogComponent } from 'src/app/output-components/youtube-modal/youtube-modal.component';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { NewsApiService } from 'src/app/services/news-api.service';
import { ReportService } from 'src/app/services/report.service';
import { SharedInteconnectService } from 'src/app/services/shared-interconnect.service';
import { YoutubeApiService } from 'src/app/services/youtube-api.service';
import * as _ from 'lodash';
import { LeadsService } from 'src/app/services/leads.service';
import { companyProfileService } from 'src/app/services/companyprofile.service';

@Component({
  selector: 'app-hardcodes-suggestion',
  templateUrl: './hardcodes-suggestion.component.html',
  styleUrls: ['./hardcodes-suggestion.component.scss']
})
export class HardcodesSuggestionComponent implements OnInit {
  @Input() suggestion: any;
  moreReports: boolean = false;
  videoStatus: boolean = false;
  fillingOverlap: boolean = false;
  stocksOverlap: boolean = false;
  moreStatus: boolean = false;

  // suggestion: any;
  parameter: any;
  contents: any = [];
  news: any = [];
  finalNews: any = [];
  newStat = false;
  interConnect = true;
  reportConnect = false;
  reportStatus = false;
  leadsDb = false;
  reportId = '';
  appItems: any;
  topCompanies = [];
  fillingConnect = [];
  reportConnectData = {
    section: '',
    data: []
  };
  hardCodedReportConnectData = {
    section: '',
    data: []
  };
  interConnectData: any;
  overlaps: any;
  youtubeContents: any;

  leadsArray: any = [];
  currentReport: any;
  cp: any;
  reportName = '';
  currentOrder = 'normalOrder';
  isTopPlayer = false;
  interConnects = [];
  interConnectsMore = [];
  searchText = '';
  moreNewsStatus = false;
  moreVideosStatus = false;

  hardCodedFiling: any = [];
  sectionDetails = {
    Drivers: {
      main_section: 'Market Dynamics',
      section_name: 'Drivers',
      router_link: '/droctcontainer'
    },
    Restraints: {
      main_section: 'Market Dynamics',
      section_name: 'Restraints',
      router_link: '/droctcontainer'
    },
    Opportunities: {
      main_section: 'Market Dynamics',
      section_name: 'Opportunities',
      router_link: '/droctcontainer'
    },
    Challenges: {
      main_section: 'Market Dynamics',
      section_name: 'Challenges',
      router_link: '/droctcontainer'
    },
    Trends: {
      main_section: 'Market Dynamics',
      section_name: 'Trends',
      router_link: '/droctcontainer'
    },
    'Suuply / Value Chain Analysis': {
      main_section: 'Supply/Value Chain Analysis',
      router_link: '/supply-chain-output'
    },
    Porters: {
      main_section: 'Porter\'s 5 Forces',
      router_link: '/porters-forces-output'
    }
  };

  order = {
    normalOrder: ['Drivers', 'Restraints', 'Suuply / Value Chain Analysis', 'Porters', 'Opportunities', 'Challenges', 'Trends'],
    supplyChainOrder: ['Suuply / Value Chain Analysis', 'Porters', 'Drivers', 'Restraints', 'Opportunities', 'Challenges', 'Trends'],
    porterOrder: ['Porters', 'Suuply / Value Chain Analysis', 'Drivers', 'Restraints', 'Opportunities', 'Challenges', 'Trends']
  };

  secHardcore = ['Johnson & Johnson', 'Novartis Ag.', 'Medtronic Plc', 'Abbott Laboratories'];

  hardCodedCovidContents = [
    {
      imgUrl: 'https://i.ytimg.com/vi/yrxYhv2O3wU/mqdefault.jpg',
      videoid: 'yrxYhv2O3wU',
      title: 'What coronavirus means for the global economy | Ray Dalio',
      publishedAt: '2020-04-09T16:16:13Z'
    },
    {
      imgUrl: 'https://i.ytimg.com/vi/yFisxvUNfMs/mqdefault.jpg',
      videoid: 'yFisxvUNfMs',
      title: 'Coronavirus outbreak: The economic impact explained',
      publishedAt: '2020-03-06T11:30:03Z'
    },
    {
      imgUrl: 'https://i.ytimg.com/vi/9nrZwjcjS1A/mqdefault.jpg',
      videoid: '9nrZwjcjS1A',
      title: 'Coronavirus: impact on Global Economy - BBC News',
      publishedAt: '2020-05-01T11:43:10Z'
    },
    {
      imgUrl: 'https://i.ytimg.com/vi/l9ViEIip9q4/mqdefault_live.jpg',
      videoid: 'l9ViEIip9q4',
      title: 'NDTV India LIVE TV - Watch Coronavirus Live Updates | Latest News in Hindi | हिंदी समाचार',
      publishedAt: '2020-03-02T09:47:22Z'
    },
    {
      imgUrl: 'https://i.ytimg.com/vi/WA1Ji-Hj1qo/mqdefault.jpg',
      videoid: 'WA1Ji-Hj1qo',
      title: 'Ray Dalio on the Economic Impact of the Coronavirus Crisis',
      publishedAt: '2020-04-15T23:10:20Z'
    }
  ];
  hardcodedStocks: any = [];

  hardCodedReports = {
    section: 'Report',
    data: [
      //   {
      //     "report_id": "5ef0c8b33f9f1f406c85d979",
      //     "report_name": "Coffee"
      // },
      // {
      //     "report_id": "5e2132c97d97af0004f1db47",
      //     "report_name": "Cold Brew Coffee"
      // },
      // {
      //     "report_id": "5e212fd57d97af0004f1dad6",
      //     "report_name": "Coffee Pods and Capsules"
      // }
    ]
  };

  hardCodedNews = [
    {
      title: 'Botox and fillers post-Covid-19: How appointments will ...',
      link: 'https://www.harpersbazaar.com/uk/beauty/skincare/a32627354/botox-fillers-post-covid-19/',
      published: '22-May-2020',
      text: 'Botox and fillers post-Covid-19: How appointments will completely change. An aesthetic doctor explains the future of cosmetic dermatology clinics.',
      source: 'harpersbazaar.com',
      linkExists: false
    },
    {
      title: 'Thinking about booking in for filler or Botox? Expect a rather ...',
      link: 'https://www.bodyandsoul.com.au/beauty/news-reviews/thinking-about-booking-in-for-filler-or-botox-expect-a-rather-long-waitlist/news-story/88ae8ba22e120102006e98409df321d7',
      published: '24-May-2020',
      text: '... next Botox, dermal filler or plastic surgery appointment might look like post-COVID-19. ... But what does it mean for elective areas of health care like cosmetic ... the country, we take a look at how your next appointment will change. ... The patient will be asked to complete the rest of the form and this will be ...',
      source: 'Body and Soul',
      linkExists: false
    },
    {
      title: 'COVID-19 Impact on Global Biodegradable Dermal Fillers Industry 2020: Market Size, Share, Trends, Applications, SWOT Analysis by Top Key Players, Demand and Forecast Report to 2025 - Jewish Life News',
      link: 'https://jewishlifenews.com/uncategorized/covid-19-impact-on-global-biodegradable-dermal-fillers-industry-2020-market-size-share-trends-applications-swot-analysis-by-top-key-players-demand-and-forecast-report-to-2025/',
      published: 'Mon, 01 Jun 2020 07:44:00 GMT',
      text: '<a href="https://jewishlifenews.com/uncategorized/covid-19-impact-on-global-biodegradable-dermal-fillers-industry-2020-market-size-share-trends-applications-swot-analysis-by-top-key-players-demand-and-forecast-report-to-2025/" target="_blank">COVID-19 Impact on Global Biodegradable Dermal Fillers Industry 2020: Market Size, Share, Trends, Applications, SWOT Analysis by Top Key Players, Demand and Forecast Report to 2025</a>&nbsp;&nbsp;<font color="#6f6f6f">Jewish Life News</font>',
      source: 'Jewish Life News',
      img: 'CBMi2AFodHRwczovL2pld2lzaGxpZmVuZXdzLmNvbS91bmNhdGVnb3JpemVkL2NvdmlkLTE5LWltcGFjdC1vbi1nbG9iYWwtYmlvZGVncmFkYWJsZS1kZXJtYWwtZmlsbGVycy1pbmR1c3RyeS0yMDIwLW1hcmtldC1zaXplLXNoYXJlLXRyZW5kcy1hcHBsaWNhdGlvbnMtc3dvdC1hbmFseXNpcy1ieS10b3Ata2V5LXBsYXllcnMtZGVtYW5kLWFuZC1mb3JlY2FzdC1yZXBvcnQtdG8tMjAyNS_SAdwBaHR0cHM6Ly9qZXdpc2hsaWZlbmV3cy5jb20vdW5jYXRlZ29yaXplZC9jb3ZpZC0xOS1pbXBhY3Qtb24tZ2xvYmFsLWJpb2RlZ3JhZGFibGUtZGVybWFsLWZpbGxlcnMtaW5kdXN0cnktMjAyMC1tYXJrZXQtc2l6ZS1zaGFyZS10cmVuZHMtYXBwbGljYXRpb25zLXN3b3QtYW5hbHlzaXMtYnktdG9wLWtleS1wbGF5ZXJzLWRlbWFuZC1hbmQtZm9yZWNhc3QtcmVwb3J0LXRvLTIwMjUvYW1wLw',
      linkExists: false
    },
    {
      title: 'Dermal Fillers and Botulinum Toxin Market Research Global Industry Analysis and Opportunity Assessment (2020-2027) - Cole of Duty',
      link: 'https://coleofduty.com/technology/2020/06/01/dermal-fillers-and-botulinum-toxin-market-research-global-industry-analysis-and-opportunity-assessment-2020-2027/',
      published: 'Mon, 01 Jun 2020 12:09:10 GMT',
      text: '<a href="https://coleofduty.com/technology/2020/06/01/dermal-fillers-and-botulinum-toxin-market-research-global-industry-analysis-and-opportunity-assessment-2020-2027/" target="_blank">Dermal Fillers and Botulinum Toxin Market Research Global Industry Analysis and Opportunity Assessment (2020-2027)</a>&nbsp;&nbsp;<font color="#6f6f6f">Cole of Duty</font>',
      source: 'Cole of Duty',
      img: 'CBMingFodHRwczovL2NvbGVvZmR1dHkuY29tL3RlY2hub2xvZ3kvMjAyMC8wNi8wMS9kZXJtYWwtZmlsbGVycy1hbmQtYm90dWxpbnVtLXRveGluLW1hcmtldC1yZXNlYXJjaC1nbG9iYWwtaW5kdXN0cnktYW5hbHlzaXMtYW5kLW9wcG9ydHVuaXR5LWFzc2Vzc21lbnQtMjAyMC0yMDI3L9IBAA',
      linkExists: false
    },
    {
      title: 'Hyaluronic Acid Based Dermal Fillers Market Outlook, Trends Analysis, Top Manufacturers, Shares, Growth Opportunities, Statistics & Forecast to 2026 - Jewish Life News',
      link: 'https://jewishlifenews.com/market-reports/hyaluronic-acid-based-dermal-fillers-market-outlook-trends-analysis-top-manufacturers-shares-growth-opportunities-statistics-forecast-to-2026/',
      published: 'Mon, 01 Jun 2020 16:39:00 GMT',
      text: '<a href="https://jewishlifenews.com/market-reports/hyaluronic-acid-based-dermal-fillers-market-outlook-trends-analysis-top-manufacturers-shares-growth-opportunities-statistics-forecast-to-2026/" target="_blank">Hyaluronic Acid Based Dermal Fillers Market Outlook, Trends Analysis, Top Manufacturers, Shares, Growth Opportunities, Statistics & Forecast to 2026</a>&nbsp;&nbsp;<font color="#6f6f6f">Jewish Life News</font>',
      source: 'Jewish Life News',
      img: 'CBMiuAFodHRwczovL2pld2lzaGxpZmVuZXdzLmNvbS9tYXJrZXQtcmVwb3J0cy9oeWFsdXJvbmljLWFjaWQtYmFzZWQtZGVybWFsLWZpbGxlcnMtbWFya2V0LW91dGxvb2stdHJlbmRzLWFuYWx5c2lzLXRvcC1tYW51ZmFjdHVyZXJzLXNoYXJlcy1ncm93dGgtb3Bwb3J0dW5pdGllcy1zdGF0aXN0aWNzLWZvcmVjYXN0LXRvLTIwMjYv0gG8AWh0dHBzOi8vamV3aXNobGlmZW5ld3MuY29tL21hcmtldC1yZXBvcnRzL2h5YWx1cm9uaWMtYWNpZC1iYXNlZC1kZXJtYWwtZmlsbGVycy1tYXJrZXQtb3V0bG9vay10cmVuZHMtYW5hbHlzaXMtdG9wLW1hbnVmYWN0dXJlcnMtc2hhcmVzLWdyb3d0aC1vcHBvcnR1bml0aWVzLXN0YXRpc3RpY3MtZm9yZWNhc3QtdG8tMjAyNi9hbXAv',
      linkExists: false
    }

  ];

  hardCodedActionCameraNews = [
    {
      title: 'What the Best Action Cameras Can Do That Your Phone Can\'t',
      link: 'https://www.themanual.com/outdoors/the-best-action-cameras/',
      published: '19-Jun-2020',
      text: 'Bringing its drone and camera expertise to the action camera market, DJI introduced the Osmo Action camera in 2019. Like the Hero8, the ...',
      source: 'The Manual',
      linkExists: false
    },
    {
      title: 'T3 Awards 2020: GoPro HERO8 Black is king of the action ...',
      link: 'https://www.t3.com/us/news/t3-awards-2020-gopro-hero-8-black-is-king-of-the-action-cameras',
      published: '08-Jun-2020',
      text: 'GoPro has dominated the action camera market for a while now, and it hasn\'t let us down with its latest flagship shooter: the GoPro HERO8 ...',
      source: 'T3',
      linkExists: false
    },
    {
      title: '[Herald Interview] Linkflow seeks to be Korea\'s first hardware ...',
      link: 'https://www.theinvestor.co.kr/view.php?ud=20200525000475',
      published: '25-May-2020',
      text: '... market not only because Korea takes up only a small segment, 0.8 percent of 1 trillion won ($805 million), of the global action camera market ...',
      source: 'The Investor',
      linkExists: false
    },
    {
      title: 'Is GoPro Finally a Buy?',
      link: 'https://www.fool.com/investing/2020/06/04/is-gopro-finally-a-buy.aspx',
      published: '04-Jun-2020',
      text: 'The action camera market will always be a small one, but the company has been right-sized while it was making key changes. James Brumley.',
      source: 'Motley Fool',
      linkExists: false
    },
    {
      title: 'Forget evil tech or rogue machines, here are the real concerns ...',
      link: 'https://cio.economictimes.indiatimes.com/news/next-gen-technologies/forget-evil-tech-or-rogue-machines-here-are-the-real-concerns-of-ai-adoption/76522411',
      published: '23-Jun-2020',
      text: 'The adoption of AI is increasing rapidly across the world with no industry remaining ... reasons – that governmental bodies around the world are taking action.',
      source: 'ETCIO.com',
      linkExists: false
    }

  ];

  hardCodedNewsVerticalGarden = [
    {
      title: 'Vertical Garden Construction Market 2021: Recent Study including Growth Factors',
      link: 'https://www.mccourier.com/vertical-garden-construction-market-2021-recent-study-including-growth-factors-applications-regional-analysis-key-players-and-forecast-2028/',
      source: 'The Courier',
      linkExists: false
    },
    {
      title: 'Vertical Garden Construction Market – Latest Trends',
      link: 'https://thebrockvilleobserver.ca/uncategorized/219543/vertical-garden-construction-market-latest-trends-and-future-growth-analysis-2021-2026/',
      source: 'Brockville Observer',
      linkExists: false
    },
    {
      title: 'Global Vertical Garden Construction Market-Industry Analysis',
      link: 'https://clarkcountyblog.com/news/1137311/global-vertical-garden-construction-market-industry-analysis-and-forecast-2019-2027-by-type-application-and-region/',
      source: 'Clark County Blog',
      linkExists: false
    }
  ];

  hardCodedNewsZeroEnergy = [
    {
      title: 'World needs no new oil, gas projects under path to net-zero emissions by 2050',
      link: 'https://www.spglobal.com/platts/en/market-insights/latest-news/natural-gas/051821-world-needs-no-new-oil-gas-projects-under-path-to-net-zero-emissions-by-2050-iea',
      source: 'S&P Global',
      linkExists: false
    },
    {
      title: 'Deloitte to open new Milan headquarters at Allianz’s Corso Italia 23 campus',
      link: 'https://www.propertyfundsworld.com/2021/05/18/300415/deloitte-open-new-milan-headquarters-allianzs-corso-italia-23-campus',
      source: 'Property Funds World',
      linkExists: false
    },
    {
      title: 'REELCAUSE Green Hydrogen Energy, Advanced Renewable Energy',
      link: 'https://www.bignewsnetwork.com/news/269506996/reelcause-green-hydrogen-energy-advanced-renewable-energy',
      source: 'Big News Network.com',
      linkExists: false
    },
    {
      title: 'Why setting net-zero carbon standards is imperative for mitigating climate change',
      link: 'https://gulfbusiness.com/why-setting-net-zero-carbon-standards-is-imperative-for-mitigating-climate-change/',
      source: 'Gulf Business',
      linkExists: false
    },
    {
      title: 'The future of green building is retrofit',
      link: 'https://www.reminetwork.com/articles/future-green-building-retrofit/',
      source: 'REMI Network',
      linkExists: false
    }

  ];

  hardCodedNewsLaminatedVeneerLumber = [
    {
      title: '3 Lumber Stocks to Consider Adding on Dips ',
      link: 'https://www.entrepreneur.com/article/371721',
      source: 'Entrepreneur',
      linkExists: false
    },
    {
      title: 'Mapping the timber industry boom in 2021',
      link: 'https://www.archpaper.com/2021/04/2021-timber-map/',
      source: 'The Architect\'s Newspaper',
      linkExists: false
    },
    {
      title: 'Raute\'s 1Q net sales increased by 4%',
      link: 'https://www.lesprom.com/en/news/Rautes_1Q_net_sales_increased_by_4_98589/',
      source: 'Lesprom',
      linkExists: false
    },
    {
      title: 'High lumber prices a boon to Alberta’s forestry industry',
      link: 'https://www.reddeeradvocate.com/news/high-lumber-prices-a-boon-to-albertas-forestry-industry/',
      source: 'Red Deer Advocate',
      linkExists: false
    },
    {
      title: 'Ignore cynics talking rot, timber apartments are a hit with tenants',
      link: 'https://www.smh.com.au/business/companies/ignore-cynics-talking-rot-timber-apartments-are-a-hit-with-tenants-20210505-p57p32.html',
      source: 'Sydney Morning Herald',
      linkExists: false
    }

  ];

  hardCodedFacialFatTransferNews = [
    {
      title: 'These Are the Top Plastic Surgery Trends of the Last Decade ...',
      link: 'https://www.newbeauty.com/top-plastic-surgery-trends/',
      published: '6 days ago',
      source: 'NewBeauty Magazine',
    },
    {
      title: 'Could hand rejuvenation treatments be the choice for you?',
      link: 'https://www.longevitylive.com/live-better/hand-rejuvenation-treatments/',
      published: '1 month ago',
      source: 'Longevity LIVE',
    },
    {
      title: 'Dr. Stark Is Taking Liposuction Results To The Next Level With ...',
      link: 'https://hauteliving.com/hautebeauty/639366/dr-stark-is-taking-liposuction-results-to-the-next-level-with-vaser-lipo/',
      published: '1 week ago',
      source: 'Haute Living',
    },
    {
      title: 'These are the beauty treatments replacing cosmetic surgery in 2020',
      link: 'https://www.womanandhome.com/beauty/beauty-news/cosmetic-beauty-trends-2020-ditch-surgery-343639/',
      published: 'Jan 1, 2020',
      source: 'woman&home',
    },
    {
      title: 'Medical Director of Amaris B. Clinic Predicts 2020 Cosmetic ...',
      link: 'https://www.biospectrumasia.com/news/54/15296/medical-director-of-amaris-b-clinic-predicts-2020-cosmetic-surgery-trend.html',
      published: 'Jan 22, 2020',
      source: 'BSA bureau',
    }
  ];

  hardCodedHyaluronicAcid = [
    {
      title: 'Croma-Pharma GmbH expands its portfolio introducing pure HA',
      link: 'https://www.businesswire.com/news/home/20200715005327/en/Croma-Pharma-GmbH-expands-portfolio-introducing-pure-HA',
      published: '1 week ago',
      source: 'Business Wire',
    },
    {
      title: 'Valensa awarded patent for hyaluronic acid, astaxanthin joint ...',
      link: 'https://www.nutritionaloutlook.com/view/valensa-awarded-patent-for-hyaluronic-acid-astaxanthin-joint-ingredients',
      published: '1 week ago',
      source: 'Nutritional Outlook',
    },
    {
      title: 'Are You Using Hyaluronic Acid Wrong - Hyaluronic Acid Myths ...',
      link: 'https://www.harpersbazaar.com/beauty/skin-care/a31116680/are-you-misusing-hyaluronic-acid/',
      published: '2 weeks ago',
      source: 'HarpersBAZAAR.com',
    },
    {
      title: 'The HydraFacial Company Announces Launch of HydraFacial ...',
      link: 'https://www.prnewswire.com/news-releases/the-hydrafacial-company-announces-launch-of-hydrafacial-connect-platform-301096937.html',
      published: '1 day ago',
      source: 'PRNewswire',
    },
    {
      title: 'AsSeenOnTV.pro and Kevin Harrington\'s DRTV Campaign ...',
      link: 'https://www.prweb.com/releases/asseenontv_pro_and_kevin_harringtons_drtv_campaign_with_lenogen_by_lenovie/prweb17250950.htm',
      published: '2 days ago',
      source: 'PR Web',
    }
  ];

  hardCodedBotulinumToxin = [
    {
      title: '(2nd LD) ITC favors Medytox over Daewoong in botulinum toxin strain dispute',
      link: 'https://en.yna.co.kr/view/AEN20200707000252320',
      published: '2 weeks ago',
      source: 'Yonhap News',
    },
    {
      title: 'Croma-Pharma announces submission for their botulinum ...',
      link: 'https://www.businesswire.com/news/home/20200708005060/en/Croma-Pharma-announces-submission-botulinum-toxin-treat-glabellar',
      published: '2 weeks ago',
      source: 'Business Wire',
    },
    {
      title: 'Court rejects Medytox\'s request not to revoke lic...',
      link: 'http://www.koreabiomed.com/news/articleView.html?idxno=8729',
      published: '2 weeks ago',
      source: 'Korea Biomedical Review',
    },
    {
      title: '[News Focus] Who will win BTX strain dispute – Daewoong or Medytox?',
      link: 'http://www.koreabiomed.com/news/articleView.html?idxno=8676',
      published: '2 weeks ago',
      source: 'Korea Biomedical Review',
    },
    {
      title: 'Yonhap News Summary',
      link: 'https://en.yna.co.kr/view/AEN20200707005800320',
      published: '2 days ago',
      source: 'Yonhap News',
    }
  ];
  cps: any;
  localInterConnects: any;

  hardCodedWaterPurifier = [
    {
      title: 'Onsitego collaborates with DuPont to launch maintenance services for water purifiers',
      link: 'http://www.businessworld.in/article/Onsitego-collaborates-with-DuPont-to-launch-maintenance-services-for-water-purifiers/27-07-2020-301884/',
      published: '4 days ago',
      source: 'BW Businessworld',
    },
    {
      title: 'instrAction Names Florian Rohde as Managing Director and Chief Technical Officer',
      link: 'https://www.globenewswire.com/news-release/2020/07/09/2059669/0/en/instrAction-Names-Florian-Rohde-as-Managing-Director-and-Chief-Technical-Officer.html',
      published: '3 weeks ago',
      source: 'GlobeNewswire',
    },
    {
      title: 'Interview with Sudish Panicker, MD and Head, BNY Mellon International Operations (India)',
      link: 'https://indiacsr.in/interview-with-sudish-panicker-md-and-head-bny-mellon-international-operations-india/',
      published: '4 hours ago',
      source: 'IndiaCSR',
    },
    {
      title: 'Major role for wastewater epidemiology in tackling Covid-19, says group',
      link: 'https://envirotecmagazine.com/2020/07/30/major-role-for-wastewater-epidemiology-in-tackling-covid-19-says-group/',
      published: '1 day ago',
      source: 'Envirotec',
    },
    {
      title: 'New solar material could clean drinking water',
      link: 'https://www.eurekalert.org/pub_releases/2020-07/uarl-nsm071320.php',
      published: '2 weeks ago',
      source: 'EurekAlert',
    }
  ];

  hardCodedWearableAmbulatory = [
    {
      title: 'Bardy Diagnostics names new CEO',
      link: 'https://www.massdevice.com/bardy-diagnostics-names-new-ceo/',
      source: 'Mass Device',
    },
    {
      title: '5 Lesser-Known Growth Stocks Rated \'Strong Buy\'',
      link: 'https://stocknews.com/news/irtc-stag-ramp-iipr-yext-5-lesser-known-growth-stocks-rated-strong-buy/',
      source: 'StockNews.com',
    },
    {
      title: 'This telemedicine system could get medtech sales reps back to ORs',
      link: 'https://www.massdevice.com/this-telemedicine-system-could-get-medtech-sales-reps-back-to-ors/',
      source: 'Mass Device',
    },
    {
      title: 'Ascom UMS Selected Oxitone Medical as a Wearable Solution ...',
      link: 'https://www.prnewswire.com/il/news-releases/ascom-ums-selected-oxitone-medical-as-a-wearable-solution-for-continuous-remote-monitoring-of-covid-19-patients-301086121.html',
      source: 'PRNewswire',
    },
    {
      title: 'Radar-Based Blood Pressure Sensors on the Way',
      link: 'https://www.eetimes.com/radar-based-blood-pressure-sensors-on-the-way/',
      source: 'EE Times',
    }
  ];
  hardCodedCovidTestingKit = [
    {
      title: 'Should You \'Buy the Dip\' in Abbott Laboratories?',
      link: 'https://stocknews.com/news/abt-should-you-buy-the-dip-in-abbott-laboratories/',
      source: 'StockNews.com',
    },
    {
      title: 'Are These DIY Gargling COVID-19 Test Kits the Answer to the Safe Return of Live Events?',
      link: 'https://edm.com/news/testfrwd-diy-gargling-covid-19-test-kits',
      source: 'EDM.com',
    },
    {
      title: 'COVID-19 test kit for live events created by Austrian start-up',
      link: 'https://djmag.com/news/covid-19-test-kit-live-events-created-austrian-start',
      source: 'DJ Mag',
    },
    {
      title: 'Rapid antigen tests are cheaper & give quick results but RT-PCR tests are more reliable, say scientists',
      link: 'https://health.economictimes.indiatimes.com/news/medical-devices/rapid-antigen-tests-are-cheaper-give-quick-results-but-rt-pcr-tests-are-more-reliable-say-scientists/78106436',
      source: 'ETHealthworld.com',
    },
    {
      title: 'The rise of the COVID-19 test kit market',
      link: 'https://www.healthcareglobal.com/medical-devices-and-pharma/rise-covid-19-test-kit-market',
      source: 'Healthcare Global - Healthcare News, Magazine and Website',
    }
  ];

  hardCodedPetroleumPitch = [
    {
      title: 'Tesla\'s stock loses charge after Musk\'s battery pitch',
      link: 'https://in.reuters.com/article/us-tesla-stocks/teslas-stock-loses-charge-after-musks-battery-pitch-idINKCN26E1WL',
      source: 'Reuters India',
    },
    {
      title: 'Coronavirus crisis gives oil exporters a crash course in energy transition',
      link: 'https://www.arabnews.com/node/1736591/business-economy',
      source: 'Arab News',
    },
    {
      title: 'Proactive Investors One2One Investor Forum',
      link: 'https://www.proactiveinvestors.com/register/event_details/294',
      source: 'Proactive Investors USA & Canada',
    },
    {
      title: 'Brett Icahn to Rejoin His Father’s Firm',
      link: 'https://www.wsj.com/articles/brett-icahn-poised-to-rejoin-his-fathers-firm-11601499938',
      source: 'Wall Street Journal',
    },
    {
      title: 'Stocks end higher on bargain hunting',
      link: 'https://mb.com.ph/2020/09/11/stocks-end-higher-on-bargain-hunting/',
      source: 'Manila Bulletin',
    }
  ];

  hardCodedEuropeZincChemicals = [
    {
      title: 'Trafigura builds stake in battery Ni future',
      link: 'https://www.amm.com/Article/3955536/Trafigura-builds-stake-in-Europes-battery-Ni-future.html',
      source: 'American Metal Market',
    },
    {
      title: 'Firms sign agreement to develop zinc-air ESS market in India',
      link: 'https://www.bestmag.co.uk/indnews/firms-sign-agreement-develop-zinc-air-ess-market-india',
      source: 'bestmag',
    },
    {
      title: 'A US$ 500 million giant merger in the field of PVC stabilizers ...',
      link: 'https://www.oaoa.com/news/business/a-us-500-million-giant-merger-in-the-field-of-pvc-stabilizers-oyak-merged-akdeniz/article_ae1586f9-101a-54be-904b-5233735e31af.html',
      source: 'Odessa American',
    },
    {
      title: 'The place of Europe in the new plant breeding landscape ...',
      link: 'https://www.europeanscientist.com/en/features/the-place-of-europe-in-the-new-plant-breeding-landscape-evolution-of-field-trials/',
      source: 'The European Scientist',
    },
    {
      title: 'The EU’s Farm-2-Fork and Green Deal ...',
      link: 'https://www.europeanscientist.com/en/agriculture/the-eus-farm-2-fork-and-green-deal-are-they-more-than-happy-talk/',
      source: 'The European Scientist',
    }
  ];

  hardCodedAcneTreatment = [
    {
      title: 'How Does Clindamycin for Acne Work?',
      link: 'https://www.healthline.com/health/clindamycin-for-acne',
      source: 'Healthline',
    },
    {
      title: 'First officially registered Acne patch by DermaAngel makes ...',
      link: 'https://www.prnewswire.com/in/news-releases/first-officially-registered-acne-patch-by-dermaangel-makes-foray-into-the-indian-market-847831399.html',
      source: 'PR Newswire India',
    },
    {
      title: 'Albany Molecular Research Inc. (AMRI) Named Exclusive API ...',
      link: 'https://www.marketscreener.com/news/latest/Albany-Molecular-Research-Inc-AMRI-Named-Exclusive-API-Supplier-for-Recently-Approved-Acne-Treatm--31652352/',
      source: 'marketscreener.com',
    },
    {
      title: 'The 5 Best Face Washes For Cystic Acne',
      link: 'https://www.elitedaily.com/p/the-5-best-face-washes-for-cystic-acne-39555468',
      source: 'Elite Daily',
    },
    {
      title: 'Maskne Is Real — Here’s How To Deal',
      link: 'https://www.refinery29.com/en-us/2020/10/10136549/maskne-treatment',
      source: 'Refinery29',
    }
  ];

  hardCodedBronze = [
    {
      title: 'Sri Lanka- Empty bullets, shells to be used as',
      link: 'https://menafn.com/1101060904/Sri-Lanka-Empty-bullets-shells-to-be-used-as-raw-material-for-traditional-industries',
      source: 'MENAFN.COM',
    },
    {
      title: 'How Rosie Assoulin and Five Other Designers Created a...',
      link: 'https://www.elle.com/fashion/a34349398/how-rosie-assoulin-and-five-other-designers-created-a-collection-using-upcycled-car-parts/',
      source: 'ELLE.com',
    },
    {
      title: 'Putting waste to good use: govt to reuse discarded railway...',
      link: 'http://www.adaderana.lk/news/68748/putting-waste-to-good-use-govt-to-reuse-discarded-railway-sleepers-empty-shell-cases-and-other-material',
      source: 'adaderana.lk',
    },
    {
      title: 'Stainless Steel, Bronze, Brass, or Aluminum: How to Choose Handle Materials',
      link: 'https://www.archdaily.com/929360/stainless-steel-bronze-brass-or-aluminum-how-to-choose-handle-materials',
      source: 'ArchDaily',
    },
    {
      title: 'Toppan Receives Bronze Class SAM Sustainability Award for 2nd Year',
      link: 'https://www.printedelectronicsnow.com/contents/view_breaking-news/2020-02-10/toppan-receives-bronze-class-sam-sustainability-award-for-2nd-year/',
      source: 'Printed Electronics Now Magazine',
    }
  ];

  hardCodedBrass = [
    {
      title: 'Analysis: Interpretation of the Development Plan for the New Energy Vehicle Industry',
      link: 'https://news.metal.com/newscontent/101305330/analysis-interpretation-of-the-development-plan-for-the-new-energy-vehicle-industry',
      source: 'SMM - Shanghai Metals Market',
    },
    {
      title: 'Non-ferrous scrap exporters hesitant to ship to China',
      link: 'https://www.argusmedia.com/en/news/2153113-nonferrous-scrap-exporters-hesitant-to-ship-to-china',
      source: 'Argus Media',
    },
    {
      title: 'UP\'s Ghunghroo Industry Sees Revival With Strong...',
      link: 'https://swarajyamag.com/insta/ups-ghunghroo-industry-sees-revival-with-strong-export-demand-following-yogi-govts-scheme-for-artisans',
      source: 'Swarajya',
    },
    {
      title: 'Shimmering bells of Etah to shine globally',
      link: 'http://www.millenniumpost.in/business/shimmering-bells-of-etah-to-shine-globally-422160',
      source: 'Millennium Post',
    },
    {
      title: 'China to allow imports of new-standard scrap metal from Nov. 1',
      link: 'https://www.zawya.com/mena/en/markets/story/China_to_allow_imports_of_newstandard_scrap_metal_from_Nov_1-TR20201019nL4N2HA2XSX1/',
      source: 'ZAWYA',
    }
  ];


  hardCodedFertilityServices = [
    {
      title: 'The Challenges of Commercializing Fertility',
      link: 'https://hbswk.hbs.edu/item/the-challenges-of-commercializing-fertility',
      source: 'Harvard Business School Working Knowledge',
    },
    {
      title: 'Inception Fertility Announces Appointment of Nicole R. Braley...',
      link: 'https://www.prnewswire.com/news-releases/inception-fertility-announces-appointment-of-nicole-r-braley-as-chief-marketing-officer-301167281.html',
      source: 'PRNewswire',
    },
    {
      title: 'INVO Bioscience Announces Pricing of Follow-on Public...',
      link: 'https://www.prnewswire.com/news-releases/invo-bioscience-announces-pricing-of-follow-on-public-offering-and-listing-on-the-nasdaq-capital-market-301172506.html',
      source: 'PRNewswire',
    },
    {
      title: 'The most effective fertility supplements',
      link: 'https://www.nutritionaloutlook.com/view/the-most-effective-fertility-supplements',
      source: 'Nutritional Outlook',
    },
    {
      title: 'Advanced Fertility Center of Chicago Welcomes Reproductive...',
      link: 'https://www.prnewswire.com/news-releases/advanced-fertility-center-of-chicago-welcomes-reproductive-endocrinologist-dr-debra-schell-301158406.html',
      source: 'PRNewswire',
    }
  ];


  hardCodedNewsIndustrialRobotics  = [
    {
      title: 'North America robot sales see double-digit growth\n ',
      link: 'https://www.todaysmedicaldevelopments.com/article/robot-sales-north-america-2022/ ',
      source: 'Todays Medical Developments',
      linkExists: false
    },
    {
      title: 'Global robot sales bounce back to hit record highs ',
      link: 'https://drivesncontrols.com/news/fullstory.php/aid/7072/Global_robot_sales_bounce_back_to_hit_record_highs.html ',
      source: 'Drivesn controls',
      linkExists: false
    },
    {
      title: 'Robot Sales Surge in Europe, Asia and the Americas – IFR Reports ',
      link: 'hhttps://www.businesswire.com/news/home/20220621005720/en/Robot-Sales-Surge-in-Europe-Asia-and-the-Americas-%E2%80%93-IFR-Reports ',
      source: 'Business wire',
      linkExists: false
    }

  ];

  hardCodedNewsNextGenerationSequencing  = [
    {
      title: 'How Next-Generation Sequencing Can Help Us In The War Against Cancer ',
      link: 'https://www.forbes.com/sites/forbestechcouncil/2022/06/24/how-next-generation-sequencing-can-help-us-in-the-war-against-cancer/ ',
      source: 'Forbes',
      linkExists: false
    },
    {
      title: 'MGI to Take Another Crack at US Next-Gen Sequencing Market This Summer',
      link: 'https://www.genomeweb.com/sequencing/mgi-take-another-crack-us-next-gen-sequencing-market-summer  ',
      source: 'Genomweb',
      linkExists: false
    },
    {
      title: 'Merck illumina Launch Research Test To Unlock Deeper Insights Into Tumor Genome ',
      link: 'https://medicaldialogues.in/news/industry/pharma/merck-illumina-launch-research-test-to-unlock-deeper-insights-into-tumor-genome-94984  ',
      source: 'Medical Dialogues',
      linkExists: false
    }
  ];

  flag: any = 1;
  stocks: any;
  localLeads: any;

  constructor(
    private youtubeService: YoutubeApiService,
    private newsService: NewsApiService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private leadsService: LeadsService,
    private reportService: ReportService,
    private sharedInterconenctService: SharedInteconnectService,
    private cpService: companyProfileService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    window.scroll(0,0)

    // console.log("this.suggestion",this.suggestion)
    if (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos') {
      if (this.activatedRoute.snapshot.queryParams['reportId']) {
        this.reportService.getById(this.activatedRoute.snapshot.queryParams['reportId']).subscribe(data => {
          if (data) {
            const localData = {
              _id:data._id,
              title:data.title,
              category: data.category,
              vertical:data.vertical,
              cp:data.cp,
              me:{
                start_year:data.me.start_year,
                end_year:data.me.end_year,
                base_year:data.me.base_year
              },
              overlaps:data.overlaps,
              owner:data.owner,
              tocList:data.tocList,
              status:data.status,
              title_prefix:data.title_prefix,
              youtubeContents:data.youtubeContents
            }
            this.localStorageService.set(ConstantKeys.CURRENT_REPORT, localData);
            this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
            this.process();
            const index = _.indexOf(HardCodedData.reportIds, this.activatedRoute.snapshot.queryParams['reportId']);
            if (index > -1) {
              this.leadsArray = HardCodedData.hardCodedLeads[index];
              this.hardcodedStocks = HardCodedData.hardCodedStocks[index];
              this.hardCodedFiling = HardCodedData.hardCodedFilings[index];
            } else {
              this.getLeadsStocksFilings(_.flatMap(data.cp, 'company_id'));
              this.localStorageService.set(ConstantKeys.CURRENT_CP_IDS, _.flatMap(data.cp, 'company_id'));
            }
          }
        });
      } else {
        this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
        if (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos') {
          this.process();
          const index = _.indexOf(HardCodedData.reportIds, this.currentReport._id);
          if (index > -1) {
            this.leadsArray = HardCodedData.hardCodedLeads[index];
            this.hardcodedStocks = HardCodedData.hardCodedStocks[index];
            this.hardCodedFiling = HardCodedData.hardCodedFilings[index];
          } else {
            this.cps = this.localStorageService.get(ConstantKeys.CURRENT_CP_IDS);
            this.getLeadsStocksFilings(this.cps);
          }
        }
      }
    }
  }

  getNewsVideos(searchText) {
    this.finalNews = [];
    this.news = [];
    this.youtubeContents = [];
    if (!searchText) {
      this.hardCodedCovidContents.forEach(e => {
        this.youtubeContents.push(e);
      });
      this.getNewsAndVideos('Corona Economy', []);
    } else if (searchText == 'Corona Economy') {
      this.hardCodedCovidContents.forEach(e => {
        this.youtubeContents.push(e);
      });
      this.getNewsAndVideos('Corona Economy', []);
    } else {
      this.getVideos(searchText + ' industry');
      this.getNewsAndVideos(searchText + ' industry', []);
    }
  }

  process() {
    this.currentReport = this.localStorageService.get(ConstantKeys.CURRENT_REPORT);
    if (this.currentReport && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.reportId = this.currentReport._id;
      this.reportName = this.currentReport.title;
      this.overlaps = (this.currentReport.overlaps) ? this.currentReport.overlaps : [];
      this.youtubeContents = (this.currentReport.youtubeContents) ? this.currentReport.youtubeContents : [];
      this.cp = this.localStorageService.get(ConstantKeys.CP);
      // this.getTopLeadsCompany();

      if (this.reportId == this.sharedInterconenctService.reportId) {
        this.reportConnectData = this.sharedInterconenctService.reportConnectData;
        this.fillingConnect = this.sharedInterconenctService.fillingConnect;
        //  this.contents = this.sharedInterconenctService.contents;
        this.finalNews = this.sharedInterconenctService.finalNews;
      } else {
        if (this.currentReport.overlaps) {
          const reportConnect = this.overlaps.filter(e => e.section_name == 'Report');
          if (reportConnect.length) {
            const dt = {
              section: '',
              data: []
            };
            if (reportConnect[0].data && reportConnect[0].data.length) {
              if (reportConnect[0].section_name) {
                dt.section = reportConnect[0].section_name;
                for (let i = 0; i < reportConnect[0].data.length; i++) {
                  dt.data.push(reportConnect[0].data[i]);
                }
              }
            }
            this.reportConnectData = dt;
            this.sharedInterconenctService.reportConnectData = this.reportConnectData;
          }
        }
        // this.getReportTopPlayers(this.reportId);
        this.getNewsAndVideos(this.reportName + ' industry', []);
        this.sharedInterconenctService.reportId = this.reportId;
      }

      if (!this.isTopPlayer) {
        if (this.overlaps && this.overlaps.length) {
          const dt = {};
          this.overlaps.forEach(element => {
            const data = [];
            if (element.data && element.data.length) {
              for (let i = 0; i < element.data.length, i < 2; i++) {
                data.push(element.data[i]);
              }
            }
            dt[element.section_name] = data;
          });
          this.interConnectData = dt;
          this.sharedInterconenctService.interConnectData = this.interConnectData;
          this.orderInterConnects(this.currentOrder);
        }
      }
    }
  }

  ngOnChanges(changes: any) {
    this.suggestion = changes.suggestion.currentValue;
    const orderType = this.suggestion.orderType;
    if (orderType == 'topPlayers') {
      this.isTopPlayer = true;
    } else if (orderType == 'supplychain') {
      this.currentOrder = 'supplyChainOrder';
    } else if (orderType == 'porter') {
      this.currentOrder = 'porterOrder';
    } else {
      this.currentOrder = 'normalOrder';
    }
    this.sharedInterconenctService.sharedText.subscribe(message => {
      this.searchText = message;
      if (this.suggestion.orderType == 'covid' || this.suggestion.orderType == 'newsVideos') {
        if (this.suggestion.orderType == 'newsVideos') {
          this.hardCodedReportConnectData = {
            section: '',
            data: []
          };
          if (this.searchText != 'Corona Economy') {
            this.hardCodedReportConnectData = this.hardCodedReports;
          }
        }
        this.getNewsVideos(this.searchText);
      }
    });
  }

  getNewsAndVideos(data, arrays) {
    if (this.reportId == '5e2ada2735e3250004e27b14' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedFacialFatTransferNews;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '5e8455141591300004822f09' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedHyaluronicAcid;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '5eb543c36e66720004958fe0' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedActionCameraNews;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '5f02f5589be6f35140188cb3' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedBotulinumToxin;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '5f22b1f843abd91218d1d533' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedWaterPurifier;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '5e86cb182af83b0004733a74' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedWearableAmbulatory;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '5f636e6394ef4c5219ac9cd1' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedCovidTestingKit;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '5e212fdd7d97af0004f1dada' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedPetroleumPitch;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if ((this.reportId == '5f8432da2502900fe65a2953' || this.reportId == '5f8d25a7de8a618a3f0abb21') && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedEuropeZincChemicals;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '5f97e2804b4e9c1a04010937' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedAcneTreatment;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if ((this.reportId == '5f9fe2bed5f1cc58807dcc0e' || this.reportId == '5fa157964fc5c58d57921c17') && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedBrass;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if ((this.reportId == '5f9bf4f9d5f1cc58807dc82e' || this.reportId == '5fa021761bc9973c681dd60f') && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedBronze;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '5e20382d7bd47f0004269ed0' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedFertilityServices;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '5e98947ef6ba090004d9a844' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedNewsVerticalGarden;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '5e9f1075f2792f00046ee8f7' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedNewsZeroEnergy;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '5e79ebcb6d7f240004e4eafe' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedNewsLaminatedVeneerLumber;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '62b085714332013719059102' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedNewsIndustrialRobotics;
      this.sharedInterconenctService.finalNews = this.finalNews;
    } else if (this.reportId == '62b30bd943320137190591c1' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
      this.finalNews = this.hardCodedNewsNextGenerationSequencing;
      this.sharedInterconenctService.finalNews = this.finalNews;
    }else {
      if (data) {
        // this.youtubeService.getAll(data.toLowerCase()).subscribe(yt => {
        //   if (yt && yt.items.length) {
        //     arrays.push(yt);
        //   }
        //   this.getVideoData(arrays);
        // });
        this.news = [];
        if (this.reportId == '5e29b4258fb7610004367a42' && (this.suggestion.orderType != 'covid' && this.suggestion.orderType != 'newsVideos')) {
          this.finalNews = this.hardCodedNews;
        } else {
          this.newsService.getAll(data, 0).subscribe(d => {
            this.news.push(d);
            this.getNewsData(this.news);
          });
        }
      }
    }
  }

  getVideos(searchText) {
    this.contents = [];
    this.youtubeService.getAll(searchText.toLowerCase()).subscribe(yt => {
      if (yt && yt.items.length) {
        yt.items.forEach(e => {
          const dt = {
            imgUrl: (e.snippet && e.snippet.thumbnails && e.snippet.thumbnails.medium && e.snippet.thumbnails.medium.url) ? e.snippet.thumbnails.medium.url : '',
            videoid: (e.id && e.id.videoId) ? e.id.videoId : '',
            title: (e.snippet && e.snippet.title) ? e.snippet.title : '',
            publishedAt: (e.snippet && e.snippet.publishedAt) ? e.snippet.publishedAt : ''
          };
          this.contents.push(dt);
        });
      }
    });
    this.youtubeContents = this.contents;
  }

  // Search str  Safety Lancet industry index  0 arrLen  0 arrays  Array []

  getVideoData(data) {
    this.contents = [];
    if (data && data.length) {
      const len = Math.ceil(5 / data.length);
      data.forEach(d => {
        d.items.forEach((md, i) => {
          if (i < len) {
            this.contents.push(md);
          }
          return;
        });
      });
      this.sharedInterconenctService.contents = this.contents;
    }
  }

  getNewsData(data) {
    this.finalNews = [];
    // let filtered = [];
    if (data && data.length) {
      const len = Math.ceil(5 / data.length);
      data.forEach(d => {
        d.forEach((md, i) => {
          if (i < len) {
            this.finalNews.push(md);
          }
          return;
        });
      });
      this.sharedInterconenctService.finalNews = this.finalNews;
    }
  }

  openYtDailog(video) {
    // let videoId = id;
    const data = {
      url: video
    };
    const dialogRef = this.dialog.open(YoutubeDailogComponent, {
      width: '650px',
      height: '350px',
      data,
      disableClose: false,
    });
  }

  getTopLeadsCompany(cp) {
    this.leadsArray = [];
    if (cp && cp.length) {
      this.leadsService.getTopLeadsCp(cp, this.currentReport.vertical).then(data => {
        if (data && data.data) {
          this.leadsArray = data.data;
        }
      }).catch(err => {
      });
    }
  }

  orderInterConnects(orderVal) {
    const orderValue = this.order[orderVal];
    this.interConnects = [];
    if (orderValue.length) {
      orderValue.forEach(element => {
        const interData = this.interConnectData[element];
        if (interData && interData.length) {
          if (interData[0]) {
            const dt = {
              report_id: interData[0].report_id,
              report_name: interData[0].report_name,
              main_section: this.sectionDetails[element].main_section,
              router_link: this.sectionDetails[element].router_link,
              section: undefined
            };
            if (this.sectionDetails[element].section_name) {
              dt.section = this.sectionDetails[element].section_name;
            }
            this.interConnects.push(dt);
          }
        }
        if (interData && interData.length > 1) {
          if (interData[1]) {
            const dt = {
              report_id: interData[1].report_id,
              report_name: interData[1].report_name,
              main_section: this.sectionDetails[element].main_section,
              router_link: this.sectionDetails[element].router_link,
              section: undefined
            };
            if (this.sectionDetails[element].section_name) {
              dt.section = this.sectionDetails[element].section_name;
            }
            this.interConnectsMore.push(dt);
          }
        }
      });

    }
  }

  getLeadsStocksFilings(cps) {
    this.localInterConnects = this.localStorageService.get(ConstantKeys.CURRENT_INTERCONNECTS);
    if (this.localInterConnects && this.localInterConnects.reportId == this.currentReport._id) {
      this.processInterConnectData(this.localInterConnects.data);
    } else {
      this.cpService.getInterconnects(cps).subscribe(d => {
        if (d && d.length) {
          this.processInterConnectData(d);
          this.localStorageService.set(ConstantKeys.CURRENT_INTERCONNECTS, {reportId: this.currentReport._id, data: d});
        }
      }, err => {
        console.log(err);
      });
    }
  }

  processInterConnectData(d) {
    this.hardcodedStocks = [];
    this.hardCodedFiling = [];
    this.leadsArray = [];
    const leads = _.compact(_.flatMap(_.flatMap(d, 'inter_connect'), 'leads'));
    if (leads.length) {
      leads.forEach(ld => {
        this.leadsArray.push(ld.split(',   ')[0]);
      });
    }
    this.hardcodedStocks = _.remove(_.compact(_.flatMap(_.flatMap(d, 'inter_connect'), 'stocks')), dd => {
      if (dd.name != '' && dd.ticker != '') {
        return dd;
      }
    });
    this.hardCodedFiling = _.compact(_.flatMap(_.flatMap(d, 'inter_connect'), 'filings'));
  }

  showMessage() {
    this.toastr.info('This report is not a part of current subscription.', 'Message');
  }
}

