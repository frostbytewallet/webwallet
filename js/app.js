$(window).on("load", function() {
    initEntropyGenerator();
    initGUI();
    setQRScanner();
    initQRCodes();
    timeCycle();
    loadLanguage();  
});

var nodeConnected = false;
$(document).ready(function() {
    $("body").show();
    loadContent();
    confirmTerms();    

    try {
        var syncing = web3.eth.syncing;
        if (syncing==false && parseInt(web3.eth.blockNumber)==0) {
            $("#nodestatus").html("Node self-maintenance");
        } else {
            web3.eth.isSyncing(function(error, sync){
                if (!error) {
                    if (sync === true) {
                    web3.reset(true);
                    } else if (sync) {
                        var prc = parseInt(parseFloat(sync.currentBlock) / parseFloat(sync.highestBlock) * 100);
                        $("#nodestatus").html("Syncing: "+prc+ "%");
                        nodeConnected = true;
                        updateEtherLeakAvailability();  
                    } else if (parseInt(web3.eth.blockNumber)==0) {
                        $("#nodestatus").html("Node syncing");
                    } else {
                        $("#nodestatus").html("");
                    }
                } else {
                    $("#nodestatus").html("Node down");
                }
            });
        }
    } catch(ex) {
        $("#nodestatus").html("Node down");
    }
});

function loadContent() {
    var wh = window.location.hash;
    if (wh.length>1) { loadSection(wh.substr(1,wh.length-1)); }
    else { loadSection("wallet"); }
}

$(window).on("resize", function() { adjustWidth(); });

var currentScale=100;
function adjustWidth() {
    var n = 100/(1020/$("body").width());
    if (n<100) n = 100;
    $(".main").css({
        "-moz-transform" : "scale("+n/100+", "+n/100+")",
        "-moz-transform-origin" : "top",
        "zoom" : n/100,
        "zoom" : n + "%"
     }).promise().done(function(){
        $("html").css("height", $(".main").height());
    });
    currentScale = n / 100;
}

var loadedSection;
function loadSection(sel, scroll) { 
    if (sel=="github") return;
    if (loadedSection) $("#content ."+loadedSection).hide();
    $("#content ."+sel).show();
    loadedSection = sel;
    window.location.hash = sel == "wallet" ? "" : sel;
    adjustWidth();
    if (scroll) scrollToContent();
}

function scrollToContent() {
    var y = $(".menu")[0].offsetTop;
    $(document).scrollTop(y * currentScale + 2);
}

function initGUI() {
    $(".footer_licenses").on("click", function() { loadSection("licenses", true); });
    $("input").attr("autocomplete","off");
    $(".menu ul li a").on("click", function() { 
        var sec = $(this).attr("id").split("_")[1]; 
        loadSection(sec, true); 
    });
    $(".logoname").on("click", function() { loadSection("wallet"); });
    $(".avlicon").on("click", function() { loadSection("specs", true); });
    $(".crunching .readmore").on("click", function() { loadSection("about", true); });
    $("#leakEther").on("click",function() { leakEther(); });
    $("#cmdSetSeed").on("click", function() { setSeed(); });
    $("#halt").on("click", function() { stopMining(); });
    $("#resume").on("click", function() { startMining(); });
    $("input").on("mouseover",function() { if ($(this).val()=="") $(this).select(); });
    $("#cmdNewWallet").on("click", function() { newWallet(); });
    $("#cmdSendETH").on("click", function() { $("#withdrawInfo").hide(); sendEth(); });
    $("#cmdCreateAVL").on("click", function() { $("#createInfo").hide(); createTokens(); });
    $("#cmdSendAVL").on("click", function() { $("#sendInfo").hide(); sendTokens(); });
    $("#logOut button").on("click", function() { self.location=self.location.href.replace("#",""); });
    $("#createAVLGasRequired").html("~ " + web3.fromWei(createAVLGasRequired_value*gasPrice, "ether"));
    $("#sendAVLGasRequired").html("~ " + web3.fromWei(sendAVLGasRequired_value*gasPrice, "ether"));
    $("#sendEtherGasRequired").html("~ " + web3.fromWei(txgas*gasPrice, "ether"));
    $("#copyaddr").on("click",function() { copyAddress(); });
    $("#overlay, #qrCodeLarge").on("click",function() { $("#overlay").hide(); $("#qrCodeLarge").hide(); });
    $(".info u").on("click", function() { $(".info").hide(); $(".info2").show(); });
    $("#accounts").on("change", function() {
        switchToAccount($("#accounts option:selected").attr("idx"),$("#accounts option:selected").attr("hdidx"));       
    });
    $("#addaccount").on("click",function() {
        bootbox.prompt({
            title: "Enter account number or private key (32 byte hex):",
            inputType: 'text',
            callback: function (result) {
                if (!result) return;
                addAccountNo=result;
            }
        });
    });
}

function initEntropyGenerator() { for (var x=0;x<40;x++) { $("#ev"+x).attr("class", "color"+(Math.floor(Math.random()*12))); } }

var qrCodeObject;
var qrCodeLargeObject;
function initQRCodes() {
    $("#qrCode").on("click",function() {
        if (!qrCodeLargeObject) {
            qrCodeLargeObject = new QRCode(
                document.getElementById("qrCodeLarge"), 
                {
                    text: "ethereum:"+$("#addr").html(),
                    width: 384, height: 384, colorDark : "#000000", colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                }
            );
        } else {
            qrCodeLargeObject.makeCode("ethereum:"+$("#addr").html());
        }
        $("#overlay").show();
        $("#qrCodeLarge").show();
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

function confirmTerms() {
    if (localStorage.getItem("TERMS_CONFIRMED")=="YES") return;

    bootbox.confirm({
        message: LANG_CONFIRM_TERMS,
        buttons: { confirm: { label: LANG_CONFIRM_AND_AGREE, className: 'btn-success' },
                   cancel: { label: LANG_DECLINE, className: 'btn-danger' } },
        callback: function (result) { 
            if (!result) { $("body").hide(); } 
        
            localStorage.setItem("TERMS_CONFIRMED", "YES");
        }
    });
}

var scanner, camera;
function setQRScanner() {
    $(".qrcode").on("click",function() {
        var qrcmd = $(this);
        var prv = qrcmd.parent().parent().find(".preview");
        var prvid = $(prv).attr("id");
        var inp = qrcmd.parent().find(".to input");
        var form = qrcmd.parent().find(".form");
        var h3 = qrcmd.parent().find("h3");

        if (scanner) {
            scanner.stop(camera);
            scanner = null;
            $(prv).hide();$(form).show();$(h3).show();
            $(".qrcode").show();
            return;
        }

        scanner = new Instascan.Scanner({ video: document.getElementById(prvid) });

        scanner.addListener('scan', function (content) {
            var cparts = content.split(":");
            $(inp).val(cparts[cparts.length==2 ? 1 : 0]);
            $(prv).hide();$(form).show();$(h3).show();
            scanner.stop(camera);
            scanner = null;
            $(".qrcode").show();
        });

        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                camera = cameras[0];
                scanner.start(camera).then(function() {
                    $(prv).show();$(form).hide();$(h3).hide();
                    $(".qrcode").hide();$(qrcmd).show();
                });
            } else {
                bootbox.alert('No cameras found');
                $(prv).hide();$(form).show();$(h3).show();
                $(".qrcode").show();
            }
        }).catch(function (e) {
            bootbox.alert(e);
            $(prv).hide();$(form).show();$(h3).show();
            $(".qrcode").show();
        });
    });
}