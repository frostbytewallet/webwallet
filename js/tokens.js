var tokens;
var promoted = [["images/avl/avl.svg","1000000","Avalanche","AVL","4","0x2771Ef07dEfB079C309542E11219D97B562ab6b0"]];
var fallback = [["*/media/12318089/trx.png","100000000000","Tronix","TRX",6,"0xf230b790e05390fc8295f4d3f60332c93bed42e2"],["*/media/1383652/eos_1.png","1000000000","EOS","EOS",18,"0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0"],["*/media/16746476/bcpt.png","116158667","BlockMason Credit Protocol","BCPT","18","0x1c4481750daa5ff521a2a7490d9981ed46465dbd"],["*/media/350851/dgd.png","1999421","Digix DAO","DGD",9,"0xe0b7927c4af23765cb51314a0e0521a9645f0e2a"],["*/media/1382758/1wings.png","100000000","Wings DAO","WINGS",18,"0x667088b212ce3d06a1b553a7221e1fd19000d9af"],["*/media/12318129/ven.png","1000000000","Vechain","VEN","18","0xd850942ef8811f2a866692a623011bde52a462c1"],["*/media/1383947/bnb.png","200000000","Binance Coin","BNB","18","0xb8c77482e45f1f44de1745f52c74426c631bdd52"],["*/media/1383814/omisego.png","140245398","OmiseGo","OMG",18,"0xd26114cd6ee289accf82350c8d8487fedb8a0c07"],["*/media/27010459/iost.png","21000000000","IOS token","IOST","18","0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab"],["*/media/1383743/mtl.png","66588888","Metal","MTL",8,"0xf433089366899d83a9f26a773d59ec7ecf30355e"],["*/media/14913458/ins.png","50000000","INS Ecosystem","INS","10","0x5b2e4a700dfbc560061e957edec8f6eeeb74a320"],["*/media/12318360/r.png","1000000000","Revain","R","0","0x48f775efbe4f5ece6e0df2f7b5932df56823b990"],["*/media/14913556/srn.png","572916627.078562646983596714","SirinLabs","SRN","18","0x68d57c9a1c35f63e2c83ee8e49a64e9d70528d25"],["*/media/12318192/icx.png","400230000","ICON Project","ICX",18,"0xb5a5f22694352c15b00323844ad545abb2b11028"],["*/media/12318290/wax.png","185000000","Worldwide Asset eXchange","WAX","8","0x39bb259f66e1c59d5abef88375979b4d20d98022"],["*/media/27010472/swftc.png","10000000000","SwftCoin","SWFTC","8","0x0bb217e40f8a5cb79adf04e1aab60e5abd0dfc1e"],["*/media/12318261/arn.png","100000000","Aeron","ARN","8","0xba5f11b16b155792cf3b2e6880e8706859a8aeb6"],["*/media/1383112/lunyr-logo.png","2703356.0785","Lunyr","LUN",18,"0xfa05a73ffe78ef8f1a739473e462c54bae6567d9"],["*/media/1383568/snt.png","6804870175","Status Network Token","SNT",18,"0x744d70fdbe2ba4cf95131626614a1763df805b9e"],["*/media/20780628/itc.png","100000000","IoT Chain","ITC","18","0x5e6b6d9abad9093fdc861ea1600eba1b355cd940"],["*/media/351368/sngls.png","1000000000 ","SingularDTV","SNGLS",18,"0xaec2e87e0a235266d9c5adc9deb4b2e29b54d009"],["*/media/16746671/gto.png","1000000000","GIFTO","GTO","5","0xc5bbae50781be1669306b9e001eff57a2957b09d"],["*/media/20780600/elf.png","1000000000","aelf","ELF","18","0xbf2179859fc6d5bee9bf9158632dc51678a4100e"],["*/media/9350744/salt.jpg","120000000","Salt Lending","SALT","8","0x4156d3342d5c385a87d264f90653733592000581"],["*/media/27010573/fqqzfp9_400x400.png","1790300000.0000000000003","Ruff","RUFF","18","0xf278c1ca969095ffddded020290cf8b5c424ace2"],["*/media/20084/btm.png","27580000","BitMark","BTM",8,"0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750"],["*/media/14543969/wpr.png","746403007.29","WePower","WPR","18","0x4cf488387f035ff08c371515562cba712f9015d4"],["*/media/12318267/vibe.png","267000000","VIBEHub","VIBE","18","0xe8ff5c9c75deb346acac493c463c8950be03dfba"],["*/media/1383799/zrx.png","1000000000","0x","ZRX",18,"0xe41d2489571d322189246dafa5ebde1f4699f498"],["*/media/1383792/pro.png","100000000","Propy","PRO","8","0x226bb599a12c826476e3a771454697ea52e9e220"],["*/media/27010448/ocn.png","10000000000","Odyssey","OCN","18","0x4092678e4e78230f46a1534c0fbc8fa39780892b"],["*/media/12318178/yoyow.png","62000000","Yoyow","YOYOW",18,"0xcbeaec699431857fdb4d37addbbdc20e132d4903"],["*/media/14913548/nuls.png","40000000","Nuls","NULS","18","0xb91318f35bdb262e9423bc7c7c2a3a93dd93c92c"],["*/media/12317959/wtc.png","70000000","Waltonchain","WTC",18,"0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74"],["*/media/27010464/zil.png","12600000000","Zilliqa","ZIL","12","0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27"],["*/media/1383893/vib.png","200000000","Viberate","VIB",18,"0x2c974b2d0ba1716e644c1fc59982a89ddd2ff724"],["*/media/15887422/jnt.jpg","N/A","Jibrel Network Token","JNT","18","0xa5fd1a791c4dfcaacc963d4f73c6ae5824149ea7"],["*/media/27010466/qun.png","1500000000","QunQun","QUN","18","0x264dc2dedcdcbb897561a57cba5085ca416fb7b4"],["*/media/1383903/mana.png","2805886393.1583","Decentraland","MANA",18,"0x0f5d2fb29fb7d3cfee444a200298f468908cc942"],["*/media/20780653/nas.png","100000000","Nebulas","NAS","18","0x5d65d971895edc438f465c17db6992698a52318d"],["*/media/1383850/evx.png","25000000","Everex","EVX","4","0xf3db5fa2c66b7af3eb0c0b782510816cbe4813b8"],["*/media/12318046/rnc.png","1000000000","Ripio","RCN","18","0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6"],["*/media/27010450/theta.png","1000000000","Theta","THETA","18","0x3883f5e181fccaf8410fa61e12b59bad963fb645"],["*/media/1383370/bat.png","1500000000","Basic Attention Token","BAT","18","0x0d8775f648430679a709e98d2b0cb6250d2887ef"],["*/media/27010511/sxdt.png","140270691.248776761435171102","SPECTRE Utility Token","SXUT","18","0x2c82c73d5b34aa015989462b2948cd616a37641f"],["*/media/25792577/aidoc.png","777775241","AI Doctor","AIDOC","18","0x584b44853680ee34a0f337b712a8f66d816df151"],["*/media/12318078/link.png","1000000000 ","ChainLink","LINK","18","0x514910771af9ca656af840dff83e8264ecf986ca"],["*/media/12318370/app.png","246203093","AppCoins","APPC","18","0x1a7a8bd9106f2b8d977e08582dc7d24c723ab0db"],["*/media/25792680/dta.png","11500000000","Data","DTA","18","0x69b148395ce0015c13e36bffbad63f49ef874e03"],["*/media/12318118/mtn.png","100000000","TrackNetToken","MTN","18","0x41dbecc1cdc5517c6f76f6a6e836adbee2754de3"],["*/media/351090/cmt.png","2000000","CometCoin","CMT","18","0xf85feea2fdd81d51177f6b8f35f0e6734ce45f5f"],["*/media/1383613/dent.png","100000000000","Dent","DENT",8,"0x3597bfd533a99c9aa083587b074434e61eb0a258"],["*/media/20780589/brd.png","88862718","Bread token","BRD","18","0x558ec3152e2eb2174905cd19aea4e34a23de9ad6"],["*/media/1383730/san.png","83337000","Santiment","SAN",18,"0x7c5a0ce9267ed19b22f8cae653f198e3e8daf098"],["*/media/12318135/lrc.png","1395076055","Loopring","LRC",18,"0xef68e7c694f40c8202821edf525de3782458639f"],["*/media/1383748/snc.png","7994751.31","SunContract","SNC",18,"0xf4134146af2d511dd5ea8cdb1c4ac88c57d60404"],["*/media/12318340/mda.png","19628888","Moeda","MDA",18,"0x51db5ad35c671a87207d88fc11d593ac0c8415bd"],["*/media/12318301/powr.png","1000000000","Power Ledger","POWR","6","0x595832f8fc6bf59c85c527fec3740a1b7a361269"],["*/media/20780773/ipnvhhke_400x400.jpg","2000000000","MediShares","MDS","18","0x66186008c1050627f979d464eabb258860563dbe"],["*/media/12318287/eng.png","150000000","Enigma","ENG","8","0xf0ee6b27b759c9893ce4f094b49ad28fd15a23e4"],["*/media/351995/golem_logo.png","1000000000","Golem Network Token","GNT",18,"0xa74476443119a942de498590fe1f2454d7d4ac0d"],["*/media/20780652/gnx.png","675000000","Genaro Network","GNX","9","0x6ec8a24cabdc339a06a172f8223ea557055adaa5"],["*/media/1383107/gup.png","100000000","Guppy","GUP",3,"0xf7b098298f7c69fc14610bf71d5e02c60792894c"],["*/media/1383549/bnt.jpg","79323978","Bancor Network Token","BNT",18,"0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c"],["*/media/27010524/stk.png"," 500000000","STK Token","STK","18","0xae73b38d1c9a8b274127ec30160a4927c4d71824"],["*/media/20780783/hpb.png","N/A","High Performance Blockchain","HPB","18","0x38c6a68304cdefb9bec48bbfaaba5c5b47818bb2"],["*/media/16746444/lend.png","1299999942","EthLend","LEND",18,"0x80fb784b7ed66730e8b1dbd9820afd29931aab03"],["*/media/16746538/aion.png","465934586.66","Aion","AION","8","0x4ceda7906a5ed2179785cd3a40a69ee8bc99c466"],["*/media/12318260/req.png","1000000000","Request Network","REQ","18","0x8f8221afbb33998d8584a2b05749ba73c37a938a"],["*/media/1383611/cvc.png","1000000000","Civic","CVC",8,"0x41e5560054824ea6b0732e656e3ad64e20e94e45"],["*/media/12318044/vee.png","6428571429","BLOCKv","VEE","18","0x340d2bde5eb28c1eed91b2f790723e3b160613b7"],["*/media/350560/cpc.png","208000000","CapriCoin","CPC","18","0xfae4ee59cdd86e3be9e8b90b53aa866327d7c090"],["*/media/16746672/tnb.png","5541877892.218590616799998","Time New Bank","TNB","18","0xf7920b0768ecb20a123fac32311d07d193381d6f"],["*/media/19808/mrs.png","0","RadonPay","RDN","18","0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6"],["*/media/1383836/ae.png","273685831","Aeternity","AE",18,"0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d"],["*/media/12318302/c20.png","40656081.980167189594966596","Crypto20","C20","18","0x26e75307fc0c021472feb8f727839531f112f317"],["*/media/1383828/poe.png","3141592653","Po.et","POE",8,"0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195"],["*/media/1383653/mco.jpg","31587682.3632061","Monaco","MCO",8,"0xb63b606ac810a52cca15e44bb630fd42d8d1d83d"],["*/media/20422/sjcx.png","424999998","Storj","STORJ",8,"0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac"],["*/media/27010681/latoken.png","1000000000","LATOKEN","LA",18,"0xe50365f5d679cb98a1dd62d6f6e58e59321bcddf"],["*/media/12318279/ast.png","500000000","AirSwap","AST","4","0x27054b13b1b798b345b591a4d22e6562d47ea75a"],["*/media/350815/augur-logo.png","11000000","Augur","REP",18,"0xe94327d07fc17907b4db788e5adf2ed424addff6"],["*/media/15887431/qash.png","1000000000","Quoine Liquid","QASH","6","0x618e75ac90b12c6049ba3b27f5d5f8651b0037f6"],["*/media/1383747/ppt.png","53252246","Populous","PPT",8,"0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a"],["*/media/12318362/mod.png","18266200","Modum","MOD","0","0x957c30ab0426e0c93cd8241e2c60392d08c6ac8e"],["*/media/12318084/knc.png","226000000","Kyber Network","KNC",18,"0xdd974d5c2e2928dea5f71b9825b8b646686bd200"],["*/media/15887408/qsp.png","976442388.3211","Quantstamp","QSP","18","0x99ea4db9ee77acd40b119bd1dc4e33e1c070b80d"],["*/media/1383738/fun.png","17173696076","FunFair","FUN",8,"0x419d0d8bdd9af5e606ae2232ed285aff190e711b"],["*/media/27010607/1.png","500000000","Bluzelle","BLZ","18","0x5732046a883704404f284ce41ffadd5b007fd668"],["*/media/1383800/tnt.png","1000000000","Tierion","TNT",8,"0x08f5a9235b08173b7569f83645d2c7fb55e8ccd8"],["*/media/12318283/cnd.png","2000000005","Cindicator","CND",18,"0xd4c435f5b09f855c3317c8524cb1f586e42795fa"],["*/media/20780616/amm.png","17532943.47918","MicroMoney","AMM","6","0x8b1f49491477e0fb46a29fef53f1ea320d13c349"],["*/media/16746544/rhoc.png","870663574","RChain","RHOC",8,"0x168296bb09e24a88805cb9c33356536b980d3fc5"],["*/media/1382296/mkr.png","1000000","Maker","MKR","18","0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"],["*/media/1383562/veri.png","100000000","Veritaseum","VERI",18,"0x8f3470a7388c05ee4e7af3d01d8c722b0ff52374"],["*/media/12318389/kcs.png","181043076 ","Kucoin","KCS","6","0x039b5649a59967e3e936d7471f9c3700100ee1ab"],["*/media/16746490/drgn.png","433494437","Dragonchain","DRGN","18","0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e"],["*/media/20631/poly.png","150000000","PolyBit","POLY","18","0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec"],["*/media/16404851/ethos.png","222295208.2384","Ethos","BQX",8,"0x5af2be193a6abca9c8817001f45744777db30756"],["*/media/1383731/kin.png","10000000000000","Kin","KIN",18,"0x818fc6c2ec5986bc6e2cbf00939d90556ab12ce5"],["*/media/27010510/plr.png","800000000","Pillar","PLR",18,"0xe3818504c1b32bf1557b16c238b2e01fd3149c17"],["*/media/25792653/agi.png","1000000000","SingularityNET","AGI","8","0x8eb24319393716668d768dcec29356ae9cffe285"],["*/media/1383687/pay.png","205218255.9485","TenX","PAY",18,"0xb97048628db6b661d4c2aa833e95dbe1a905b280"],["*/media/351400/icn.png","100000000","Iconomi","ICN",18,"0x888666ca69e0f178ded6d75b5726cee99a87d698"],["*/media/1383083/gnosis-logo.png","10000000","Gnosis","GNO",18,"0x6810e776880c02933d47db1b9fc05908e5386b96"],["*/media/11417639/enjt.png","1000000000","Enjin Coin","ENJ","18","0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c"],["*/media/1384011/sub1.png","600000000","Substratum Network","SUB","2","0x12480e24eb5bec1a9d4369cab6a80cad3c0a377a"],["*/media/1383803/storm.jpg","10000000000 ","Storm","STORM","18","0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433"],["*/media/14761903/dtr.png","3750000","Dynamic Trading Rights","DTR","8","0xd234bf2410a0009df9c3c63b610c09738f18ccd7"],["*/media/12317962/xuc.png","21000000000","U.CASH","UCASH","8","0x92e52a1a235d9a103d970901066ce910aacefd37"],["*/media/14913551/sphtx.png","350000000","SophiaTX","SPHTX","18","0x3833dda0aeb6947b98ce454d89366cba8cc55528"],["*/media/25792569/tel.png","100000000000","Telcoin","TEL","2","0x85e076361cc813a908ff672f9bad1541474402b2"],["*/media/12318216/ppp.png","165000000","PayPie","PPP","18","0xc42209accc14029c1012fb5680d95fbd6036e2a0"],["*/media/16746488/prl.png","108592693","Oyster Pearl","PRL","18","0x1844b21593262668b7248d0f57a220caaba46ab9"],["*/media/12318418/rlc.png"," 87000000","iEx.ec","RLC",9,"0x607f4c5bb672230e8672085532f7e901544a7375"],["*/media/1383244/ant.png","39609524","Aragon","ANT",18,"0x960b236a07cf122663c4303350609a66a7b288c0"],["*/media/14913634/gvt.png","4436644","Genesis Vision","GVT","18","0x103c3a209da59d3e7c4a89307e66521e081cfdf0"],["*/media/1383564/snm.png","444000000","SONM","SNM",18,"0x983f6d60db79ea8ca4eb9968c6aff8cfa04b3c63"],["*/media/9350739/amb.png","361477438","Ambrosus","AMB","18","0x4dc3643dbc642b72c158e7f3d2ff232df61cb6ce"],["*/media/12318082/eiboo.png","90708327","Eidoo","EDO","18","0xced4e93198734ddaff8492d525bd258d49eb388e"]];

function getTokenHTML(token) {
    var template = "<div class='token'><img src='[0]' title='[2] ([3])' totalsupply='[1]' name='[2]' symbol='[3]' decimals='[4]' contract='[5]' /></div>";
    for (var i = 0; i<token.length; i++) {
        template = template.replace("["+i+"]", token[i]);
        if (i==2 || i==3) template = template.replace("["+i+"]", token[i]);
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
            if (list[j][5]==toFilter[i][5]) { shouldFilter=true; break; }
        }
        if (!shouldFilter) res.push(list[j]);
    }
    return res;
}

function loadTokens() {
    tokens = [];
    var initital = filterTokens(fallback, promoted); 
    setSlider(getTokensHTML(promoted)+getTokensHTML(initital));

    var url1 = "https://min-api.cryptocompare.com/data/all/coinlist";
    var cached = JSON.parse(localStorage.getItem("tokens"));

    try {
        if (cached!=null) { 
            tokens = filterTokens(cached, promoted);
            loadTokenBalances(); 
        }
        else {
            var syms = {};
            for (var i=0;i<promoted.length;i++) syms[promoted[i][3]] = 1;

            getCache(url1, function(d1) {
                var url2 = "https://api.ethplorer.io/getTop?apiKey=freekey&limit=1000&criteria=";

                getCache(url2+"trade", function(bytrade) {
                    accumulate(bytrade);
                    getCache(url2+"cap", function(bycap) {
                        accumulate(bycap);
                        getCache(url2+"count", function(bycount) {
                            accumulate(bycount);

                            localStorage.setItem("tokens", JSON.stringify(tokens));
                            loadTokenBalances();
                        });
                    });
                });

                function accumulate(d2) {
                    d2 = JSON.parse(d2);

                    for (var i=1;i<d2.tokens.length;i++) {
                        if (d2.tokens[i].price && d1.Data[d2.tokens[i].symbol] && syms[d2.tokens[i].symbol]==null) {
                            if (d1.Data[d2.tokens[i].symbol].ImageUrl!="") {
                                var sym = [];
                                sym.push("*"+d1.Data[d2.tokens[i].symbol].ImageUrl);
                                sym.push(d1.Data[d2.tokens[i].symbol].TotalCoinSupply);
                                sym.push(d1.Data[d2.tokens[i].symbol].CoinName);
                                sym.push(d2.tokens[i].symbol);
                                sym.push(d2.tokens[i].decimals ? d2.tokens[i].decimals : 18);
                                sym.push(d2.tokens[i].address);

                                tokens.push(sym);
                                syms[d2.tokens[i].symbol] = 1;
                            }
                        }
                    }
                }
            });
        }
    } catch(ex) {}
}

function loadTokenBalances() {
    var tokensBarCache = localStorage.getItem("tokensBarCache");

    if (addresses==null || (!nodeConnected && !tokensBarCache)) {
        setSlider(getTokensHTML(promoted)+getTokensHTML(tokens)); return;
    }
    if (!nodeConnected) {
        tokensBarCache = JSON.parse(tokensBarCache);
        setSlider(getTokensHTML(tokensBarCache.held)+getTokensHTML(tokensBarCache.unheld));
        return;
    }

    var tokenContracts = [], queriedTokens = [];
    for (var i=0;i<promoted.length;i++) { 
        tokenContracts.push(promoted[i][5]); queriedTokens.push(promoted[i]);
    }
    for (var i=0;i<tokens.length;i++) {
        tokenContracts.push(tokens[i][5]); queriedTokens.push(tokens[i]);
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
            localStorage.setItem("tokenbalance_"+loadedAddress()+"_"+queriedTokens[i][5], value);
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
        $loadedToken = $(this).find("img");
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

        if ($lastToken) $lastToken.parent().css("opacity", 0.8);
        $loadedToken.parent().css("opacity", 0.9);

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