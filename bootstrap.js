const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;
const Cm = Components.manager;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("extensions.cstbb-extension.");
prefs2 = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getDefaultBranch("extensions.cstbb-extension.");

const THUNDERBIRD_ID = "{3550f703-e582-4d05-9a08-453d09bdfdc6}";  
const FIREFOX_ID = "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}"; 
const SEAMOKEY_ID = "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}"; 
var appInfo = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULAppInfo); 

function install(params, reason) { }

function uninstall(params, reason) {

	// Double check to not delete branch on upgrade.
	// Remove branch on 'real' uninstall only.
	if(ADDON_UPGRADE==reason){return;}
		else if (ADDON_UNINSTALL!=reason) {return;}
			else {this.prefs.deleteBranch("");}
}

function startup(params, reason){

	if(appInfo.ID == FIREFOX_ID){
		this.prefs2.setBoolPref("menubbuttons",false);
		this.prefs2.setBoolPref("tabsbbuttons",false);
		this.prefs2.setCharPref("navbarbuttons","nabbuttons_on");
		this.prefs2.setBoolPref("bookmbuttons1",false);
		this.prefs2.setBoolPref("bookmbuttons2",false);
		this.prefs2.setBoolPref("addonbuttons",false);
		this.prefs2.setBoolPref("aiosbuttons",false);
		this.prefs2.setBoolPref("placesbuttons",false);
		this.prefs2.setBoolPref("tabscrollbut",false);
		this.prefs2.setBoolPref("showforward",false);
		this.prefs2.setCharPref("navbicons","ico_default");
		this.prefs2.setCharPref("buttonbf","bf_default");
		this.prefs2.setIntPref("navdmicons",0);
		this.prefs2.setIntPref("dlindicator",1);
		this.prefs2.setBoolPref("bfdropmarker",false);
		this.prefs2.setCharPref("classicsrg","srg_default");
		this.prefs2.setBoolPref("verdomainid",false);
		this.prefs2.setIntPref("menubbradius",100);
		this.prefs2.setIntPref("tabsbbradius",100);
		this.prefs2.setIntPref("navbbradius",100);
		this.prefs2.setIntPref("bookmbbradius1",100);
		this.prefs2.setIntPref("bookmbbradius2",100);
		this.prefs2.setIntPref("addonbbradius",100);
		this.prefs2.setIntPref("urlsearchbbradius",100);
		this.prefs2.setIntPref("menubbheight",0);
		this.prefs2.setIntPref("navbbheight",0);
		this.prefs2.setIntPref("bookbbheight",0);
		this.prefs2.setIntPref("addonbbheight",0);
		this.prefs2.setIntPref("menubbwidth",0);
		this.prefs2.setIntPref("navbbwidth",0);
		this.prefs2.setIntPref("bookbbwidth",0);
		this.prefs2.setIntPref("addonbbwidth",0);
		this.prefs2.setIntPref("menubbspace",0);
		this.prefs2.setIntPref("tabsbbspace",0);
		this.prefs2.setIntPref("navbbspace",0);
		this.prefs2.setIntPref("bookbbspace",0);
		this.prefs2.setIntPref("bookbispace",0);
		this.prefs2.setIntPref("addonbbspace",0);
		this.prefs2.setIntPref("menubbspace2",0);
		this.prefs2.setIntPref("navbbspace2",0);
		this.prefs2.setIntPref("bookbbspace2",0);
		this.prefs2.setIntPref("addonbbspace2",0);
	}
	else if(appInfo.ID == THUNDERBIRD_ID){
		this.prefs2.setBoolPref("tbmenubbuttons",false);
		this.prefs2.setBoolPref("tbtabsbbuttons",false);
		this.prefs2.setBoolPref("tbmainbbuttons",true);
		this.prefs2.setCharPref("tbmailicons","ico_default");
		this.prefs2.setIntPref("tbmenubbradius",100);
		this.prefs2.setIntPref("tbtabsbbradius",100);
		this.prefs2.setIntPref("tbmainbbradius",100);
		this.prefs2.setIntPref("tbmenubbheight",0);
		this.prefs2.setIntPref("tbmainbbheight",0);
		this.prefs2.setIntPref("tbmenubbwidth",0);
		this.prefs2.setIntPref("tbmainbbwidth",0);
		this.prefs2.setIntPref("tbmainbbspace",0);
		this.prefs2.setIntPref("tbmainbbspace2",0);
	}
	else if(appInfo.ID == SEAMOKEY_ID){
		this.prefs2.setBoolPref("smmenubbuttons",false);
		this.prefs2.setBoolPref("smmainbbuttons",true);
		this.prefs2.setBoolPref("smbookmbuttons1",false);
		this.prefs2.setBoolPref("smbookmbuttons2",false);
		this.prefs2.setCharPref("smnavbicons","ico_default");
		this.prefs2.setCharPref("smmailicons","ico_default");
		this.prefs2.setIntPref("smmainbbradius",100);
		this.prefs2.setIntPref("smmainbbheight",0);
		this.prefs2.setIntPref("smmainbbwidth",0);
		this.prefs2.setIntPref("smmainbbspace",0);
		this.prefs2.setIntPref("smmainbbspace2",0);
	}

	PrefsObserver.init();
}

function shutdown(params, reason){
	PrefsObserver.shutdown();
}

var PrefsObserver = {
	branch: "extensions.cstbb-extension.",

	init: function() {
		for (let cstbboption in cstbbsettings)
			this.updateOption(cstbboption);

		Services.prefs.addObserver(this.branch, this, true);
	},

	shutdown: function() {
		for (let cstbboption in cstbbsettings)
			cstbbsettings[cstbboption].shutdown();

		Services.prefs.removeObserver(this.branch, this);
	},

	updateOption: function(cstbboption) {
		if (!(cstbboption in cstbbsettings))
			return;

		try	{
			let enabled;
			if (cstbboption == "overlay" || cstbboption == "navbarbuttons" || cstbboption == "navbicons" || cstbboption == "tbmailicons" ||  cstbboption == "smnavbicons" || cstbboption == "smmailicons" || cstbboption == "buttonbf" || cstbboption == "classicsrg")
				enabled = true;
			else if (Services.prefs.getPrefType(this.branch + cstbboption) == Ci.nsIPrefBranch.PREF_INT)
				enabled = Services.prefs.getIntPref(this.branch + cstbboption) > -1;
			else
				enabled = Services.prefs.getBoolPref(this.branch + cstbboption);
			if (enabled)
				cstbbsettings[cstbboption].init();
			else
				cstbbsettings[cstbboption].shutdown();

			// Make sure some style sheets always get (re)enabled _after_ 'navbarbuttons' style sheet, if their options are active (->prevents glitches).
			if (cstbboption == "navbarbuttons" && (Services.prefs.getCharPref(this.branch + "buttonbf") != 'bf_default')==true){
				cstbbsettings["buttonbf"].shutdown();
				cstbbsettings["buttonbf"].init();
			}
			if (cstbboption == "navbarbuttons" && (Services.prefs.getIntPref(this.branch + "navbbheight") != 0)==true){
				cstbbsettings["navbbheight"].shutdown();
				cstbbsettings["navbbheight"].init();
			}
			if (cstbboption == "navbarbuttons" && (Services.prefs.getIntPref(this.branch + "navbbwidth") != 0)==true){
				cstbbsettings["navbbwidth"].shutdown();
				cstbbsettings["navbbwidth"].init();
			}

			// Make sure 'navbbheight' style sheet is always (re)enabled _after_ 'buttonbf' style sheet, if both are used (->prevents glitches).
			if (cstbboption == "buttonbf" && enabled==true && (Services.prefs.getIntPref(this.branch + "navbbheight") > 0)==true){
				cstbbsettings["navbbheight"].shutdown();
				cstbbsettings["navbbheight"].init();
			}

		}
		catch (e) {}
	},

	observe: function(subject, topic, data) {
		if (topic != "nsPref:changed" || data.indexOf(this.branch) != 0)
			return;

		this.updateOption(data.substr(this.branch.length));
	},

	QueryInterface: XPCOMUtils.generateQI([Ci.nsISupportsWeakReference, Ci.nsIObserver])
};

var StylesheetManager = {
	uri: null,
	stylesheetService: Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),

	init: function() {
		let stylesheet = this.stylesheet;
		if (this.uri && this.uri.spec == stylesheet) return;

		this.shutdown();

		this.uri = Services.io.newURI(stylesheet, null, null);
		this.stylesheetService.loadAndRegisterSheet(this.uri, Ci.nsIStyleSheetService.USER_SHEET);
	},

	shutdown: function() {
		if (!this.uri) return;

		this.stylesheetService.unregisterSheet(this.uri, Ci.nsIStyleSheetService.USER_SHEET);
		this.uri = null;
	}
};

// add-ons settings area overlay
var CSTBBOverlay = {
	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/overlay.css"
};

// Firefox main settings
var MenuBarButtons = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/menubarbuttons.css"
};

var TabsBarButtons = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/tabsbarbuttons.css"
};

var NavBarButtons = {

	__proto__: StylesheetManager,
		get stylesheet() {
		let radiovalue = Services.prefs.getCharPref(PrefsObserver.branch + "navbarbuttons");
		
		if (radiovalue=="nabbuttons_on") {
			// get OS-string
			var osString = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime).OS;

			if (osString=="WINNT") {
				return "chrome://cstbb-extension/content/css/navbarbuttons.css";
			}
			else return "chrome://cstbb-extension/content/css/navbarbuttons_nw.css";	
		}

		if (radiovalue=="nabbuttons_on_small_ux")	return "chrome://cstbb-extension/content/css/navbarbuttons_small_ux.css";

	}
};

var BookmarksBarButtons1 = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/bookmarksbarbuttons1.css"
};

var BookmarksBarButtons2 = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/bookmarksbarbuttons2.css"
};

var AddonBarButtons = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/addonbarbuttons.css"
};

var AiosButtons = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/aiosbuttons.css"
};

var PlacesButtons = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/placesbuttons.css"
};

//Thunderbird main settings
var TBMenuBarButtons = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/tb_menubar.css"
};

var TBTabsBarButtons = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/tb_tabstoolbar.css"
};

var TBMainBarButtons = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/tb_maintoolbar.css"
};

// Seamokey main settings
var SMMenuBarButtons = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/sm_menutoolbars.css"
};

var SMMainBarButtons = {

	__proto__: StylesheetManager,
		get stylesheet() {
		
			var osString = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime).OS;

			if (Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("general.skins.").getCharPref("selectedSkin") == "classic/1.0") {
				return "chrome://cstbb-extension/content/css/sm_maintoolbars.css";
			}
			else return "chrome://cstbb-extension/content/css/sm_maintoolbars2.css";	

	}
};

var SMBookmarksBarButtons1 = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/sm_bookmarkstoolbar.css"
};

var SMBookmarksBarButtons2 = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/sm_bookmarks.css"
};

// other main settings
var TabScrollButtons = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/tabscrollbuttons.css"
};

var BackForwardDropmarker = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/bfdropmarker.css"
};

// icon settings

//Fx
var NavBarIcons = {

	__proto__: StylesheetManager,
	get stylesheet() {
		let radiovalue = Services.prefs.getCharPref(PrefsObserver.branch + "navbicons");
		
		if (radiovalue=="ico_ff12d")	return "chrome://cstbb-extension/content/css/icons_ff12_dark.css";
		if (radiovalue=="ico_ff12w")	return "chrome://cstbb-extension/content/css/icons_ff12_light.css";
		if (radiovalue=="ico_ff13d")	return "chrome://cstbb-extension/content/css/icons_ff13_dark.css";
		if (radiovalue=="ico_ff13w")	return "chrome://cstbb-extension/content/css/icons_ff13_light.css";
		if (radiovalue=="ico_ff1") 		return "chrome://cstbb-extension/content/css/icons_ff1.css";
		if (radiovalue=="ico_ff2")		return "chrome://cstbb-extension/content/css/icons_ff2.css";
		if (radiovalue=="ico_ff3v1")	return "chrome://cstbb-extension/content/css/icons_ff3v1.css";
		if (radiovalue=="ico_ff3v2")	return "chrome://cstbb-extension/content/css/icons_ff3v2.css";
		if (radiovalue=="ico_tango")	return "chrome://cstbb-extension/content/css/icons_tango.css";
		if (radiovalue=="ico_ffmac")	return "chrome://cstbb-extension/content/css/icons_mac.css";
		if (radiovalue=="ico_sm")		return "chrome://cstbb-extension/content/css/icons_sm.css";
		if (radiovalue=="ico_mix")		return "chrome://cstbb-extension/content/css/icons_ffmix.css";
		if (radiovalue=="ico_noia")		return "chrome://cstbb-extension/content/css/icons_noia.css";
	}
};

//Tb
var ThunderbirdMainIcons = {

	__proto__: StylesheetManager,
	get stylesheet() {
		let radiovalue = Services.prefs.getCharPref(PrefsObserver.branch + "tbmailicons");
		
		if (radiovalue=="ico_tb17d")	return "chrome://cstbb-extension/content/css/tb_icons_dark.css";
		if (radiovalue=="ico_tb17w")	return "chrome://cstbb-extension/content/css/tb_icons_white.css";
		if (radiovalue=="ico_tb1")		return "chrome://cstbb-extension/content/css/tb_icons_tb1.css";
		if (radiovalue=="ico_tb2")		return "chrome://cstbb-extension/content/css/tb_icons_tb2.css";
		if (radiovalue=="ico_tb3v1")	return "chrome://cstbb-extension/content/css/tb_icons_tb3.css";
		if (radiovalue=="ico_tb3v2")	return "chrome://cstbb-extension/content/css/tb_icons_tb3_strata.css";
		if (radiovalue=="ico_tbmac")	return "chrome://cstbb-extension/content/css/tb_icons_tb_mac.css";
	}
};

//Sm
var SeamonkeyNavBarIcons = {

	__proto__: StylesheetManager,
	get stylesheet() {
		let radiovalue = Services.prefs.getCharPref(PrefsObserver.branch + "smnavbicons");
		
		if (radiovalue=="ico_ff12d")	return "chrome://cstbb-extension/content/css/sm_icons_ff12_dark.css";
		if (radiovalue=="ico_ff12w")	return "chrome://cstbb-extension/content/css/sm_icons_ff12_light.css";
		if (radiovalue=="ico_ff13d")	return "chrome://cstbb-extension/content/css/sm_icons_ff13_dark.css";
		if (radiovalue=="ico_ff13w")	return "chrome://cstbb-extension/content/css/sm_icons_ff13_light.css";
		if (radiovalue=="ico_ff1") 		return "chrome://cstbb-extension/content/css/sm_icons_ff1.css";
		if (radiovalue=="ico_ff2")		return "chrome://cstbb-extension/content/css/sm_icons_ff2.css";
		if (radiovalue=="ico_ff3v1")	return "chrome://cstbb-extension/content/css/sm_icons_ff3v1.css";
		if (radiovalue=="ico_ff3v2")	return "chrome://cstbb-extension/content/css/sm_icons_ff3v2.css";
		if (radiovalue=="ico_tango")	return "chrome://cstbb-extension/content/css/sm_icons_tango.css";
		if (radiovalue=="ico_ffmac")	return "chrome://cstbb-extension/content/css/sm_icons_mac.css";
		if (radiovalue=="ico_sm")		return "chrome://cstbb-extension/content/css/sm_icons_sm.css";
		if (radiovalue=="ico_mix")		return "chrome://cstbb-extension/content/css/sm_icons_ffmix.css";
		if (radiovalue=="ico_noia")		return "chrome://cstbb-extension/content/css/sm_icons_noia.css";
	}
};

var SeamonkeyMailIcons = {

	__proto__: StylesheetManager,
	get stylesheet() {
		let radiovalue = Services.prefs.getCharPref(PrefsObserver.branch + "smmailicons");
		
		if (radiovalue=="ico_tb17d")	return "chrome://cstbb-extension/content/css/sm_icons_tb_dark.css";
		if (radiovalue=="ico_tb17w")	return "chrome://cstbb-extension/content/css/sm_icons_tb_white.css";
		if (radiovalue=="ico_tb1")		return "chrome://cstbb-extension/content/css/sm_icons_tb1.css";
		if (radiovalue=="ico_tb2")		return "chrome://cstbb-extension/content/css/sm_icons_tb2.css";
		if (radiovalue=="ico_tb3v1")	return "chrome://cstbb-extension/content/css/sm_icons_tb3.css";
		if (radiovalue=="ico_tb3v2")	return "chrome://cstbb-extension/content/css/sm_icons_tb3_strata.css";
		if (radiovalue=="ico_tbmac")	return "chrome://cstbb-extension/content/css/sm_icons_tb_mac.css";
	}
};

//Fx
var BackForwardButton = {

	__proto__: StylesheetManager,
	get stylesheet(){
		try{
			let radiovalue = Services.prefs.getCharPref(PrefsObserver.branch + "buttonbf");
			if (radiovalue=="bf_green"){
				if (Services.prefs.getCharPref(PrefsObserver.branch + "navbarbuttons")=="nabbuttons_on_small_ux") return "chrome://cstbb-extension/content/css/icons_bf_ff3_greensmall.css";
				else return "chrome://cstbb-extension/content/css/icons_bf_ff3_green.css";
			}
			if (radiovalue=="bf_blue"){
				if (Services.prefs.getCharPref(PrefsObserver.branch + "navbarbuttons")=="nabbuttons_on_small_ux") return "chrome://cstbb-extension/content/css/icons_bf_ff3_bluesmall.css";
				else return "chrome://cstbb-extension/content/css/icons_bf_ff3_blue.css";
			}
			if (radiovalue=="bf_blue2"){
				if (Services.prefs.getCharPref(PrefsObserver.branch + "navbarbuttons")=="nabbuttons_on_small_ux") return "chrome://cstbb-extension/content/css/icons_bf_ff3_blue_v2small.css";
				else return "chrome://cstbb-extension/content/css/icons_bf_ff3_blue_v2.css";
			}
			if (radiovalue=="bf_red"){
				if (Services.prefs.getCharPref(PrefsObserver.branch + "navbarbuttons")=="nabbuttons_on_small_ux") return "chrome://cstbb-extension/content/css/icons_bf_ff3_redsmall.css";
				else return "chrome://cstbb-extension/content/css/icons_bf_ff3_red.css";
			}
			if (radiovalue=="bf_orange"){
				if (Services.prefs.getCharPref(PrefsObserver.branch + "navbarbuttons")=="nabbuttons_on_small_ux") return "chrome://cstbb-extension/content/css/icons_bf_ff3_orangesmall.css";
				else return "chrome://cstbb-extension/content/css/icons_bf_ff3_orange.css";
			}
			if (radiovalue=="bf_ie8"){
				if (Services.prefs.getCharPref(PrefsObserver.branch + "navbarbuttons")=="nabbuttons_on_small_ux") return "chrome://cstbb-extension/content/css/icons_bf_ie8small.css";
				else return "chrome://cstbb-extension/content/css/icons_bf_ie8.css";
			}
			if (radiovalue=="bf_ie9"){
				if (Services.prefs.getCharPref(PrefsObserver.branch + "navbarbuttons")=="nabbuttons_on_small_ux") return "chrome://cstbb-extension/content/css/icons_bf_ie9small.css";
				else return "chrome://cstbb-extension/content/css/icons_bf_ie9.css";
			}
		}catch(e) {Cu.reportError(e)}
	}
	
};

var NavDmIcons = {

	__proto__: StylesheetManager,
	get stylesheet(){
		try{
			let radiovalue = Services.prefs.getIntPref(PrefsObserver.branch + "navdmicons");
			if (radiovalue==1) return "chrome://cstbb-extension/content/css/icons_dm_small_dark.css";
			if (radiovalue==2) return "chrome://cstbb-extension/content/css/icons_dm_big_dark.css";
			if (radiovalue==3) return "chrome://cstbb-extension/content/css/icons_dm_small_light.css";
			if (radiovalue==4) return "chrome://cstbb-extension/content/css/icons_dm_big_light.css";
		}catch(e) {Cu.reportError(e)}
	}
	
};

var DlIndicator = {

	__proto__: StylesheetManager,
	get stylesheet(){
		try{
			let radiovalue = Services.prefs.getIntPref(PrefsObserver.branch + "dlindicator");
			if (radiovalue==1) return "chrome://cstbb-extension/content/css/dl_indicator_modern_icon1.css";
			if (radiovalue==2) return "chrome://cstbb-extension/content/css/dl_indicator_modern_icon2.css";
		}catch(e) {Cu.reportError(e)}
	}
	
};

// other tweaks and settings
var ClassicSRGButton = {

	__proto__: StylesheetManager,
	get stylesheet() {
		let radiovalue = Services.prefs.getCharPref(PrefsObserver.branch + "classicsrg");
		
		if (radiovalue=="srg_classic")	return "chrome://cstbb-extension/content/css/srg-classic.css";
		if (radiovalue=="srg_austr")	return "chrome://cstbb-extension/content/css/srg-austr.css";
	}

};

var VerifiedDomainsIdentities = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/verifieddomid.css"
};

var ShowForwardButton = {

	__proto__: StylesheetManager,
	stylesheet: "chrome://cstbb-extension/content/css/showforward.css"
};

// radius settings
var MenuBarButtonRadius = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("menubbradius")!=100){
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#toolbar-menubar toolbarbutton[type="menu"],\
							#toolbar-menubar .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							#toolbar-menubar .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker,\
							#toolbar-menubar .toolbarbutton-1,\
							#toolbar-menubar .bookmark-item:not(menu):not(menuitem){\
								border-radius: '+prefs.getIntPref("menubbradius")/2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var TabsBarButtonRadius = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("tabsbbradius")!=100){
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#TabsToolbar toolbarbutton[type="menu"]:not(#ctr_appbutton),\
							#TabsToolbar .toolbarbutton-1:not(#ctr_appbutton) > .toolbarbutton-menubutton-button,\
							#TabsToolbar .toolbarbutton-1:not(#ctr_appbutton) > .toolbarbutton-menubutton-dropmarker,\
							#TabsToolbar .toolbarbutton-1:not(#ctr_appbutton),\
							#TabsToolbar .bookmark-item:not(menu):not(menuitem){\
								border-radius: '+prefs.getIntPref("tabsbbradius")/2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var NavBarButtonRadius = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("navbbradius")!=100){
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#navigator-toolbox[iconsize=large] #nav-bar toolbarbutton[type="menu"],\
							#navigator-toolbox[iconsize=small] #nav-bar toolbarbutton[type="menu"],\
							#navigator-toolbox[iconsize=small] #nav-bar .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							#navigator-toolbox[iconsize=small] #nav-bar .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker,\
							#navigator-toolbox[iconsize=small] #nav-bar .toolbarbutton-1,\
							#navigator-toolbox[iconsize=large] #nav-bar toolbarbutton[type="menu-button"] > .toolbarbutton-icon,\
							#navigator-toolbox[iconsize=large] #nav-bar .toolbarbutton-menubutton-dropmarker > image,\
							#navigator-toolbox[iconsize=large] #nav-bar .toolbarbutton-menubutton-button .toolbarbutton-icon,\
							#navigator-toolbox[iconsize=large] #nav-bar .toolbarbutton-1:hover > .toolbarbutton-icon,\
							#navigator-toolbox[iconsize=large] #nav-bar .toolbarbutton-1[checked=true] > .toolbarbutton-icon,\
							#navigator-toolbox[iconsize=large] #nav-bar .toolbarbutton-1[open=true] > .toolbarbutton-icon,\
							#navigator-toolbox[iconsize=large] #nav-bar .toolbarbutton-1[type="menu-button"] > .toolbarbutton-icon,\
							#navigator-toolbox[iconsize=large] #nav-bar .toolbarbutton-1[type="menu-button"] > .toolbarbutton-menubutton-dropmarker::before,\
							#navigator-toolbox[iconsize=large][mode=icons] > #nav-bar .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							#navigator-toolbox[iconsize=large][mode=icons] > #nav-bar .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker,\
							#navigator-toolbox[iconsize=large][mode=icons] > #nav-bar .toolbarbutton-1:not(#ctr_back-button):not(#ctr_forward-button):not(#back-button):not(#forward-button):not([type="menu-button"]),\
							#nav-bar .bookmark-item:not(menu):not(menuitem){\
								border-radius: '+prefs.getIntPref("navbbradius")/2+'px !important;\
							}\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]),#nav-bar) > #unified-back-forward-button > #forward-button > .toolbarbutton-icon,\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]),#nav-bar) > #nav-bar-customizationtarget > #unified-back-forward-button > #forward-button > .toolbarbutton-icon,\
							#nav-bar #urlbar-container > #forward-button > .toolbarbutton-icon {\
							  border-bottom-right-radius: 0px !important;\
							  border-top-right-radius: 0px !important;\
							  border-bottom-left-radius: 0px !important;\
							  border-top-left-radius: 0px !important;\
							}\
							#navigator-toolbox[iconsize=large][mode=icons] > #nav-bar #ctr_back-button > .toolbarbutton-icon{\
								border-radius: 10000px !important;\
							}\
							#navigator-toolbox[iconsize=large] #nav-bar #ctr_forward-button:hover > .toolbarbutton-icon,\
							#navigator-toolbox[iconsize=large] #nav-bar #ctr_forward-button > .toolbarbutton-icon,\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]),#nav-bar:not([currentset])) > #unified-back-forward-button > #forward-button > .toolbarbutton-icon,\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]),#nav-bar:not([currentset])) > #nav-bar-customizationtarget > #unified-back-forward-button > #forward-button > .toolbarbutton-icon {\
							  border-bottom-right-radius: '+prefs.getIntPref("navbbradius")/2+'px !important;\
							  border-top-right-radius: '+prefs.getIntPref("navbbradius")/2+'px !important;\
							  border-bottom-left-radius: 0px !important;\
							  border-top-left-radius: 0px !important;\
							}\
							#navigator-toolbox #nav-bar #ctr_forward-button:-moz-locale-dir(ltr),\
							#navigator-toolbox #nav-bar #ctr_back-button:-moz-locale-dir(rtl) {\
							  border-bottom-right-radius: '+prefs.getIntPref("navbbradius")/2+'px !important;\
							  border-top-right-radius: '+prefs.getIntPref("navbbradius")/2+'px !important;\
							}\
							#navigator-toolbox #nav-bar #ctr_forward-button:-moz-locale-dir(rtl),\
							#navigator-toolbox #nav-bar #ctr_back-button:-moz-locale-dir(ltr) {\
							  border-bottom-left-radius: '+prefs.getIntPref("navbbradius")/2+'px !important;\
							  border-top-left-radius: '+prefs.getIntPref("navbbradius")/2+'px !important;\
							}\
							#navigator-toolbox[iconsize=large][mode=icons] > #nav-bar .toolbarbutton-1 > .toolbarbutton-menubutton-button {\
							  border-bottom-left-radius: '+prefs.getIntPref("navbbradius")/2+'px !important;\
							  border-top-left-radius: '+prefs.getIntPref("navbbradius")/2+'px !important;\
							  border-bottom-right-radius: 0px !important;\
							  border-top-right-radius: 0px !important;\
							}\
							#navigator-toolbox[iconsize=large][mode=icons] > #nav-bar .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker {\
							  border-bottom-right-radius: '+prefs.getIntPref("navbbradius")/2+'px !important;\
							  border-top-right-radius: '+prefs.getIntPref("navbbradius")/2+'px !important;\
							  border-bottom-left-radius: 0px !important;\
							  border-top-left-radius: 0px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var BookmarksBarButtonsRadius1 = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("bookmbbradius1")!=100){
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#PersonalToolbar toolbarbutton[type="menu"],\
							#PersonalToolbar .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							#PersonalToolbar .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker,\
							#PersonalToolbar .toolbarbutton-1 {\
								border-radius: '+prefs.getIntPref("bookmbbradius1")/2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var BookmarksBarButtonsRadius2 = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("bookmbbradius2")!=100){
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#PersonalToolbar .bookmark-item:not(menu):not(menuitem) {\
								border-radius: '+prefs.getIntPref("bookmbbradius2")/2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var AddonbarButtonRadius = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("addonbbradius")!=100){
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#addon-bar toolbarbutton[type="menu"],\
							#addon-bar .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							#addon-bar .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker,\
							#addon-bar .toolbarbutton-1,\
							#addon-bar .bookmark-item:not(menu):not(menuitem){\
								border-radius: '+prefs.getIntPref("addonbbradius")/2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};
	
var UrlSearchBarBorderRadius = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("urlsearchbbradius")!=100){
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#urlbar:-moz-locale-dir(rtl) .verifiedDomain,\
							#urlbar:-moz-locale-dir(rtl) .verifiedIdentity,\
							#TabsToolbar:-moz-locale-dir(ltr) :-moz-any(#urlbar-go-button,#urlbar-reload-button,#urlbar-stop-button),\
							#toolbar-menubar:-moz-locale-dir(ltr) :-moz-any(#urlbar-go-button,#urlbar-reload-button,#urlbar-stop-button),\
							#PersonalToolbar:-moz-locale-dir(ltr) :-moz-any(#urlbar-go-button,#urlbar-reload-button,#urlbar-stop-button),\
							#addon-bar:-moz-locale-dir(ltr) :-moz-any(#urlbar-go-button,#urlbar-reload-button,#urlbar-stop-button),\
							#nav-bar:-moz-locale-dir(ltr) :-moz-any(#urlbar-go-button,#urlbar-reload-button,#urlbar-stop-button),\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar[currentset*="unified-back-forward-button,urlbar-container"]) #urlbar:-moz-locale-dir(ltr){\
								border-top-right-radius:'+prefs.getIntPref("urlsearchbbradius")/2+'px !important;\
								border-bottom-right-radius:'+prefs.getIntPref("urlsearchbbradius")/2+'px !important;\
							}\
							#urlbar:-moz-locale-dir(ltr) .verifiedDomain,\
							#urlbar:-moz-locale-dir(ltr) .verifiedIdentity,\
							#TabsToolbar:-moz-locale-dir(rtl) :-moz-any(#urlbar-go-button,#urlbar-reload-button,#urlbar-stop-button),\
							#toolbar-menubar:-moz-locale-dir(rtl) :-moz-any(#urlbar-go-button,#urlbar-reload-button,#urlbar-stop-button),\
							#PersonalToolbar:-moz-locale-dir(rtl) :-moz-any(#urlbar-go-button,#urlbar-reload-button,#urlbar-stop-button),\
							#addon-bar:-moz-locale-dir(rtl) :-moz-any(#urlbar-go-button,#urlbar-reload-button,#urlbar-stop-button),\
							#nav-bar:-moz-locale-dir(rtl) :-moz-any(#urlbar-go-button,#urlbar-reload-button,#urlbar-stop-button),\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar[currentset*="unified-back-forward-button,urlbar-container"]) #urlbar:-moz-locale-dir(rtl){\
								border-top-left-radius:'+prefs.getIntPref("urlsearchbbradius")/2+'px !important;\
								border-bottom-left-radius:'+prefs.getIntPref("urlsearchbbradius")/2+'px !important;\
							}\
							window:not([chromehidden~=toolbar]) :-moz-any(#TabsToolbar, #toolbar-menubar, #PersonalToolbar, #addon-bar) #urlbar,\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"])) #urlbar,\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=small][mode=icons] #urlbar{\
								border-radius:'+prefs.getIntPref("urlsearchbbradius")/2+'px !important;\
							}\
							.searchbar-textbox{\
								border-radius:'+prefs.getIntPref("urlsearchbbradius")/2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

// Thunderbird radius settings

var TBMenuBarButtonRadius = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("tbmenubbradius")!=100){
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document	url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul) {\
							.chromeclass-menubar toolbarbutton[type="menu"],\
							.chromeclass-menubar .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							.chromeclass-menubar .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker,\
							.chromeclass-menubar .toolbarbutton-1{\
								border-radius: '+prefs.getIntPref("tbmenubbradius")/2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var TBTabsBarButtonRadius = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("tbtabsbbradius")!=100){
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document	url(chrome://messenger/content/messenger.xul){\
							#tabs-toolbar #alltabs-button,\
							#tabbar-toolbar toolbarbutton[type="menu"],\
							#tabbar-toolbar toolbarbutton,\
							#tabbar-toolbar .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							#tabbar-toolbar .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker,\
							#tabbar-toolbar .toolbarbutton-1{\
								border-radius: '+prefs.getIntPref("tbtabsbbradius")/2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var TBMainBarButtonRadius = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("tbmainbbradius")!=100){
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document	url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://calendar/content/calendar-event-dialog.xul){\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker,\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1{\
								border-radius: '+prefs.getIntPref("tbmainbbradius")/2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};	

// Seamonkey radius settings

var SMMainBarButtonRadius = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("smmainbbradius")!=100){
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document  url(chrome://navigator/content/navigator.xul),\
										url(chrome://editor/content/editor.xul),\
										url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://calendar/content/calendar-event-dialog.xul){\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker,\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1{\
								border-radius: '+prefs.getIntPref("smmainbbradius")/2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};	


// height settings
var MenubarButtonHeight = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("menubbheight")!=0){
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#toolbar-menubar toolbarbutton:not(#back-forward-dropmarker):not(.toolbarbutton-menubutton-button){\
								min-height: '+prefs.getIntPref("menubbheight")+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var NavbarButtonHeight = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("navbbheight");
				if(value!=0){
					
				  switch (value) {
					case 25: s1=0.5;	s2=-0; s3=-11; break;
					case 26: s1=1;		s2=-1; s3=-11; break;
					case 27: s1=1.5;	s2=-1; s3=-12; break;
					case 28: s1=2;		s2=-1; s3=-13; break;
					case 29: s1=2.5;	s2=-2; s3=-13; break;
					case 30: s1=3;		s2=-2; s3=-13; break;
					case 31: s1=3.5;	s2=-2; s3=-13; break;
					case 32: s1=4;		s2=-2; s3=-14; break;
					case 33: s1=4.5;	s2=-3; s3=-14; break;
					case 34: s1=5;		s2=-3; s3=-14; break;
					case 35: s1=5.5;	s2=-3; s3=-15; break;
					case 36: s1=6;		s2=-4; s3=-15; break;
					case 37: s1=6.5;	s2=-4; s3=-15; break;
					case 38: s1=7;		s2=-4; s3=-16; break;
					case 39: s1=7.5;	s2=-5; s3=-16; break;
					case 40: s1=8;		s2=-5; s3=-17; break;
					case 41: s1=8.5;	s2=-5; s3=-17; break;
					case 42: s1=9;		s2=-6; s3=-17; break;
					case 43: s1=9.5;	s2=-6; s3=-18; break;
					case 44: s1=10;		s2=-6; s3=-18; break;
					case 45: s1=10.5;	s2=-7; s3=-18; break;
					case 46: s1=11;		s2=-7; s3=-19; break;
					case 47: s1=11.5;	s2=-7; s3=-19; break;
					case 48: s1=12;		s2=-8; s3=-19; break;
					case 49: s1=12.5;	s2=-8; s3=-20; break;
					case 50: s1=13;		s2=-8; s3=-20; break;
				  }
				  
				  s4=3; s5=5;
				  
				  if((Services.prefs.getCharPref("extensions.cstbb-extension.buttonbf") != "bf_default")==false){
				    
					if (Services.prefs.getCharPref(PrefsObserver.branch + "navbarbuttons")=="nabbuttons_on_small_ux") { s3=0; s4=0; s5=0; }
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#navigator-toolbox[iconsize=large] #nav-bar toolbarbutton:not(#ctr_back-button):not(#ctr_forward-button):not(#back-button):not(#forward-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.bookmark-item):not(#zoompage-zoomin-s):not(#zoompage-zoomout-s):not(#zoompage-zoomreset-t):not(#zoompage-zoomdisplay-t):not(#zoompage-zoomout-t):not(#zoompage-zoomin-t):not(.quick-engine-button),\
							#navigator-toolbox[iconsize=small] #nav-bar toolbarbutton:not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(#zoompage-zoomin-s):not(#zoompage-zoomout-s):not(#zoompage-zoomdisplay-t):not(#zoompage-zoomout-t):not(#zoompage-zoomin-t):not(.quick-engine-button){\
								min-height: '+value+'px !important;\
							}\
							#navigator-toolbox[iconsize=large] #nav-bar #urlbar toolbarbutton:not(#ctr_back-button):not(#ctr_forward-button):not(#back-button):not(#forward-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.quick-engine-button),\
							#navigator-toolbox[iconsize=small] #nav-bar #urlbar toolbarbutton:not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.quick-engine-button){\
								min-height: 16px !important;\
							}\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]),#nav-bar:not([currentset])) > #unified-back-forward-button > #back-button > .toolbarbutton-icon,\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]),#nav-bar:not([currentset])) > #nav-bar-customizationtarget > #unified-back-forward-button > #back-button > .toolbarbutton-icon {\
							  -moz-margin-end: '+s2+'px !important;\
							  padding: '+(5+s1)+'px !important;\
							}\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]),#nav-bar:not([currentset])) > #unified-back-forward-button > #forward-button > .toolbarbutton-icon,\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]),#nav-bar:not([currentset])) > #nav-bar-customizationtarget > #unified-back-forward-button > #forward-button > .toolbarbutton-icon{\
							  padding: '+(2+s1)+'px '+(2+s1)+'px '+(2+s1)+'px '+(7+s1)+'px !important;\
							}\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > #nav-bar #ctr_back-button > .toolbarbutton-icon {\
							  padding: '+(s5+s1)+'px !important;\
							}\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > #nav-bar #ctr_forward-button:-moz-locale-dir(ltr) {\
							  -moz-margin-start: '+(s4+s3)+'px !important;\
							}\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > #nav-bar #ctr_forward-button > .toolbarbutton-icon {\
							  padding: '+s1+'px '+s1+'px '+s1+'px '+(s5+s1)+'px !important;\
							}\
						}\
					');
				  }
				  else {

					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#navigator-toolbox[iconsize=large] #nav-bar toolbarbutton:not(#ctr_back-button):not(#ctr_forward-button):not(#back-button):not(#forward-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.bookmark-item):not(#zoompage-zoomin-s):not(#zoompage-zoomout-s):not(#zoompage-zoomreset-t):not(#zoompage-zoomdisplay-t):not(#zoompage-zoomout-t):not(#zoompage-zoomin-t):not(.quick-engine-button),\
							#navigator-toolbox[iconsize=small] #nav-bar toolbarbutton:not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(#zoompage-zoomin-s):not(#zoompage-zoomout-s):not(#zoompage-zoomdisplay-t):not(#zoompage-zoomout-t):not(#zoompage-zoomin-t):not(.quick-engine-button){\
								min-height: '+value+'px !important;\
							}\
							#navigator-toolbox[iconsize=large] #nav-bar #urlbar toolbarbutton:not(#ctr_back-button):not(#ctr_forward-button):not(#back-button):not(#forward-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.quick-engine-button),\
							#navigator-toolbox[iconsize=small] #nav-bar #urlbar toolbarbutton:not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.quick-engine-button){\
								min-height: 16px !important;\
							}\
						}\
					');				  
				  
				  }
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var BookmarksbarButtonHeight = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("bookbbheight")!=0){
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#PersonalToolbar toolbarbutton:not(.toolbarbutton-menubutton-button):not(.bookmark-item){\
								min-height: '+prefs.getIntPref("bookbbheight")+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var AddonbarButtonHeight = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("addonbbheight")!=0){
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#addon-bar toolbarbutton:not(.toolbarbutton-menubutton-button){\
								min-height: '+prefs.getIntPref("addonbbheight")+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

// Thunderbird height settings

var TBMenubarButtonHeight = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("tbmenubbheight")!=0){
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@-moz-document	url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul) {\
							.chromeclass-menubar .toolbarbutton-1:not(.toolbarbutton-menubutton-button){\
								min-height: '+prefs.getIntPref("tbmenubbheight")+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var TBMainbarButtonHeight = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("tbmainbbheight")!=0){
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document	url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://calendar/content/calendar-event-dialog.xul){\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker,\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1{\
								min-height: '+prefs.getIntPref("tbmainbbheight")+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

// Seamonkey height settings

var SMMainbarButtonHeight = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("smmainbbheight")!=0){
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document  url(chrome://navigator/content/navigator.xul),\
										url(chrome://editor/content/editor.xul),\
										url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://calendar/content/calendar-event-dialog.xul){\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker,\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1{\
								min-height: '+prefs.getIntPref("smmainbbheight")+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

// width settings
var MenubarButtonWidth = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("menubbwidth")!=0){
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#toolbar-menubar toolbarbutton:not(#back-forward-dropmarker):not(.toolbarbutton-menubutton-button){\
								min-width: '+prefs.getIntPref("menubbwidth")+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var NavbarButtonWidth = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("navbbwidth")!=0){
				
				var text='';
				
				  if (Services.prefs.getCharPref(PrefsObserver.branch + "navbarbuttons")=="nabbuttons_on_small_ux") {
					
					text='\
					  #nav-bar #ctr_back-button,\
					  #nav-bar #ctr_forward-button {\
					    min-width: '+prefs.getIntPref("navbbwidth")+'px !important;\
					  }\
					';
				  }
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#navigator-toolbox[iconsize=large] #nav-bar toolbarbutton:not(#ctr_back-button):not(#ctr_forward-button):not(#back-button):not(#forward-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.bookmark-item):not(#zoompage-zoomin-s):not(#zoompage-zoomout-s):not(#zoompage-zoomreset-t):not(#zoompage-zoomout-t):not(#zoompage-zoomin-t):not(#zoompage-zoomout-c):not(#zoompage-zoomin-c):not(#zoompage-zoomout-n):not(#zoompage-zoomin-n):not(.quick-engine-button),\
							#navigator-toolbox[iconsize=large] #nav-bar .toolbarbutton-menubutton-button{\
								min-width: '+prefs.getIntPref("navbbwidth")+'px !important;\
							}\
							#navigator-toolbox[iconsize=large] #nav-bar #urlbar toolbarbutton:not(#ctr_back-button):not(#ctr_forward-button):not(#back-button):not(#forward-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.bookmark-item):not(#zoompage-zoomin-s):not(#zoompage-zoomout-s):not(#zoompage-zoomreset-t):not(#zoompage-zoomout-t):not(#zoompage-zoomin-t):not(.quick-engine-button),\
							#navigator-toolbox[iconsize=large] #nav-bar #urlbar .toolbarbutton-menubutton-button{\
								min-width: 16px !important;\
							}\
							#navigator-toolbox[iconsize=small] #nav-bar toolbarbutton:not(#back-forward-dropmarker):not(.toolbarbutton-menubutton-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.quick-engine-button):not(#zoompage-zoomin-s):not(#zoompage-zoomout-s):not(#zoompage-zoomin-t):not(#zoompage-zoomout-t):not(#zoompage-zoomin-n):not(#zoompage-zoomout-n):not(#zoompage-zoomin-c):not(#zoompage-zoomout-c),\
							#navigator-toolbox[iconsize=small] #nav-bar .toolbarbutton-menubutton-button{\
								min-width: '+prefs.getIntPref("navbbwidth")+'px !important;\
							}\
							#navigator-toolbox[iconsize=small] #nav-bar #urlbar toolbarbutton:not(#back-forward-dropmarker):not(.toolbarbutton-menubutton-button):not(#urlbar-go-button):not(#urlbar-reload-button),\
							#navigator-toolbox[iconsize=small] #nav-bar #urlbar .toolbarbutton-menubutton-button{\
								min-width: 16px !important;\
							}\
						}\
						'+text+'\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var BookmarksbarButtonWidth = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("bookbbwidth")!=0){
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#PersonalToolbar toolbarbutton:not(#back-forward-dropmarker):not(.toolbarbutton-menubutton-button):not(.bookmark-item),\
							#PersonalToolbar .toolbarbutton-menubutton-button:not(.bookmark-item){\
								min-width: '+prefs.getIntPref("bookbbwidth")+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var AddonbarButtonWidth = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("addonbbwidth")!=0){
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#addon-bar toolbarbutton:not(#back-forward-dropmarker):not(.toolbarbutton-menubutton-button),\
							#addon-bar .toolbarbutton-menubutton-button{\
								min-width: '+prefs.getIntPref("addonbbwidth")+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

// Thunderbird width settings

var TBMenubarButtonWidth = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("tbmenubbwidth")!=0){
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@-moz-document	url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul) {\
							.chromeclass-menubar .toolbarbutton-1:not(.toolbarbutton-menubutton-button){\
								min-width: '+prefs.getIntPref("tbmenubbwidth")+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var TBMainbarButtonWidth = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("tbmainbbwidth")!=0){
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document	url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://calendar/content/calendar-event-dialog.xul){\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1{\
								min-width: '+prefs.getIntPref("tbmainbbwidth")+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

// Seamonkey width settings

var SMMainbarButtonWidth = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("smmainbbwidth")!=0){
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document  url(chrome://navigator/content/navigator.xul),\
										url(chrome://editor/content/editor.xul),\
										url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://calendar/content/calendar-event-dialog.xul){\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1{\
								min-width: '+prefs.getIntPref("smmainbbwidth")+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

// space settings (left/right)

var MenubarButtonsSpace = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("menubbspace");
				if(value!=0){
					let menubb_space = 2;	//initialize value (not used anyway)
					let menubb_space_x = menubb_space;
					
					switch (value) {
						case 1: menubb_space=-1/2; menubb_space_x = 0; break;
						case 2: menubb_space=0; break;
						case 3: menubb_space=1/2; break;
						case 4: menubb_space=2/2; break;
						case 5: menubb_space=3/2; break;
						case 6: menubb_space=4/2; break;
						case 7: menubb_space=5/2; break;
						case 8: menubb_space=6/2; break;
						case 9: menubb_space=7/2; break;
						case 10: menubb_space=8/2; break;
						case 11: menubb_space=9/2; break;
						case 12: menubb_space=10/2; break;
						case 13: menubb_space=11/2; break;
						case 14: menubb_space=12/2; break;
						case 15: menubb_space=13/2; break;
						case 16: menubb_space=14/2; break;
						case 17: menubb_space=15/2; break;
						case 18: menubb_space=16/2; break;
						case 19: menubb_space=17/2; break;
						case 20: menubb_space=18/2; break;
						case 21: menubb_space=19/2; break;
						case 22: menubb_space=20/2; break;
					}
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#toolbar-menubar toolbarbutton:not(#back-forward-dropmarker):not(#forward-button):not(#zoom-in-button):not(.toolbarbutton-menubutton-button) {\
								margin-left: '+menubb_space+'px !important;\
							}\
							#toolbar-menubar toolbarbutton:not(#back-button):not(#zoom-out-button):not(.toolbarbutton-menubutton-button) {\
								margin-right: '+menubb_space+'px !important;\
							}\
							#toolbar-menubar #back-forward-dropmarker{\
								margin-left:-'+menubb_space_x+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var TabsbarButtonsSpace = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("tabsbbspace");
				if(value!=0){
					let tabsbb_space = 2;	//initialize value (not used anyway)
					let tabsbb_space_x = tabsbb_space;
					
					switch (value) {
						case 1: tabsbb_space=-1/2; tabsbb_space_x = 0; break;
						case 2: tabsbb_space=0; break;
						case 3: tabsbb_space=1/2; break;
						case 4: tabsbb_space=2/2; break;
						case 5: tabsbb_space=3/2; break;
						case 6: tabsbb_space=4/2; break;
						case 7: tabsbb_space=5/2; break;
						case 8: tabsbb_space=6/2; break;
						case 9: tabsbb_space=7/2; break;
						case 10: tabsbb_space=8/2; break;
						case 11: tabsbb_space=9/2; break;
						case 12: tabsbb_space=10/2; break;
						case 13: tabsbb_space=11/2; break;
						case 14: tabsbb_space=12/2; break;
						case 15: tabsbb_space=13/2; break;
						case 16: tabsbb_space=14/2; break;
						case 17: tabsbb_space=15/2; break;
						case 18: tabsbb_space=16/2; break;
						case 19: tabsbb_space=17/2; break;
						case 20: tabsbb_space=18/2; break;
						case 21: tabsbb_space=19/2; break;
						case 22: tabsbb_space=20/2; break;
					}
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#TabsToolbar .toolbarbutton-1:not(#ctr_appbutton):not(#back-forward-dropmarker):not(#forward-button):not(#zoom-in-button):not(.toolbarbutton-menubutton-button) {\
								margin-left: '+tabsbb_space+'px !important;\
							}\
							#TabsToolbar .toolbarbutton-1:not(#ctr_appbutton):not(#back-button):not(#zoom-out-button):not(.toolbarbutton-menubutton-button) {\
								margin-right: '+tabsbb_space+'px !important;\
							}\
							#TabsToolbar #back-forward-dropmarker{\
								margin-left:-'+tabsbb_space_x+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var NavbarButtonsSpace = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("navbbspace");
				if(value!=0){
					let navbb_space = 2;	//initialize value (not used anyway)
					let navbb_space_x = navbb_space;

					switch (value) {
						case 1: navbb_space=-1/2; navbb_space_x=0; break;
						case 2: navbb_space=0; break;
						case 3: navbb_space=1/2; break;
						case 4: navbb_space=2/2; break;
						case 5: navbb_space=3/2; break;
						case 6: navbb_space=4/2; break;
						case 7: navbb_space=5/2; break;
						case 8: navbb_space=6/2; break;
						case 9: navbb_space=7/2; break;
						case 10: navbb_space=8/2; break;
						case 11: navbb_space=9/2; break;
						case 12: navbb_space=10/2; break;
						case 13: navbb_space=11/2; break;
						case 14: navbb_space=12/2; break;
						case 15: navbb_space=13/2; break;
						case 16: navbb_space=14/2; break;
						case 17: navbb_space=15/2; break;
						case 18: navbb_space=16/2; break;
						case 19: navbb_space=17/2; break;
						case 20: navbb_space=18/2; break;
						case 21: navbb_space=19/2; break;
						case 22: navbb_space=20/2; break;
					}

					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#navigator-toolbox[iconsize=large] #nav-bar toolbarbutton:not(#back-forward-dropmarker):not(#unified-back-forward-button):not(#ctr_forward-button):not(#forward-button):not(#urlbar-go-button):not(.toolbarbutton-menubutton-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.bookmark-item):not(.quick-engine-dropdown):not(#zoompage-zoomin-s):not(#zoompage-zoomout-s):not(#zoompage-zoomreset-t):not(#zoompage-zoomin-t):not(.quick-engine-button):not(#zoompage-zoomin-n):not(#zoompage-zoomin-c):not(#zoompage-zoomdisplay-c):not(#zoompage-zoomdisplay-n){\
								margin-left: '+navbb_space+'px !important;\
							}\
							#navigator-toolbox[iconsize=large] #nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]) toolbarbutton:not(#back-forward-dropmarker):not(#ctr_back-button):not(#back-button):not(.toolbarbutton-menubutton-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.bookmark-item):not(.quick-engine-button):not(.quick-engine-dropdown):not(#zoompage-zoomdisplay-s):not(#zoompage-zoomreset-t):not(#zoompage-zoomout-t):not(#zoompage-zoomout-n):not(#zoompage-zoomout-c):not(#zoompage-zoomdisplay-c):not(#zoompage-zoomdisplay-n),\
							#navigator-toolbox[iconsize=large] #nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]) #forward-button,\
							#navigator-toolbox[iconsize=large] #nav-bar[currentset*="unified-back-forward-button,urlbar-container"] toolbarbutton:not(#back-forward-dropmarker):not(#ctr_back-button):not(#ctr_forward-button):not(#back-button):not(#forward-button):not(.toolbarbutton-menubutton-button):not(#urlbar-go-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.bookmark-item):not(#zoompage-zoomdisplay-s):not(#zoompage-zoomreset-t):not(#zoompage-zoomout-t):not(.quick-engine-button):not(.quick-engine-dropdown):not(#zoompage-zoomout-n):not(#zoompage-zoomout-c):not(#zoompage-zoomdisplay-c):not(#zoompage-zoomdisplay-n){\
								margin-right: '+navbb_space+'px !important;\
							}\
							#navigator-toolbox[iconsize=large] #nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]) #urlbar toolbarbutton:not(#back-forward-dropmarker):not(#back-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.toolbarbutton-menubutton-button),\
							#navigator-toolbox[iconsize=large] #nav-bar[currentset*="unified-back-forward-button,urlbar-container"] #urlbar toolbarbutton:not(#back-forward-dropmarker):not(#ctr_back-button):not(#ctr_forward-button):not(#back-button):not(#forward-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.toolbarbutton-menubutton-button){\
								margin-right: 0px !important;\
							}\
							#navigator-toolbox[iconsize=small] #nav-bar toolbarbutton:not(#back-forward-dropmarker):not(#forward-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(#zoom-in-button):not(.toolbarbutton-menubutton-button):not(.quick-engine-button):not(.quick-engine-dropdown):not(#zoompage-zoomin-s):not(#zoompage-zoomout-s):not(#zoompage-zoomreset-t):not(#zoompage-zoomin-t):not(.quick-engine-button):not(#zoompage-zoomin-n):not(#zoompage-zoomin-c):not(#zoompage-zoomdisplay-c):not(#zoompage-zoomdisplay-n) {\
								margin-left: '+navbb_space+'px !important;\
							}\
							#navigator-toolbox[iconsize=small] #nav-bar toolbarbutton:not(#back-forward-dropmarker):not(#back-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(#zoom-out-button):not(.toolbarbutton-menubutton-button):not(.quick-engine-button):not(.quick-engine-dropdown):not(#zoompage-zoomdisplay-s):not(#zoompage-zoomreset-t):not(#zoompage-zoomout-t):not(#zoompage-zoomout-n):not(#zoompage-zoomout-c):not(#zoompage-zoomdisplay-c):not(#zoompage-zoomdisplay-n) {\
								margin-right: '+navbb_space+'px !important;\
							}\
							#navigator-toolbox[iconsize=large] #nav-bar #urlbar toolbarbutton:not(#back-forward-dropmarker):not(#unified-back-forward-button):not(#forward-button):not(#urlbar-go-button):not(.toolbarbutton-menubutton-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(.bookmark-item):not(#zoompage-zoomin-s):not(#zoompage-zoomout-s):not(#zoompage-zoomreset-t):not(#zoompage-zoomout-t):not(#zoompage-zoomin-t):not(.quick-engine-button):not(.quick-engine-dropdown),\
							#navigator-toolbox[iconsize=small] #nav-bar #urlbar toolbarbutton:not(#back-forward-dropmarker):not(#forward-button):not(#urlbar-go-button):not(#urlbar-reload-button):not(#urlbar-stop-button):not(#zoom-in-button):not(.toolbarbutton-menubutton-button) {\
								margin-left: 0px !important;\
								margin-right: 0px !important;\
							}\
							#nav-bar #back-forward-dropmarker{\
								margin-left:-'+navbb_space_x+'px !important;\
							}\
							#urlbar-search-splitter{\
								margin-left:-'+navbb_space_x+'px !important;\
								margin-right:-'+navbb_space_x+'px !important;\
							}\
							#nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]) #urlbar,\
							#nav-bar #search-container{\
								margin-left:'+navbb_space+'px !important;\
								margin-right:'+navbb_space+'px !important;\
							}\
							#nav-bar[currentset*="unified-back-forward-button,urlbar-container"] #urlbar{\
								margin-right:'+navbb_space+'px !important;\
							}\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]),#nav-bar:not([currentset])) > #unified-back-forward-button,\
							window:not([chromehidden~=toolbar]) #navigator-toolbox[iconsize=large][mode=icons] > :-moz-any(#nav-bar:not([currentset*="unified-back-forward-button,urlbar-container"]),#nav-bar:not([currentset])) > #nav-bar-customizationtarget > #unified-back-forward-button{\
								margin-right: -1px !important;\
							}\
							#navigator-toolbox #nav-bar #urlbar-container > #forward-button[disabled="true"] {\
							  opacity: .8 !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var BookmarksbarButtonsSpace = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("bookbbspace");
				if(value!=0){
					let bookbb_space = 2;	//initialize value (not used anyway)
					let bookbb_space_x = bookbb_space;

					switch (value) {
						case 1: bookbb_space=-1/2; bookbb_space_x = 0; break;
						case 2: bookbb_space=0; break;
						case 3: bookbb_space=1/2; break;
						case 4: bookbb_space=2/2; break;
						case 5: bookbb_space=3/2; break;
						case 6: bookbb_space=4/2; break;
						case 7: bookbb_space=5/2; break;
						case 8: bookbb_space=6/2; break;
						case 9: bookbb_space=7/2; break;
						case 10: bookbb_space=8/2; break;
						case 11: bookbb_space=9/2; break;
						case 12: bookbb_space=10/2; break;
						case 13: bookbb_space=11/2; break;
						case 14: bookbb_space=12/2; break;
						case 15: bookbb_space=13/2; break;
						case 16: bookbb_space=14/2; break;
						case 17: bookbb_space=15/2; break;
						case 18: bookbb_space=16/2; break;
						case 19: bookbb_space=17/2; break;
						case 20: bookbb_space=18/2; break;
						case 21: bookbb_space=19/2; break;
						case 22: bookbb_space=20/2; break;
					}
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#PersonalToolbar toolbarbutton:not(#back-forward-dropmarker):not(.bookmark-item):not(#forward-button):not(#zoom-in-button):not(.toolbarbutton-menubutton-button) {\
								margin-left: '+bookbb_space+'px !important;\
							}\
							#PersonalToolbar toolbarbutton:not(.bookmark-item):not(#back-button):not(#zoom-out-button):not(.toolbarbutton-menubutton-button) {\
								margin-right: '+bookbb_space+'px !important;\
							}\
							#PersonalToolbar #back-forward-dropmarker{\
								margin-left:-'+bookbb_space_x+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var BookmarksbarItemsSpace = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("bookbispace");
				if(value!=0){
					let bookbi_space = 2;	//initialize value (not used anyway)

					switch (value) {
						case 1: bookbi_space=-1/2; break;
						case 2: bookbi_space=0; break;
						case 3: bookbi_space=1/2; break;
						case 4: bookbi_space=2/2; break;
						case 5: bookbi_space=3/2; break;
						case 6: bookbi_space=4/2; break;
						case 7: bookbi_space=5/2; break;
						case 8: bookbi_space=6/2; break;
						case 9: bookbi_space=7/2; break;
						case 10: bookbi_space=8/2; break;
						case 11: bookbi_space=9/2; break;
						case 12: bookbi_space=10/2; break;
						case 13: bookbi_space=11/2; break;
						case 14: bookbi_space=12/2; break;
						case 15: bookbi_space=13/2; break;
						case 16: bookbi_space=14/2; break;
						case 17: bookbi_space=15/2; break;
						case 18: bookbi_space=16/2; break;
						case 19: bookbi_space=17/2; break;
						case 20: bookbi_space=18/2; break;
						case 21: bookbi_space=19/2; break;
						case 22: bookbi_space=20/2; break;
					}
	
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#PersonalToolbar .bookmark-item:not(menu):not(menuitem) {\
								margin-left: '+bookbi_space+'px !important;\
							}\
							#PersonalToolbar .bookmark-item:not(menu):not(menuitem) {\
								margin-right: '+bookbi_space+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var AddonbarButtonsSpace = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("addonbbspace");
				if(value!=0){
					let addonbb_space = 2;	//initialize value (not used anyway)
					let addonbb_space_x = addonbb_space;

					switch (value) {
						case 1: addonbb_space=-1/2; addonbb_space_x = 0; break;
						case 2: addonbb_space=0; break;
						case 3: addonbb_space=1/2; break;
						case 4: addonbb_space=2/2; break;
						case 5: addonbb_space=3/2; break;
						case 6: addonbb_space=4/2; break;
						case 7: addonbb_space=5/2; break;
						case 8: addonbb_space=6/2; break;
						case 9: addonbb_space=7/2; break;
						case 10: addonbb_space=8/2; break;
						case 11: addonbb_space=9/2; break;
						case 12: addonbb_space=10/2; break;
						case 13: addonbb_space=11/2; break;
						case 14: addonbb_space=12/2; break;
						case 15: addonbb_space=13/2; break;
						case 16: addonbb_space=14/2; break;
						case 17: addonbb_space=15/2; break;
						case 18: addonbb_space=16/2; break;
						case 19: addonbb_space=17/2; break;
						case 20: addonbb_space=18/2; break;
						case 21: addonbb_space=19/2; break;
						case 22: addonbb_space=20/2; break;
					}
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#addon-bar toolbarbutton:not(#back-forward-dropmarker):not(#forward-button):not(#zoom-in-button):not(.toolbarbutton-menubutton-button) {\
								margin-left: '+addonbb_space+'px !important;\
							}\
							#addon-bar toolbarbutton:not(#back-button):not(#zoom-out-button):not(.toolbarbutton-menubutton-button) {\
								margin-right: '+addonbb_space+'px !important;\
							}\
							#addon-bar #back-forward-dropmarker{\
								margin-left:-'+addonbb_space_x+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

// Thunderbird space settings (left/right)

var TBMainbarButtonsSpace = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("tbmainbbspace");
				if(value!=0){
					let tbmainbb_space = 2;	//initialize value (not used anyway)

					switch (value) {
						case 1: tbmainbb_space=-1/2; break;
						case 2: tbmainbb_space=0; break;
						case 3: tbmainbb_space=1/2; break;
						case 4: tbmainbb_space=2/2; break;
						case 5: tbmainbb_space=3/2; break;
						case 6: tbmainbb_space=4/2; break;
						case 7: tbmainbb_space=5/2; break;
						case 8: tbmainbb_space=6/2; break;
						case 9: tbmainbb_space=7/2; break;
						case 10: tbmainbb_space=8/2; break;
						case 11: tbmainbb_space=9/2; break;
						case 12: tbmainbb_space=10/2; break;
						case 13: tbmainbb_space=11/2; break;
						case 14: tbmainbb_space=12/2; break;
						case 15: tbmainbb_space=13/2; break;
						case 16: tbmainbb_space=14/2; break;
						case 17: tbmainbb_space=15/2; break;
						case 18: tbmainbb_space=16/2; break;
						case 19: tbmainbb_space=17/2; break;
						case 20: tbmainbb_space=18/2; break;
						case 21: tbmainbb_space=19/2; break;
						case 22: tbmainbb_space=20/2; break;
					}
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document	url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://calendar/content/calendar-event-dialog.xul){\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1:not(.toolbarbutton-menubutton-button) {\
								margin-left: '+tbmainbb_space+'px !important;\
								margin-right: '+tbmainbb_space+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

// Seamonkey space settings (left/right)

var SMMainbarButtonsSpace = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("smmainbbspace");
				if(value!=0){
					let smmainbb_space = 2;	//initialize value (not used anyway)

					switch (value) {
						case 1: smmainbb_space=-1/2; break;
						case 2: smmainbb_space=0; break;
						case 3: smmainbb_space=1/2; break;
						case 4: smmainbb_space=2/2; break;
						case 5: smmainbb_space=3/2; break;
						case 6: smmainbb_space=4/2; break;
						case 7: smmainbb_space=5/2; break;
						case 8: smmainbb_space=6/2; break;
						case 9: smmainbb_space=7/2; break;
						case 10: smmainbb_space=8/2; break;
						case 11: smmainbb_space=9/2; break;
						case 12: smmainbb_space=10/2; break;
						case 13: smmainbb_space=11/2; break;
						case 14: smmainbb_space=12/2; break;
						case 15: smmainbb_space=13/2; break;
						case 16: smmainbb_space=14/2; break;
						case 17: smmainbb_space=15/2; break;
						case 18: smmainbb_space=16/2; break;
						case 19: smmainbb_space=17/2; break;
						case 20: smmainbb_space=18/2; break;
						case 21: smmainbb_space=19/2; break;
						case 22: smmainbb_space=20/2; break;
					}
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document  url(chrome://navigator/content/navigator.xul),\
										url(chrome://editor/content/editor.xul),\
										url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://calendar/content/calendar-event-dialog.xul){\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1:not(.toolbarbutton-menubutton-button) {\
								margin-left: '+smmainbb_space+'px !important;\
								margin-right: '+smmainbb_space+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

// space settings (top/bottom)

var MenubarButtonsSpace2 = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("menubbspace2");
				if(value!=0){
					let menubb_space2 = 2;	//initialize value (not used anyway)

					switch (value) {
						case 1: menubb_space2=-1; break;
						case 2: menubb_space2=0; break;
						case 3: menubb_space2=1; break;
						case 4: menubb_space2=2; break;
						case 5: menubb_space2=3; break;
						case 6: menubb_space2=4; break;
						case 7: menubb_space2=5; break;
						case 8: menubb_space2=6; break;
						case 9: menubb_space2=7; break;
						case 10: menubb_space2=8; break;
						case 11: menubb_space2=9; break;
						case 12: menubb_space2=10; break;
						case 13: menubb_space2=11; break;
						case 14: menubb_space2=12; break;
						case 15: menubb_space2=13; break;
						case 16: menubb_space2=14; break;
						case 17: menubb_space2=15; break;
						case 18: menubb_space2=16; break;
						case 19: menubb_space2=17; break;
						case 20: menubb_space2=18; break;
						case 21: menubb_space2=19; break;
						case 22: menubb_space2=20; break;
					}
				
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#toolbar-menubar toolbarbutton:not(.toolbarbutton-menubutton-button) {\
								margin-top: '+menubb_space2+'px !important;\
							}\
							#toolbar-menubar toolbarbutton:not(.toolbarbutton-menubutton-button) {\
								margin-bottom: '+menubb_space2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var NavbarButtonsSpace2 = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				if(prefs.getIntPref("navbbspace2")!=99){
					
					// default values like before
					if(prefs.getIntPref("navbbspace2")>0 && prefs.getIntPref("navbbspace2")<99) {
					
						return "data:text/css;charset=utf-8," + encodeURIComponent('\
							@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
							@-moz-document url(chrome://browser/content/browser.xul) {\
								#navigator-toolbox[iconsize=small] #nav-bar,\
								#navigator-toolbox[iconsize=large] #nav-bar{\
									padding-top: '+prefs.getIntPref("navbbspace2")+'px !important;\
									padding-bottom: '+prefs.getIntPref("navbbspace2")+'px !important;\
								}\
							}\
						');
					}
					// detour to force a 0px margin, mainly for WinXP users
					else if(prefs.getIntPref("navbbspace2")==100) {
						
						return "data:text/css;charset=utf-8," + encodeURIComponent('\
							@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
							@-moz-document url(chrome://browser/content/browser.xul) {\
								#navigator-toolbox[iconsize=small] #nav-bar,\
								#navigator-toolbox[iconsize=large] #nav-bar{\
									margin-top: 0px !important;\
									margin-bottom: 0px !important;\
								}\
							}\
						');					
					}
					// detour to force a -1px margin, mainly for WinXP users
					else if(prefs.getIntPref("navbbspace2")==101) {
						
						return "data:text/css;charset=utf-8," + encodeURIComponent('\
							@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
							@-moz-document url(chrome://browser/content/browser.xul) {\
								#navigator-toolbox[iconsize=small] #nav-bar,\
								#navigator-toolbox[iconsize=large] #nav-bar{\
									margin-top: -1px !important;\
									margin-bottom: -1px !important;\
								}\
							}\
						');					
					}
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var BookmarksbarButtonsSpace2 = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("bookbbspace2");
				if(value!=0){
					let bookbb_space2 = 2;	//initialize value (not used anyway)
		
					switch (value) {
						case 2: bookbb_space2=0; break;
						case 3: bookbb_space2=1; break;
						case 4: bookbb_space2=2; break;
						case 5: bookbb_space2=3; break;
						case 6: bookbb_space2=4; break;
						case 7: bookbb_space2=5; break;
						case 8: bookbb_space2=6; break;
						case 9: bookbb_space2=7; break;
						case 10: bookbb_space2=8; break;
						case 11: bookbb_space2=9; break;
						case 12: bookbb_space2=10; break;
						case 13: bookbb_space2=11; break;
						case 14: bookbb_space2=12; break;
						case 15: bookbb_space2=13; break;
						case 16: bookbb_space2=14; break;
						case 17: bookbb_space2=15; break;
						case 18: bookbb_space2=16; break;
						case 19: bookbb_space2=17; break;
						case 20: bookbb_space2=18; break;
						case 21: bookbb_space2=19; break;
						case 22: bookbb_space2=20; break;
					}
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#PersonalToolbar toolbarbutton:not(.bookmark-item):not(.toolbarbutton-menubutton-button),\
							#PersonalToolbar .bookmark-item:not(menu):not(menuitem) {\
								margin-top: '+bookbb_space2+'px !important;\
							}\
							#PersonalToolbar toolbarbutton:not(.bookmark-item):not(.toolbarbutton-menubutton-button),\
							#PersonalToolbar .bookmark-item:not(menu):not(menuitem) {\
								margin-bottom: '+bookbb_space2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var AddonbarButtonsSpace2 = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("addonbbspace2");
				if(value!=0){
					let addonbb_space2 = 2;	//initialize value (not used anyway)

					switch (value) {
						case 1: addonbb_space2=-1; break;
						case 2: addonbb_space2=0; break;
						case 3: addonbb_space2=1; break;
						case 4: addonbb_space2=2; break;
						case 5: addonbb_space2=3; break;
						case 6: addonbb_space2=4; break;
						case 7: addonbb_space2=5; break;
						case 8: addonbb_space2=6; break;
						case 9: addonbb_space2=7; break;
						case 10: addonbb_space2=8; break;
						case 11: addonbb_space2=9; break;
						case 12: addonbb_space2=10; break;
						case 13: addonbb_space2=11; break;
						case 14: addonbb_space2=12; break;
						case 15: addonbb_space2=13; break;
						case 16: addonbb_space2=14; break;
						case 17: addonbb_space2=15; break;
						case 18: addonbb_space2=16; break;
						case 19: addonbb_space2=17; break;
						case 20: addonbb_space2=18; break;
						case 21: addonbb_space2=19; break;
						case 22: addonbb_space2=20; break;
					}
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document url(chrome://browser/content/browser.xul) {\
							#addon-bar toolbarbutton:not(.toolbarbutton-menubutton-button) {\
								margin-top: '+addonbb_space2+'px !important;\
							}\
							#addon-bar toolbarbutton:not(.toolbarbutton-menubutton-button) {\
								margin-bottom: '+addonbb_space2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

// Thunderbird space settings (top/bottom)

var TBMainbarButtonsSpace2 = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("tbmainbbspace2");
				if(value!=0){
					let tbmainbb_space2 = 2;	//initialize value (not used anyway)

					switch (value) {
						case 1: tbmainbb_space2=-1; break;
						case 2: tbmainbb_space2=0; break;
						case 3: tbmainbb_space2=1; break;
						case 4: tbmainbb_space2=2; break;
						case 5: tbmainbb_space2=3; break;
						case 6: tbmainbb_space2=4; break;
						case 7: tbmainbb_space2=5; break;
						case 8: tbmainbb_space2=6; break;
						case 9: tbmainbb_space2=7; break;
						case 10: tbmainbb_space2=8; break;
						case 11: tbmainbb_space2=9; break;
						case 12: tbmainbb_space2=10; break;
						case 13: tbmainbb_space2=11; break;
						case 14: tbmainbb_space2=12; break;
						case 15: tbmainbb_space2=13; break;
						case 16: tbmainbb_space2=14; break;
						case 17: tbmainbb_space2=15; break;
						case 18: tbmainbb_space2=16; break;
						case 19: tbmainbb_space2=17; break;
						case 20: tbmainbb_space2=18; break;
						case 21: tbmainbb_space2=19; break;
						case 22: tbmainbb_space2=20; break;
					}
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document	url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://calendar/content/calendar-event-dialog.xul){\
							:-moz-any(.chromeclass-toolbar) .toolbarbutton-1:not(.toolbarbutton-menubutton-button) {\
								margin-top: '+tbmainbb_space2+'px !important;\
								margin-bottom: '+tbmainbb_space2+'px !important;\
							}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

// Seamonkey space settings (top/bottom)

var SMMainbarButtonsSpace2 = {

	__proto__: StylesheetManager,
		get stylesheet(){
			try{
				var value=prefs.getIntPref("smmainbbspace2");
				if(value!=0){
					let smmainbb_space2 = 2;	//initialize value (not used anyway)

					switch (value) {
						case 1: smmainbb_space2=-1; break;
						case 2: smmainbb_space2=0; break;
						case 3: smmainbb_space2=1; break;
						case 4: smmainbb_space2=2; break;
						case 5: smmainbb_space2=3; break;
						case 6: smmainbb_space2=4; break;
						case 7: smmainbb_space2=5; break;
						case 8: smmainbb_space2=6; break;
						case 9: smmainbb_space2=7; break;
						case 10: smmainbb_space2=8; break;
						case 11: smmainbb_space2=9; break;
						case 12: smmainbb_space2=10; break;
						case 13: smmainbb_space2=11; break;
						case 14: smmainbb_space2=12; break;
						case 15: smmainbb_space2=13; break;
						case 16: smmainbb_space2=14; break;
						case 17: smmainbb_space2=15; break;
						case 18: smmainbb_space2=16; break;
						case 19: smmainbb_space2=17; break;
						case 20: smmainbb_space2=18; break;
						case 21: smmainbb_space2=19; break;
						case 22: smmainbb_space2=20; break;
					}
					
					return "data:text/css;charset=utf-8," + encodeURIComponent('\
						@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
						@-moz-document  url(chrome://navigator/content/navigator.xul),\
										url(chrome://editor/content/editor.xul),\
										url(chrome://messenger/content/messenger.xul),\
										url(chrome://messenger/content/messageWindow.xul),\
										url(chrome://messenger/content/messengercompose/messengercompose.xul),\
										url(chrome://messenger/content/addressbook/addressbook.xul),\
										url(chrome://calendar/content/calendar-event-dialog.xul){\
								:-moz-any(.chromeclass-toolbar) .toolbarbutton-1:not(.toolbarbutton-menubutton-button) {\
									margin-top: '+smmainbb_space2+'px !important;\
									margin-bottom: '+smmainbb_space2+'px !important;\
								}\
						}\
					');
				}
				
			}catch(e) {Cu.reportError(e)}
		}
};

var cstbbsettings = {

	"overlay": CSTBBOverlay,
	"menubbuttons": MenuBarButtons,
	"tabsbbuttons": TabsBarButtons,
	"navbarbuttons": NavBarButtons,
	"bookmbuttons1": BookmarksBarButtons1,
	"bookmbuttons2": BookmarksBarButtons2,
	"addonbuttons": AddonBarButtons,
	"aiosbuttons": AiosButtons,
	"placesbuttons": PlacesButtons,
	"tabscrollbut": TabScrollButtons,
	"showforward": ShowForwardButton,
	"tbmenubbuttons": TBMenuBarButtons,
	"tbtabsbbuttons": TBTabsBarButtons,
	"tbmainbbuttons": TBMainBarButtons,
	"smmenubbuttons": SMMenuBarButtons,
	"smmainbbuttons": SMMainBarButtons,
	"smbookmbuttons1": SMBookmarksBarButtons1,
	"smbookmbuttons2": SMBookmarksBarButtons2,
	"navbicons": NavBarIcons,
	"tbmailicons": ThunderbirdMainIcons,
	"smnavbicons": SeamonkeyNavBarIcons,
	"smmailicons": SeamonkeyMailIcons,
	"buttonbf": BackForwardButton,
	"navdmicons": NavDmIcons,
	"dlindicator": DlIndicator,
	"classicsrg": ClassicSRGButton,
	"verdomainid": VerifiedDomainsIdentities,
	"bfdropmarker": BackForwardDropmarker,
	"menubbradius": MenuBarButtonRadius,
	"tabsbbradius": TabsBarButtonRadius,
	"navbbradius": NavBarButtonRadius,
	"tbmenubbradius": TBMenuBarButtonRadius,
	"tbtabsbbradius": TBTabsBarButtonRadius,
	"tbmainbbradius": TBMainBarButtonRadius,
	"smmainbbradius": SMMainBarButtonRadius,
	"bookmbbradius1":BookmarksBarButtonsRadius1,
	"bookmbbradius2":BookmarksBarButtonsRadius2,
	"addonbbradius": AddonbarButtonRadius,
	"urlsearchbbradius": UrlSearchBarBorderRadius,
	"menubbheight": MenubarButtonHeight,
	"navbbheight": NavbarButtonHeight,
	"bookbbheight": BookmarksbarButtonHeight,
	"addonbbheight": AddonbarButtonHeight,
	"tbmenubbheight": TBMenubarButtonHeight,
	"tbmainbbheight": TBMainbarButtonHeight,
	"smmainbbheight": SMMainbarButtonHeight,
	"menubbwidth": MenubarButtonWidth,
	"navbbwidth": NavbarButtonWidth,
	"bookbbwidth": BookmarksbarButtonWidth,
	"addonbbwidth": AddonbarButtonWidth,
	"tbmenubbwidth": TBMenubarButtonWidth,
	"tbmainbbwidth": TBMainbarButtonWidth,
	"smmainbbwidth": SMMainbarButtonWidth,
	"menubbspace": MenubarButtonsSpace,
	"tabsbbspace": TabsbarButtonsSpace,
	"navbbspace": NavbarButtonsSpace,
	"bookbbspace": BookmarksbarButtonsSpace,
	"bookbispace": BookmarksbarItemsSpace,
	"addonbbspace": AddonbarButtonsSpace,
	"tbmainbbspace": TBMainbarButtonsSpace,
	"smmainbbspace": SMMainbarButtonsSpace,
	"menubbspace2": MenubarButtonsSpace2,
	"navbbspace2": NavbarButtonsSpace2,
	"bookbbspace2": BookmarksbarButtonsSpace2,
	"addonbbspace2": AddonbarButtonsSpace2,
	"tbmainbbspace2": TBMainbarButtonsSpace2,
	"smmainbbspace2": SMMainbarButtonsSpace2
};