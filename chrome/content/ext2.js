/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const ROOT_PREF = "top.";
const MAIN_PREF = "ext2.";
const EXTRA_PREF = "ext3.";
const HOME_PATH = "ProgF";

window.addEventListener("load", function(){
  bindingButton(document.getElementsByTagName("button"));
  bindingList(document.getElementsByTagName("richlistbox"), MAIN_PREF + "reset");
  timekeeper.register();

  this._monitor = setInterval(function(){
    if(window.screenX < - window.outerWidth/2)
      window.moveTo(- window.outerWidth/2, window.screenY);
    else if(window.screenX > window.screen.availWidth - window.outerWidth/2)
      window.moveTo(window.screen.availWidth - window.outerWidth/2, window.screenY);

    if(window.screenY < 0)
      window.moveTo(window.screenX, 0);
    else if(window.screenY + window.outerHeight > window.screen.availHeight)
      window.moveTo(window.screenX, window.screen.availHeight - window.outerHeight);

    setCharPref(MAIN_PREF + "pos", window.screenX + "," + window.screenY);
  }, 100, this);
}, false);

window.addEventListener("blur", function(){
  setBoolPref(MAIN_PREF + "focus", false);
}, false);

window.addEventListener("focus", function(){
  this.sizeToContent();
  setBoolPref(MAIN_PREF + "focus", true);
}, false);

window.addEventListener("unload", function(){
  setBoolPref(MAIN_PREF + "pressEsc", true);
  clearInterval(this._monitor);
  timekeeper.unregister();
}, false);

function isExecutable(path){
  if(!path.isFile())
    return false;

  if(AppConstants.platform == "linux")
    return path.isExecutable() || path.leafName.match(/.desktop$/);
  else
    return path.isExecutable();
}

function hasApp(path){
  if(localFile(path).isFile())
    return false;

  return argEntries(path).find(p => { return isExecutable(p); });
}

let timekeeper = {

  get node(){ return document.getElementById("timekeeper"); },

  get time(){ return this._time; },

  set time(val){ this._time = val; },

  get target(){ return getPrefLS(EXTRA_PREF + "path"); },

  get tabIndex(){ return parseInt(this.node.getAttribute("tabIndex")); },

  set tabIndex(val){
    this.node.removeAttribute("tabIndex");
    this.node.setAttribute("tabIndex", val);
    if(prefHasUserValue(MAIN_PREF + "pressQ")) setBoolPref(MAIN_PREF + "pressQ", val == 0);
    if(prefHasUserValue(MAIN_PREF + "pressE")) setBoolPref(MAIN_PREF + "pressE", val == 1);
    if(prefHasUserValue(MAIN_PREF + "pressT")) setBoolPref(MAIN_PREF + "pressT", val == 2);
  },

  get path(){ return getPrefLS(MAIN_PREF + "path"); },

  set path(val){
    if(!localFile(val).exists())
      val = homePath(HOME_PATH);

    this.node.removeAttribute("path");
    this.node.setAttribute("path", val);

    clearUserPref(MAIN_PREF + "pressA");
    clearUserPref(MAIN_PREF + "pressQ");
    clearUserPref(MAIN_PREF + "pressE");
    setBoolPref(MAIN_PREF + "pressG", val == homePath(HOME_PATH));

    if(isRoot(val)){
      clearUserPref(MAIN_PREF + "pressT");
    }else{
      setBoolPref(MAIN_PREF + "pressA", false);
      setBoolPref(MAIN_PREF + "pressT", false);
    }

    if(hasApp(val)) setBoolPref(MAIN_PREF + "pressQ", false);
    if(hasFolder(val)) setBoolPref(MAIN_PREF + "pressE", false);

    if(getPref(MAIN_PREF + "pressQ") == false)
      setBoolPref(MAIN_PREF + "pressQ", true);
    else if(getPref(MAIN_PREF + "pressE") == false)
      setBoolPref(MAIN_PREF + "pressE", true);
    else
      setBoolPref(MAIN_PREF + "pressT", true);

    setPrefLS(MAIN_PREF + "path", val);
  },

  get list(){ return this._list; },

  set list(list){
    if(list.itemCount == 0){
      let args;

      if(this.tabIndex == 2){
        args = argTree(this.path);
      }else{
        if(this.tabIndex == 0)
          args = argEntries(this.path).filter(val => isExecutable(val));
        else
          args = argEntries(this.path).filter(val => val.isDirectory());
      }

      for(let i in args){
        list.appendItem(document.createElementNS(XUL_NS, "richlistitem"));
        bindingItem(list.lastChild, iconPath(args[i]), this.tabIndex != 2 ? args[i].leafName : args[i].path, (parseInt(i) + 1)  + " / " + args.length);
        list.getItemAtIndex(i).setAttribute("value", args[i].path);
        list.getItemAtIndex(i).setAttribute("command", "pressH");
      }

      list.ensureIndexIsVisible(0);
      list.selectedIndex = 0;
    }

    this._list = list;
  },

  update: function(){
    document.getElementById("pressA").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressA"));
    document.getElementById("pressQ").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressQ"));
    document.getElementById("pressE").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressE"));
    document.getElementById("pressT").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressT"));

    clearUserPref(MAIN_PREF + "pressS");
    clearUserPref(MAIN_PREF + "pressD");
    clearUserPref(MAIN_PREF + "pressF");
    clearUserPref(MAIN_PREF + "pressJ");
    clearUserPref(MAIN_PREF + "pressK");
    clearUserPref(MAIN_PREF + "pressL");
    clearUserPref(MAIN_PREF + "pressC");
    clearUserPref(MAIN_PREF + "pressV");

    setBoolPref(MAIN_PREF + "pressH", false);
    setBoolPref(MAIN_PREF + "pressG", this.path == homePath(HOME_PATH));
    setBoolPref(MAIN_PREF + "pressY", false);

    if(this.list.range(-3)) setBoolPref(MAIN_PREF + "pressS", false);
    if(this.list.range(-1)) setBoolPref(MAIN_PREF + "pressD", false);
    if(this.list.range(-2)) setBoolPref(MAIN_PREF + "pressF", false);
    if(this.list.range(2)) setBoolPref(MAIN_PREF + "pressJ", false);
    if(this.list.range(1)) setBoolPref(MAIN_PREF + "pressK", false);
    if(this.list.range(3)) setBoolPref(MAIN_PREF + "pressL", false);

    document.getElementById("pressS").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressS"));
    document.getElementById("pressD").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressD"));
    document.getElementById("pressF").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressF"));
    document.getElementById("pressJ").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressJ"));
    document.getElementById("pressK").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressK"));
    document.getElementById("pressL").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressL"));
    document.getElementById("pressG").setAttribute("disabled", this.path == homePath(HOME_PATH));

    if(isExecutable(localFile(this.path))){
      setBoolPref(MAIN_PREF + "pressC", false);

      if(this.target)
        setBoolPref(MAIN_PREF + "pressV", false);
    }

    document.getElementById("pressC").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressC"));
    document.getElementById("pressV").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressV"));
  },

  get time() { return Date.now() - this._now; },

  register: function(){
    let prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
    this._branch = prefService.getBranch("");
    this._branch.QueryInterface(Ci.nsIPrefBranch);
    this._branch.addObserver("", this, false);
    this._branch.setBoolPref(MAIN_PREF + "pressEsc", false);

    setPrefLS(MAIN_PREF + "path", homePath(HOME_PATH));

    if(!getPref(EXTRA_PREF + "pressEsc"))
      this.node.setAttribute("target", getPrefLS(EXTRA_PREF + "path"));

    this._sec = setInterval(function(){
      document.title = document.title.replace(/\d+/, Math.round(timekeeper.time/1000));
    }, 1000, this);
    this._branch.setBoolPref(MAIN_PREF + "reset", true);
  },

  unregister: function(){
    clearInterval(this._sec);

    if(!this._branch)
      return;

    this._branch.removeObserver("", this);
    this._branch.clearUserPref(MAIN_PREF + "pressA");
    this._branch.clearUserPref(MAIN_PREF + "pressQ");
    this._branch.clearUserPref(MAIN_PREF + "pressE");
    this._branch.clearUserPref(MAIN_PREF + "pressT");
    this._branch.clearUserPref(MAIN_PREF + "pressS");
    this._branch.clearUserPref(MAIN_PREF + "pressD");
    this._branch.clearUserPref(MAIN_PREF + "pressF");
    this._branch.clearUserPref(MAIN_PREF + "pressJ");
    this._branch.clearUserPref(MAIN_PREF + "pressK");
    this._branch.clearUserPref(MAIN_PREF + "pressL");
    this._branch.clearUserPref(MAIN_PREF + "pressH");
    this._branch.clearUserPref(MAIN_PREF + "pressC");
    this._branch.clearUserPref(MAIN_PREF + "pressV");
    this._branch.clearUserPref(MAIN_PREF + "pressG");
    this._branch.clearUserPref(MAIN_PREF + "pressY");
    this._branch.clearUserPref(MAIN_PREF + "focus");
    this._branch.clearUserPref(MAIN_PREF + "path");
    this._branch.clearUserPref(MAIN_PREF + "pos");
    this._branch.clearUserPref(MAIN_PREF + "reset");
  },

  reset: function(){
    this.update();
    clearInterval(this._sec);
    document.title = document.title.replace(/\d+/, 0);
    this._now = Date.now();
    this._sec = setInterval(function(){
      document.title = document.title.replace(/\d+/, Math.round(timekeeper.time/1000));
    }, 1000, this);
  },

  observe: function(aSubject, aTopic, aData){
    if(aTopic != "nsPref:changed") return;

    if(aData == ROOT_PREF + "abacus"){
      this.node.setAttribute("abacus", getPref(aData));
      window.sizeToContent();
    }else if(aData.startsWith(EXTRA_PREF)){
      if(aData == EXTRA_PREF + "path" || aData == EXTRA_PREF + "pressEsc" && !getPref(EXTRA_PREF + "pressEsc")){
        this.node.setAttribute("target", Date.now());
      }else{
        return;
      }
    }else if(aData == MAIN_PREF + "focus" && getPref(aData)){
      window.focus();
    }else if(aData == MAIN_PREF + "path"){
      this.path = getPrefLS(aData);
    }else if(aData == MAIN_PREF + "pos"){
      window.moveTo(getPref(aData).split(",")[0], getPref(aData).split(",")[1]);
    }else if(!getPref(aData)){
      return;
    }

    if(aData == MAIN_PREF + "pressEsc"){
      window.close();
      return;
    }else if(aData == MAIN_PREF + "reset"){
      setBoolPref(aData, false);
    }else if(aData == MAIN_PREF + "pressA"){
      this.path = parentPath(this.path);
    }else if(aData == MAIN_PREF + "pressQ"){
      this.tabIndex = 0;
    }else if(aData == MAIN_PREF + "pressE"){
      this.tabIndex = 1;
    }else if(aData == MAIN_PREF + "pressT"){
      this.tabIndex = 2;
    }else if(aData == MAIN_PREF + "pressS"){
      this.list.scroll(-3);
    }else if(aData == MAIN_PREF + "pressD"){
      this.list.scroll(-1);
    }else if(aData == MAIN_PREF + "pressF"){
      this.list.scroll(-2);
    }else if(aData == MAIN_PREF + "pressG"){
      if(this.path != homePath(HOME_PATH))
        this.path = homePath(HOME_PATH);
    }else if(aData == MAIN_PREF + "pressH"){
      this.path = this.list.selectedItem.value;
    }else if(aData == MAIN_PREF + "pressJ"){
      this.list.scroll(2);
    }else if(aData == MAIN_PREF + "pressK"){
      this.list.scroll(1);
    }else if(aData == MAIN_PREF + "pressL"){
      this.list.scroll(3);
    }else if(aData == MAIN_PREF + "pressY"){
      this.path = this.path;
    }else{
      switch(AppConstants.platform){
        case "linux":
          let process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);

          if(aData == MAIN_PREF + "pressC"){
            if(this.path.endsWith(".desktop")){
              process.init(localFile("/usr/bin/gtk-launch"));
              process.run(false, [leafName(this.path)], 1);
            }else{
              process.init(localFile(this.path));
              process.run(false, [], 0);
            }
          }else if(aData == MAIN_PREF + "pressV"){
            if(this.path.endsWith(".desktop")){
              process.init(localFile("/usr/bin/gtk-launch"));
              process.run(false, [leafName(this.path), this.target], 2);
            }else{
              process.init(localFile(this.path));
              process.run(false, [this.target], 1);
            }
          }
        break;

        default:
          if(aData == MAIN_PREF + "pressC"){
            localFile(this.path).launch();
          }else if(aData == MAIN_PREF + "pressV"){
            try{
              let info = Cc["@mozilla.org/mime;1"].getService(Ci.nsIMIMEService).getFromTypeAndExtension("*/*", null);
              let handlerApp = Cc["@mozilla.org/uriloader/local-handler-app;1"].createInstance(Ci.nsILocalHandlerApp);

              handlerApp.executable = localFile(this.path);
              info.preferredAction = info.useHelperApp;
              info.preferredApplicationHandler = handlerApp;
              info.launchWithFile(localFile(this.target));
            }catch(ex){}
          }
        break;
      }
    }

    this.reset();
  }
}
