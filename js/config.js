var API_URL = "https://etherscan.io";
var providerUrl = "https://api.frostbytewallet.io";
var contractAddr = "0x2771Ef07dEfB079C309542E11219D97B562ab6b0";
var abi = [
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_spender",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "pieceprice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addrLevel",
				"type": "bytes1"
			}
		],
		"name": "getPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "totalsupply",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalavl",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "x",
				"type": "address"
			}
		],
		"name": "sendEther",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "incirculation",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "version",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "x",
				"type": "address"
			}
		],
		"name": "gooBalanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "leakEther",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			},
			{
				"name": "_spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"name": "remaining",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "oneavl",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "total",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "tokensCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "total",
				"type": "uint256"
			}
		],
		"name": "etherSent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "total",
				"type": "uint256"
			}
		],
		"name": "etherLeaked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_spender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	}
];

var DERIVATION_PATH = "m/44'/60'/0'/0";

var BASE_ADDR_LEVEL = 180;
var PIECE_PRICE = 3906250000000000;
var BLOCK_TIME = 12000;

var mining=true;
var mining_intensity = 0;
var mining_level = 256;

var createAVLGasRequired_value = 210000;
var sendAVLGasRequired_value = 60000;
var tokenPrecision=10000;
var tokenPrecisionDigits=4;
var global_keystore;
var gasPrice = 20000000000; 
var txgas = 60000;
var gx=5000000;

var LANG_DOC_TITLE = "FrostByte - Ethereum wallet for anonymous identities";
var LANG_SLOGEN = "Ethereum wallet for anonymous identities";
var LANG_UNLOAD_WALLET = "Unload wallet";
var LANG_LOAD_WALLET = "Load wallet";
var LANG_WRITE_DOWN_ACCOUNT_NUMBERS = "Write down the account numbers that you use. Deeper addresses can create avalanche for lower prices.";
var LANG_CONTRACT_ADDRESS = "Contract address";
var LANG_CONTRACT_ADDRESS_TITLE = "Contract Address";
var LANG_DAC = "Decentralized autonomous contract";
var LANG_CREATE_AVL_FOR_REFUNDS = "Create avalanche to receive fee refunds";
var LANG_LEAK_ETHER = "Leak some ether";
var LANG_ADD_ACCOUNT = "+ Add Account";
var LANG_COPY_ADDRESS = "Copy Address";
var LANG_CREATE_ETHER_WALLET = "Create Ethereum wallet";
var LANG_ENT_GEN = "Entropy generator";
var LANG_SENT_ETHER_TITLE = "Send Ethereum";
var LANG_TO_ADDRESS = "To address";
var LANG_VALUE = "Value";
var LANG_SEND = "Send";
var LANG_ETHER_FEES_USED = "ether fees are used";
var LANG_ETHER_FEES_REFUNDED = "and refunded immediately";
var LANG_CREATE_AVL = "Create Avalanche";
var LANG_IN_CIRCULATION = "Total in circulation";
var LANG_CREATE = "Create";
var LANG_ETHER_FEES_USED_REFUNDED = "ether fees are used and refunded immediately";
var LANG_SEND_AVL = "Send Avalanche";
var LANG_SOURCE = "Full source code available, uncompressed (viewsource)";
var LANG_LOADING = "(loading)";
var LANG_VIEW_GITHUB = "View on Github";

function loadLanguage() {
    document.title = LANG_DOC_TITLE;
    $(".slogen span").html(LANG_SLOGEN);
    $("#logOut button").html(LANG_UNLOAD_WALLET);
    $("#cmdSetSeed").html(LANG_LOAD_WALLET);
    $(".info span").html(LANG_WRITE_DOWN_ACCOUNT_NUMBERS);
    $(".info2 span").html(LANG_CONTRACT_ADDRESS);
    $("#dac").html(LANG_DAC);
    $("#topinfo").html(LANG_CREATE_AVL_FOR_REFUNDS);
    $("#leakEther").html(LANG_LEAK_ETHER);
    $(".my h3").html(LANG_CONTRACT_ADDRESS_TITLE);
    $("#addAccount").html(LANG_ADD_ACCOUNT);
    $("#copyaddr").html(LANG_COPY_ADDRESS);
    $("#cmdNewWallet").html(LANG_CREATE_ETHER_WALLET);
    $(".entlabel span").html(LANG_ENT_GEN);
    $(".withdraw h3").html(LANG_SENT_ETHER_TITLE);
    $(".withdraw .to .caption span").html(LANG_TO_ADDRESS);
    $(".withdraw .amount .caption span").html(LANG_VALUE);
    $("#cmdSendETH").html(LANG_SEND);
    $(".lan_fees_used").html(LANG_ETHER_FEES_USED);
    $("#enoughFeesSendEther").html(LANG_ETHER_FEES_REFUNDED);
    $(".buy h3").html(LANG_CREATE_AVL);
    $("#totalSupply span").html(LANG_IN_CIRCULATION);
    $(".buy .caption span").html(LANG_VALUE);
    $("#cmdCreateAVL").html(LANG_CREATE);
    $(".lan_fees_used_refunded").html(LANG_ETHER_FEES_USED_REFUNDED);
    $(".send h3").html(LANG_SEND_AVL);
    $(".send .to .caption span").html(LANG_TO_ADDRESS);
    $(".send .caption.v span").html(LANG_VALUE);
    $("#cmdSendAVL").html(LANG_SEND);
    $("#enoughFeesSendAVL").html(LANG_ETHER_FEES_REFUNDED);
    $("#source").html(LANG_SOURCE);
	$(".result span, .result2 span, .result3 span").html(LANG_LOADING);
	$(".avlicon").attr("title", LANG_SPECIFICATIONS);
	$(".slogen").attr("title", LANG_VIEW_GITHUB);
}

var LANG_CONFIRM_TERMS = "Please confirm that you are neither under the age of 18 nor a US resident, and agree to use this open source platform as-is and on your own risk:";
var LANG_CONFIRM_AND_AGREE = "Confirm and agree";
var LANG_DECLINE = "Decline";
var LANG_CONFIRM = "Confirm";
var LANG_CANCEL = "Cancel";
var LANG_LOGIN_ERR_MSG = "Please create an address or login";
var LANG_ADDRESS_ERR_MSG = "Invalid ETH address";
var LANG_INVALID_AMOUNT_ERR_MSG = "Invalid amount";
var LANG_PLEASE_WAIT = "Please wait...";
var LANG_TRAN_CONFIRMED = "Transaction confirmed";
var LANG_TRAN_SENT = "Transaction sent";
var LANG_TRAN_FAILED = "Transaction failed";
var LANG_TRAN_HASH = "Transaction hash";
var LANG_NO_ETH = "Insufficient balance";
var LANG_NO_ETH_FOR_FEES = "Insufficient ETH balance for fees";
var LANG_NOT_LOGGED_SEND = "You may send this amount directly to the contract address, or create an ethereum wallet to pay lower prices.";
var LANG_NO_AVL = "Insufficient AVL balance";
var LANG_ENTER_PASSWORD_TO_ENCRYPT = "Enter a password to encrypt your seed in the browser:";
var LANG_ENTER_PASSWORD_TO_UNLOCK = "Enter your password to:";
var LANG_MINING_HALTED = "Not crunching identities";
var LANG_ADDRESS_COPIED = "Address copied to clipboard";
var LANG_NO_CLIPBOARD = "Clipboard not accessible";
var LANG_CREATE_AVL_LOW_AMOUNT = "Amount must be at least 0.01 ETH";
var LANG_SPECIFICATIONS = "Specifications";

function LANG_SEND_ETHER_CONFIRM(a1, a2, a3, a4, a5) {
    return "You'll send " + a1 + " ETH to " + a2 + "<br/>Fees"+(a3 ? " (refunded)" : "")+": " + a4 + " ETH<br/><b>Total: "+ a5 + " ETH</b><br/><br/>WARNING: Do NOT send to smart contracts.";
}

function LANG_LEAK_ETHER_CONFIRM(a1, a2, a3) {
    return "You'll receive " + a1 + " ETH<br/>Fees"+(a2 ? " (refunded)" : "")+": " + a3 + " ETH";
}

function LANG_CREATE_AVL_CONFIRM(a1, a2, a3) {
    return "You are creating AVL with " + a1 + " ETH<br/>Fees (refunded): " + a2 + " ETH<br/><b>Total: " + a3 + " ETH</b>";
}

function LANG_CREATED_AVL(a1, a2) {
    return "Created " + a1 + " AVL for " + a2 + " ether";
}

function LANG_SEND_AVL_CONFIRM(a1, a2, a3, a4) {
    return "You are sending " + a1 + " AVL to " + a2 + "<br/>Fees"+(a3 ? " (refunded)" : "")+": " + web3.fromWei(a4, "ether") + " ETH";
}

function LANG_CREATE_WALLET_PROMPT(a1) {
    return 'Your wallet seed:<br/><br/><span style="font-size:1.2em">' + a1 + '</span><br/><br/>Please write down your wallet seed in a safe place and enter a password to encrypt your seed in the browser:';
}

function LANG_MINING_ADDRESSES(a1, a2) {
    return "Crunching identities at depth " + a1 + ", intensity " + a2 + "%";
}
