## FrostByte

Secure client-side ethereum wallet. Safest way to store ether and tokens. Supports offline mode with optic synchronization (no cables).

https://www.frostbytewallet.io

### Integrated currency: Avalanche!

A decentralized currency for anonymous identities. A wrapper for Ethereum, with various incentives for creating ethereum addresses that are hard to generate.

**> Address depth and anonymous identities**

The highest byte in the user's ethereum address is defined as the address depth, and the price for creating the coin is set accordingly. If the highest byte in the address is 255 then the price is 1 eth, and for each byte lower than that, the price is reduced by 1 eth / 256.

Address depth allows decentralized applications to maintain a certain level of identity control while the users remain anonymous. Usecases include faucets, advertising applications, surveys, voting, decentralized exchanges and more.

**> Where does the ether go when creating new AVL coins**

Nowhere. It's 100% yours, locked inside the contract as "Goo", and used by the contract to refund your ether fees while you use any AVL supported wallet. Fees are refunded for sending ether, and for creating and sending AVL. Also, you may leak your current Goo amount, divided by your address depth, back to ether every 24 hours. When buying and selling AVL coins in online exchanges, only the AVL is transferred.

### Currency features:

- Autonomous contract (creator can't interact with or change the contract after its launch)
- Fee refunds
- Anonymous identities
- Coins are created by users
- Optimized blockchain storage
- Amplified PoW
- Private ethereum faucet

### Technical specifications:

- Name: Avalanche
- Decimals: 4
- Symbol: AVL
- Total supply: 1,000,000 AVL (created by users)
- Pre-allocation: 10,000 AVL (no ether)
- ERC-20 compatible
- Contract address: 0x2771Ef07dEfB079C309542E11219D97B562ab6b0

### Frostbyte web wallet features:

- Fast transaction confirmation
- Improved HD wallet security
- Camera QR scanner
- Mobile compatability
- Built-in identity cruncher

### Identity crunching

Below is a demonstration of how hard it is to crunch any level of address depth:

![Address depth demonstration](https://i.imgur.com/b6iBd79.png)

The deeper it gets, the harder the crunching gets as well.

### Integration (developers)

1. Your contract may require that users have an address depth below a certain level, using the following solidity code:

```solidity
mapping (address => bytes1) addresslevels; // cache

function getAddressLevel() internal returns (bytes1 res)
{
    if (addresslevels[msg.sender] > 0) { return addresslevels[msg.sender]; }

    bytes1 highest = 0;

    for (uint i = 0; i < 20; i++) {
	    bytes1 c = bytes1(uint8(uint(msg.sender) / (2 ** (8 * (19 - i)))));
	    if (bytes1(c) > highest) highest = c;
    }

    addresslevels[msg.sender] = highest;
    return highest;
}
```
2. To check a specific address for AVL or Goo balance, use the following solidity code:

```solidity
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

function getAVLBalance(address x) public constant returns (uint) {
    ERC20 tokenContract = ERC20(0x2771Ef07dEfB079C309542E11219D97B562ab6b0);
    return tokenContract.balanceOf(x);
}

function getGooBalance(address x) public constant returns (uint) {
    ERC20 tokenContract = ERC20(0x2771Ef07dEfB079C309542E11219D97B562ab6b0);
    return tokenContract.gooBalanceOf(x);
}
```
