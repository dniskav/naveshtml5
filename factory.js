var Factory = function(classes){
	this.classes = classes;
};

Factory.prototype = {
	create : function(type, params){
		return new this.classes[type](params);
	},
	extend : function (ChildClass, ParentClass) {
		var act = this;
		ChildClass.prototype = new ParentClass();
		ChildClass.prototype.constructor = ChildClass;
	}
};