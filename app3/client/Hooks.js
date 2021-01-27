var addHooksPubli = {

  onSuccess: function(formType, result) {
    swal("Bien!","Se ha agregado el registro!","success");
    Modal.hide()
  },
  onError: function(formType, error) {
    console.log(error)
    swal("Ops!","Hay errores en el formulario, por favor verifique y vuelva a intentar","error");
  },

};
var updateHooksPubli = {
  onSuccess: function(formType, result) {
    Modal.hide();
    swal("Bien!","Se ha modificado el convenio!","success");
    // Meteor.call("publicidades.guardarImagen",this.currentDoc._id,this.currentDoc.logo,function(err,res){
      
      
    // })
    
  },
  onError: function(formType, error) {
    console.log(error)
    swal("Ops!","Hay errores en el formulario, por favor verifique y vuelva a intentar","error");
  },
 
};
var updateHooks = {
  onSuccess: function(formType, result) {

    swal("Bien!","Se ha modificado el convenio!","success");
    Modal.hide()
  },
  onError: function(formType, error) {
    console.log(error)
    swal("Ops!","Hay errores en el formulario, por favor verifique y vuelva a intentar","error");
  },
 
};


AutoForm.addHooks(['nuevaPublicidad_',"nuevaPublicidad_"], addHooksPubli);
AutoForm.addHooks(['updatePublicidad_',"updatePublicidad_"], updateHooksPubli);

AutoForm.addHooks(['modificaSettings_',"modificaSettings_"], updateHooks);

