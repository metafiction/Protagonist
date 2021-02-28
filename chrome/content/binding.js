/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
const LIST_ROWS = 7;
const PANEL_WIDTH = 480;
const PANEL_HEIGHT = 270;

function trim(args){
  try{
    while(args.childNodes)
      args.removeChild(args.firstChild);
  }catch(ex){}
}

function bindingItem(item, icon, text, no){
  trim(item);

  item.appendChild(document.createElementNS(XUL_NS, "hbox"));
  item.firstChild.setAttribute("align", "center");
  item.firstChild.setAttribute("flex", "1");
  item.firstChild.style.cssText = "padding-left: 4px;";
  item.firstChild.appendChild(document.createElementNS(XUL_NS, "image"));
  item.firstChild.firstChild.setAttribute("src", icon);
  item.firstChild.firstChild.style.cssText = "height: 24px; width: 24px;";
  item.firstChild.appendChild(document.createElementNS(XUL_NS, "hbox"));
  item.firstChild.childNodes[1].setAttribute("flex", "1");
  item.firstChild.childNodes[1].appendChild(document.createElementNS(XUL_NS, "label"));
  item.firstChild.childNodes[1].firstChild.value = text;
  item.firstChild.childNodes[1].appendChild(document.createElementNS(XUL_NS, "spacer"));
  item.firstChild.childNodes[1].childNodes[1].setAttribute("flex", "1");
  item.firstChild.appendChild(document.createElementNS(XUL_NS, "label"));
  item.firstChild.childNodes[2].value = no;
  item.firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));

  item.addEventListener("mousedown", function(){
    if(this.selected)
      this.focused = this.current;
  }, true);

  item.addEventListener("click", function(){
    if(this.focused)
      this.doCommand();
  }, false);
}

function bindingButton(buttons){
  for(let i in buttons){
    trim(buttons[i]);

    switch(buttons[i].className){
      case "plain":
        buttons[i].appendChild(document.createElementNS(XUL_NS, "hbox"));
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].firstChild.firstChild.value = buttons[i].getAttribute("label");
        buttons[i].firstChild.lastChild.value = buttons[i].getAttribute("key");
      break;

      case "climb":
        buttons[i].appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].appendChild(document.createElementNS(XUL_NS, "hbox"));
        buttons[i].childNodes[1].style.cssText = "margin-left: -4px; margin-right: 6px;";
        buttons[i].childNodes[1].appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].childNodes[1].firstChild.className = "arrow lft";
        buttons[i].childNodes[1].firstChild.style.cssText = "width: 5px; height: 10px;";
        buttons[i].appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].lastChild.value = buttons[i].getAttribute("key");
      break;

      case "firstview":
        buttons[i].appendChild(document.createElementNS(XUL_NS, "vbox"));
        buttons[i].firstChild.setAttribute("pack", "center");
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.firstChild.className = "arrow";
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].lastChild.value = buttons[i].getAttribute("key");
      break;

      case "previousview":
        buttons[i].appendChild(document.createElementNS(XUL_NS, "vbox"));
        buttons[i].firstChild.setAttribute("pack", "center");
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.firstChild.className = "arrow";
        buttons[i].firstChild.lastChild.className = "arrow";
        buttons[i].appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].lastChild.value = buttons[i].getAttribute("key");
      break;

      case "previousitem":
        buttons[i].appendChild(document.createElementNS(XUL_NS, "vbox"));
        buttons[i].firstChild.setAttribute("pack", "center");
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.firstChild.className = "arrow";
        buttons[i].appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].lastChild.value = buttons[i].getAttribute("key");
      break;

      case "nextitem":
        buttons[i].appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].firstChild.value = buttons[i].getAttribute("key");
        buttons[i].appendChild(document.createElementNS(XUL_NS, "vbox"));
        buttons[i].childNodes[1].setAttribute("pack", "center");
        buttons[i].lastChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].lastChild.firstChild.className = "arrow";
      break;

      case "nextview":
        buttons[i].appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].firstChild.value = buttons[i].getAttribute("key");
        buttons[i].appendChild(document.createElementNS(XUL_NS, "vbox"));
        buttons[i].childNodes[1].setAttribute("pack", "center");
        buttons[i].lastChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].lastChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].lastChild.firstChild.className = "arrow";
        buttons[i].lastChild.lastChild.className = "arrow";
      break;

      case "lastview":
        buttons[i].appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].firstChild.value = buttons[i].getAttribute("key");
        buttons[i].appendChild(document.createElementNS(XUL_NS, "vbox"));
        buttons[i].childNodes[1].setAttribute("pack", "center");
        buttons[i].lastChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].lastChild.firstChild.className = "arrow";
        buttons[i].lastChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
      break;

      case "home":
        buttons[i].appendChild(document.createElementNS(XUL_NS, "stack"));
        buttons[i].firstChild.style.cssText = "width: 20px; margin-right: 1px;";
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.childNodes[0].style.cssText = "width: 13px; margin: 2px 0px 0px 3px; border-top: 2px solid; transform: rotate(45deg);";
        buttons[i].firstChild.childNodes[1].style.cssText = "width: 13px; margin: 2px 0px 0px 4px; border-top: 2px solid; transform: rotate(-45deg);";
        buttons[i].firstChild.childNodes[2].style.cssText = "width: 14px; margin: 5px 3px 0px 3px; border-right: 2px solid; border-left: 2px solid; border-bottom: 2px solid;";
        buttons[i].firstChild.childNodes[3].className = "bar up";
        buttons[i].firstChild.childNodes[3].style.cssText = "height: 6px; width: 8px; margin: 10px 2px 0px 6px;transform: rotate(90deg);";
        buttons[i].appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].lastChild.value = buttons[i].getAttribute("key");
      break;

      case "enter":
        buttons[i].appendChild(document.createElementNS(XUL_NS, "hbox"));
        buttons[i].firstChild.style.cssText = "width: 16px; margin-right: 1px;";
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "vbox"));
        buttons[i].firstChild.firstChild.setAttribute("pack", "center");
        buttons[i].firstChild.firstChild.style.cssText = "padding-top: 11px; margin-left: -2px;";
        buttons[i].firstChild.firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.firstChild.firstChild.className = "arrow lft enter";
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.lastChild.setAttribute("width", "9");
        buttons[i].firstChild.lastChild.style.cssText = "margin-top: 5px; margin-bottom: 4px; margin-left: -2px; margin-right: 2px; border-bottom-right-radius: 4px; border-bottom: 3px solid black; border-right: 3px solid black;";
        buttons[i].appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].lastChild.value = buttons[i].getAttribute("key");
      break;

      case "reload":
        buttons[i].appendChild(document.createElementNS(XUL_NS, "stack"));
        buttons[i].firstChild.style.cssText = "margin: 0px 1px;";
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "vbox"));
        buttons[i].firstChild.firstChild.setAttribute("pack", "center");
        buttons[i].firstChild.firstChild.setAttribute("width", "20");
        buttons[i].firstChild.firstChild.style.cssText = "margin-right: 3px;";
        buttons[i].firstChild.firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.firstChild.firstChild.setAttribute("maxwidth", 12);
        buttons[i].firstChild.firstChild.firstChild.style.cssText = "width: 12px; height: 12px; border: 3px solid; border-radius: 100%; border-right-color: transparent;";
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.lastChild.className = "arrow";
        buttons[i].firstChild.lastChild.style.cssText = "margin-left: 6px; margin-top: 6px; margin-right: -5px; transform: rotate(-45deg);";
        buttons[i].appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].lastChild.value = buttons[i].getAttribute("key");
      break;

      case "close":
        buttons[i].appendChild(document.createElementNS(XUL_NS, "vbox"));
        buttons[i].firstChild.setAttribute("pack", "center");
        buttons[i].firstChild.style.cssText = "width: 16px; margin-right: 1px;";
        buttons[i].firstChild.appendChild(document.createElementNS(XUL_NS, "stack"));
        buttons[i].firstChild.firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.firstChild.appendChild(document.createElementNS(XUL_NS, "spacer"));
        buttons[i].firstChild.firstChild.firstChild.style.cssText = "margin: 0px 1px; width: 13px; height: 3px; background: black; transform: rotate(45deg);";
        buttons[i].firstChild.firstChild.lastChild.style.cssText = "margin: 0px 1px; width: 13px; height: 3px; background: black; transform: rotate(-45deg);";
        buttons[i].appendChild(document.createElementNS(XUL_NS, "label"));
        buttons[i].lastChild.value = "Esc";
        buttons[i].setAttribute("onclick", "window.close();");
      break;
    }
  }
}

function bindingList(lists, pref){
  for(let i in lists){
    lists[i].onscroll = function(){
      this.selectedIndex = this.getIndexOfFirstVisibleRow() + parseInt(this.getAttribute("pointer"));
    }

    lists[i].onselect = function(){
      this.selectedItem.focused = null;
      this.setAttribute("pointer", this.selectedIndex - this.getIndexOfFirstVisibleRow());

      if(this.getRowCount() > this.getNumberOfVisibleRows()){
        var first = this.getIndexOfFirstVisibleRow();
        var last = -1;

        if(this.hasAttribute("lastIndex"))
          last = parseInt(this.getAttribute("lastIndex"));

        if(first == last || last == -1){
          for(let j = 0; j < this.getNumberOfVisibleRows(); j++)
            this.getItemAtIndex(first + j).removeAttribute("background");
        }else{
          for(let j = first; j < first + this.getNumberOfVisibleRows(); j++){
            if(j < last || last + this.getNumberOfVisibleRows() <= j)
              this.getItemAtIndex(j).removeAttribute("background");
            else
              this.getItemAtIndex(j).setAttribute("background", true);
          }
        }
      }

      Services.prefs.setBoolPref(pref, true);
    }

    lists[i].clear = function(){
      while(this.hasChildNodes())
        this.removeChild(this.firstChild);
    }

    lists[i].range = function(direction){
      if(direction == -1)
        return this.selectedIndex > 0;
      if(direction == 1)
        return this.selectedIndex < this.getRowCount() - 1;
      if(direction < -1)
        return this.getIndexOfFirstVisibleRow() > 0;

      return this.getIndexOfFirstVisibleRow() < this.getRowCount() - this.getNumberOfVisibleRows();
    }

    lists[i].getNumberOfVisibleRows = function(){
      return LIST_ROWS;
    }

    lists[i].scroll = function(direction){
      var offset = this.selectedIndex - this.getIndexOfFirstVisibleRow();
      this.setAttribute("lastIndex", this.getIndexOfFirstVisibleRow());

      switch (direction){
        case -1:
        case 1:
          this.ensureIndexIsVisible(this.selectedIndex + direction);
          offset = this.selectedIndex - this.getIndexOfFirstVisibleRow() + direction;
          break;

        case -2:
          if(0 < this.getIndexOfFirstVisibleRow() - this.getNumberOfVisibleRows())
            this.ensureIndexIsVisible(this.getIndexOfFirstVisibleRow() - this.getNumberOfVisibleRows());
          else
            this.ensureIndexIsVisible(0);
          break;

        case 2:
          if(this.getIndexOfFirstVisibleRow() + 2 * this.getNumberOfVisibleRows() > this.getRowCount() )
            this.ensureIndexIsVisible(this.getRowCount() - 1);
          else
            this.ensureIndexIsVisible(this.getIndexOfFirstVisibleRow() + 2 * this.getNumberOfVisibleRows() -1);
          break;

        case -3:
          this.ensureIndexIsVisible(0);
          break;

        case 3:
          this.ensureIndexIsVisible(this.getRowCount() - 1);
          break;
      }

      this.selectedIndex = this.getIndexOfFirstVisibleRow() + offset;
      this.removeAttribute("lastIndex");
    }
  }
}

function bindingStack(panels){
  for(let i in panels){
    if(panels[i].className == "windowpanel"){
      panels[i].addEventListener("mouseout", function(){
        if(this.hasAttribute("moving")){
          this.left = this._startX;
          this.top = this._startY;
        }

        this._tmpX = null;
        this._tmpY = null;
        this.removeAttribute("moving");
      }, false);

      panels[i].addEventListener("mouseover", function(){
        if(this._tmpX == this._startX && this._tmpY == this._startY) return;

        this._tmpX = null;
        this._tmpY = null;
      }, false);

      panels[i].addEventListener("mousedown", function(){
        this._startX = this.left;
        this._startY = this.top;
        this._tmpX = event.offsetX;
        this._tmpY = event.offsetY;

        if(!this._startX){
          this._startX = this.getAttribute("left");
          this.left = this.getAttribute("left");
        }

        if(!this._startY){
          this._startY = this.getAttribute("top");
          this.top = this.getAttribute("top");
        }
      }, false);

      panels[i].addEventListener("mousemove", function(){
        if(this._tmpX == null) return;

        this.setAttribute("moving", true);

        this.left = (parseInt(this.left) + parseInt(event.offsetX - this._tmpX));
        this.top = (parseInt(this.top) + parseInt(event.offsetY - this._tmpY));

        if(this.left < 0)
          this.left = 0;
        else if(this.left  > PANEL_WIDTH - this.width)
          this.left = PANEL_WIDTH - this.width;

        if(this.top < 0)
          this.top = 0;
        else if(this.top  > PANEL_HEIGHT - this.height)
          this.top = PANEL_HEIGHT - this.height;

        this.style.cssText = "margin-top:" + this.top + "px; margin-left:" + this.left + "px; width:" + this.width + "px; height:" + this.height + "px;";
        this._tmpX = event.offsetX;
        this._tmpY = event.offsetY;
      }, false);

      panels[i].addEventListener("mouseup", function(){
        var rate =  PANEL_WIDTH / screen.width;
        this.removeAttribute("moving");
        this._tmpX = null;
        this._tmpY = null;
        setCharPref(this.getAttribute("pref") + ".pos", this.left/rate + " , " + this.top/rate);
      }, false);
    }
  }
}
