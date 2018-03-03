function getTokenHTML(token) {
    var template = "<div class='token SYM_[2]' title='[1] ([2])' totalsupply='[0]' name='[1]' symbol='[2]' decimals='[3]' contract='[4]'></div>";
    for (var i = 0; i<token.length; i++) {
        template = template.replace("["+i+"]", token[i]);
        if (i==1 || i==2) template = template.replace("["+i+"]", token[i]);
        if (i==2) template = template.replace("["+i+"]", token[i]);
    }
    return template.replace("*", "https://www.cryptocompare.com");
}

function getTokensHTML(tokens) {
    var res = "";
    for (var i = 0; i<tokens.length; i++) {
        res += getTokenHTML(tokens[i]);
    }
    return res;
}

function filterTokens(list, toFilter) {
    var res = [];
    for (var j=0;j<list.length;j++) {
        var shouldFilter=false;
        for (var i=0;i<toFilter.length;i++) {
            if (list[j][4]==toFilter[i][4]) { shouldFilter=true; break; }
        }
        if (!shouldFilter) res.push(list[j]);
    }
    return res;
}

function loadTokens() {
    tokens = filterTokens(tokens, promoted); 
    setSlider(getTokensHTML(promoted)+getTokensHTML(tokens));
    loadTokenBalances();
}

function loadTokenBalances() {
    var tokensBarCache = localStorage.getItem("tokensBarCache");

    if (addresses==null || (!nodeConnected && !tokensBarCache)) {
        return;
    }
    if (!nodeConnected) {
        tokensBarCache = JSON.parse(tokensBarCache);
        setSlider(getTokensHTML(tokensBarCache.held)+getTokensHTML(tokensBarCache.unheld));
        return;
    }

    var tokenContracts = [], queriedTokens = [];
    for (var i=0;i<promoted.length;i++) { 
        tokenContracts.push(promoted[i][4]); queriedTokens.push(promoted[i]);
    }
    for (var i=0;i<tokens.length;i++) {
        tokenContracts.push(tokens[i][4]); queriedTokens.push(tokens[i]);
    }

    tokenBalanceReader.getTokenBalances(loadedAddress(), tokenContracts, function(err,res) {
        if (err) return;

        var held = [], unheld = [];
        for (var i=0;i<queriedTokens.length;i++) {
            var value = parseFloat(res[i]);
            if (value>0) { 
                held.push(queriedTokens[i]); 
            }
            else { unheld.push(queriedTokens[i]); }
            localStorage.setItem("tokenbalance_"+loadedAddress()+"_"+queriedTokens[i][4], value);
        }
        
        setSlider(getTokensHTML(held)+getTokensHTML(unheld));
        localStorage.setItem("tokensBarCache", JSON.stringify({ "held": held, "unheld": unheld }));
    });
}

function getLoadedTokenBalance() {
    var cached = readLoadedTokenBalance();
    var tokenDecimals = parseFloat($loadedToken.attr("decimals"));
    var tokenUnit = Math.pow(10, tokenDecimals);

    if (!nodeConnected) {
        if (cached!=null) { 
            $("#queryBalance .result4 span").html(parseFloat(cached) / tokenUnit); 
        } else { 
            $("#queryBalance .result4 span").html("Unknown"); 
        }
    } else {
        loadedContract.balanceOf(loadedAddress(), function(err,res) {
            var tokenBalance;
            if (err) {
                if (cached!=null) tokenBalance = parseFloat(cached);
            } else {
                tokenBalance = parseFloat(res);
                localStorage.setItem(getLoadedTokenCacheItemName(), tokenBalance);
            }
            if (tokenBalance!=null) {
                $("#queryBalance .result4 span").html(tokenBalance / tokenUnit);
            } else {
                $("#queryBalance .result4 span").html("Unknown");
            }
        });
    }
}

function readLoadedTokenBalance() {
    var cached = localStorage.getItem(getLoadedTokenCacheItemName());
    return cached==null ? null : parseFloat(cached);
}
function getLoadedTokenCacheItemName() {
    return "tokenbalance_"+loadedAddress()+"_"+$loadedToken.attr("contract");
}

function setSlider(html) {
    if ($("#tokensBar").html()!="") {
        $(".lSSlideOuter").remove(); $("#walletFunctions").prepend("<div id='tokensBar'></div>");
    }
    $("#tokensBar").html(html); $("#tokensBar").lightSlider();
    $("#tokensBar .token").on("click", function() {
        $("#txtAVLValue").val("");
        $("#sendInfo").html("");
        var $lastToken = $loadedToken;
        $loadedToken = $(this);
        if ($loadedToken.attr("symbol")=="AVL") {
            $(".result4").css("visibility", "hidden");
            $(".result4 span").html("");
            $("#tokenName").html("Avalanche");
            $("#tokenSymbol").html("AVL");
            $("#sendTokenSymbol").html("AVL");
            loadedContract = null;
        } else {
            loadedContract = web3.eth.contract(ERC20abi).at($loadedToken.attr("contract"));
            $("#tokenName").html($loadedToken.attr("name"));
            $("#sendTokenSymbol").html($loadedToken.attr("symbol"));
            $("#tokenSymbol").html($loadedToken.attr("symbol")+":");
            $(".result4").css("visibility", "visible");
            $(".result4 span").html(nodeConnected ? "(loading)":"Unknown");
        }

        if ($lastToken) $lastToken.css("opacity", 0.8);
        $loadedToken.css("opacity", 0.9);

        if (addresses!=null) {
            createLargeQRCode(JSON.stringify({ "address": loadedAddress(), "contract": (loadedContract ? $loadedToken.attr("contract") : null) }));
            if (loadedContract) getLoadedTokenBalance();
            updateEtherLeakAvailability();
        } else {
            $(document).scrollTop($(".send.sec")[0].offsetTop * currentScale);
            $("#sendAVLTo").focus();
        }
    });
}