var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
var contract = web3.eth.contract(abi).at(contractAddr);

var addresses;
var balanceFBT,balanceETH,balanceFEE;

var tokenBought; //event
var Transfer; //event
var etherSent; //event

var working = false;
var mining=true;
var mining_intensity = 0;
var mining_level = 256;

var loaded_address_index=0;

var getBalances = function() { 
    getBalance(); 
};

function watchBalance(once) {
    getBalances(loaded_address_index);
    if (!once) setTimeout(function() { watchBalance(); }, 12000);
}

function getBalance() {
    contract.balanceOf("0x"+addresses[loaded_address_index], function(err,res) {
        balanceFBT = parseFloat(res);        
        $("#queryBalance .result").html("<b>FBT</b>: " +balanceFBT/tokenPrecision);
        $("#queryBalance .result").show();
    });
    web3.eth.getBalance(addresses[loaded_address_index], function(err,res) {
        balanceETH = parseFloat(res);
        $("#queryBalance .result2").html("<b>ETH</b>: "+web3.fromWei(balanceETH,"ether"));
        $("#queryBalance .result2").show();
    });
    contract.feeBank("0x"+addresses[loaded_address_index],function(err,res) {
        balanceFEE = parseFloat(res);
        showInfo();
    })
    $("#queryBalance").show();
    $("#FBTPrice").html(web3.fromWei(pieceprice * getHexAddressLevel(addresses[loaded_address_index]),"ether"));
}

function showInfo() {
    contract.totalSupply(function(err,res) {
        $("#totalSupply").html(parseFloat(res)/tokenPrecision + " FBT");
    });
    if (isNaN(balanceFEE)) return;
    if (balanceFEE>=buyTokensGasRequired_value*gasPrice) 
    { $("#enoughFeesCreateFBT").show(); } else { $("#enoughFeesCreateFBT").hide(); }
    if (balanceFEE>=sendTokensGasRequired_value*gasPrice) 
    { $("#enoughFeesSendFBT").show(); } else { $("#enoughFeesSendFBT").hide(); }
    if (balanceFEE>=txgas*gasPrice) 
    { $("#enoughFeesSendEther").show(); } else { $("#enoughFeesSendEther").hide(); }
    if (balanceFEE>=200000*gasPrice) {
        $("#topinfo").html("Leak some ether");
        $("#topinfo").off("click");
        $("#topinfo").on("click",function() { leakEther(); });
    } else {
        $("#topinfo").html("Create a frostbyte to receive fee refunds");
        $("#topinfo").off("click");
    }
}
var login_err_msg = "Please create an address or login";
var address_err_msg = "Invalid ETH address";
var zero_err_msg = "Value must be greater than zero";

function sendEth() {
    if (working) { bootbox.alert("Please wait for pending operation to complete"); return; }
    if (!addresses) { bootbox.alert(login_err_msg); return; }
    if (!etherSent) {
        etherSent = contract.etherSent(function(error, result) {
            if (error) { alert(error); return; }

            var receipt = web3.eth.getTransactionReceipt(result.transactionHash);
            if (receipt==null) return;
            var fees = parseFloat(receipt.gasUsed)*gasPrice;
            $("#withdrawInfo").html("Sent "+web3.fromWei(value,"ether")+ " ETH to specified address"); // with "+web3.fromWei(fees, "ether")+" fees"
            working = false;
            watchBalance(true);
        });        
    }
    var toAddr = $("#sendTo").val();
    if (!web3.isAddress(toAddr)) { bootbox.alert(address_err_msg); return; }
    var valueEth = $("#sendValueAmount").val();
    var value = parseFloat(web3.toWei(valueEth,"ether"));
    if (value==0) { bootbox.alert(zero_err_msg); return; }
    $("#withdrawInfo").html("Please wait...");
    $("#withdrawInfo").show();
    var siName = "nonce_" + addresses[0] + "_" + toAddr + "_" + value;
    var gn = localStorage.getItem(siName);
    if (!gn) { localStorage.setItem(siName, 0); gn = 0; } else { gn = parseInt(gn); }
    var success = false;
    working = true;
    
    while (!success) {
        var rn = web3.toHex(gn);
        try {
            txgas = contract.sendEther.estimateGas($("#sendTo").val(), {from: "0x"+addresses[loaded_address_index], value: value, gas: txgas, gasPrice: gasPrice, nonce: rn});
            success = true;
        } catch(ex) {}
        gn++; localStorage.setItem(siName, gn);
    }

    $("#sendEtherGasRequired").html(web3.fromWei(txgas*gasPrice, "ether"));
    if (value+txgas*gasPrice>balanceETH) { 
        bootbox.alert("Insufficient balance"); 
        $("#withdrawInfo").hide(); working = false;
        return; 
    }
    
    bootbox.confirm({
        message: "You are sending " + valueEth + " ETH to " + toAddr + "<br/>Fees"+(balanceFEE > 200000*gasPrice ? " (refunded)" : "")+": " + web3.fromWei(txgas*gasPrice, "ether") + " ETH<br/><b>Total: "+ web3.fromWei(value+txgas*gasPrice, "ether") + " ETH</b>",
        buttons: {
            confirm: {
                label: 'Confirm',
                className: 'btn-success'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) { 
                working = true;
                $("#withdrawInfo").hide();
                contract.sendEther($("#sendTo").val(), {from: "0x"+addresses[loaded_address_index], value: value, gas: txgas, gasPrice: gasPrice, nonce: rn}, function(err,res) { });
                $("#withdrawInfo").show();
            } else { working = false; $("#withdrawInfo").hide(); }
        }
    });
}

function leakEther() {
    if (working) { bootbox.alert("Please wait for pending operation to complete"); return; }
    if (!addresses) { bootbox.alert(login_err_msg); return; }
    var siName = "nonce_" + addresses[0] + "_leak";
    var gn = localStorage.getItem(siName);
    if (!gn) { localStorage.setItem(siName, 0); gn = 0; } else { gn = parseInt(gn); }
    var success = false;
    var leakGas;

    while (!success) {
        var rn = web3.toHex(gn);
        try {
            leakGas = contract.refundFees.estimateGas({from: "0x"+addresses[loaded_address_index], value: 0, gas: txgas, gasPrice: gasPrice, nonce: rn});
            success = true;
        } catch(ex) {}
        gn++; localStorage.setItem(siName, gn);
    }

    if (leakGas*gasPrice>balanceETH) { 
        bootbox.alert("Insufficient ETH balance for fees"); 
        return; 
    }
    
    bootbox.confirm({
        message: "You'll receive " + web3.fromWei(200000*gasPrice) + " ETH<br/>Fees: " + web3.fromWei(leakGas*gasPrice, "ether") + " ETH",
        buttons: {
            confirm: {
                label: 'Confirm',
                className: 'btn-success'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) { 
                contract.refundFees({from: "0x"+addresses[loaded_address_index], value: 0, gas: leakGas, gasPrice: gasPrice, nonce: rn}, function(err,res) { });
            }
        }
    });
}

function buyTokens() {
    if (working) { bootbox.alert("Please wait for pending operation to complete"); return; }
    if (!addresses) { bootbox.alert("You may send this amount directly to the contract address, or create an ethereum wallet to pay lower prices."); return; }
    if (balanceFBT>0) { bootbox.alert("Please move your existing FBT to another account prior to creating a new batch."); return; }
    if (!tokenBought) {
        tokenBought = contract.tokenBought(function(error, result) {
            if (error) { alert(error); return; }

            var receipt = web3.eth.getTransactionReceipt(result.transactionHash);
            if (receipt==null) return;
            var fees = parseFloat(receipt.gasUsed)*gasPrice;
            var bought = parseFloat(result.args.totalTokensBought);
            var boughtfor = parseFloat(result.args.Price);
            $("#buyInfo").html("Bought "+(bought/tokenPrecision)+" FBT for "+web3.fromWei(boughtfor,"ether")+" ether"); // with "+web3.fromWei(fees, "ether")+" fees"
            working = false;
            watchBalance(true);
        });        
    }
    var valueEth = parseFloat(web3.toWei($("#txtETHValue").val(),"ether"));
    if (valueEth==0) return;
    var unitPrice = pieceprice * getHexAddressLevel(addresses[loaded_address_index]);
    if (valueEth<unitPrice) {
        bootbox.alert("Must create at least one unit"); return;
    }

    $("#buyInfo").html("Please wait...");
    $("#buyInfo").show();

    var siName = "nonce_" + addresses[0] + "_" + valueEth;
    var gn = localStorage.getItem(siName);
    if (!gn) { localStorage.setItem(siName, 0); gn = 0; } else { gn = parseInt(gn); }
    var success = false;
    working = true;
    
    while (!success) {
        var rn = web3.toHex(gn);
        try {
            buyTokensGasRequired_value = web3.eth.estimateGas({from: "0x"+addresses[loaded_address_index], to: contractAddr, value: valueEth, gasPrice: gasPrice, gas: buyTokensGasRequired_value, nonce: rn});
            success = true;
        } catch(ex) {}
        gn++; localStorage.setItem(siName, gn);
    }

    $("#buyTokensGasRequired").html(web3.fromWei(buyTokensGasRequired_value*gasPrice, "ether"));
    if (valueEth+buyTokensGasRequired_value*gasPrice>balanceETH) { 
        bootbox.alert("Insufficient balance");
        working = false; $("#buyInfo").hide();
        return; 
    }
    
    bootbox.confirm({
        message: "You are creating frostbytes with " + valueEth + " ETH<br/>Fees"+(balanceFEE > 200000*gasPrice ? " (refunded)" : "")+": " + web3.fromWei(buyTokensGasRequired_value*gasPrice, "ether") + " ETH<br/><b>Total: "+ web3.fromWei(valueEth+buyTokensGasRequired_value*gasPrice, "ether") + " ETH</b>",
        buttons: {
            confirm: {
                label: 'Confirm',
                className: 'btn-success'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) { 
                working = true;
                $("#buyInfo").hide();
                web3.eth.sendTransaction({from: "0x"+addresses[loaded_address_index], to: contractAddr, value: valueEth, gasPrice: gasPrice, gas: buyTokensGasRequired_value}, function (err, txhash) { });
                $("#buyInfo").show();
            } else { working = false; $("#buyInfo").hide(); }
        }
    });


}

function sendTokens() {
    if (working) { bootbox.alert("Please wait for pending operation to complete"); return; }
    if (!addresses) { bootbox.alert(login_err_msg); return; }
    var toAddr = $("#sendFBTTo").val();
    if (!web3.isAddress(toAddr)) { bootbox.alert(address_err_msg); return; }
    if (!Transfer) {
        Transfer = contract.Transfer(function(error, result) {
            if (error) { alert(error); return; }

            var receipt = web3.eth.getTransactionReceipt(result.transactionHash);
            if (receipt==null) return;
            var fees = parseFloat(receipt.gasUsed)*gasPrice;
            $("#sendInfo").html("Sent "+$("#txtFBTValue").val()+" FBT to specified address"); //  with "+web3.fromWei(fees, "ether")+" ETH fees
            working = false;
            watchBalance(true);
        });        
    }

    var valueFBT = parseFloat($("#txtFBTValue").val()) * tokenPrecision;
    if (valueFBT==0) { bootbox.alert(zero_err_msg); return; }
    if (valueFBT>balanceFBT) { bootbox.alert("Insufficient FBT balance"); return; }

    $("#sendInfo").html("Please wait...");
    $("#sendInfo").show();

    var siName = "nonce_" + addresses[0] + "_" + toAddr + "_" + valueFBT;
    var gn = localStorage.getItem(siName);
    if (!gn) { localStorage.setItem(siName, 0); gn = 0; } else { gn = parseInt(gn); }
    var success = false;
    working = true;
    
    while (!success) {
        var rn = web3.toHex(gn);
        try {
            sendTokensGasRequired_value = contract.transfer.estimateGas($("#sendFBTTo").val(), valueFBT, {from: "0x"+addresses[loaded_address_index], value: 0, gas: sendTokensGasRequired_value, gasPrice: gasPrice});
            success = true;
        } catch(ex) {}
        gn++; localStorage.setItem(siName, gn);
    }

    $("#sendTokensGasRequired").html(web3.fromWei(sendTokensGasRequired_value*gasPrice, "ether"));
    if (sendTokensGasRequired_value*gasPrice>balanceETH) { 
        bootbox.alert("Insufficient ETH balance for fees"); 
        working = false; $("#sendInfo").hide();
        return; 
    }
    
    bootbox.confirm({
        message: "You are sending " + (valueFBT/tokenPrecision) + " FBT to " + toAddr + "<br/>Fees"+(balanceFEE > 200000*gasPrice ? " (refunded)" : "")+": " + web3.fromWei(sendTokensGasRequired_value*gasPrice, "ether") + " ETH",
        buttons: {
            confirm: {
                label: 'Confirm',
                className: 'btn-success'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) { 
                working = true;
                $("#sendInfo").hide();
                contract.transfer($("#sendFBTTo").val(), valueFBT, {from: "0x"+addresses[loaded_address_index], value: 0, gas: sendTokensGasRequired_value, gasPrice: gasPrice}, function(err,res) {});
                $("#sendInfo").show();
            } else { working = false; $("#sendInfo").hide(); }
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

function newWallet() {
    var extraEntropy = mouseEntropy.toString(); 
    var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);

    var infoString = 'Your wallet seed:<br/><br/><span style="font-size:1.2em">' + randomSeed + '</span><br/><br/>Please write down your wallet seed in a safe place and enter a password to encrypt your seed in the browser:';
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
    var infoString = "Enter a password to encrypt your seed in the browser:";
    $("#cmdNewWallet").hide();
    $(".my.sec .comment").hide();
    $("#walletLoader > *").hide();
    $("#logOut").show();
    bootbox.prompt({
        title: infoString,
        inputType: 'password',
        callback: function (result) {
            if (!result) {
                $("#cmdNewWallet").show();
                $(".my.sec .comment").show();
                return;
            }
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
    $("#queryBalance .result, #queryBalance .result2").hide();
    watchBalance(true);
    $("#addr").html("0x"+addresses[loaded_address_index]);
    $("#addr").attr("href", "https://etherscan.io/address/0x"+addresses[loaded_address_index]);
    $("#addressdepth").html("Depth: "+getHexAddressLevel(addresses[loaded_address_index]));
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
    // get address level, set mining_level
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
        mining_level = addrLevel<180 ? addrLevel : 180;
        watchBalance();
    } else {
        if (addrLevel<mining_level) {
            var gained = mining_level-addrLevel;
            mining_level=addrLevel;
            if (mining_intensity<1000) {
                mining_intensity+=10*gained;
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
    if (mining) {
        $(".entlabel").html("Mining addresses at depth "+(mining_level) + ", intensity " + intprc + "%");
    } else {
        $(".entlabel").html("Mining halted");
    }
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
    bootbox.alert('Address "'+$("#addr").html()+'" copied to clipboard');
  } catch (err) {
    bootbox.alert('Clipboard not accessible');
  }

  document.body.removeChild(textArea);
}

