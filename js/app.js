$(document).ready(function() {
    for (var x=0;x<40;x++) { $("#ev"+x).attr("class", "color"+(Math.floor(Math.random()*12))); }
    $("body").show();
    bootbox.confirm({
        message: "Please confirm that you are neither under the age of 18 nor a US resident, and agree to use this open source platform as-is and on your own risk:",
        buttons: {
            confirm: {
                label: 'Confirm and agree',
                className: 'btn-success'
            },
            cancel: {
                label: 'Decline',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) { $("body").show();} else { $("body").hide(); }
        }
    });

    setQRScanner();
    $("#cmdSetSeed").on("click", function() { setSeed(); });
    $("#halt").on("click", function() { stopMining(); });
    $("#resume").on("click", function() { startMining(); });
    $("input").on("mouseover",function() {
        if ($(this).val()=="") $(this).select();
    });
    $("#cmdNewWallet").on("click", function() { newWallet(); });
    $("#cmdSendETH").on("click", function() { sendEth(); });
    $("#cmdBuyTokens").on("click", function() { buyTokens(); });
    $("#cmdSendTokens").on("click", function() { sendTokens(); });
    $("#logOut button").on("click", function() { self.location=self.location.href; });
    $("#buyTokensGasRequired").html(web3.fromWei(buyTokensGasRequired_value*gasPrice, "ether"));
    $("#sendTokensGasRequired").html(web3.fromWei(sendTokensGasRequired_value*gasPrice, "ether"));
    $("#sendEtherGasRequired").html(web3.fromWei(txgas*gasPrice, "ether"));
    $("#copyaddr").on("click",function() { copyAddress(); });
    $("#overlay, #qrCodeLarge").on("click",function() {
    $("#overlay").hide();
    $("#qrCodeLarge").hide();
    });
    $("#qrCode").on("click",function() {
        $("#qrCodeLarge").html("");
        new QRCode(
            document.getElementById("qrCodeLarge"), 
            {
                text: "ethereum:"+$("#addr").html(),
                width: 384,
                height: 384,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            }
        );
        $("#overlay").show();
        $("#qrCodeLarge").show();
    });
    $("#addr").html(contractAddr);
    $(".addr").html(contractAddr);
    $("#addr").attr("href", "https://etherscan.io/address/"+contractAddr);
    $(".addr").attr("href", "https://etherscan.io/address/"+contractAddr);
    $("#qrCode").html("");
    new QRCode(
        document.getElementById("qrCode"), 
        {
            text: "ethereum:"+contractAddr,
            width: 140,
            height: 140,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        }
    );
    $("#qrCode").show();

    timeCycle();

    $("#accounts").on("change", function() {
        switchToAccount($("#accounts option:selected").attr("idx"),$("#accounts option:selected").attr("hdidx"));       
    });
    
    showInfo();
    
    $(".info u").on("click",function() { 
        $(".info").hide(); 
        $(".info2").show();
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
});

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
            $(inp).val(cparts[1]);
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