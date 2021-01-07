pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;

//https://github.com/ethereum/dapp-bin/blob/master/library/iterable_mapping.sol


contract FireChainStore {

    struct ValueType {
        bytes value;
    }
    struct Store {
        address owner;
        bytes32[] keys;
        mapping(bytes32 => ValueType) data;
    }
    
    mapping (address => Store) userStores;
    address[] users;
    
    // todo: check sender address against _owner key for permissions
    function write (address _owner, bytes32 _key, ValueType _value) public {
        Store userStore = userStores[_owner];
        
        userStore.data[_key] = _value;
        userStore.keys.push(_key);
    }
    
    function read (address _owner, bytes32 _key) public returns(ValueType _value) {
        Store userStore = userStores[_owner];
        
        _value = userStore.data[_key];
        return _value;
    }
    
    function createStore(address _owner) public returns (bool created) {
        Store userStore = userStores[_owner];
        
        if (userStore.owner == 0) {
            userStore.owner = _owner;
            users.push(_owner);
            return true;
        } else {
            // Store exists
            return false;
        }
    
    }
    
}
