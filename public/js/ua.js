var client = function() {
    var engine = {
        ie: !1,
        gecko: !1,
        webkit: !1,
        khtml: !1,
        opera: !1,
        ver: null
    }, browser = {
        ie: !1,
        firefox: !1,
        safari: !1,
        konq: !1,
        opera: !1,
        chrome: !1,
        weixin: !1,
        ver: null
    }, system = {
        win: !1,
        mac: !1,
        X11: !1,
        iphone: !1,
        ipod: !1,
        ipad: !1,
        ios: !1,
        android: !1
    };
    return {
        engine: engine,
        browser: browser,
        system: system
    };
}(), engine = client.engine, browser = client.browser, system = client.system, ua = navigator.userAgent.toLowerCase(), platform = navigator.platform;

if (ua.match(/opr\/([\d\.]+)/) || window.opera) {
    var result = ua.match(/opr\/([\d\.]+)/);
    engine.ver = browser.ver = result[1], engine.opera = browser.opera = !0, window.opera && (engine.ver = browser.ver = window.opera.version(), 
    engine.opera = browser.opera = !0);
} else if (/applewebkit\/(\S+)/.test(ua)) if (engine.ver = RegExp.$1, engine.webkit = !0, 
/chrome\/(\S+)/.test(ua)) browser.ver = RegExp.$1, browser.chrome = !0; else if (/version\/(\S+)/.test(ua)) browser.ver = RegExp.$1, 
browser.safari = !0; else if (/micromessenger\/(\S+)/.test(ua)) browser.ver = RegExp.$1, 
browser.weixin = !0; else {
    var safariVersion = 1;
    safariVersion = engine.webkit < 100 ? 1 : engine.webkit < 312 ? 1.2 : engine.webkit < 412 ? 1.3 : 2, 
    browser.ver = safariVersion, browser.safari = !0;
} else /khtml\/(\S+)/.test(ua) || /konqueror\/([^;]+)/.test(ua) ? (engine.ver = browser.ver = RegExp.$1, 
engine.khtml = browser.konq = !0) : /rv:([^\)]+)\) gecko\/\d{8}/.test(ua) ? (engine.ver = RegExp.$1, 
engine.gecko = !0, /firefox\/(\S+)/.test(ua) && (browser.ver = RegExp.$1, browser.firefox = !0)) : (/msie ([^;]+)/.test(ua) || "ActiveXObject" in window) && "ActiveXObject" in window && (/msie ([^;]+)/.test(ua) ? (engine.ver = browser.ver = RegExp.$1, 
engine.ie = browser.ie = !0) : /rv:([^\)]+)\)/.test(ua) && (engine.ver = browser.ver = RegExp.$1, 
engine.ie = browser.ie = !0));

system.win = 0 == platform.indexOf("Win"), system.mac = 0 == platform.indexOf("Mac"), 
system.x11 = 0 == platform.indexOf("X11") || 0 == platform.indexOf("Linux"), system.iphone = ua.indexOf("iphone") > -1, 
system.ipod = ua.indexOf("ipod") > -1, system.ipad = ua.indexOf("ipad") > -1, (system.mac || system.iphone || system.ipad || system.ipod) && ua.indexOf("mobile") > -1 && (system.ios = /cpu (?:iphone )?os ([\d\.]+)/.test(ua) ? RegExp.$1.replace(/_/g, ".") : 2), 
/android ([\d\.]+)/.test(ua) && (system.android = RegExp.$1.split(";")[0]);