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
		}

	if(type === '.' || type === '#'){
		element = el.substring(1),
		type = el.charAt(0);
	}else if(type === document || type === window){
		type = type;
	}else{
		type = '';		
	};
	switch(type){
		case '#':
			obj = document.getElementById(element);
			obj.on = on;
			obj.html = html;
			obj.attr = attr;
		break
		
		case '.':
			obj = document.getElementsByClassName(element);
			obj.on = on;
			obj.html = html;
			obj.attr = attr;
		break
		
		case '':
			obj = document.getElementsByTagName(element);
			obj.on = on;
			obj.html = html;
			obj.attr = attr;
		break

		default :
			obj = type;
			obj.on = on;
			obj.attr = attr;
		break
	} 
	return obj;
};


