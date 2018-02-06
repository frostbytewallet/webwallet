var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
var contract = web3.eth.contract(abi).at(contractAddr);

var addresses;
var loaded_address_index=0;
var balanceAVL,balanceETH,balanceFEE;

var tokensCreated; //event
var Transfer; //event
var etherSent; //event
var etherLeaked; //event

function loadedAddress() { return addresses[loaded_address_index]; }

function watchBalance(once) {
    txgas = web3.eth.gasPrice;
    
    contract.balanceOf("0x"+loadedAddress(), function(err,res) {
        balanceAVL = parseFloat(res);     
        $("#queryBalance .result span").html(balanceAVL/tokenPrecision);
    });

    web3.eth.getBalance(loadedAddress(), function(err,res) {
        balanceETH = parseFloat(res);
        $("#queryBalance .result2 span").html(web3.fromWei(balanceETH,"ether"));
    });

    contract.gooBalanceOf("0x"+loadedAddress(),function(err,res) {
        balanceFEE = parseFloat(res);
        $("#queryBalance .result3 span").html(web3.fromWei(balanceFEE,"ether"));
        updateEtherLeakAvailability();
    });
    
    $("#queryBalance").show();

    $("#AVLPrice").html(web3.fromWei(PIECE_PRICE * (getHexAddressLevel(loadedAddress()) + 1), "ether"));
    
    if (!once) setTimeout(function() { watchBalance(); }, BLOCK_TIME);
}

function updateEtherLeakAvailability() {
    contract.totalSupply(function(err,res) { $("#totalSupply").html(parseFloat(res)/tokenPrecision); });

    if (isNaN(balanceFEE)) return;

    if (balanceFEE>=sendAVLGasRequired_value*gasPrice) 
    { $("#enoughFeesSendAVL").show(); } else { $("#enoughFeesSendAVL").hide(); }

    if (balanceFEE>=txgas*gasPrice) 
    { $("#enoughFeesSendEther").show(); } else { $("#enoughFeesSendEther").hide(); }

    if (balanceFEE>0) { $("#topinfo").hide(); $("#leakEther").show(); }
    else { $("#topinfo").show(); $("#leakEther").hide(); }
}

function setInfo(info) {
    $(".info span").html(info);
    $(".info").show(); $(".info2").hide();
}

function validateETHAddress(address) {
    if (!web3.isAddress(address)) { bootbox.alert(LANG_ADDRESS_ERR_MSG); return false; }
    return true;
}

function sendEth() {
    if (!addresses) { bootbox.alert(LANG_LOGIN_ERR_MSG); return; }

    var toAddr = $("#sendTo").val(); if (!validateETHAddress(toAddr)) return;

    var valueEth = $("#sendValueAmount").val();
    var value = parseFloat(web3.toWei(valueEth,"ether"));
    if (value==0 || isNaN(value)) { bootbox.alert(LANG_INVALID_AMOUNT_ERR_MSG); return; }
    
    $("#withdrawInfo").html(LANG_PLEASE_WAIT); $("#withdrawInfo").show();
    
    txgas = contract.sendEther.estimateGas($("#sendTo").val(), {from: "0x"+loadedAddress(), value: value, gas: gx, gasPrice: gasPrice });
    var totalFees = txgas*gasPrice;
    $("#sendEtherGasRequired").html(web3.fromWei(totalFees, "ether"));

    if (value==balanceETH) { value = value - totalFees; }
    var totalSpent = value+totalFees;
    if (totalSpent>balanceETH) { 
        bootbox.alert("Insufficient balance"); $("#withdrawInfo").hide(); return; 
    }
    var isRefunded = balanceFEE > totalFees;
    
    bootbox.confirm({
        message: LANG_SEND_ETHER_CONFIRM(web3.fromWei(value, "ether"), toAddr, isRefunded, web3.fromWei(totalFees, "ether"), web3.fromWei(totalSpent, "ether")),
        buttons: {
            confirm: { label: LANG_CONFIRM, className: 'btn-success' },
            cancel: { label: LANG_CANCEL, className: 'btn-danger' }
        },
        callback: function (result) {
            if (result) { 
                if (!etherSent) {
                    etherSent = contract.etherSent(function(error, result) {
                        if (error) { alert(error); return; }
                        var receipt = web3.eth.getTransactionReceipt(result.transactionHash);
                        if (receipt==null) return;
                        $("#withdrawInfo").html(LANG_TRAN_CONFIRMED);
                        setInfo(LANG_TRAN_HASH + ": <a target='blank' href='"+API_URL+"/tx/"+result.transactionHash+"'>"+result.transactionHash+"</a>");
                        watchBalance(true);
                    });        
                }
                $("#withdrawInfo").hide();
                contract.sendEther($("#sendTo").val(), {from: "0x"+loadedAddress(), value: value, gas: txgas, gasPrice: gasPrice}, function(err,res) { });
                $("#withdrawInfo").html(LANG_PLEASE_WAIT);
                $("#withdrawInfo").show();
            } else { $("#withdrawInfo").hide(); }
        }
    });
}

function leakEther() {
    if (!addresses) { bootbox.alert(LANG_LOGIN_ERR_MSG); return; }

    if (balanceFEE==0) { bootbox.alert("No Goo balance available"); return; }
    
    leakGas = contract.leakEther.estimateGas({from: "0x"+loadedAddress(), value: 0, gas: gx, gasPrice: gasPrice });
    var totalFees = leakGas*gasPrice;
    if (totalFees>balanceETH) { bootbox.alert(LANG_NO_ETH_FOR_FEES); return; }
    var leakAmount = balanceFEE / getHexAddressLevel(loadedAddress());
    var isRefunded = balanceFEE - leakAmount > totalFees;

    bootbox.confirm({
        message: LANG_LEAK_ETHER_CONFIRM(web3.fromWei(leakAmount), isRefunded, web3.fromWei(totalFees, "ether")),
        buttons: { confirm: { label: LANG_CONFIRM, className: 'btn-success' },
                   cancel: { label: LANG_CANCEL, className: 'btn-danger' } },
        callback: function (result) {
            if (result) { 
                if (!etherLeaked) {
                    etherLeaked = contract.etherLeaked(function(error, result) {
                        if (error) { alert(error); return; }
                        var receipt = web3.eth.getTransactionReceipt(result.transactionHash);
                        if (receipt==null) return;
                        if (parseInt(result.args.total)==0) { bootbox.alert("Only leaks once in 24 hours"); return; }
                        setInfo(LANG_TRAN_HASH + ": <a target='blank' href='"+API_URL+"/tx/"+result.transactionHash+"'>"+result.transactionHash+"</a>");
                        watchBalance(true);
                    });        
                }
                contract.leakEther({from: "0x"+loadedAddress(), value: 0, gas: leakGas, gasPrice: gasPrice }, function(err,res) { });
            }
        }
    });
}

function createTokens() {
    if (!addresses) { bootbox.alert(LANG_NOT_LOGGED_SEND); return; }
    var valueEth = parseFloat(web3.toWei($("#txtETHValue").val(),"ether"));
    if (valueEth < 10000000000000000) {
        bootbox.alert(LANG_CREATE_AVL_LOW_AMOUNT);
        return;
    }
    var unitPrice = PIECE_PRICE * (getHexAddressLevel(loadedAddress()) + 1);
    $("#createInfo").html(LANG_PLEASE_WAIT); $("#createInfo").show();

    createAVLGasRequired_value = web3.eth.estimateGas({from: "0x"+loadedAddress(), to: contractAddr, value: valueEth, gasPrice: gasPrice, gas: gx });

    var totalFees = createAVLGasRequired_value*gasPrice;
    $("#createAVLGasRequired").html(web3.fromWei(totalFees, "ether"));
    var totalSpent = valueEth+totalFees;
    if (totalSpent>balanceETH) { 
        bootbox.alert(LANG_NO_ETH_FOR_FEES);
        $("#createInfo").hide();
        return; 
    }
    
    bootbox.confirm({
        message: LANG_CREATE_AVL_CONFIRM(web3.fromWei(valueEth,"ether"), web3.fromWei(totalFees, "ether"), web3.fromWei(totalSpent, "ether")),
        buttons: { confirm: { label: LANG_CONFIRM, className: 'btn-success' },
                   cancel: { label: LANG_CANCEL, className: 'btn-danger' } },
        callback: function (result) {
            if (result) { 
                if (!tokensCreated) {
                    tokensCreated = contract.tokensCreated(function(error, result) {
                        if (error) { alert(error); return; }
                        var receipt = web3.eth.getTransactionReceipt(result.transactionHash);
                        if (receipt==null) return;
                        var fees = parseFloat(receipt.gasUsed)*gasPrice;
                        var created = parseFloat(result.args.total);
                        var createdfor = parseFloat(result.args.price);
                        $("#createInfo").html(LANG_CREATED_AVL(created/tokenPrecision, web3.fromWei(createdfor,"ether")));
                        setInfo(LANG_TRAN_HASH+": <a target='blank' href='"+API_URL+"/tx/"+result.transactionHash+"'>"+result.transactionHash+"</a>");
                        watchBalance(true);
                    });        
                }
                $("#createInfo").hide();
                web3.eth.sendTransaction({from: "0x"+loadedAddress(), to: contractAddr, value: valueEth, gasPrice: gasPrice, gas: createAVLGasRequired_value}, function (err, txhash) { });
                $("#createInfo").html(LANG_PLEASE_WAIT);
                $("#createInfo").show();
            } else { $("#createInfo").hide(); }
        }
    });


}

function sendTokens() {
    if (!addresses) { bootbox.alert(LANG_LOGIN_ERR_MSG); return; }
    
    var toAddr = $("#sendAVLTo").val(); if (!validateETHAddress(toAddr)) return;

    var valueAVL = parseFloat($("#txtAVLValue").val()) * tokenPrecision;
    if (valueAVL==0) { bootbox.alert(LANG_INVALID_AMOUNT_ERR_MSG); return; }
    if (valueAVL>balanceAVL) { bootbox.alert(LANG_NO_AVL); return; }

    $("#sendInfo").html(LANG_PLEASE_WAIT); $("#sendInfo").show();

    sendAVLGasRequired_value = contract.transfer.estimateGas($("#sendAVLTo").val(), valueAVL, {from: "0x"+loadedAddress(), value: 0, gas: gx, gasPrice: gasPrice});
    var totalFees = sendAVLGasRequired_value*gasPrice;
    $("#sendAVLGasRequired").html(web3.fromWei(totalFees, "ether"));

    if (totalFees>balanceETH) { 
        bootbox.alert(LANG_NO_ETH_FOR_FEES); 
        $("#sendInfo").hide();
        return; 
    }

    var isRefunded = balanceFEE > totalFees;
    
    bootbox.confirm({
        message: LANG_SEND_AVL_CONFIRM(valueAVL/tokenPrecision, toAddr, isRefunded, totalFees),
        buttons: { confirm: { label: LANG_CONFIRM, className: 'btn-success' },
                   cancel: { label: LANG_CANCEL, className: 'btn-danger' } },
        callback: function (result) {
            if (result) { 
                if (!Transfer) {
                    Transfer = contract.Transfer(function(error, result) {
                        if (error) { alert(error); return; }
                        var receipt = web3.eth.getTransactionReceipt(result.transactionHash);
                        if (receipt==null) return;
                        $("#sendInfo").html(LANG_TRAN_CONFIRMED); 
                        setInfo(LANG_TRAN_HASH + ": <a target='blank' href='"+API_URL+"/tx/"+result.transactionHash+"'>"+result.transactionHash+"</a>");
                        watchBalance(true);
                    });        
                }
                $("#sendInfo").hide();
                contract.transfer($("#sendAVLTo").val(), valueAVL, {from: "0x"+loadedAddress(), value: 0, gas: sendAVLGasRequired_value, gasPrice: gasPrice}, function(err,res) {});
                $("#sendInfo").html(LANG_PLEASE_WAIT);
                $("#sendInfo").show();
            } else { $("#sendInfo").hide(); }
        }
    });
}

function setWeb3Provider(keystore) {
    var web3Provider = new HookedWeb3Provider({ host: providerUrl, transaction_signer: keystore });
    web3.setProvider(web3Provider);
}

var mouseEntropy = "";
var mouseRand="", timeRand, last_mouseRand, evop;

$(document).on("mousemove mousedown click", function( e ) {
  mouseRand = e.pageX*e.pageY; 
  if (!last_mouseRand) last_mouseRand = mouseRand;
  if (evop==1) $(document).off("mousemove");
  last_mouseRand = mouseRand;
});

function timeCycle() {
    if (addresses) return;
    var d = new Date();
    var n = d.getTime(); 
    timeRand = n * Math.random();
    mouseEntropy += timeRand.toString();
    mouseEntropy += mouseRand.toString();
    mouseEntropy += getScrollPos().toString();
    updateVisualizer(n, timeRand);
    if (evop==1) { 
        $(document).off("mousemove");
    } else {
        setTimeout("timeCycle();",250+Math.floor(Math.random()*250));
    }
}

function updateVisualizer(r1,r2) {
    $("#ev"+(Math.floor(r1) % 40)).attr("class", "color"+(Math.floor(r2) % 12));
    if (evop!=1) evop = mouseEntropy.length/(4096); if (evop>1)evop=1;
    $("#entperc").html(Math.ceil(evop*100));
    var evopb = evop+0.4; if (evopb>1)evopb=1;
    $("#entropyVisualizer").css("opacity", evopb);
}

function timeCycle2() {
    if (mining) {
        var d = new Date();
        var n = d.getTime(); 
        timeRand = n * Math.random();
        updateVisualizer2(n, timeRand);
    }
    setTimeout("timeCycle2();",mining ? 250+Math.floor(Math.random()*250) : 1000);
}

function updateVisualizer2(r1,r2) {
    $("#ev"+(Math.floor(r1) % 40)).attr("class", "color"+(Math.floor(r2) % 12));
    $("#entropyVisualizer").css("opacity", parseFloat(intprc) / 100);
}

function getScrollPos(){
    if (typeof pageYOffset!= 'undefined') { return pageYOffset; }
    else {
        var B= document.body;
        var D= document.documentElement;
        D= (D.clientHeight)? D: B;
        return D.scrollTop;
    }
}

function newWallet() {
    var extraEntropy = web3.sha3(mouseEntropy.toString());
    var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);

    var infoString = LANG_CREATE_WALLET_PROMPT(randomSeed);
    bootbox.prompt({
        title: infoString,
        inputType: 'password',
        callback: function (result) {
            if (!result) return;
            $("#walletLoader > *").hide();
            $("#logOut").show();
            lightwallet.keystore.deriveKeyFromPassword(result, function(err, pwDerivedKey) {
                if (err) { alert(err); return; }
                $(".entgen").hide();
                $("#halt").css("visibility", "visible");
                $(document).off("mousemove");
                timeCycle2();
                global_keystore = new lightwallet.keystore(randomSeed, pwDerivedKey);
                newAddresses(result);
                setWeb3Provider(global_keystore);
                $(".info").show();
            });
            $("#cmdNewWallet").hide();
        }
    });
}

function setSeed() {
    var infoString = LANG_ENTER_PASSWORD_TO_ENCRYPT;
    bootbox.prompt({
        title: infoString,
        inputType: 'password',
        callback: function (result) {
            if (!result) return;
            $("#cmdNewWallet").hide();
            $(".my.sec .comment").hide();
            $("#walletLoader > *").hide();
            $("#logOut").show();
            lightwallet.keystore.deriveKeyFromPassword(result, function(err, pwDerivedKey) {
                if (err) { alert(err); return; }
                $(".entgen").hide();
                $("#halt").css("visibility", "visible");
                $(document).off("mousemove");
                timeCycle2();
                global_keystore = new lightwallet.keystore(document.getElementById('seed').value, pwDerivedKey);
                newAddresses(result);
                setWeb3Provider(global_keystore);
                $(".info").show();
            });
        }
    });
}

function newAddresses(password) {
    lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
        if (err) { alert(err); return; }
        evop=1;
        updateEntLabel();
        $("#accsec").show();
        global_keystore.generateHardAddress(pwDerivedKey);
    });
}
var addAccountNo;

function switchToAccount(idx,hdidx) {
    loaded_address_index=parseInt(idx);
    $("#queryBalance").hide();
    watchBalance(true);
    $("#addr").html("0x"+loadedAddress());
    $("#addr").attr("href", API_URL+"/address/0x"+loadedAddress());
    $("#addressdepth").html("Depth: "+getHexAddressLevel(loadedAddress()));
    $("#addressdepth").show();
    $(".my.sec h3").html(hdidx == 0 ? "Main Account" : "Account #"+hdidx);
    $(".my.sec .comment").hide();
    $("#qrCode").html("");
    new QRCode(
        document.getElementById("qrCode"), 
        {
            text: "ethereum:"+$("#addr").html(),
            width: 140,
            height: 140,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        }
    );
    $("#qrCode").show();
    updateEntLabel();
    if (mining) $(".entgen").show();
}

function getHexAddressLevel(addr) {
    var x = hexToBytes(addr); var highest = 0;
   
    for (var i=0;i<20;i++) {
        if (x[i]>highest) highest=x[i];
    }

    return highest;
}

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}

var totalGenerated=0;
function finishedGenerating(hdidx, addrLevel, forceSwitch,pwDerivedKey, hdPathString) {
    document.getElementById('seed').value = "";
    addresses = global_keystore.getAddresses();
    if (hdidx==0 || forceSwitch) switchToAccount(totalGenerated,hdidx);
    if (mining_level==256) {
        mining_level = addrLevel<BASE_ADDR_LEVEL ? addrLevel : BASE_ADDR_LEVEL;
        watchBalance(totalGenerated>0);
    } else {
        if (addrLevel<mining_level) {
            var gained = mining_level-addrLevel;
            mining_level=addrLevel;
            if (mining_intensity<1000) {
                mining_intensity+=5*gained;
                if (mining_intensity>1000) mining_intensity=1000;
            }
            if (intprc>0) intprc-=gained;
            if (intprc<0) intprc=0;
            if (intprc==0) { stopMining(); mining_intensity=0; intprc=100; }
        }
    }
    var listitem = "<option value='"+addresses[totalGenerated]+"' idx='"+totalGenerated+"' hdidx='"+hdidx+"'>"+(hdidx==0 ? "Main" : "#"+hdidx)+"</option>";
    $("#accounts").append(listitem);
    if (forceSwitch) $("#accounts option:last-child").prop('selected', true); 
    if (totalGenerated>0) localStorage.setItem(addresses[0]+"_"+totalGenerated, hdidx);
    totalGenerated++;
    updateEntLabel();
    if (forceSwitch) {
        setTimeout(function() { global_keystore.generateHardAddress(pwDerivedKey, hdPathString); }, mining_intensity);
    }
}

function stopMining() {
    mining=false; updateEntLabel(); $("#halt").css("visibility", "hidden"); $("#resume").css("visibility", "visible");
}
function startMining() {
    mining=true; updateEntLabel(); $("#halt").css("visibility", "visible"); $("#resume").css("visibility", "hidden");
}

var intprc = 100;
function updateEntLabel() {
    if (mining) { $(".entlabel").html(LANG_MINING_ADDRESSES(mining_level, intprc)); }
    else { $(".entlabel").html(LANG_MINING_HALTED); }
}

function copyAddress() {
  var textArea = document.createElement("textarea");

  textArea.style.position = 'fixed';
  textArea.style.top = -500;
  textArea.style.left = -500;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = $("#addr").html();

  document.body.appendChild(textArea);

  textArea.select();
  
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    bootbox.alert(LANG_ADDRESS_COPIED);
  } catch (err) {
    bootbox.alert(LANG_NO_CLIPBOARD);
  }

  document.body.removeChild(textArea);
}