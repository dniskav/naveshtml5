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
			var	el = this,
				evs = ev.split(' '),
				eventsIterator = function(method, evs, fn, bool){
					var acum;
					for (var ndx in evs) {
						method(evs[ndx], fn, bool);
					}
				};
			if(el instanceof NodeList){
				for(var i = 0; i < el.length; i++){
					if(el[i].addEventListener){
						eventsIterator(el[i].addEventListener, evs, fn, false);
					}else if(el[i].attachEvent){
						eventsIterator(el[i].attachEvent, evs, fn);
					}
				}
			}else{
				if(el.addEventListener){
					eventsIterator(el.addEventListener, evs, fn, false);
				}else if(el.attachEvent){
					eventsIterator(el[i].attachEvent, evs, fn);
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

q.extend = function(ChildClass, ParentClass) {
	var dummyClass = ChildClass.prototype;
	ChildClass.prototype = new ParentClass();
	for (var prop in dummyClass) {
		if (dummyClass.hasOwnProperty(prop)) {
			ChildClass.prototype[prop] = dummyClass[prop];
		}
	}
	ChildClass.prototype.constructor = ChildClass;
};

q.arrayRemove = function(array, element){
	if(typeof element === 'number'){
		delete array[element];
	}else if(typeof element === 'object'){
		delete array[array.indexOf(element)];
	}else{
		return;
	}
	return array.filter(function(el){ return typeof el !== 'undefined'});
}

