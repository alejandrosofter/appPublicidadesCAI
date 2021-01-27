Template.inicio.rendered=function(){
	SUIBlock.block('Cargando sitio, aguarde un momento...');
  Meteor.call("publicidades.promociones",function(err,res){
 SUIBlock.unblock();
     Session.set("promocionesWeb",res);

  })
}
Template.cadaPromocion2.helpers({
	"random":function(){
		return "rand="+Math.random()
	}
})
Template.inicio.helpers({
  "muestraSlide":function(){
  return (Router.current().route.getName()=="inicio" || Router.current().route.getName()==undefined)
},
	'empresa': function(){
     return Settings.findOne({clave:"nombreEmpresa"}).valor;
     },
     "promociones":function(){
     	console.log(this)
      return this;
     },
     "videos":function(){
      var arr= this
      var sal="var videos=[];";
      for(var i=0;i<arr.length;i++){
      	console.log(arr[i])
      	if(arr[i].tieneVideo==true)sal+="videos.push({videoURL:'"+arr[i].videoYoutube+"',containment:'self',autoPlay:true, mute:true, startAt:0,opacity:1, loop:false, ratio:'4/3', addRaster:true});";
      }
      	

      return sal;
     },
	'usuario': function(){
     return Meteor.user()
     },
	  'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().profile==="admin")return true;
       return false;
     },
     'estaLogueado': function(){
     if(Meteor.user())return true;
       return false;
     },
})
Template.slide.helpers({
	"slides":function(){
		var res= Session.get("sliders");
		if(res) for(var i=0;i<res.length;i++)res[i].pos=(i)
		return res;
	},
	
	"slidesNro":function(){
		var res= Session.get("sliders");
		var aux=[];
		if(res) for(var i=0;i<res.length;i++)aux.push(i)
		return aux;
	}
})
Template.index.rendered=function(){
	const lozad = require('lozad');
	const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();
Meteor.call("getSitio",function(err,res){

	$("#sitio").html(res)
})
}
Template.slide.rendered=function(){
	Meteor.call("publicidades.promociones",true,function(err,res){
		Session.set("sliders",res);
	})
}
Template.cadaSlide.helpers({
	"nombreComercio":function(){
		return this.usuario[0].profile.fantasia;
	},
	"detalleComercio":function(){
		return this.detalleSlide;
	},
"esActivo":function(val){
	return this.pos==0?"active":"";
	},
})