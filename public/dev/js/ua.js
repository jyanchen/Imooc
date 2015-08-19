var client = function() {
    var engine = {
        // 呈现引擎
        ie: false,
        gecko: false,
        webkit: false,
        khtml: false,
        opera: false,
        //其他版本号
        ver: null
    };
    var browser = {
        // 浏览器
        ie: false,
        firefox: false,
        safari: false,
        konq: false,
        opera: false,
        chrome: false,
        weixin: false,
        // 其他的版本
        ver: null
    };
    var system = {
        win: false,
        mac: false,
        X11: false,
        // 移动设备
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false
    };
    // 在此检测呈现引擎，平台和设备
    return {
        engine: engine,
        browser: browser,
        system: system
    };
}();

var engine = client.engine,
	browser = client.browser,
	system = client.system,
	ua = navigator.userAgent.toLowerCase(),
	platform = navigator.platform;

// 浏览器相关信息
if (ua.match(/opr\/([\d\.]+)/) || window.opera) {
    var result = ua.match(/opr\/([\d\.]+)/);
    engine.ver = browser.ver = result[1];
    engine.opera = browser.opera = true;
    // opera 5+ && lt opera 29
    if (window.opera) {
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = true;
    }
} else if (/applewebkit\/(\S+)/.test(ua)) {
    engine.ver = RegExp["$1"];
    engine.webkit = true;
    // 确定是chrome还是safari
    /*
     * chrome用户代理字符串
     * Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) 
     * Chrome/42.0.2311.152 Safari/537.36
     */
    if (/chrome\/(\S+)/.test(ua)) {
        browser.ver = RegExp["$1"];
        browser.chrome = true;
    } else if (/version\/(\S+)/.test(ua)) {
        /*
         * safari用户代理字符串
         * Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) 
         * Version/5.1.7 Safari/534.57.2
         */
        browser.ver = RegExp["$1"];
        browser.safari = true;
    } else if (/micromessenger\/(\S+)/.test(ua)) {
        /**
         * 微信的用户代理字符串
         * Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) 
         * Mobile/11D201 MicroMessenger/6.2.2 NetType/WIFI Language/zh_TW
         */
        browser.ver = RegExp["$1"];
        browser.weixin = true;
    } else {
        //近似地确定版本号
        var safariVersion = 1;
        if (engine.webkit < 100) {
            safariVersion = 1;
        } else if (engine.webkit < 312) {
            safariVersion = 1.2;
        } else if (engine.webkit < 412) {
            safariVersion = 1.3;
        } else {
            safariVersion = 2;
        }
        browser.ver = safariVersion;
        browser.safari = true;
    }
} else if (/khtml\/(\S+)/.test(ua) || /konqueror\/([^;]+)/.test(ua)) {
	/**
	 * Konqueror的用户代理的字符串
	 * Mozilla/5.0 (compatible; Konqueror/3.5; SunOS) 
	 * KHTML/3.5.0 (like Gecko)
	 */
	// Linux系统的浏览器Konqueror
    engine.ver = browser.ver = RegExp["$1"];
    engine.khtml = browser.konq = true;

} else if (/rv:([^\)]+)\) gecko\/\d{8}/.test(ua)) {
    engine.ver = RegExp["$1"];
    engine.gecko = true;
    /*
     * firefox的用户代理的字符串
     * Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) 
     * Gecko/20100101 Firefox/38.0
     */
    // 确定是不是firefox
    if (/firefox\/(\S+)/.test(ua)) {
        browser.ver = RegExp["$1"];
        browser.firefox = true;
    }
} else if (/msie ([^;]+)/.test(ua) || "ActiveXObject" in window) {
    if ("ActiveXObject" in window) {
        if (/msie ([^;]+)/.test(ua)) {
            engine.ver = browser.ver = RegExp["$1"];
            engine.ie = browser.ie = true;
        } else {
            if (/rv:([^\)]+)\)/.test(ua)) {
                engine.ver = browser.ver = RegExp["$1"];
                engine.ie = browser.ie = true;
            }
        }
    }

}

// 检测平台
system.win = platform.indexOf("Win") == 0;
system.mac = platform.indexOf("Mac") == 0;
system.x11 = (platform.indexOf("X11") == 0) || (platform.indexOf("Linux") == 0);

// 移动设备
system.iphone = ua.indexOf("iphone") > -1;
system.ipod = ua.indexOf("ipod") > -1;
system.ipad = ua.indexOf("ipad") > -1;

//检测iOS 版本
if ((system.mac || system.iphone || system.ipad || system.ipod) && ua.indexOf("mobile") > -1) {
    if (/cpu (?:iphone )?os ([\d\.]+)/.test(ua)) {
        system.ios = RegExp.$1.replace(/_/g, ".");
    } else {
        system.ios = 2; //不能真正检测出来，所以只能猜测
    }
}
//检测Android 版本
if (/android ([\d\.]+)/.test(ua)) {
    system.android = (RegExp.$1).split(';')[0];
}
