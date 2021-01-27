applicationController = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',

	  waitOn: function() {
		return [
			Meteor.subscribe("publicidades.all")
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		this.next();
	  },
	  action: function () {
		if (!this.ready()) {
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
applicationControllerInicio = RouteController.extend({
  layoutTemplate: 'layoutSolo',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',

	  waitOn: function() {
		return [
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		this.next();
	  },
	  action: function () {
		if (!this.ready()) {
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});

Router.route('/', {
 path: '/',
 // layoutTemplate: 'layoutVacio',
    template:"publicidades",
		controller: applicationController,
});
Router.route('/inicio', {
 path: '/inicio',
 // layoutTemplate: 'layoutVacio',
    template:"publicidades",
		controller: applicationController,
});

Router.route('settings', {
		path: '/settings',
    template:"settings",
		controller: applicationController,
})
Router.route('usuarios', {
		path: '/usuarios',
    template:"usuarios",
		controller: applicationController,
})
Router.route('publicidades', {
		path: '/publicidades',
    template:"publicidades",
		controller: applicationController,
})
Router.route('/editarBanner/:_id', {
	controller: applicationController,
    template: 'editarBanner',
    data: function(){
         var sal=Publicidades.findOne({_id:(this.params._id)});
         return sal;
    }
});
Router.route('/liquidaciones_facturas/:_id', {
	controller: applicationController,
    template: 'liquidaciones_facturas',
    data: function(){
         var sal=Liquidaciones.findOne({_id:(this.params._id)});
         console.log(this.params)
         return sal;
    }
});
Router.route('/nomencladores/:_id', {
	controller: applicationController,
    template: 'nomencladores',
    data: function(){
    	Meteor.subscribe('nomencladores.all')
         var sal=Nomencladores.findOne({_id:(this.params._id)});
         return sal;
    }
});