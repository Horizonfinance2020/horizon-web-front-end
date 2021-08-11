//配置文件
let API_URL = ''

// 网络
let Network = ''

//Pdnding清除时间 毫秒值。
const PENDINGNUM=21600000

let IERC20 = {}

let HPeriodToken = {}

let HGateKeeper = {}

let Tag = null

let MerkleDrop = ''
//blocknative 库配置
const Wallets = [{
  walletName: "metamask"
},
{
  walletName: "walletConnect",
  infuraKey: 'd3818b1cddd14cf489c8d55b4ec69f92'
},
]
const DappId = '48bec8e3-294f-42f5-9c94-0f657ed9db49'

const NameMapping = {
  yyCRV: ['towweek', 'onemonth'],
  xSushi: ['sushitwo', 'sushimonth'],
  yvUSDC:['ytwo', 'ymonth']
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
  yvUSDC: {
    '1 week': 'yone',
    '2 weeks': 'ytwo',
    '1 month': 'ymonth',
  },
}

const BalanceOfObj = {
  yyCRV: 0,
  xSushi: 0,
  yvUSDC:0
}


const Digits = {
  yyCRV: 1e18,
  xSushi: 1e18  ,
  yvUSDC:1e6
}


const PeriodName = ['2 weeks', '1 month']

switch (process.env.NODE_ENV) {
  // 测试环境
  case 'test':
    Tag = 'pending'
    API_URL = 'https://test-api.horizon.finance'
    Network = 'ropsten'
    IERC20 = {
      yyCRV: '0x13A8A0401eEDD531F079A38Cfe7C70CC899ACB85',
      xSushi: '0x13A8A0401eEDD531F079A38Cfe7C70CC899ACB85',
      yvUSDC:'0x13A8A0401eEDD531F079A38Cfe7C70CC899ACB85'
    }
    HPeriodToken = {
      oneweek: '0x68d9AFda47805Ce682F31E4989f431c433F958ba',
      towweek: '0x61912C720E594F4433aB689289f4eaf0d77567A4',
      onemonth: '0xb44390AB84776727937eFBD14EF2396bcb75AD49',
      sushione: '0x68d9AFda47805Ce682F31E4989f431c433F958ba',
      sushitwo: '0x68d9AFda47805Ce682F31E4989f431c433F958ba',
      sushimonth: '0x68d9AFda47805Ce682F31E4989f431c433F958ba',
      ytwo:'0x68d9AFda47805Ce682F31E4989f431c433F958ba',
      ymonth:'0x68d9AFda47805Ce682F31E4989f431c433F958ba'
    }
    HGateKeeper = {
      oneweek: '0x3f7bf62Dc248087a263CC88FbdEe6E474E1eA497',
      towweek: '0x5A194eDd3D4Fe0154f30EC3c4E8F3c88E70387C7',
      onemonth: '0x0dE5b1A4383C804896D056fB5AEb9689408Ea254',
      sushione: '0x3f7bf62Dc248087a263CC88FbdEe6E474E1eA497',
      sushitwo: '0x3f7bf62Dc248087a263CC88FbdEe6E474E1eA497',
      sushimonth: '0x3f7bf62Dc248087a263CC88FbdEe6E474E1eA497',
      ytwo:'0x3f7bf62Dc248087a263CC88FbdEe6E474E1eA497',
      ymonth:'0x3f7bf62Dc248087a263CC88FbdEe6E474E1eA497'
    }
    MerkleDrop ={
      xSushi: '0xAA05c1fe884bD0C3763E0cAa7D00f0e6aaa341d5', 
      yyCRV: '0xD7D399911F8fFA7d4351E3DF206F7D919237275B',
    }
    break

  // 生产环境
  case 'production':
    API_URL = 'https://api.horizon.finance'
    Network = 'mainnet'
    IERC20 = {
      yyCRV: '0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c',
      xSushi: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
      yvUSDC:'0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9'
    }
    HPeriodToken = {
      oneweek: '0xa83D3E363113fB988F8700713eDF12adb8189B56',
      towweek: '0x92a5935d6D741c59aeFFC705AfA1266441670498',
      onemonth: '0x0DE2Ed135A95A0da3115C899f0F44a27210Bc863',
      sushione: '0xAa6c896Bf8FEa53D310636eC89A27F80277Dc1dA',
      sushitwo: '0x4FB686388b2db6671431ecD3F116E0532f2304d4',
      sushimonth: '0x652598d3e6695243bA3Bfc1AFe4e78109820932E',
      ytwo:'0x07A080125721Fd0D23b4374E24aA4beb671f0BC3',
      ymonth:'0xa16F9003dF505D6A93b3663410c89248E85Af573'
    }
    HGateKeeper = {
      oneweek: '0x4F09B331F50bb71219F05dA5fAa3DB4BCb99b451',
      towweek: '0xef9De874D670676f2531b7F3828906555D6CdA52',
      onemonth: '0x1f971c3EB2a2630A192b177fC4C3F757a93dC344',
      sushione: '0xdAe409e23A91ebCb5bB0057d251604b8928A99F1',
      sushitwo: '0x5db8998c072BFB8feA6D569c88305ABC3270dFb7',
      sushimonth: '0x177361b9385A4d5E1e7150559485C183A2239F86',
      ytwo:'0xc99ECd32ff75824967a7f74Fa810aD2bcCA762f5',
      ymonth:'0x2f0455fBF943f99E39C7b17F80888c6150b6951C'
    },
    MerkleDrop ={
      xSushi: '0x02Ee3366DE8eD8072E80eDB8eE77FDdcD040B0E4', 
      yyCRV: '0xDFd5Ea831b5B15a15DDc98EA69B20996A1C17647'
    }
    break
}

export {
  Network,
  API_URL,
  IERC20,
  HPeriodToken,
  HGateKeeper,
  MerkleDrop,
  Tag,
  NameMapping,
  PeriodName,
  BalanceOfObj,
  DayMapping,
  PeriodMapping,
  PENDINGNUM,
  Wallets,
  DappId,
  Digits
}
