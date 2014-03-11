var Factory = function(classes){
	this.classes = classes;
};

Factory.prototype = {
	create : function(type, params, scope){
		params.scope = params.scope || scope || this;
		return new this.classes[type](params);
	}
};