$(window).on("load", function() {
    initEntropyGenerator(); initGUI();
    setQRScanner(); initQRCodes();
    timeCycle(); loadLanguage();
});

$(document).ready(function() {
    $("body").show(); loadContent();
    loadTokens(); confirmTerms();    
    getNodeStatus();
    $("head").append('<link rel="stylesheet" href="css/tokens.css?v=35" />');    
});

var currentScale=100;
$(window).on("resize", function() { adjustWidth(); });
function adjustWidth() {
    var n = 100/(1020/$("body").width());
    if (n<100) n = 100;
    var mh = $(".main").height();
    currentScale = n / 100;
    $(".main").css({
        "-moz-transform" : "scale("+currentScale+", "+currentScale+")",
        "-moz-transform-origin" : "top",
        "zoom" : currentScale,
        "zoom" : n + "%"
    }).promise().done(function(){
        $("html").height(mh * currentScale);
    });
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

function loadContent() {
    var wh = window.location.hash;
    if (wh.length>1) { loadSection(wh.substr(1,wh.length-1)); }
    else { loadSection("wallet"); }
}

function scrollToContent() {
    var y = $(".menu")[0].offsetTop;
    $(document).scrollTop(y * currentScale + 2);
}

function initGUI() {
    $(".footer_licenses").on("click", function() { loadSection("licenses", true); });
    $("input").attr("autocomplete","off");
    $(".menu ul li a").on("click", function() { 
        var sec = $(this).attr("id").split("_")[1]; loadSection(sec, true); 
    });
    $(".logoname").on("click", function() { loadSection("wallet"); });
    $(".avlicon").on("click", function() { loadSection("specs", true); });
    $(".crunching .readmore").on("click", function() { loadSection("about", true); });
    $("#leakEther").on("click",function() { getNonce(function() { leakEther(); }); });
    $("#cmdSetSeed").on("click", function() { setSeed(); });
    $("#halt").on("click", function() { stopMining(); });
    $("#resume").on("click", function() { startMining(); });
    $("input").on("mouseover",function() { if ($(this).val()=="") $(this).select(); });
    $("#cmdNewWallet").on("click", function() { newWallet(); });
    $("#cmdSendETH").on("click", function() { getNonce(function() { sendEth(); }); });
    $("#cmdCreateAVL").on("click", function() { getNonce(function() { createTokens(); }); });
    $("#cmdSendAVL").on("click", function() { getNonce(function() { sendTokens(); }); });
    $("#logOut button").on("click", function() { 
        if (self.location.href.indexOf("#")>=0) { self.location=self.location.href.split("#")[0]; }
        else { self.location=self.location.href; }
    });
    $("#createAVLGasRequired").html("~ " + web3.fromWei(createAVLGasRequired_value*gasPrice, "ether"));
    $("#sendAVLGasRequired").html("~ " + web3.fromWei(sendAVLGasRequired_value*gasPrice, "ether"));
    $("#sendEtherGasRequired").html("~ " + web3.fromWei(txgas*gasPrice, "ether"));
    $("#copyaddr").on("click",function() { copyAddress(); });
    $(".info u").on("click", function() { $(".info").hide(); $(".info2").show(); });
    $("#accounts").on("change", function() {
        switchToAccount($("#accounts option:selected").attr("idx"),$("#accounts option:selected").attr("hdidx"));       
    });
    $("#addaccount").on("click",function() {
        bootbox.prompt({
            title: "Enter account number or private key (32 byte hex):", inputType: 'text',
            callback: function (result) { if (result==null) return; addAccountNo=result; }
        });
    });
    $("#overlay, #qrCodeLarge").on("click",function() { hideLargeQRCode(); });
    $("#sync").on("click", function() {
        synchronizingOffline = true;
        requestAssistance(JSON.stringify({ "A": loadedAddress(), "C": (loadedContract ? $loadedToken.attr("contract") : null) }));
    });
    $("#assistoffline").on("click", function() { scanAssistanceRequest(); });
    $("#withdrawInfo, #sendInfo, #createInfo").on("click",function() {
        $(this).html("");
    });
}

function initEntropyGenerator() { for (var x=0;x<40;x++) { $("#ev"+x).attr("class", "color"+(Math.floor(Math.random()*12))); } }

function confirmTerms() {
    if (localStorage.getItem("TERMS_CONFIRMED")=="YES") return;

    bootbox.confirm({
        message: LANG_CONFIRM_TERMS,
        buttons: { confirm: { label: LANG_CONFIRM_AND_AGREE, className: 'btn-success' },
                   cancel: { label: LANG_DECLINE, className: 'btn-danger' } },
        callback: function (result) { 
            if (!result) { $("body").hide();$("body, html").height(0); return; } 
        
            localStorage.setItem("TERMS_CONFIRMED", "YES");
        }
    });
}

function getCache(url, callback) {
    var item = localStorage.getItem(url);
    if (item) { callback(JSON.parse(item)); return; }
    $.get(url).then(function(d) { 
        localStorage.setItem(url, JSON.stringify(d)); 
        callback(d); 
    });
}     

function isJson(str) { try { return JSON.parse(str); } catch (e) { return false; } }

function getFriendlyError(msg) {
    return msg;
}