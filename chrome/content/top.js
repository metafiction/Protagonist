/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const MAIN_PREF = "top.";
const EXT1_PREF = "ext1.";
const EXT1_FILE = EXT1_PREF + "xhtml";
const EXT2_PREF = "ext2.";
const EXT2_FILE = EXT2_PREF + "xhtml";
const EXT3_PREF = "ext3.";
const EXT3_FILE = EXT3_PREF + "xhtml";
const EXT1_KEYS = ["W", "E", "R", "T", "A", "G", "H", "S", "D", "F", "J", "K", "L", "U", "I", "O", "P", "Y"];
const EXT2_KEYS = ["Q", "E", "T", "A", "G", "H", "S", "D", "F", "J", "K", "L", "C", "V", "Y"];
const EXT3_KEYS = ["W", "E", "R", "T", "A", "G", "H", "S", "D", "F", "J", "K", "L", "Y"];

window.addEventListener("load", function(){
  bindingButton(document.getElementsByTagName("button"));
  bindingList(document.getElementsByTagName("richlistbox"), MAIN_PREF + "reset");
  bindingStack(document.getElementsByTagName("vbox"));
  timekeeper.register();

  this._monitor = setInterval(function(){
    if(window.screenX < 0)
      window.moveTo(0, window.screenY);
    else if(window.screenX > window.screen.availWidth - window.outerWidth)
      window.moveTo(window.screen.availWidth - window.outerWidth, window.screenY);

    if(window.screenY < 0)
      window.moveTo(window.screenX, 0);
    else if(window.screenY + window.outerHeight > window.screen.availHeight)
      window.moveTo(window.screenX, window.screen.availHeight - window.outerHeight);

    if(getPref(MAIN_PREF + "pos") != window.screenX + "," + window.screenY)
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
  setBoolPref(EXT1_PREF + "pressEsc", true);
  setBoolPref(EXT2_PREF + "pressEsc", true);
  setBoolPref(EXT3_PREF + "pressEsc", true);
  clearInterval(this._monitor);
  timekeeper.unregister();
}, false);

let timekeeper = {

  get node(){ return document.getElementById("timekeeper"); },

  get list(){ return document.getElementsByTagName("richlistbox")[0]; },

  get portal(){ return parseInt(this.node.getAttribute("portal")); },

  set portal(val){
    this.node.setAttribute("portal", val);
    setBoolPref("top.abacus", val == 1);

    if(val == 0){
      setBoolPref(MAIN_PREF + "pressX", false);
    }else{
      setBoolPref(MAIN_PREF + "pressZ", false);
      this.initAbacus()
    }

    if(!getPref(EXT1_PREF + "pressEsc") && getPref(EXT1_PREF + "focus"))
      this.extIndex = 0;
    else if(!getPref(EXT2_PREF + "pressEsc") && getPref(EXT2_PREF + "focus"))
      this.extIndex = 1;
    else if(!getPref(EXT3_PREF + "pressEsc") && getPref(EXT3_PREF + "focus"))
      this.extIndex = 2;

    if(val == 1 && this.list.selectedIndex < 0)
      this.list.selectedIndex = 0;
  },

  get extIndex(){
    if(getPref(MAIN_PREF + "pressB"))
      return 0;
    else if(getPref(MAIN_PREF + "pressN"))
      return 1;
    else if(getPref(MAIN_PREF + "pressM"))
      return 2;
    else
      return -1;
  },

  set extIndex(val){
    this.node.removeAttribute("extIndex");
    this.node.setAttribute("extIndex", Date.now());

    if(val == 0){
      if(this._ext1)
        this._ext1.focus();
      else
        this._ext1 = window.open(EXT1_FILE, "", "chrome");
    }else if(val == 1){
      if(this._ext2)
        this._ext2.focus();
      else
        this._ext2 = window.open(EXT2_FILE, "", "chrome");
    }else if(val == 2){
      if(this._ext3)
        this._ext3.focus();
      else
        this._ext3 = window.open(EXT3_FILE, "", "chrome");
    }else{
      clearUserPref(MAIN_PREF + "pressB");
      clearUserPref(MAIN_PREF + "pressN");
      clearUserPref(MAIN_PREF + "pressM");
      this.node.setAttribute("top_state", Date.now());
      window.focus();
      return;
    }

    if(prefHasUserValue(MAIN_PREF + "pressB"))setBoolPref(MAIN_PREF + "pressB", val == 0);
    if(prefHasUserValue(MAIN_PREF + "pressN"))setBoolPref(MAIN_PREF + "pressN", val == 1);
    if(prefHasUserValue(MAIN_PREF + "pressM"))setBoolPref(MAIN_PREF + "pressM", val == 2);
    setBoolPref(MAIN_PREF + "reset", true);
  },

  get time() { return Math.round((Date.now() - this._now)/1000); },

  updateStack: function(node, index){
    if(this.extIndex != index)
      return;

    let r =  480 / screen.width;
    let width, height, left, top;
    let d = new Date(parseInt(Date.now()));

    this.portal = 0;
    node.childNodes[2].value = d.toLocaleString();
    node.parentNode.insertBefore(node, node.parentNode.lastChild);
    node.parentNode.lastChild.removeAttribute("hidden");

    for(let i = 0; i < node.parentNode.childNodes.length; i++)
      node.parentNode.childNodes[i].setAttribute("hidden", true);

    switch(node.getAttribute("pref")){
      case "ext1":
        width = parseInt(this._ext1.outerWidth * r);
        height = parseInt(this._ext1.outerHeight * r);
        left = parseInt(this._ext1.screenX * r);
        top = parseInt(this._ext1.screenY * r);
      break;

      case "ext2":
        width = parseInt(this._ext2.outerWidth * r);
        height = parseInt(this._ext2.outerHeight * r);
        left = parseInt(this._ext2.screenX * r);
        top = parseInt(this._ext2.screenY * r);
      break;

      case "ext3":
        width = parseInt(this._ext3.outerWidth * r);
        height = parseInt(this._ext3.outerHeight * r);
        left = parseInt(this._ext3.screenX * r);
        top = parseInt(this._ext3.screenY * r);
      break;

      default:
        width = parseInt(window.outerWidth * r);
        height = parseInt(window.outerHeight * r);
        left = parseInt(window.screenX * r);
        top = parseInt(window.screenY * r);
      break;
    }

    node.setAttribute("width", width);
    node.setAttribute("height", height);
    node.setAttribute("left", left);
    node.setAttribute("top", top);
    node.style.cssText = "margin-top:" + top + "px; margin-left:" + left+ "px; width:" + width + "px; height:" + height + "px;";
    node.removeAttribute("hidden");
  },

  initAbacus: function(){
    let strbundle = document.getElementById("strings");
    let args = [];
    let list = document.getElementsByTagName("richlistbox")[0];
    let path;

    if(this.extIndex == 0){
      for(let i in EXT1_KEYS)
        args.push(EXT1_PREF + "press" + EXT1_KEYS[i]);

      path = getPrefLS(EXT1_PREF + "path");
    }else if(this.extIndex == 1){
      for(let i in EXT2_KEYS)
        args.push(EXT2_PREF + "press" + EXT2_KEYS[i]);

      path = getPrefLS(EXT2_PREF + "path");
    }else if(this.extIndex == 2){
      for(let i in EXT3_KEYS)
        args.push(EXT3_PREF + "press" + EXT3_KEYS[i]);

      path = getPrefLS(EXT3_PREF + "path");
    }else{
      return;
    }

    list.clear();

    for(let i in args){
      list.appendItem(document.createElementNS(XUL_NS, "richlistitem"));

      try{
        while(list.getItemAtIndex(i).childNodes)
          list.getItemAtIndex(i).removeChild(list.getItemAtIndex(i).firstChild);
      }catch(ex){
        list.getItemAtIndex(i).setAttribute("pref", args[i]);
        list.getItemAtIndex(i).appendChild(document.createElementNS(XUL_NS, "hbox"));
        list.getItemAtIndex(i).firstChild.setAttribute("align", "center");
        list.getItemAtIndex(i).firstChild.setAttribute("flex", "1");
        list.getItemAtIndex(i).firstChild.style.cssText = "padding-left: 4px;";
        list.getItemAtIndex(i).firstChild.appendChild(document.createElementNS(XUL_NS, "hbox"));
        list.getItemAtIndex(i).firstChild.firstChild.setAttribute("flex", "1");
        list.getItemAtIndex(i).firstChild.firstChild.appendChild(document.createElementNS(XUL_NS, "label"));
        list.getItemAtIndex(i).firstChild.firstChild.firstChild.setAttribute("marked", false);
        list.getItemAtIndex(i).firstChild.firstChild.firstChild.style.cssText = "width: 50px;";

        switch(args[i].split(".")[1]){
          case "pressS":
          case "pressD":
          case "pressF":
          case "pressJ":
          case "pressK":
          case "pressL":
            list.getItemAtIndex(i).firstChild.firstChild.firstChild.value = "List";
          break;

          case "pressQ":
          case "pressW":
          case "pressE":
          case "pressR":
          case "pressT":
            list.getItemAtIndex(i).firstChild.firstChild.firstChild.value = "Tab";
          break;

          default:
            list.getItemAtIndex(i).firstChild.firstChild.firstChild.value = "Button";
          break;
        }

        list.getItemAtIndex(i).firstChild.firstChild.appendChild(document.createElementNS(XUL_NS, "label"));
        list.getItemAtIndex(i).firstChild.firstChild.childNodes[1].value = args[i].split(".press")[1];
        list.getItemAtIndex(i).firstChild.firstChild.childNodes[1].setAttribute("marked", false);
        list.getItemAtIndex(i).firstChild.firstChild.childNodes[1].style.cssText = "text-align: center; border: 1px solid Highlight; padding: 0px; width: 20px;";
        list.getItemAtIndex(i).firstChild.firstChild.appendChild(document.createElementNS(XUL_NS, "label"));
        list.getItemAtIndex(i).firstChild.firstChild.childNodes[2].value = strbundle.getString("common." + args[i].split(".")[1]);
        list.getItemAtIndex(i).firstChild.firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        list.getItemAtIndex(i).firstChild.firstChild.childNodes[3].setAttribute("flex", "1");
        list.getItemAtIndex(i).firstChild.appendChild(document.createElementNS(XUL_NS, "image"));
        list.getItemAtIndex(i).firstChild.childNodes[1].setAttribute("src", iconPath(path));
        list.getItemAtIndex(i).firstChild.childNodes[1].setAttribute("top", true);
        list.getItemAtIndex(i).firstChild.childNodes[1].style.cssText = "height: 24px; width: 24px;";
        list.getItemAtIndex(i).firstChild.appendChild(document.createElementNS(XUL_NS, "label"));
        list.getItemAtIndex(i).firstChild.childNodes[2].value = path + "  :  " + (parseInt(i) + 1) + " / " + args.length;
        list.getItemAtIndex(i).firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
      }

      list.getItemAtIndex(i).addEventListener("mousedown", function(){
        if(this.selected)this.focused = this.current;
      }, true);

      list.getItemAtIndex(i).addEventListener("click", function(){
        if(this.focused)this.doCommand();
      }, false);

      list.getItemAtIndex(i).setAttribute("command", "pressH");
    }
  },

  update: function(){
    clearUserPref(MAIN_PREF + "pressS");
    clearUserPref(MAIN_PREF + "pressD");
    clearUserPref(MAIN_PREF + "pressF");
    clearUserPref(MAIN_PREF + "pressJ");
    clearUserPref(MAIN_PREF + "pressK");
    clearUserPref(MAIN_PREF + "pressL");

    setBoolPref(MAIN_PREF + "pressH", false);

    if(this.portal == 1){
      let path;

      if(this.extIndex == 0)
        path = getPrefLS(EXT1_PREF + "path");
      else if(this.extIndex == 1)
        path = getPrefLS(EXT2_PREF + "path");
      else
        path = getPrefLS(EXT3_PREF + "path");

      for(let i = 0; i < this.list.itemCount; i++){
        let style = "text-align: center; padding: 0px; width: 20px;";

        if(prefHasUserValue(this.list.getItemAtIndex(i).getAttribute("pref"))){
          if(getPref(this.list.getItemAtIndex(i).getAttribute("pref")))
            style = style + "color: transparent; border: 1px solid Darkgray; background-color: Highlight;";
          else
            style = style + "border: 1px solid Highlight;";
        }else{
          style = style + "color: transparent; background-color: -moz-Dialog; border: 1px solid Darkgray;";
        }

        this.list.getItemAtIndex(i).firstChild.firstChild.childNodes[1].style.cssText = style;
        this.list.getItemAtIndex(i).firstChild.childNodes[1].setAttribute("src", iconPath(path));
        this.list.getItemAtIndex(i).firstChild.childNodes[2].value = path + "  :  " + (parseInt(i) + 1) + " / " + this.list.itemCount;
      }

      if(this.list.range(-3)) setBoolPref(MAIN_PREF + "pressS", false);
      if(this.list.range(-1)) setBoolPref(MAIN_PREF + "pressD", false);
      if(this.list.range(-2)) setBoolPref(MAIN_PREF + "pressF", false);
      if(this.list.range(2)) setBoolPref(MAIN_PREF + "pressJ", false);
      if(this.list.range(1)) setBoolPref(MAIN_PREF + "pressK", false);
      if(this.list.range(3)) setBoolPref(MAIN_PREF + "pressL", false);
    }

    document.getElementById("pressS").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressS"));
    document.getElementById("pressD").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressD"));
    document.getElementById("pressF").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressF"));
    document.getElementById("pressJ").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressJ"));
    document.getElementById("pressK").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressK"));
    document.getElementById("pressL").setAttribute("disabled", !prefHasUserValue(MAIN_PREF + "pressL"));
  },

  register: function(){
    let prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
    this._branch = prefService.getBranch("");
    this._branch.QueryInterface(Ci.nsIPrefBranch);
    this._branch.addObserver("", this, false);
    this._branch.setBoolPref(MAIN_PREF + "pressEsc", false);
    this._branch.setBoolPref(EXT1_PREF + "pressEsc", true);
    this._branch.setBoolPref(EXT2_PREF + "pressEsc", true);
    this._branch.setBoolPref(EXT3_PREF + "pressEsc", true);

    this._sec = setInterval(function(){
      document.title = document.title.replace(/\d+/, timekeeper.time);
    }, 1000, this);
    this._branch.setBoolPref(MAIN_PREF + "reset", true);
  },

  unregister: function(){
    clearInterval(this._sec);

    if(!this._branch)
      return;

    this._branch.deleteBranch("");
    this._branch.removeObserver("", this);
    this._branch.clearUserPref(EXT1_PREF + "pressEsc");
    this._branch.clearUserPref(EXT2_PREF + "pressEsc");
    this._branch.clearUserPref(EXT3_PREF + "pressEsc");
    this._branch.clearUserPref(MAIN_PREF + "pressEsc");
    this._branch.clearUserPref(MAIN_PREF + "pressB");
    this._branch.clearUserPref(MAIN_PREF + "pressN");
    this._branch.clearUserPref(MAIN_PREF + "pressM");
    this._branch.clearUserPref(MAIN_PREF + "pressS");
    this._branch.clearUserPref(MAIN_PREF + "pressD");
    this._branch.clearUserPref(MAIN_PREF + "pressF");
    this._branch.clearUserPref(MAIN_PREF + "pressJ");
    this._branch.clearUserPref(MAIN_PREF + "pressK");
    this._branch.clearUserPref(MAIN_PREF + "pressL");
    this._branch.clearUserPref(MAIN_PREF + "pressH");
  },

  reset: function(){
    this.update();
    clearInterval(this._sec);
    document.title = document.title.replace(/\d+/, 0);
    this._now = Date.now();
    this._sec = setInterval(function(){
      document.title = document.title.replace(/\d+/, timekeeper.time);
    }, 1000, this);
  },

  observe: function(aSubject, aTopic, aData){
    if(aTopic != "nsPref:changed") return;

    if(aData == MAIN_PREF + "pressEsc" && getPref(MAIN_PREF + "pressEsc")){
      window.close();
      return;
    }

    if(aData == MAIN_PREF + "pos"){
      window.moveTo(getPref(aData).split(",")[0], getPref(aData).split(",")[1]);
      this.node.setAttribute("top_state", Date.now());
    }else if(aData == EXT1_PREF + "pos"){
      if(this._ext1)this.extIndex = 0;
      this.node.setAttribute("ext1_state", Date.now());
    }else if(aData == EXT2_PREF + "pos"){
      if(this._ext2)this.extIndex = 1;
      this.node.setAttribute("ext2_state", Date.now());
    }else if(aData == EXT3_PREF + "pos"){
      if(this._ext3)this.extIndex = 2;
      this.node.setAttribute("ext3_state", Date.now());
    }else if(!getPref(aData)){
      return;
    }

    if(aData == EXT1_PREF + "focus" || aData == MAIN_PREF + "pressB"){
      this.extIndex = 0;
    }else if(aData == EXT2_PREF + "focus" || aData == MAIN_PREF + "pressN"){
      this.extIndex = 1;
    }else if(aData == EXT3_PREF + "focus" || aData == MAIN_PREF + "pressM"){
      this.extIndex = 2;
    }else if(aData == MAIN_PREF + "focus"){
      this.node.setAttribute("top_state", Date.now());
    }else if(aData == MAIN_PREF + "reset"){
      setBoolPref(aData, false);
    }else if(aData == EXT1_PREF + "pressEsc"){
      this._ext1 = null;

      if(this._ext2)
        this.extIndex = 1;
      else if(this._ext3)
        this.extIndex = 2;
      else
        this.extIndex = -1;
    }else if(aData == EXT2_PREF + "pressEsc"){
      this._ext2 = null;

      if(this._ext1)
        this.extIndex = 0;
      else if(this._ext3)
        this.extIndex = 2;
      else
        this.extIndex = -1;
    }else if(aData == EXT3_PREF + "pressEsc"){
      this._ext3 = null;

      if(this._ext1)
        this.extIndex = 0;
      else if(this._ext2)
        this.extIndex = 1;
      else
        this.extIndex = -1;
    }else if(aData == MAIN_PREF + "pressZ"){
      this.portal = 0;
    }else if(aData == MAIN_PREF + "pressX"){
      if(this.extIndex != -1)this.portal = 1;
    }else if(aData == MAIN_PREF + "pressS"){
      this.list.scroll(-3);
    }else if(aData == MAIN_PREF + "pressD"){
      this.list.scroll(-1);
    }else if(aData == MAIN_PREF + "pressF"){
      this.list.scroll(-2);
    }else if(aData == MAIN_PREF + "pressJ"){
      this.list.scroll(2);
    }else if(aData == MAIN_PREF + "pressK"){
      this.list.scroll(1);
    }else if(aData == MAIN_PREF + "pressL"){
      this.list.scroll(3);
    }else if(aData == MAIN_PREF + "pressH"){
      if(prefHasUserValue(this.list.selectedItem.getAttribute("pref")))
        setBoolPref(this.list.selectedItem.getAttribute("pref"), true);
    }

    this.reset();
  }
}
