var synchronizingOffline = false;
var scanner, camera;
var qrCodeObject, qrCodeLargeObject;

function requestAssistance(data, caption) {
    window.requestAnimationFrame(function() {
        $("#createInfo").html(""); $("#withdrawInfo").html(""); $("#sendInfo").html("");
        $("#assist").html(caption ? caption : "Online device assistance required");
        showLargeQRCode(data);
    });
}

var requestScanner;
var requestCamera;
function scanAssistanceRequest() {
    hideLargeCamera();
    requestScanner = new Instascan.Scanner({ video: document.getElementById("largePrv") });

    $("#largePrv").on("click", function() {
        hideLargeCamera(); $("#largePrv").off("click");
    });
    
    requestScanner.addListener('scan', function (content) {
        hideLargeCamera();
        var json = isJson(content);
        if (json) { 
            if (json.A!=null) { assistOfflineWallet(json); } 
            else { bootbox.alert("Invalid assistance request"); }
        } else { broadcastRawTx(content); }
    });

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            requestCamera = cameras[0];
            requestScanner.start(requestCamera).then(function() { showLargeCamera(); });
        } else {
            bootbox.alert('No cameras found');
            hideLargeCamera(0);
        }
    }).catch(function (e) { hideLargeCamera();bootbox.alert(e); });
}

function assistOfflineWallet(ow) {
    // avl, eth, goo, loaded token, nonce, incirculation, gasprice, address 4 bytes
    var response = {"A":null,"E":null,"G":null,"T":null,"N":null,"I":null,"P":null,"X":ow.A.substr(34,8)};
    var step = 0;

    function updateProgress() { step++; $("#assist").html("Retrieved "+step+"/7"); }

    tokenBalanceReader.getTokenBalance(ow.A, ow.C ? ow.C : contractAddr, function(err,res) { updateProgress();
        if (err==null && ow.C) response.T = parseFloat(res);     
        
        requestAssistance(null, "Initiating sequence...");

        contract.balanceOf(ow.A, function(err,res) { updateProgress();
            if (err) { errHandler(e); return; }
            else { response.A = parseFloat(res); }
            
            web3.eth.getBalance(ow.A, function(err,res) { updateProgress();
                if (err) { errHandler(e); return; }
                else { response.E = parseFloat(res); }

                contract.gooBalanceOf(ow.A,function(err,res) { updateProgress();
                    if (err) { errHandler(e); return; }
                    else { response.G = parseFloat(res); }

                    web3.eth.getTransactionCount(ow.A, function(error, nonce) { updateProgress();
                        if (err) { errHandler(e); return; }
                        else { response.N = parseInt(res); }

                        contract.totalSupply(function(err,res) { updateProgress();
                            if (err) { errHandler(e); return; }
                            else { response.I = parseFloat(res); }  
                            
                            response.P = web3.eth.gasPrice; updateProgress();

                            showLargeQRCode(JSON.stringify(response).replace(/\s/g,''));
                            $("#assist").html("Ready for scan by offline device");
                        });                        
                    });
                });
            });
        });
    });

    function errHandler(e) { bootbox.alert(e.message); hideOverlay(); }
}

function synchronizeData(data) {
    // avl, eth, goo, loaded token, nonce, incirculation, gasprice, address 4 bytes
    localStorage.setItem("totalSupply", parseFloat(data.I)/tokenPrecision);
    gasPrice = parseFloat(data.P);
    localStorage.setItem("balanceFEE"+loadedAddress(), parseFloat(data.G));
    localStorage.setItem("balanceAVL"+loadedAddress(), parseFloat(data.A));
    localStorage.setItem("balanceETH"+loadedAddress(), parseFloat(data.E));
    localStorage.setItem("nonce"+loadedAddress(), parseInt(data.N));
    if (loadedContract) localStorage.setItem("tokenbalance_"+loadedAddress()+"_"+$loadedToken.attr("contract"), data.T);
    watchBalance(true);
    bootbox.alert("Synchronization completed for address " + loadedAddress());
}

function initQRCodes() {
    createLargeQRCode("ethereum:"+$("#addr").html());

    $("#qrCode").on("click",function() {
        $("#assist").html("ethereum:"+$("#addr").html());
        showLargeQRCode("ethereum:"+$("#addr").html());
    });

    $("#addr, .addr").html(contractAddr);
    $("#addr, .addr").attr("href", API_URL + "/address/"+contractAddr);
    $("#qrCode").html("");

    qrCodeObject = new QRCode(
        document.getElementById("qrCode"), 
        {
            text: "ethereum:"+contractAddr,
            width: 140, height: 140, colorDark : "#000000", colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        }
    );

    $("#qrCode").show();
}

function showLargeQRCode(data) {
    if (data) { createLargeQRCode(data); $("#qrCodeLarge").show(); }
    showOverlay();
}
function createLargeQRCode(data) {
    if (qrCodeLargeObject==null) {
        qrCodeLargeObject = new QRCode(
            document.getElementById("qrCodeLarge"), 
            {
                text: data,
                width: 512, height: 512, colorDark : "#000000", colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            }
        );
    } else { qrCodeLargeObject.makeCode(data); }
}

var responseScanner;
var responseCamera;
function hideLargeQRCode() {
    hideOverlay(); $("#qrCodeLarge").hide();

    if (synchronizingOffline) {
        synchronizingOffline = false;
        hideLargeCamera();
        responseScanner = new Instascan.Scanner({ video: document.getElementById("largePrv") });

        $("#largePrv").on("click", function() {
            hideLargeCamera(); $("#largePrv").off("click");
        });

        responseScanner.addListener('scan', function (content) {
            hideLargeCamera();
            var json = isJson(content);
            if (json) {
                if (json.A!=null && json.E!=null && json.G!=null && json.N!=null && json.I!=null && json.P!=null) {
                    if (json.X == loadedAddress().substr(34, 8)) {
                        synchronizeData(json);
                    } else { bootbox.alert("Address mismatch"); }
                } else { bootbox.alert("Invalid synchronization data"); }
            } 
        });

        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                responseCamera = cameras[0];
                responseScanner.start(responseCamera).then(function() { showLargeCamera(); });
            } else { bootbox.alert('No cameras found'); hideLargeCamera(); }
        }).catch(function (e) { bootbox.alert(e.message); hideLargeCamera(); });
    }
}

function setQRScanner() {
    $(".qrcode").on("click",function() {
        var qrcmd = $(this); var prv = qrcmd.parent().parent().find(".preview");
        var prvid = $(prv).attr("id"); var inp = qrcmd.parent().find(".to input");
        var form = qrcmd.parent().find(".form"); var h3 = qrcmd.parent().find("h3");

        if (scanner) {
            scanner.stop(camera); scanner = null; $(prv).hide();$(form).show();$(h3).show();
            $(".qrcode").show(); updateSyncOptions(); return;
        }

        scanner = new Instascan.Scanner({ video: document.getElementById(prvid) });

        scanner.addListener('scan', function (content) {
            var cparts = content.split(":");
            $(inp).val(cparts[cparts.length==2 ? 1 : 0]);
            $(prv).hide();$(form).show();$(h3).show();
            scanner.stop(camera); scanner = null;
            $(".qrcode").show(); updateSyncOptions();
        });

        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                camera = cameras[0];
                scanner.start(camera).then(function() {
                    $(prv).show();$(form).hide();$(h3).hide();
                    $(".qrcode").hide();$(qrcmd).show();
                    hideSyncOptions();
                });
            } else {
                bootbox.alert('No cameras found');
                $(prv).hide();$(form).show();$(h3).show();
                $(".qrcode").show(); updateSyncOptions();
            }
        }).catch(function (e) {
            bootbox.alert(e);
            $(prv).hide();$(form).show();$(h3).show();
            $(".qrcode").show(); updateSyncOptions();
        });
    });
}

function showOverlay() { $("#overlay").show(); $("html, body").css("overflow-y", "hidden"); adjustWidth(); }
function hideOverlay() { $("#overlay").hide(); $("html, body").css("overflow-y", "initial"); adjustWidth(); }

function showLargeCamera() { $("#largePrv").show(); $("html, body").css("overflow-y", "hidden"); adjustWidth(); }
function hideLargeCamera() { 
    $("#largePrv").hide(); $("html, body").css("overflow-y", "initial"); adjustWidth(); 
    try { requestScanner.stop(requestCamera); requestScanner=null; requestCamera = null; } catch(ex) { requestScanner=null; requestCamera = null; }
    try { responseScanner.stop(responseCamera); responseScanner=null; responseCamera = null; } catch(ex) { responseScanner=null; responseCamera = null; }
}

function updateSyncOptions() { if (!nodeConnected) $("#sync").css("visibility", "visible"); }
function hideSyncOptions() { $("#sync").css("visibility", "hidden"); }