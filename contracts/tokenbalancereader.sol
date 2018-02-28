pragma solidity ^0.4.20;

contract ERC20 {
    function totalSupply() public constant returns (uint totalsupply);
    function balanceOf(address _owner) public constant returns (uint balance);
    function transfer(address _to, uint _value) public returns (bool success);
    function transferFrom(address _from, address _to, uint _value) public returns (bool success);
    function approve(address _spender, uint _value) public returns (bool success);
    function allowance(address _owner, address _spender) public constant returns (uint remaining);
    
    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}

contract TokenBalanceReader {
    
    function getTokenBalances(address x, address[200] contracts) public view returns (uint[200] result) {
        for (uint i=0; i<200; i++) {
            if (contracts[i]==address(0)) return result;
            uint res = getTokenBalance(x, contracts[i]);
            result[i] = res;
        }

        return result;
    }

    function getTokenBalance(address x, address y) public view returns (uint) {
        ERC20 tokenContract = ERC20(y);
        return tokenContract.balanceOf(x);
    }
    
}