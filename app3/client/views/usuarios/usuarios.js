import { Meteor } from 'meteor/meteor';

consultarUsuarios=function()
{
   Meteor.call("users.list",function(err,res){
        Session.set("usuarios",res);
      })
}
var resetearClave=function(id,clave)
{
  console.log("cambia clave"+id)
   Meteor.call("users.resetPassword",id,clave,function(err,res){
    swal("Bien!","se ha reseteado la clave!","success");
    if(!Meteor.user())Router.go('/login');
      })
}
Template.usuarios.onCreated(function () {
  Meteor.subscribe('usuarios.all');
});

Template.usuarios.helpers({
	'settings': function(){
     consultarUsuarios();
        return {
 collection: Session.get("usuarios"),
 rowsPerPage: 100,
 class: "table table-hover table-condensed",
 showFilter: false,
 fields: [
 
	   {
        key: 'username',
			 label:"Usuario",
      },
      {
        key: 'profile.razonSocial',
        label: 'Razon Social',
      },
	 {
        key: 'profile.rol',
        label: 'Perfil de...',
      },
      {
          label: '',
          //headerClass: 'col-md-1',
          tmpl: Template.accionesUsuarios
        }
      
  
 ]
 };
    }

});
Template.imagenUsuario.helpers({
  "logo":function(){
    return this.data.profile.logo
  }
})
Template.usuarios.events({

  "click #btnPrint":function(){
    window.print()
  },
  'mouseover tr': function(ev) {
    $("#tabla").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();

  },
  "click #btnAgregar":function(){
    Modal.show('nuevoUsuario',function(){ return null; });
  },
  'click #delete': function(ev) {
    var id = this._id;
    swal({
      title: "Estas Seguro de quitar?",
      text: "Una vez que lo has quitado sera permanente!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Si, borralo!",
      closeOnConfirm: true
    }, function() {
     Meteor.call("users.remove",id,function(err,res){
      consultarUsuarios();
      if(!err)swal("Bien!","Se ha eliminado el usuario ","success")
      else swal("Ops..","hay un problema con la carga del nuevo usuario: "+err.message,"error")
    });
      
      
    });

  },
   'click #modificar': function(ev) {
    var data=this;
    Modal.show("modificarUsuario",function(){
      return data
    })

  },
});
Template.modificarUsuario.helpers({
"data":function(){
  return this;
}
});

Template.modificarUsuario.rendered=function(){
  $("#tipoUsuario").val(this.data.profile.rol);

}

Template.modificarUsuario.events({
  "change .file-upload-input": function(event, template){
   var func = this;
   var file = event.currentTarget.files[0];
   
   var reader = new FileReader();
   reader.onload = function(fileLoadEvent) {

    reader.result.resizeImage(250,150,function(data){
      $("#logo").val(data)
    })
   };
   reader.readAsDataURL(file);
},
"click #btnAgregar":function(){
  var perfil={
    
    razonSocial:$("#razonSocial").val(),
    nombres:$("#nombres").val(),
    email:$("#email").val(),
    telefono:$("#telefono").val(),
    logo:$("#logo").val(),
    domicilio:$("#domicilio").val(),
    representante:$("#representante").val(),
    rubro:$("#rubro").val(),
    caracterRepresentante:$("#caracterRepresentante").val(),
    fantasia:$("#fantasia").val(),
    rol:$( "#tipoUsuario option:selected" ).val()
  };
  var usuario=$("#usuario").val();
  var clave=$("#password").val();
  var _id=this._id;

if(clave!="")resetearClave(_id,clave);
UIBlock.block('Realizando consulta, aguarde por favor...');
Meteor.call("users.update",_id,usuario,perfil,function(err,res){
  UIBlock.unblock();
if(!err){
  consultarUsuarios();
  Modal.hide();
}
      else swal("Ops..","hay un problema con la carga del nuevo usuario: "+err.message,"error")
  })
}
})

Template.nuevoUsuario.events({
  "change .file-upload-input": function(event, template){
   var func = this;
   var file = event.currentTarget.files[0];
   
   var reader = new FileReader();
   reader.onload = function(fileLoadEvent) {
    reader.result.resizeImage(250,150,function(data){
      $("#logo").val(data)
    })
   
   };
   reader.readAsDataURL(file);
},
  "click #btnAgregarUsuario":function(){
    console.log("acet")
    var perfil={
    
    razonSocial:$("#razonSocial").val(),
    nombres:$("#nombres").val(),
    email:$("#email").val(),
    logo:$("#logo").val(),
    rubro:$("#rubro").val(),
    domicilio:$("#domicilio").val(),
    caracterRepresentante:$("#caracterRepresentante").val(),
    representante:$("#representante").val(),
    fantasia:$("#fantasia").val(),
    telefono:$("#telefono").val(),
    rol:$( "#tipoUsuario option:selected" ).val()
  };
  var usuario=$("#usuario").val();
    var clave=$("#password").val();
    UIBlock.block('Realizando consulta, aguarde por favor...');
    Meteor.call("users.add",usuario,clave,perfil,function(err,res){
      UIBlock.unblock();
      if(!err){
        consultarUsuarios();
        Modal.hide();

      }
      else swal("Ops..","hay un problema con la carga del nuevo usuario: "+err.message,"error")
    });

  },
})