/**
 * simple selector to attach events
 * @param  {string} el string to select element with the css selectors
 * @return {object}    object with the methods
 */
function q(el){
	if(typeof el === 'undefined') return;
	var obj, 
		element = el,
		type = (el === document)? document : el.charAt(0),
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

		};

	if(type === '.' || type === '#'){
		element = el.substring(1),
		type = el.charAt(0);
	}else if(type === document){
		type = document;
	}else{
		type = '';		
	};
	switch(type){
		case '#':
			obj = document.getElementById(element);
			obj.on = on;
		break
		
		case '.':
			obj = document.getElementsByClassName(element);
			obj.on = on;
		break
		
		case '':
			obj = document.getElementsByTagName(element);
			obj.on = on;
		break

		case document:
			obj = type;
			obj.on = on;
		break
	} 
	return obj;
};


