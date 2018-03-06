var nodeConnected = true;
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
var contract = web3.eth.contract(abi).at(contractAddr);
var tokenBalanceReader = web3.eth.contract(tokenBalanceReaderABI).at(tokenBalanceReader);
var $loadedToken, loadedContract;

function setWeb3Provider(keystore) {
    var web3Provider = new HookedWeb3Provider({ host: providerUrl, transaction_signer: keystore });
    web3.setProvider(web3Provider);
}

var addresses;
var loaded_address_index=0;
var balanceAVL,balanceETH,balanceFEE;

function loadedAddress() { return addresses[loaded_address_index]; }

function watchBalance(once) {
    var cached = localStorage.getItem("balanceAVL"+loadedAddress());

    if (!nodeConnected) {
        balanceAVL = cached==null ? null : parseFloat(cached);
        $("#queryBalance .result span").html(balanceAVL != null ? balanceAVL/tokenPrecision : "Unknown");
    } else {
        contract.balanceOf(loadedAddress(), function(err,res) {
            if (err) {
                balanceAVL = cached==null ? null : parseFloat(cached);
            } else {
                balanceAVL = parseFloat(res);     
                localStorage.setItem("balanceAVL"+loadedAddress(), balanceAVL);
            }
            $("#queryBalance .result span").html(balanceAVL != null ? balanceAVL/tokenPrecision : "Unknown");
        });
    }

    cached = localStorage.getItem("balanceETH"+loadedAddress());
    if (!nodeConnected) {
        balanceETH = cached==null ? null : parseFloat(cached);
        $("#queryBalance .result2 span").html(balanceETH != null ? web3.fromWei(balanceETH,"ether") : "Unknown");
    } else {
        web3.eth.getBalance(loadedAddress(), function(err,res) {
            if (err) {
                balanceETH = cached==null ? null : parseFloat(cached);
            } else {
                balanceETH = parseFloat(res);     
                localStorage.setItem("balanceETH"+loadedAddress(), balanceETH);
            }
            $("#queryBalance .result2 span").html(balanceETH != null ? web3.fromWei(balanceETH,"ether") : "Unknown");
        });
    }

    cached = localStorage.getItem("balanceFEE"+loadedAddress());
    if (!nodeConnected) {
        balanceFEE = cached==null ? null : parseFloat(cached);
        $("#queryBalance .result3 span").html(balanceFEE != null ? web3.fromWei(balanceFEE,"ether") : "Unknown");
        if (once) updateEtherLeakAvailability();
    } else {
        contract.gooBalanceOf(loadedAddress(),function(err,res) {
            if (err) {
                balanceFEE = cached==null ? null : parseFloat(cached);
            } else {
                balanceFEE = parseFloat(res);  
                localStorage.setItem("balanceFEE"+loadedAddress(), balanceFEE);   
            }
            $("#queryBalance .result3 span").html(balanceFEE != null ? web3.fromWei(balanceFEE,"ether") : "Unknown");
            if (once) updateEtherLeakAvailability();
        });
    }

    if (once && nodeConnected) loadTokenBalances();
    if (loadedContract) getLoadedTokenBalance();

    $("#queryBalance").show();
    $("#AVLPrice").html(web3.fromWei(PIECE_PRICE * (getHexAddressLevel(loadedAddress()) + 1), "ether"));
    
    if (!once && nodeConnected) setTimeout(function() { watchBalance(); }, BLOCK_TIME);
}

function updateEtherLeakAvailability() {
    var v;
    var cached = localStorage.getItem("totalSupply");
    if (!nodeConnected) {
        v = cached ? cached : "Unknown";
        $("#totalSupply").html(v); 
    } else {
        contract.totalSupply(function(err,res) { 
            if (err) { 
                v = cached ? cached : "Unknown";
            } else {
                v = parseFloat(res)/tokenPrecision;
                localStorage.setItem("totalSupply", v);
            }  
            $("#totalSupply").html(v); 
        });
    }
    
    if (isNaN(balanceFEE)) return;

    if (balanceFEE>=sendAVLGasRequired_value*gasPrice && !loadedContract) 
    { $("#enoughFeesSendAVL").show(); } else { $("#enoughFeesSendAVL").hide(); }

    if (balanceFEE>=txgas*gasPrice && !directSend) 
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

function getNonce(callback) {
    if (addresses==null) return;

    var cached = localStorage.getItem("nonce"+loadedAddress());
    if (!nodeConnected) {
        if (cached!=null) localStorage.setItem("nonce"+loadedAddress(), 0);
    } else {
        web3.eth.getTransactionCount(loadedAddress(), function(error, nonce) {
            if (error) {
                if (cached==null) localStorage.setItem("nonce"+loadedAddress(), 0);
            } else {
                localStorage.setItem("nonce"+loadedAddress(), nonce);
            }
        });
    }
    callback();
}

function readNonce() { return localStorage.getItem("nonce"+loadedAddress()); }

function incrementNonce() {
    localStorage.setItem("nonce"+loadedAddress(), parseInt(localStorage.getItem("nonce"+loadedAddress())+1));
}

var directSend = false;
function sendEth() {
    if (addresses==null) { bootbox.alert(LANG_LOGIN_ERR_MSG); return; }

    $("#withdrawInfo").hide();

    var toAddr = $("#sendTo").val(); if (!validateETHAddress(toAddr)) return;
    var isContract = nodeConnected ? web3.eth.getCode(toAddr).length>2 : true;
    if (isContract) { directSend = true; txgas = 250000; } else { directSend = false; txgas = 60000; }

    var valueEth = $("#sendValueAmount").val();
    var value = parseFloat(web3.toWei(valueEth,"ether"));
    if (value==0 || isNaN(value)) { bootbox.alert(LANG_INVALID_AMOUNT_ERR_MSG); return; }
    
    $("#withdrawInfo").html(LANG_PLEASE_WAIT); $("#withdrawInfo").show();
    
    if (nodeConnected) {
        if (isContract) {
            txgas = web3.eth.estimateGas({from: loadedAddress(), to: toAddr, value: value, gas: gx, gasPrice: gasPrice, nonce: readNonce() });
        } else {
            txgas = contract.sendEther.estimateGas($("#sendTo").val(), {from: loadedAddress(), value: value, gas: gx, gasPrice: gasPrice, nonce: readNonce() });
        }
    }
    var totalFees = txgas*gasPrice;
    $("#sendEtherGasRequired").html((nodeConnected ? "" : "Much less than ") + web3.fromWei(totalFees, "ether"));

    if (value==balanceETH) { value = value - totalFees; }
    var totalSpent = value+totalFees;
    if (nodeConnected && totalSpent>balanceETH) { 
        bootbox.alert("Insufficient balance"); $("#withdrawInfo").hide(); return; 
    }
    var isRefunded = balanceFEE > totalFees;
    
    bootbox.confirm({
        message: LANG_SEND_ETHER_CONFIRM(web3.fromWei(value, "ether"), toAddr, isRefunded, web3.fromWei(totalFees, "ether"), web3.fromWei(totalSpent, "ether"), directSend),
        buttons: {
            confirm: { label: LANG_CONFIRM, className: 'btn-success' },
            cancel: { label: LANG_CANCEL, className: 'btn-danger' }
        },
        callback: function (result) {
            if (result) { 
                $("#withdrawInfo").hide();

                if (isContract) {
                    web3.eth.sendTransaction({from: loadedAddress(), to: toAddr, value: value, gasPrice: gasPrice, gas: txgas, nonce: readNonce() }, function (err, txhash) { 
                        if (err) { bootbox.alert(getFriendlyError(err.message)); $("#withdrawInfo").hide(); return; }
                        $("#withdrawInfo").html("<a target='_blank' href='"+API_URL+"/tx/"+txhash+"'>"+LANG_TRAN_SENT+"</a>");
                        setInfo(LANG_TRAN_HASH + ": <a target='_blank' href='"+API_URL+"/tx/"+txhash+"'>"+txhash+"</a>");
                        incrementNonce();
                    });
                } else {
                    contract.sendEther(toAddr, {from: loadedAddress(), value: value, gasPrice: gasPrice, gas: txgas, nonce: readNonce() }, function(err,txhash) { 
                        if (err) { bootbox.alert(getFriendlyError(err.message)); $("#withdrawInfo").hide(); return; }
                        $("#withdrawInfo").html("<a target='_blank' href='"+API_URL+"/tx/"+txhash+"'>"+LANG_TRAN_SENT+"</a>");
                        setInfo(LANG_TRAN_HASH + ": <a target='_blank' href='"+API_URL+"/tx/"+txhash+"'>"+txhash+"</a>");
                        incrementNonce();
                    });
                }
                $("#withdrawInfo").html(LANG_PLEASE_WAIT);
                $("#withdrawInfo").show();

            } else { $("#withdrawInfo").hide(); }
        }
    });
}

var leaked = false;
function leakEther() {
    if (leaked) { bootbox.alert("Only leaks once in 24 hours"); return; }
    if (addresses==null) { bootbox.alert(LANG_LOGIN_ERR_MSG); return; }

    if (balanceFEE==0) { bootbox.alert("No Goo balance available"); return; }
    
    if (nodeConnected) leakGas = contract.leakEther.estimateGas({from: loadedAddress(), value: 0, gas: gx, gasPrice: gasPrice });
    var totalFees = leakGas*gasPrice;
    if (nodeConnected && totalFees>balanceETH) { bootbox.alert(LANG_NO_ETH_FOR_FEES); return; }
    var leakAmount = balanceFEE / getHexAddressLevel(loadedAddress());
    var isRefunded = balanceFEE - leakAmount > totalFees;

    bootbox.confirm({
        message: LANG_LEAK_ETHER_CONFIRM(web3.fromWei(leakAmount), isRefunded, web3.fromWei(totalFees, "ether")),
        buttons: { confirm: { label: LANG_CONFIRM, className: 'btn-success' },
                   cancel: { label: LANG_CANCEL, className: 'btn-danger' } },
        callback: function (result) {
            if (result) { 
                contract.leakEther({from: loadedAddress(), value: 0, gas: leakGas, gasPrice: gasPrice, nonce: readNonce() }, function(err,txhash) { 
                    if (err) { bootbox.alert(getFriendlyError(err.message)); return; }
                    setInfo(LANG_TRAN_HASH + ": <a target='_blank' href='"+API_URL+"/tx/"+txhash+"'>"+txhash+"</a>");
                    incrementNonce();
                });
                leaked = true;
            }
        }
    });
}

function createTokens() {
    if (addresses==null) { bootbox.alert(LANG_NOT_LOGGED_SEND); return; }

    $("#createInfo").hide();

    var valueEth = parseFloat(web3.toWei($("#txtETHValue").val(),"ether"));
    if (valueEth < 10000000000000000) {
        bootbox.alert(LANG_CREATE_AVL_LOW_AMOUNT);
        return;
    }
    var unitPrice = PIECE_PRICE * (getHexAddressLevel(loadedAddress()) + 1);
    $("#createInfo").html(LANG_PLEASE_WAIT); $("#createInfo").show();

    if (nodeConnected) createAVLGasRequired_value = web3.eth.estimateGas({from: loadedAddress(), to: contractAddr, value: valueEth, gasPrice: gasPrice, gas: gx });

    var totalFees = createAVLGasRequired_value*gasPrice;
    $("#createAVLGasRequired").html(web3.fromWei(totalFees, "ether"));
    var totalSpent = valueEth+totalFees;
    if (nodeConnected && totalSpent>balanceETH) { 
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
                $("#createInfo").hide();
                web3.eth.sendTransaction({from: loadedAddress(), to: contractAddr, value: valueEth, gasPrice: gasPrice, gas: createAVLGasRequired_value, nonce: readNonce() }, function (err, txhash) { 
                    if (err) { bootbox.alert(getFriendlyError(err.message)); $("#createInfo").hide(); return; }
                    $("#createInfo").html("<a target='_blank' href='"+API_URL+"/tx/"+txhash+"'>"+LANG_TRAN_SENT+"</a>");
                    setInfo(LANG_TRAN_HASH+": <a target='_blank' href='"+API_URL+"/tx/"+txhash+"'>"+txhash+"</a>");
                    incrementNonce();
                });
                $("#createInfo").html(LANG_PLEASE_WAIT);
                $("#createInfo").show();
            } else { $("#createInfo").hide(); }
        }
    });
}

function sendTokens() {
    if (addresses==null) { bootbox.alert(LANG_LOGIN_ERR_MSG); return; }
    
    $("#sendInfo").hide();

    var activeContract = loadedContract ? loadedContract : contract;
    var activePrecision = loadedContract ? Math.pow(10, parseFloat($loadedToken.attr("decimals"))) : tokenPrecision;

    var toAddr = $("#sendAVLTo").val(); if (!validateETHAddress(toAddr)) return;

    var valueAVL = parseFloat($("#txtAVLValue").val()) * activePrecision;
    if (nodeConnected && valueAVL==0) { bootbox.alert(LANG_INVALID_AMOUNT_ERR_MSG); return; }
    if (nodeConnected && valueAVL > (loadedContract ? readLoadedTokenBalance() : balanceAVL)) 
    { bootbox.alert(LANG_NO_AVL); return; }

    $("#sendInfo").html(LANG_PLEASE_WAIT); $("#sendInfo").show();

    if (nodeConnected) sendAVLGasRequired_value = activeContract.transfer.estimateGas($("#sendAVLTo").val(), valueAVL, {from: loadedAddress(), value: 0, gas: gx, gasPrice: gasPrice});
    var totalFees = sendAVLGasRequired_value*gasPrice;
    $("#sendAVLGasRequired").html(web3.fromWei(totalFees, "ether"));

    if (nodeConnected && totalFees>balanceETH) { 
        bootbox.alert(LANG_NO_ETH_FOR_FEES); 
        $("#sendInfo").hide();
        return; 
    }

    var isRefunded = loadedContract ? false : balanceFEE > totalFees;
    
    bootbox.confirm({
        message: LANG_SEND_AVL_CONFIRM(valueAVL/activePrecision, toAddr, isRefunded, totalFees, loadedContract ? $loadedToken.attr("symbol") : "AVL"),
        buttons: { confirm: { label: LANG_CONFIRM, className: 'btn-success' },
                   cancel: { label: LANG_CANCEL, className: 'btn-danger' } },
        callback: function (result) {
            if (result) { 
                $("#sendInfo").hide();
                activeContract.transfer($("#sendAVLTo").val(), valueAVL, {from: loadedAddress(), value: 0, gas: sendAVLGasRequired_value, gasPrice: gasPrice, nonce: readNonce() }, function(err,txhash) {
                    if (err) { bootbox.alert(getFriendlyError(err.message)); $("#sendInfo").hide(); return; }
                    $("#sendInfo").html("<a target='_blank' href='"+API_URL+"/tx/"+txhash+"'>"+LANG_TRAN_SENT+"</a>"); 
                    setInfo(LANG_TRAN_HASH + ": <a target='_blank' href='"+API_URL+"/tx/"+txhash+"'>"+txhash+"</a>");
                    incrementNonce();
                });
                $("#sendInfo").html(LANG_PLEASE_WAIT);
                $("#sendInfo").show();
            } else { $("#sendInfo").hide(); }
        }
    });
}

var mouseEntropy = "";
var mouseRand="", timeRand, last_mouseRand, evop;

$(document).on("mousemove mousedown click", function( e ) {
  mouseRand = e.pageX*e.pageY; 
  if (last_mouseRand==null) last_mouseRand = mouseRand;
  if (evop==1) $(document).off("mousemove");
  last_mouseRand = mouseRand;
});

function timeCycle() {
    if (addresses!=null) return;
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
        setTimeout("timeCycle();",300+Math.floor(Math.random()*300));
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
    setTimeout("timeCycle2();",mining ? 300+Math.floor(Math.random()*300) : 1000);
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

var pwdHash;

function newWallet() {
    var extraEntropy = web3.sha3(mouseEntropy.toString());
    var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);

    loadWalletStart();

    var infoString = LANG_CREATE_WALLET_PROMPT(randomSeed);
    bootbox.prompt({
        title: infoString,
        inputType: 'password',
        callback: function (result) {
            if (result==null) { loadWalletCancel(); return; }
            pwdHash = web3.sha3(result);

            lightwallet.keystore.createVault({
                seedPhrase: randomSeed,
                password: result,
                hdPathString: DERIVATION_PATH,
                salt: result
            }, function (err, ks) {
                ks.keyFromPassword(result, function (err, pwDerivedKey) {
                    if (err) { throw err; }

                    ks.passwordProvider = function (pwcallback) {
                        bootbox.prompt({
                            title: LANG_ENTER_PASSWORD_TO_UNLOCK,
                            inputType: 'password',
                            callback: function (res) {
                                if (res==null) { passwordCancel(); return; }
                                if (web3.sha3(res)!=pwdHash) { 
                                    passwordCancel();
                                    bootbox.alert("Incorrect password, try again");
                                    return;
                                }
                                pwcallback(null, res);
                            }
                        });
                    };
                    global_keystore = ks;
                    setWeb3Provider(global_keystore);
                    newAddresses(pwDerivedKey);
                    loadWalletEnd();
                });
            });
        }
    });
}

function setSeed() {
    if ($("#seed").val().split(" ").length!=12) {
        bootbox.alert("Invalid seed"); return;
    }

    loadWalletStart();

    var infoString = LANG_ENTER_PASSWORD_TO_ENCRYPT;
    bootbox.prompt({
        title: infoString,
        inputType: 'password',
        callback: function (result) {
            if (result==null) { loadWalletCancel(); return; }
            pwdHash = web3.sha3(result);

            lightwallet.keystore.createVault({
                seedPhrase: $("#seed").val(),
                password: result,
                hdPathString: DERIVATION_PATH,
                salt: result
            }, function (err, ks) {
                ks.keyFromPassword(result, function (err, pwDerivedKey) {
                    if (err) { throw err; }

                    ks.passwordProvider = function (pwcallback) {
                        bootbox.prompt({
                            title: LANG_ENTER_PASSWORD_TO_UNLOCK,
                            inputType: 'password',
                            callback: function (res) {
                                if (res==null) { passwordCancel(); return; }
                                if (web3.sha3(res)!=pwdHash) { 
                                    passwordCancel();
                                    bootbox.alert("Incorrect password, try again");
                                    return;
                                }
                                pwcallback(null, res);
                            }
                        });
                    };
                    global_keystore = ks;
                    setWeb3Provider(global_keystore);
                    newAddresses(pwDerivedKey);
                    loadWalletEnd();
                });
            });
        }
    });
}

function loadWalletStart() {
    $(".my .above").css("visibility", "hidden");
    $(".my .spinner").show();
    $("#cmdNewWallet").hide();
    $(".my.sec .comment").hide();
    $("#walletLoader > *").hide();
    $("#logOut").show();
    $(".entgen").css("visibility", "hidden");
}
function loadWalletEnd() {
    $("#halt").css("visibility", "visible");
    $(document).off("mousemove");
    $(".info").show();
    $("#cmdNewWallet").hide();
    $(".entgen").css("visibility", "visible");
    timeCycle2();
}
function loadWalletCancel() {
    $(".my .above").css("visibility", "visible");
    $(".my .spinner").hide();
    $("#cmdNewWallet").show();
    $(".my.sec .comment").show();
    $("#walletLoader > *").show();
    $("#logOut").hide();
    $(".entgen").css("visibility", "visible");
}
function passwordCancel() {
    $("#createInfo").html(""); $("#withdrawInfo").html(""); $("#sendInfo").html("");
}

function newAddresses(pwDerivedKey) {
    evop=1;
    updateEntLabel();
    $("#accsec").show();
    global_keystore.generateHardAddress(pwDerivedKey);
}
var addAccountNo;

function switchToAccount(idx,hdidx) {
    leaked = false;
    if (nodeConnected) {
        gasPrice = parseFloat(web3.eth.gasPrice) + 2000000000;
        localStorage.setItem("gasPrice", gasPrice);
    } else {
        var cached = localStorage.getItem("gasPrice");
        gasPrice = cached ? cached : gasPrice;
    }
    $("#createAVLGasRequired").html((nodeConnected ? "" : "~ ") + web3.fromWei(createAVLGasRequired_value*gasPrice, "ether"));
    $("#sendAVLGasRequired").html((nodeConnected ? "" : "~ ") + web3.fromWei(sendAVLGasRequired_value*gasPrice, "ether"));
    $("#sendEtherGasRequired").html((nodeConnected ? "" : "~ ") + web3.fromWei(txgas*gasPrice, "ether"));
    
    loaded_address_index=parseInt(idx);
    $("#queryBalance").hide();
    watchBalance(true);
    $("#addr").html(loadedAddress());
    $("#addr").attr("href", API_URL+"/address/"+loadedAddress());
    $("#addressdepth").html("Depth: "+getHexAddressLevel(loadedAddress()));
    $("#addressdepth").show();
    $(".my.sec h3").html(hdidx == 0 ? "Main Account" : "Account #"+hdidx);
    $(".my.sec .comment").hide();
    qrCodeObject.makeCode("ethereum:"+$("#addr").html());
    updateEntLabel();
    if (!nodeConnected) { $("#sync").css("visibility","visible"); } else { $("#sync").css("visibility","hidden"); }
    createLargeQRCode(JSON.stringify({ "address": loadedAddress(), "contract": (loadedContract ? $loadedToken.attr("contract") : null) }));
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
function finishedGenerating(hdidx, addrLevel, forceSwitch,pwDerivedKey) {
    document.getElementById('seed').value = "";
    addresses = global_keystore.getAddresses();
    if (hdidx==0 || forceSwitch) switchToAccount(totalGenerated,hdidx);
    if (mining_level==256) {
        mining_level = addrLevel<BASE_ADDR_LEVEL ? addrLevel : BASE_ADDR_LEVEL;
        if (totalGenerated==0) watchBalance();
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
    if (totalGenerated==0) {
        $(".my .above").css("visibility", "visible");
        $(".my .spinner").hide();
    }
    totalGenerated++;
    updateEntLabel();
    if (forceSwitch) {
        setTimeout(function() { global_keystore.generateHardAddress(pwDerivedKey); }, mining_intensity);
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

function broadcastRawTx(rawtx) {
    web3.eth.sendRawTransaction(rawtx, function(err, res) {
        if (err) { bootbox.alert("Transaction not broadcasted ("+err.message+")"); return; }
        bootbox.alert("Transaction broadcasted: "+ res);
    });
}

function getNodeStatus() {
    web3.eth.getBlockNumber(function(error, result) {
        if (error) {
            $("#nodestatus").html("Offline mode");
            nodeConnected = false;
            updateEtherLeakAvailability();
        } else {
            web3.eth.isSyncing(function(error, sync){
                if (error==null) {
                    if (sync === true) {
                        web3.reset(true);
                    } else if (sync) {
                        var prc = parseInt(parseFloat(sync.currentBlock) / parseFloat(sync.highestBlock) * 100);
                        $("#nodestatus").html("Syncing: "+prc+ "%");
                        nodeConnected = true;
                    } else if (parseInt(web3.eth.blockNumber)==0) {
                        $("#nodestatus").html("Node loading");
                        nodeConnected = false;
                    } else {
                        $("#nodestatus").html("<a id='assistoffline'>Assist an offline device</a>");
                        $("#assistoffline").on("click", function() { scanAssistanceRequest(); });
                        nodeConnected = true;
                    }
                } else {
                    $("#nodestatus").html("Node down");
                    nodeConnected = false;
                }
            });
            updateEtherLeakAvailability();
        }
    });
}
