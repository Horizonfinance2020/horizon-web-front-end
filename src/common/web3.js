import axios from 'axios'
import {
  Network,
  API_URL,
  HPeriodToken,
  IERC20,
  HGateKeeper,
  MerkleDrop
} from '../config.js'

const getDashboard = function(address, day, market) {
  return axios.get(`${API_URL}/dashboard`, {
    params: {
      network: Network,
      market: market,
      days: day,
      address: address,
    },
  })
}

const getActiveBid = function(address, market) {
  return axios.get(`${API_URL}/activeBid`, {
    params: {
      network: Network,
      market: market,
      address: address,
    },
  })
}

const getHistoryBid = function(address, market) {
  return axios.get(`${API_URL}/historyBid`, {
    params: {
      network: Network,
      market: market,
      address: address,
    },
  })
}
const getClaimInfo = function(address) {
  return axios.get(`${API_URL}/claimInfo?address=${address}`)
  // return axios.get(`${API_URL}/claimInfo?address=${'0x9ac41e441131d8bad5f165c2a8dd71e5f7bfaea8'}`)
}

const IERC20_abi = require('./IERC20_abi.json')
const HPeriod_abi = require('./HPeriod_abi.json')
const HGateKeeper_abi = require('./HGateKeeper_abi.json')
const HToken_abi = require('./HToken_abi.json')
const MerkleDrop_abi= require('./MerkleDrop_abi.json')

const getPending = function(hashString) {
  return new window.web3.eth.getTransactionReceipt(hashString)
}
// 动态获取web3实例对象
const getWeb3 = function(abi, accounts) {
  let instance = new window.web3.eth.Contract(abi, accounts)
  return instance
}
const getHToken = function(accounts) {
  return getWeb3(HToken_abi, accounts)
}
const getHTokenPeriodNumber = function(accounts) {
  return getHToken(accounts)
    .methods.period_number()
    .call()
}
//获取当前块高度
const getBlock = function() {
  return new window.web3.eth.getBlockNumber()
}
const updatePeriodStatu = function(accounts, name) {
  let data = getWeb3(HGateKeeper_abi, HGateKeeper[name])
    .methods.updatePeriodStatus()
    .encodeABI()
  let params = 
    {
      from: accounts,
      to: HGateKeeper[name],
      value: 0,
      data: data,
    }
  return params
}
//存
const getHGateKeeper = function(number, accounts, name, ratio) {
  let data = getWeb3(HGateKeeper_abi, HGateKeeper[name])
    .methods.bidRatio(number, ratio)
    .encodeABI()
    return  {
      from: accounts,
      to: HGateKeeper[name],
      value: 0,
      data: data,
    }
}
const getClaim = function(number, accounts, name, lp_token) {
  let data = getWeb3(HGateKeeper_abi, HGateKeeper[name])
    .methods.claim(lp_token, number)
    .encodeABI()
    return {
      from: accounts,
      to: HGateKeeper[name],
      value: 0,
      data: data,
    }
}
const getIERC20 = function(name) {
  return getWeb3(IERC20_abi, IERC20[name])
}
const getIEBF = function(accounts, name) {
  return getIERC20(name)
    .methods.balanceOf(accounts)
    .call()
}
const getMyBF = function(accounts, lp_addr) {
  return getWeb3(IERC20_abi, lp_addr)
    .methods.balanceOf(accounts)
    .call()
}
const getMyBFs = function(accounts, lp_addr) {
  return  getWeb3(IERC20_abi, lp_addr)
    .methods.balanceOf(accounts)
    .call()
}
const getSUIEBF = function(accounts, name) {
  return getIERC20(name)
    .methods.balanceOf(accounts)
    .call()
}
const getHPeriod = function(name) {
  return getWeb3(HPeriod_abi, HPeriodToken[name])
}
const getBlockNum = function(name) {
  return getHPeriod(name)
    .methods.getParamPeriodBlockNum()
    .call()
}
const getPeriod = function(name) {
  return getHPeriod(name)
    .methods.getCurrentPeriod()
    .call()
}
const getPeriodInfos = function(period, name) {
  return getHPeriod(name)
    .methods.getPeriodInfo(period)
    .call()
}
// 查询授权额度
const getAllowance = async function(accounts, name, type) {
  return getIERC20(type)
    .methods.allowance(accounts, HGateKeeper[name])
    .call()
}
//存
const setApprove = function(number, name,accounts, type) {
  let params= getIERC20(type)
    .methods.approve(HGateKeeper[name], number)
    .encodeABI()
    return {
      from:accounts,
      to: IERC20[type],
      value: 0,
      data: params,
    }
}
const refundClaim= function(token,accounts,address, amount, proof) {
  console.log(MerkleDrop[token],token,'MerkleDrop')
  let data = getWeb3(MerkleDrop_abi, MerkleDrop[token])
    .methods.claim(address, amount, proof)
    .encodeABI()
    console.log(data,'data')
  let params = 
    {
      from: accounts,
      to: MerkleDrop[token],
      data: data,
    }
  return params
}
export {
  getWeb3,
  getIEBF,
  getHPeriod,
  getBlockNum,
  getPeriod,
  getPeriodInfos,
  getBlock,
  getAllowance,
  setApprove,
  getDashboard,
  getHGateKeeper,
  getActiveBid,
  getHistoryBid,
  getClaimInfo,
  getClaim,
  getHTokenPeriodNumber,
  getSUIEBF,
  getPending,
  getMyBF,
  updatePeriodStatu,
  getMyBFs,
  refundClaim
}
