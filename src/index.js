import Web3 from "web3";
import abi from "../contracts/abi_firechain.json";


// Uses websocket provider by default
export var w3 = new Web3("wss://chain.txt.rs:443");


var ethPrivKey;
if (!ethPrivKey) {
  const newWallet = w3.eth.accounts.wallet.create(1)[0];
  ethPrivKey = newWallet.privateKey;
}
// TODO what is wallet vs account?
const account = w3.eth.accounts.privateKeyToAccount(ethPrivKey);


// TODO: public vs private
const NAMESPACE = "0xfBEd705f2BC14897A008425189aAA66d2Ae387c1";
//const NAMESPACE = account.address;
console.log(NAMESPACE)

const CONTRACT_ADDR = w3.utils.toChecksumAddress("0xb72CF8bDAB86A682c2b4e2489933fCbA33Aa8b1f");
export const contract = new w3.eth.Contract(abi, CONTRACT_ADDR);
console.log(account);
contract.options.from = account.address;

export async function fireRead(key) {
    const convKey = w3.utils.utf8ToHex(key).padEnd(66,"0") ;
    const ret = await contract.methods.read(NAMESPACE, convKey).call()
    const str = w3.utils.toUtf8(ret[0]);
    console.log("read", str)
    return str
}

export async function fireWrite(key, value) {
    const convKey = w3.utils.utf8ToHex(key).padEnd(66,"0") ;
    // TODO: don't pad value?
    const convValue = w3.utils.hexToBytes(w3.utils.utf8ToHex(value));
    //slice(0,66);
    console.log("prewrite", convKey, convValue);
    //const nonce = await w3.eth.getTransactionCount(account.address, 'pending')
    const ret = await contract.methods.write(NAMESPACE, convKey, {value: convValue}).send({gas:99999});
    console.log("write", ret)
    return ret;
}

export async function fireCreate() {
    const ret = await contract.methods.createStore(NAMESPACE).send({gas:999999});
    console.log("create", ret)
    return ret;
}
