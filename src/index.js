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

const CONTRACT_ADDR = w3.utils.toChecksumAddress("0xF60789aC205C1E4E33eF30978367e67dE9e2f2b3");
export const contract = new w3.eth.Contract(abi, CONTRACT_ADDR);
console.log(account);
contract.options.from = account.address;

export async function fireRead(key) {
    const convKey = w3.utils.utf8ToHex(key).padEnd(66,"0") ;
    const ret = await contract.methods.read(NAMESPACE, convKey).call()
    const str = ret[0];
    console.log("read", str)
    return str
}

export async function fireWrite(key, value) {
    const convKey = w3.utils.utf8ToHex(key).padEnd(66,"0") ;
    // TODO: don't pad value?
    const convValue = value;
    //slice(0,66);
    console.log("prewrite", convKey, convValue);
    //const nonce = await w3.eth.getTransactionCount(account.address, 'pending')
    const gasEstimate = await contract.methods.write(NAMESPACE, convKey, {value: convValue}).estimateGas();
    const ret = await contract.methods.write(NAMESPACE, convKey, {value: convValue}).send({gas: gasEstimate});
    console.log("write", ret)
    return ret;
}

export async function fireCreate() {
    const gasEstimate = await contract.methods.createStore(NAMESPACE).estimateGas();
    const ret = await contract.methods.createStore(NAMESPACE).send({gas: gasEstimate});
    console.log("create", ret)
    return ret;
}
