//配置文件
let API_URL = ''

let NetWork = ''

let IERC20 = {}

let HPeriodToken = {}

let HGateKeeper = {}

let Tag = null

const NameMapping = {
  yyCRV: ['towweek', 'onemonth'],
  xSushi: ['sushitwo', 'sushimonth'],
}

const DayMapping = [14, 30]

const PeriodMapping = {
  yyCRV: {
    '1 week': 'oneweek',
    '2 weeks': 'towweek',
    '1 month': 'onemonth',
  },
  xSushi: {
    '1 week': 'sushione',
    '2 weeks': 'sushitwo',
    '1 month': 'sushimonth',
  },
}

const BalanceOfObj = {
  yyCRV: 0,
  xSushi: 0,
}

const PeriodName = ['2 weeks', '1 month']

switch (process.env.NODE_ENV) {
  // 测试环境
  case 'test':
    Tag = '3.29 优化'
    API_URL = 'https://test-api.horizon.finance'
    NetWork = 'ropsten'
    IERC20 = {
      yyCRV: '0x13A8A0401eEDD531F079A38Cfe7C70CC899ACB85',
      xSushi: '0x13A8A0401eEDD531F079A38Cfe7C70CC899ACB85',
    }
    HPeriodToken = {
      oneweek: '0x68d9AFda47805Ce682F31E4989f431c433F958ba',
      towweek: '0x61912C720E594F4433aB689289f4eaf0d77567A4',
      onemonth: '0xb44390AB84776727937eFBD14EF2396bcb75AD49',
      sushione: '0x68d9AFda47805Ce682F31E4989f431c433F958ba',
      sushitwo: '0x68d9AFda47805Ce682F31E4989f431c433F958ba',
      sushimonth: '0x68d9AFda47805Ce682F31E4989f431c433F958ba',
    }
    HGateKeeper = {
      oneweek: '0x3f7bf62Dc248087a263CC88FbdEe6E474E1eA497',
      towweek: '0x5A194eDd3D4Fe0154f30EC3c4E8F3c88E70387C7',
      onemonth: '0x0dE5b1A4383C804896D056fB5AEb9689408Ea254',
      sushione: '0x3f7bf62Dc248087a263CC88FbdEe6E474E1eA497',
      sushitwo: '0x3f7bf62Dc248087a263CC88FbdEe6E474E1eA497',
      sushimonth: '0x3f7bf62Dc248087a263CC88FbdEe6E474E1eA497',
    }
    break

  // 生产环境
  case 'production':
    API_URL = 'https://api.horizon.finance'
    NetWork = 'mainnet'
    IERC20 = {
      yyCRV: '0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c',
      xSushi: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
    }
    HPeriodToken = {
      oneweek: '0xa83D3E363113fB988F8700713eDF12adb8189B56',
      towweek: '0x92a5935d6D741c59aeFFC705AfA1266441670498',
      onemonth: '0x0DE2Ed135A95A0da3115C899f0F44a27210Bc863',
      sushione: '0xAa6c896Bf8FEa53D310636eC89A27F80277Dc1dA',
      sushitwo: '0x4FB686388b2db6671431ecD3F116E0532f2304d4',
      sushimonth: '0x652598d3e6695243bA3Bfc1AFe4e78109820932E',
    }
    HGateKeeper = {
      oneweek: '0x4F09B331F50bb71219F05dA5fAa3DB4BCb99b451',
      towweek: '0xef9De874D670676f2531b7F3828906555D6CdA52',
      onemonth: '0x1f971c3EB2a2630A192b177fC4C3F757a93dC344',
      sushione: '0xdAe409e23A91ebCb5bB0057d251604b8928A99F1',
      sushitwo: '0x5db8998c072BFB8feA6D569c88305ABC3270dFb7',
      sushimonth: '0x177361b9385A4d5E1e7150559485C183A2239F86',
    }
    break
}

export {
  NetWork,
  API_URL,
  IERC20,
  HPeriodToken,
  HGateKeeper,
  Tag,
  NameMapping,
  PeriodName,
  BalanceOfObj,
  DayMapping,
  PeriodMapping,
}
