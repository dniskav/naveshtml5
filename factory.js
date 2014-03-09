var Factory = function(classes){
	this.classes = classes;
};

Factory.prototype.create = function(type, params){
	return new this.classes[type](params);
};