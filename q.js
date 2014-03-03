/**
 * simple selector to attach events and set or get the html
 * @param  {string} el string to select element with the css selectors
 * @return {object}    object with the methods
 */
function q(el){
	if(typeof el === 'undefined') return;
	var obj, 
		element = el,
		type = (typeof el === 'object')? el : el.charAt(0),
		on = function(ev, fn){
			var	el = this;
			if(el instanceof NodeList){
				for(var i = 0; i < el.length; i++){
					if(el[i].addEventListener){
						el[i].addEventListener(ev, fn, false);
					}else if(el[i].attachEvent){
						el[i].attachEvent(ev, fn);
					}
				}
			}else{
				if(el.addEventListener){
					el.addEventListener(ev, fn, false);
				}else if(el.attachEvent){
					el.attachEvent(ev, fn);
				}
			};
			return this;
		},

		html = function(html){
			var	el = this;
			if(html){
				el.innerHTML = html;
				return this;
			}else return el.innerHTML;
		},

		attr = function(attr, value){
			var el = this;
			if(value){
				el[attr] = value;
				return this;
			}
			return el[attr];
		},

		append = function(element){
			var el = this;
			if(typeof element === 'string'){
				el.innerHTML = element;
			}else{
				el.appendChild(element);
			}
			return this;
		}

	if(new RegExp('[\#.<]').test(type)){
		element = el.substring(1),
		type = el.charAt(0);
	}else if(type === document || type === window){
		type = type;
	}else{
		type = '';		
	};
	switch(type){
		case '<':
			var ht = new DOMParser(),
				obj = ht.parseFromString(element,"text/xml").childNodes[0];
		break

		case '#':
			obj = document.getElementById(element);
		break
		
		case '.':
			obj = document.getElementsByClassName(element);
		break
		
		case '':
			obj = document.getElementsByTagName(element);
		break

		default :
			obj = type;
		break
	};
	
	obj.on = on;
	obj.html = html;
	obj.attr = attr;
	obj.append = append;
	return obj;
};
