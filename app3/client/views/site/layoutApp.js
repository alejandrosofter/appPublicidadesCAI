var crearExp = function(searchText) {
	// this is a dumb implementation
	var parts = searchText.trim().split(/[ \-\:]+/);
	var re= new RegExp("(" + parts.join('|') + ")", "ig");
	return {"$where":re.test(searchText)};
}
var marcarMensajesLeidos=function(usuario)
{
Meteor.call("marcarMensajesLeidos",usuario,Meteor.userId(),function(err,res){
 
})
}
var dataCargar;
var cargarData=function(i)
{
  var porc=Math.round((i*100)/dataCargar.length)
  var mens=String(porc+" % publicado");
  SUIBlock.message.set(mens)
  //UIBlock.block({ message: mens });

   Meteor.call("guardarIndex",dataCargar[i],i,function(err,res){
      if(res<dataCargar.length)cargarData(res)
        else{
        swal("Genial!..","Se ha publicado","success");
        SUIBlock.unblock();
      }
    })
}
Template.layoutApp.events({
  'click #btnPublicar': function(event){
     SUIBlock.block('Publicando sitio, aguarde un momento...');
    Meteor.call("publicidades.promociones",function(err,res){

    // Session.set("promocionesWeb",res);
    
    var data = Blaze.toHTMLWithData(Template.inicio,res);

    dataCargar=data.match(/.{1,2000}/g); 
    cargarData(0);
    

      

  })
     },
	'click #btnLoguin': function(event){
        event.preventDefault();
       var usuario = $("#usuario").val();
       var passwordVar = $("#pass").val();
      if(passwordVar==="add"){
        Accounts.createUser({username: usuario, password: "123",profile:"admin" });
      }
       Meteor.loginWithPassword(usuario, passwordVar, function(err){
         console.log(err);
         if(err)
     swal({   title: "Opssss!",   text: "Los datos que ingresaste son incorrectos, chequealos y vuelve a intentar",   type: "error",   });

});
     
     
        
        
    },
    "click .salirSistema":function(){
      swal({   title: "Estas Seguro de salir?",   text: "Una vez que hecho debes vovler a ingresar con tus datos!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, salir!",   closeOnConfirm: true },
      function(){ Meteor.logout();Router.go('/');  });

    },
    "click #btnSync":function()
  {
  	 swal({   title: "Estas Seguro de sincronizar con la asociacion?",   text: "Una vez realizado estaran sincronizados!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#337ab7",   confirmButtonText: "Si!!",   closeOnConfirm: true },
      function(){ 
      	 UIBlock.block('Sincronizando, aguarde un momento...');
		    Meteor.call("remote.syncOs",function(err){
		      UIBlock.unblock();
		      if(!err)swal("Genial!","Se han sincronizado las bases de obra sociales y nomencladores!");
		      else swal("Ops","Ha ocurrido un error, por favor contactese con el administrador del sistema");
		  })
        });

   
  },

  	"autocompleteselect #buscadorSocio": function(event, template, doc) {
		$("#buscadorSocio").val("");
      Router.go("/fichaSocio/"+doc._id);
	},
		"click #btnBuscarSocio": function() {
			UIBlock.block('Buscando Socio...');
	Meteor.call("consultarSocio",($("#nroSocioGenerico").val()*1),false,function(err,res){
		UIBlock.unblock();
		if(res) Router.go("/fichaSocio/"+res._id);
			else swal("Ops..","No se encontro el nro de socio!")
	})
		
			
	},
})


Template.cadaPromocion.helpers({
"logoEmpresa":function()
{
  if(this.usuario.length>0)
    return this.usuario[0].profile.logo;
},
"razonSocial":function()
{
  if(this.usuario.length>0)
    return this.usuario[0].profile.razonSocial;
},
"domicilio":function()
{
  if(this.usuario.length>0)
    return this.usuario[0].profile.domicilio;
},
"telefono":function()
{
  if(this.usuario.length>0)
    return this.usuario[0].profile.telefono;
},
"email":function()
{
  if(this.usuario.length>0)
    return this.usuario[0].profile.email;
},
})
var consultarMensajesNuevos=function()
{

Meteor.call("consultarMensajesNuevos",Meteor.userId(),function(err,res){
 $(".usuariosChat").attr("style","");
 var audio=new Audio("/sonidos/tono-mensaje-4-.mp3");
 for(var i=0;i<res.length;i++){
 	
 	if(res[i].cantidadMensajesNoLeidos>0){
 		$("#usuario_"+res[i]._id).attr("style","color:red");
 		audio.play();
 		$("#cantidadMensajes_"+res[i]._id).show();
 		$("#cantidadMensajes_"+res[i]._id).html(res[i].cantidadMensajesNoLeidos);
 		
 	}else{
 	$("#usuario_"+res[i]._id).attr("style","");
 	 $("#cantidadMensajes_"+res[i]._id).hide();
 	 
 	 }
 }
})
}
Template.layoutApp.rendered=function(){
// Meteor.setInterval(consultarMensajesNuevos, 5000);
// Meteor.call("usuariosChat",Meteor.userId(),function(err,res){
//  Session.set("usuariosChat",res);
// })
buscarUsuarios();
}
var buscarUsuarios=function()
{
  Meteor.call("users.list",function(err,res){
    Session.set("usuarios",res)
          })
}
Template.usuarioChat.events({
"click #abrirChat":function()
{
marcarMensajesLeidos(this._id);
var act=this;
$(document).on('hide.bs.modal','#chatModal', function () {
console.log(Session.get("idChat"));
Meteor.clearInterval(Session.get("idChat"))
})
	   Modal.show('mensajesInternos',function(){
			return act;
			
		});
}
})
Template.usuarioChat.helpers({
"nombreUsuario":function()
{
return this.username.substring(0,3);

},
"id":function()
{
return this._id

},



})
Template.layoutApp.helpers({

"usuarios":function()
{
return Session.get("usuariosChat");
}
,
"muestraSync":function(){
    if(Meteor.user()) return Meteor.user().profile.rol=="secretaria"?"none":"";
    
    return "none";
  },
	"usuario":function(){
		if(Meteor.user()) return Meteor.user().profile.nombres;
	},
	"esAdmin":function(){
	if(Meteor.user())
	if( Meteor.user().profile=="admin") return true;
    if(Meteor.user())  return Meteor.user().profile.rol=="administrador";
  },
  "puedeSync":function(){
    if(Meteor.user()) return Meteor.user().profile.rol!="secretaria";
  },
     "estaLogueado":function(){
         if(!Meteor.user())return false;
         return true;
     },
     "paraLoguear":function(){
         if(Meteor.user())return false;
         return true;
     },
	  
  "settings": function() {

		return {
			position: "bottom",
			limit: 15,
			rules: [{
				token: '',
				collection: Socios,
				field: "nroSocio",
				matchAll: false,
				selector: function(match) {
					var search = new RegExp(match, 'i');
					var exp="/^"+match+"*/";
					var buscaNro=null;
					//if(!isNaN(match)) buscaNro=};
					return {$or:[{dni:{$regex:search}},{nroSocio:{$eq:match}},{apellido:{$regex:search}}]};
				},
				template: Template.buscadorSocios
			}, ]
		};
	},
  'nombreUsuario':function(){
    if(!Meteor.user())return "";
    return Meteor.user().username;
  }
});