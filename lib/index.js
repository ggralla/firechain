"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.contract = exports.w3 = undefined;
exports.fireRead = fireRead;
exports.fireWrite = fireWrite;
exports.fireCreate = fireCreate;

var _web = require("web3");

var _web2 = _interopRequireDefault(_web);

var _abi_firechain = require("../contracts/abi_firechain.json");

var _abi_firechain2 = _interopRequireDefault(_abi_firechain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Uses websocket provider by default
var w3 = exports.w3 = new _web2.default("wss://chain.txt.rs:443");

var ethPrivKey;
if (!ethPrivKey) {
    var newWallet = w3.eth.accounts.wallet.create(1)[0];
    ethPrivKey = newWallet.privateKey;
}
// TODO what is wallet vs account?
var account = w3.eth.accounts.privateKeyToAccount(ethPrivKey);

// TODO: public vs private
var NAMESPACE = "0xfBEd705f2BC14897A008425189aAA66d2Ae387c1";
//const NAMESPACE = account.address;
console.log(NAMESPACE);

var CONTRACT_ADDR = w3.utils.toChecksumAddress("0xF60789aC205C1E4E33eF30978367e67dE9e2f2b3");
var contract = exports.contract = new w3.eth.Contract(_abi_firechain2.default, CONTRACT_ADDR);
console.log(account);
contract.options.from = account.address;

async function fireRead(key) {
    var convKey = w3.utils.utf8ToHex(key).padEnd(66, "0");
    var ret = await contract.methods.read(NAMESPACE, convKey).call();
    var str = ret[0];
    console.log("read", str);
    return str;
}

async function fireWrite(key, value) {
    var convKey = w3.utils.utf8ToHex(key).padEnd(66, "0");
    // TODO: don't pad value?
    var convValue = value;
    //slice(0,66);
    console.log("prewrite", convKey, convValue);
    //const nonce = await w3.eth.getTransactionCount(account.address, 'pending')
    var gasEstimate = await contract.methods.write(NAMESPACE, convKey, { value: convValue }).estimateGas();
    var ret = await contract.methods.write(NAMESPACE, convKey, { value: convValue }).send({ gas: gasEstimate });
    console.log("write", ret);
    return ret;
}

async function fireCreate() {
    var gasEstimate = await contract.methods.createStore(NAMESPACE).estimateGas();
    var ret = await contract.methods.createStore(NAMESPACE).send({ gas: gasEstimate });
    console.log("create", ret);
    return ret;
}