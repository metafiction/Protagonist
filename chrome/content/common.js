/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

Components.utils.import("resource://gre/modules/Services.jsm");

const Cc = Components.classes;
const Ci = Components.interfaces;
const { AppConstants } = ChromeUtils.import("resource://gre/modules/AppConstants.jsm");

function parentPath(val){
  try{
    return localFile(val).parent.path;
  }catch(ex){
    return null;
  }
}

function isRoot(val){
  return parentPath(val) == null;
}

function leafName(val){
  try{
    return val == "/" ? val : localFile(val).leafName;
  }catch(ex){
    return null;
  }
}

function homePath(home){
  try{
    return Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get(home, Ci.nsIFile).path;
  }catch(ex){
    if(home == "ProgF" && AppConstants.platform == "linux")
      return "/usr/share/applications";

    return null;
  }

  return null;
}

function isFile(path, ext){
  try{
    if(ext && !path.endsWith(ext))
      return false;

    return localFile(path).isFile();
  }catch(ex){
    return false;
  }
}

function localFile(path){
  try{
    Components.utils.import("resource://gre/modules/FileUtils.jsm");
    return new FileUtils.File(path);
  }catch(ex){
    return null;
  }
}

function iconPath(file){
  try{
    Components.utils.import("resource://gre/modules/BrowserUtils.jsm");

    if(file instanceof Ci.nsIFile)
      return "moz-icon:" + BrowserUtils.makeFileURI(file).spec + "?size=32";
    else
      return "moz-icon:" + BrowserUtils.makeFileURI(localFile(file)).spec + "?size=32";
  }catch(ex){
    return "";
  }
}

function setBoolPref(key, val){
  Services.prefs.setBoolPref(key, val);
}

function setIntPref(key, val){
  Services.prefs.setIntPref(key, val);
}

function setCharPref(key, val){
  Services.prefs.setCharPref(key, val);
}

function clearUserPref(key){
  Services.prefs.clearUserPref(key);
}

function prefHasUserValue(key){
  try{
    return Services.prefs.prefHasUserValue(key);
  }catch(ex){
    return false;
  }
}

function getPref(key){
  if(prefHasUserValue(key)){
    switch(Services.prefs.getPrefType(key)){
      case Ci.nsIPrefBranch.PREF_BOOL:
        return Services.prefs.getBoolPref(key);
      break;

      case Ci.nsIPrefBranch.PREF_INT:
        return Services.prefs.getIntPref(key);
      break;

      case Ci.nsIPrefBranch.PREF_STRING:
        return Services.prefs.getCharPref(key);
      break;
    }
  }

  return null;
}

function getPrefLS(key){
  try{
    return Services.prefs.getComplexValue(key, Ci.nsIPrefLocalizedString).data;
  }catch(ex){
    return "";
  }
}

function setPrefLS(key, val){
  let pls = Cc["@mozilla.org/pref-localizedstring;1"].createInstance(Ci.nsIPrefLocalizedString);
  pls.data = val;
  Services.prefs.setComplexValue(key, Ci.nsIPrefLocalizedString, pls);
}

function argEntries(path){
  let entries
  let args = [];

  try{
    entries = localFile(path).directoryEntries;
  }catch(ex){
    return null;
  }

  while(entries.hasMoreElements()){
    let entry = entries.getNext().QueryInterface(Ci.nsIFile);

    try{
      if(!entry.isHidden() && !entry.isSpecial() && !entry.isSymlink())
        args.push(entry);
    }catch(ex){
      continue;
    }
  }

  args.sort((a, b) => { return a.leafName > b.leafName; });

  return args;
}

function hasFile(path){
  if(localFile(path).isDirectory())
    return argEntries(path).find(p => { return p.isFile(); });

  return false;
}

function hasFolder(path){
  if(localFile(path).isDirectory())
    return argEntries(path).find(p => { return p.isDirectory(); });

  return false;
}

function argTree(path){
  let args = [];

  if(parentPath(path)){
    args.push(localFile(path).parent);

    while(parentPath(args[args.length - 1].path))
      args.push(args[args.length - 1].parent);
  }

  return args;
}
