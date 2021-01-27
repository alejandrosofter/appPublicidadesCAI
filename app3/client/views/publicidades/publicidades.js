

function wrapCanvasText(t, canvas, maxW, maxH, justify) {

    if (typeof maxH === "undefined") {
        maxH = 0;
    }
    var words = t.text.split(" ");
    var formatted = '';

    // This works only with monospace fonts
    justify = justify || 'left';

    // clear newlines
    var sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, "");
    // calc line height
    var lineHeight = new fabric.Text(sansBreaks, {
        fontFamily: t.fontFamily,
        fontSize: t.fontSize
    }).height;

    // adjust for vertical offset
    var maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
    var context = canvas.getContext("2d");


    context.font = t.fontSize + "px " + t.fontFamily;
    var currentLine = '';
    var breakLineCount = 0;

    n = 0;
    while (n < words.length) {
        var isNewLine = currentLine == "";
        var testOverlap = currentLine + ' ' + words[n];

        // are we over width?
        var w = context.measureText(testOverlap).width;

        if (w < maxW) { // if not, keep adding words
            if (currentLine != '') currentLine += ' ';
            currentLine += words[n];
            // formatted += words[n] + ' ';
        } else {

            // if this hits, we got a word that need to be hypenated
            if (isNewLine) {
                var wordOverlap = "";

                // test word length until its over maxW
                for (var i = 0; i < words[n].length; ++i) {

                    wordOverlap += words[n].charAt(i);
                    var withHypeh = wordOverlap + "-";

                    if (context.measureText(withHypeh).width >= maxW) {
                        // add hyphen when splitting a word
                        withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
                        // update current word with remainder
                        words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
                        formatted += withHypeh; // add hypenated word
                        break;
                    }
                }
            }
            while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
            currentLine = ' ' + currentLine;

            while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
            currentLine = ' ' + currentLine + ' ';

            formatted += currentLine + '\n';
            breakLineCount++;
            currentLine = "";

            continue; // restart cycle
        }
        if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
            // add ... at the end indicating text was cutoff
            formatted = formatted.substr(0, formatted.length - 3) + "...\n";
            currentLine = "";
            break;
        }
        n++;
    }

    if (currentLine != '') {
        while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
        currentLine = ' ' + currentLine;

        while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
        currentLine = ' ' + currentLine + ' ';

        formatted += currentLine + '\n';
        breakLineCount++;
        currentLine = "";
    }

    // get rid of empy newline at the end
    formatted = formatted.substr(0, formatted.length - 1);

    var ret = new fabric.Text(formatted, { // return new text-wrapped text obj
        left: t.left,
        top: t.top,
        fill: t.fill,
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        originX: t.originX,
        originY: t.originY,
        angle: t.angle,
    });
    return ret;
}
Template.publicidades.rendered=function () { 
  Meteor.subscribe("publicidades.all");
  consultarUsuarios();
   // this.filter = new ReactiveTable.Filter('buscadorpublicidades', ['codigoNomenclador']);
   // this.filterNombre = new ReactiveTable.Filter('buscadorNombre', ['nombreNomenclador']);
}
Template.nuevaPublicidad.rendered=function () { 
    setOpcionesUsuarios(Session.get("usuarios"))

}

Template.modificarPublicidad.helpers({
  'logoPubli':function(){
    return this.logo
  },
})
// var setModificadorImagen=function()
// {
//   console.log("set modificador")
//    import Cropper from 'cropperjs';

//       var image = document.getElementById('muestraLogo');
//       var cropBoxData;
//       var canvasData;
//       var cropper;

//         cropper = new Cropper(image, {
//           autoCropArea: 0.5,
//           ready: function () {
//             //Should set crop box data first here
//             cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
//           }
//         });
      
 
  
// }
var b64toBlob=function(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = window.atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}

Template.modificarPublicidad.rendered=function () { 
  var id=this.data.idUsuario;
 setOpcionesUsuarios(Session.get("usuarios"),id);
}
var canvas;
Template.editarBanner.helpers({
  "estado":function(){
    return ""
    if(canvas)
    return canvas.getActiveObject()?"":"disabled";
  },
"banner":function(){
  return this.imagenBanner
}
})
var aumenta=1;

Template.editarBanner.events({
  "click #aumenta":function(){
var o = canvas.getActiveObject();
    // if no object selected, do nothing
    if (!o) {
      return
    }
    aumenta+=0.3;
      o.set('scaleX', aumenta);
    
      o.set('scaleY', aumenta);
    
    o.setCoords();
    canvas.renderAll();
  },
  "click #achica":function(){
var o = canvas.getActiveObject();
    // if no object selected, do nothing
    if (!o) {
      return
    }
    aumenta-=0.3;
      o.set('scaleX',aumenta);
    
      o.set('scaleY', aumenta);
    
    o.setCoords();
    canvas.renderAll();
  },
  "click #quitar":function(){
     canvas.getActiveObject().remove();
  },
  "click #importar":function(){
     importarSvg(this._id)
  },
   "click #enviarFrente":function(){
      canvas.bringForward(canvas.getActiveObject())
  },
   "click #enviarAtras":function(){
     canvas.sendBackwards(canvas.getActiveObject())
  },
  "click #colorPrimario":function(){
     canvas.getActiveObject().set({fill: '#f39f05'});
     canvas.renderAll()
  },
  "click #colorSecundario":function(){
     canvas.getActiveObject().set({fill: '#181492'});
     canvas.renderAll()
  },
  "click #colorBlanco":function(){
     canvas.getActiveObject().set({fill: '#fff'});
     canvas.renderAll()
  },
   "click #colorNegro":function(){
     canvas.getActiveObject().set({fill: '#000'});
     canvas.renderAll()
  },
  "click #limpiar":function(){
    horizontal(this)
  },
  "click #modoHorizontal":function(){
    
  },
  "click #btnGenerar":function(){
    var FileSaver = require('file-saver');
     canvas.deactivateAll().renderAll();//deselecciona todos para que no se vea la seleccion
    var image = canvas.toDataURL("image/png");
    var data=JSON.stringify(canvas.toJSON());
    SUIBlock.block('Prcesando informacion, aguarde un momento...');
    var idPublicidad=this._id;
    Meteor.call("publicidades.guardarBanner",idPublicidad,data,function(err,res){
      var dataImg = canvas.toDataURL('image/png');
      dataImg.resizeImage(850,200,function(data){
        Meteor.call("publicidades.guardarImagen",idPublicidad,data,function(err,res){
     SUIBlock.unblock();
      if(!err)swal("Genial!","Se guardo el banner!","success")
        else swal("opss",err,"error")
    })
      })
      
   })
  }
})
var elememsBanner={};

var horizontal=function(datos){
 
  if(canvas)canvas.clear();
  else canvas = new fabric.Canvas('canvas');

canvas.on('selection:updated', function () {
   aumenta=1;

});
var logo=datos.logo;
var usuario=getUsuario(datos.idUsuario);

//   var fondoDescuento = new fabric.Rect({
//   width: 300, height: 300, fill: '#181492', left:600, top: 0,opacity: 1
// });
  var fondoDescuento = new fabric.Triangle({
  width: 300, height: 500, fill: '#181492', left:510, top: 130,opacity: 0.8
});
    var fondoDescuento2 = new fabric.Triangle({ 
  width: 300, height: 300, fill: '#181492', left: 570, top: 0,opacity: 0.8
});
  
  var fondoLogo = new fabric.Rect({ width: 250, height: 300,left: 0,opacity: 1, top: 0, fill: 'white' });
   var fondoDetalle = new fabric.Rect({ width: 630, height: 60,opacity: 0.5,left: 0, top: 120, fill: 'black' });
  var textoDescuento=datos.cantidadDescuento;
var detalle = new fabric.IText(datos.detalle, {  fontSize: 15, width:300,left: 610, top:100, fontFamily: 'Roboto Light'    }).set({fill: 'white'});
var domicilio = new fabric.IText( usuario.profile.domicilio+" | Tel. "+usuario.profile.telefono, { fontSize: 10,left: 20, top: 170, fontFamily: 'Roboto Light'    }).set({fill: '#4c4c4c'});

var decuento = new fabric.IText(textoDescuento, { fontSize: 70,left: 670, top: 20, fontFamily: 'Roboto'  }).set({fill: 'orange'});
 var aux={decuento:decuento,detalle:detalle,domicilio:domicilio,fondoLogo:fondoLogo,fondoDescuento:fondoDescuento,fondoDescuento2:fondoDescuento2}
  elememsBanner=aux;

fondoLogo.lockMovementX=true;
fondoLogo.lockMovementY=true;
canvas.add(fondoLogo);


 fondoDescuento.lockMovementX=true;
fondoDescuento.lockMovementY=true;

 fondoDescuento2.lockMovementX=true;
fondoDescuento2.lockMovementY=true;

  canvas.add(fondoDescuento);
  canvas.add(fondoDescuento2);

  canvas.add(domicilio);
//var detalleFormat = wrapCanvasText(detalle, canvas, 227, 2200, 'right');

canvas.add(detalle);
 fondoDescuento2.set('angle', 0).set('flipY', true);
fondoDescuento.set('angle', -40).set('flipY', true);

canvas.add(decuento);
canvas.renderAll();




}
var vertical=function(datos){

  $("#conte_canvas").hide();
   $("#conte_canvas2").show();

  canvas = new fabric.Canvas('canvas2');
canvas.on('selection:updated', function () {
   aumenta=1;

});

var logo=datos.logo;
Meteor.call("settings.oneClave","dirImagenes",function(err,res){
  var valor=res?res.valor:"??";
  Session.set("dirImagenes",valor);
})
Meteor.call("users.perfil",datos.idUsuario,function(err,res){
  var fondoDescuento = new fabric.Triangle({
  width: 300, height: 500, fill: 'blue', left:180, top: 380,opacity: 0.6
});
    var fondoDescuento2 = new fabric.Triangle({ 
  width: 300, height: 300, fill: 'blue', left: 210, top: 260,opacity: 0.6
});
  
  var fondoLogo = new fabric.Rect({ width: 470, height: 145,left: 0,opacity: 0.6, top: -8, fill: 'white' });
   var fondoDetalle = new fabric.Rect({ width: 630, height: 60,opacity: 0.5,left: 0, top: 120, fill: 'black' });
  var textoDescuento=datos.cantidadDescuento+" "+datos.tipoDescuento;
var detalle = new fabric.Text(datos.detalle, {  fontSize: 14, width:300,left: 190, top:340, fontFamily: 'Saira'    }).set({fill: 'white'});
var domicilio = new fabric.Text(res.domicilio, { fontSize: 10,left: 160, top: 120, fontFamily: 'Gloria Hallelujah'    }).set({fill: '#4c4c4c'});

var decuento = new fabric.Text(textoDescuento, { fontSize: 60,left: 280, top: 260, fontFamily: 'Roboto'  }).set({fill: 'orange'});
  fabric.Image.fromURL(logo, function(imgFoto) {
 fabric.Image.fromURL(res.logo, function(imgFotoLogo) {
  var aux={decuento:decuento,detalleFormat:detalleFormat,imagenLogo:imgFotoLogo,imagen:imgFoto,domicilio:domicilio,fondoLogo:fondoLogo,fondoDescuento:fondoDescuento,fondoDescuento2:fondoDescuento2}
  elememsBanner=aux;

  canvas.add(imgFoto);
canvas.add(fondoLogo);
canvas.add(domicilio); 
canvas.add(imgFotoLogo);

imgFotoLogo.set({ top:20});
  canvas.add(fondoDescuento);
  canvas.add(fondoDescuento2);
var detalleFormat = wrapCanvasText(detalle, canvas, 270, 2200, 'right');

canvas.add(detalleFormat);
 fondoDescuento2.set('angle', 0).set('flipY', true);
fondoDescuento.set('angle', -40).set('flipY', true);

canvas.add(decuento);

 })


});
})



}
Template.editarBanner.rendered=function () {
  importarSvg(this.data._id)
}
function importarSvg(id)
{
 
  canvas = new fabric.Canvas('canvas');
  Meteor.call("getSvgBanner",id,function(err,json){

    
    canvas.loadFromJSON(json, function() {
   canvas.renderAll(); 
},function(o,object){
})
 


  });
}
function getUsuario(id)
{
  if(Session.get("usuarios"))
  for(var i=0;i<Session.get("usuarios").length;i++)
    if(id==Session.get("usuarios")[i]._id) return Session.get("usuarios")[i];
  return null;
}
function setOpcionesUsuarios(data,idSeleccion)
{
  for(var i=0;i<data.length;i++){
      var lab=data[i].profile.razonSocial;
      var seleccionado=idSeleccion==data[i]._id?true:false;
      var auxOption=new Option(lab, data[i]._id, seleccionado, seleccionado);
      
      $('#idUsuario').append(auxOption)
    }
    $('#idUsuario').trigger('change');
    

} 
Template.imprimirContrato.rendered=function(){
  $('#contrato').summernote({
  airMode: true
})
  $('#contrato').on('summernote.keyup', function(we, e) {
  $("#btnGuardar").show()
});
  
}
Template.imprimirContrato.helpers({
"textoContrato":function(){
  if(this.textoContrato)
  return new Spacebars.SafeString(this.textoContrato);
else return new Spacebars.SafeString("Todavia no se ha generado el contrato!.. haga click en <b>Generar Contrato </b>para generarlo")
},

})
Template.textoContrato.helpers({
  "dia":function(){
  return new Date().getDate();
},
"mes":function(){
  var d=new Date();
  return d.getMesLetras()
},
"ano":function(){
  return new Date().getYear();
},
"dias":function(){
  return this.fecha.getDia();
},
"mesLetras":function(){
 return this.fecha.getMesLetras()
},
"ano":function(){
 return this.fecha.getAno()
},
"representa":function(){
  var usuario=getUsuario(this.idUsuario);
  return usuario.profile.representante;
},
"caracterRepresenta":function()
{
  var usuario=getUsuario(this.idUsuario);
  return usuario.profile.caracterRepresentante;
},
"razonSocial":function(){
  var usuario=getUsuario(this.idUsuario);
  return usuario.profile.razonSocial;
},
"domicilio":function(){
  var usuario=getUsuario(this.idUsuario);
  return usuario.profile.domicilio;
},
"nombreFantasia":function(){
  var usuario=getUsuario(this.idUsuario);
  return usuario.profile.fantasia;
},
"promociones":function(){
 var sal=[];
 for(var i=0;i<this.promociones.length;i++){
  var aux=this.promociones[i];
  aux.nro=i+1;
  sal.push(aux)
 }
 return sal
  
},
"cantidadCuotas":function(){
  return !this.cantidadCuotas==""
},
"tieneCuotas":function(){
  return this.cantidadCuotas
},
"rubro":function(){
  var usuario=getUsuario(this.idUsuario);
  return usuario.profile.rubro;
},

})
Template.imprimirContrato.events({
  "click #btnImprimir":function(){
  import printJS from 'print-js'
  printJS({
    printable: 'printable',
    type: 'html',
    targetStyles: ['*']
 }) 
},
"click #btnGuardar":function(){
var datos=$('#contrato').summernote("code");
 Meteor.call("publicidades.updateContrato",this._id,datos,function(err,res){
  swal("Genial!","Se ha actualizado el contrato!");
 })
},
"click #btnEnviar":function(){
 Meteor.call("enviarMensaje",this,function(err,res){
  swal("Genial!","Se ha actualizado el contrato!");
 })
},
"click #btnGenerar":function(){
  var data = Blaze.toHTMLWithData(Template.textoContrato,this);
 Meteor.call("publicidades.updateContrato",this._id,data,function(err,res){
  swal("Genial!","Se ha actualizado el contrato!");
 })
}
})
Template.publicidades.events({
   "keyup #codigoNomenclador": function (event, template, doc) {

      var input = $(event.target).val();
      console.log(input)
     if(input=="")template.filter.set("");
      else template.filter.set(input);
      
   },
   "keyup #nombreNomenclador": function (event, template, doc) {

      var input = $(event.target).val();
      console.log(input)
     if(input=="")template.filterNombre.set("");
      else template.filterNombre.set(input);
      
   },
'mouseover tr': function(ev) {
    $("#tabla").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();

  },
"click #agregarPromo":function()
{
  var data=this;
 Modal.show("nuevaPromocion",function(){
  return data
 })
},
"click #btnAgregar":function()
{
  var data=this;
 Modal.show("nuevaPublicidad",function(){
  return data
 })
},
"click #editarBanner":function()
{
  var data=this;
 Router.go("/editarBanner/"+this._id)
}
,"click #modificar":function()
{
  var data=this;
 Modal.show("modificarPublicidad",function(){
  return data
 }) 
},
"click #video":function()
{ 
  var data=this;
 Modal.show("videoPublicidad",function(){
  return data
 }) 
},
"click #imprimir":function()
{
  var data=this;
 Modal.show("imprimirContrato",function(){
  return data
 })
},
'click #delete': function(ev) {
    var id = this._id;
   
      swal({
  title: 'Donde quitar?',
  text: "Una vez que lo has quitado sera permanente!",
  type: 'warning',
  showCancelButton: true,
  confirmButtonText: "Si, borralo!",
  cancelButtonText: 'FONDO'
}).then((result) => {
  if (result.value) {
     Meteor.call("publicidades.remove",id,function(err,res){
      if(!err)swal("Bien!","Se ha eliminado el registro ","success")
      else swal("Ops..","hay un problema con la carga del nuevo usuario: "+err.message,"error")
    });
  } 
})

  },
  'click #poneSlide': function(ev) {
    var id = this._id;
    Meteor.call("publicidades.cambiaCampo",id,"muestraSlide",false,function(err,res){
      // if(res)swal("Genial!","se realizo la operacion con exito","success");
      // else swal("Ops..","no se pudo realizar la operacion","error");
    })

  },
  'click #sacaSlide': function(ev) {
     var id = this._id;
    Meteor.call("publicidades.cambiaCampo",id,"muestraSlide",true,function(err,res){
      // if(res)swal("Genial!","se realizo la operacion con exito");
      // else swal("Ops..","no se pudo realizar la operacion");
    })
  },

  'click .quitarPromo': function(ev) {
   console.log(ev)
   var idPubli=$(ev.currentTarget).attr("idPubli");
   var id=$(ev.currentTarget).attr("id");
   console.log(idPubli,id)
    swal({
      title: "Estas Seguro de quitar la promo?",
      text: "Una vez que lo has quitado sera permanente!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Si, borralo!",
      closeOnConfirm: true
    }, function() {
    Meteor.call("publicidades.quitarPromo",idPubli,id,function(err,res){
      if(!err)swal("genial!","se ha quitar la publi","success");
      else swal("ops!","no se ha podido realizar la operacion","error")
    })
    });

  },
  'click .editarPromo': function(ev) {
   
   var idPubli=$(ev.currentTarget).attr("idPubli");
   var id=$(ev.currentTarget).attr("id");
   var data=Publicidades.findOne({_id:id});
   data.idPublicidad=idPubli;
   Modal.show("modificarPromocion",function(){
    return data;
   })

  },
})
var buscarIndice=function(busca,arr)
{
  for (var i = 0; i < arr.length; i++)
    if(arr[i]._id==busca)return i;
  return -1;
}
var imgTempImport=null;
Template.imagenPubli.events({
  "change .file-upload-input": function(event, template){
   var func = this;
   var file = event.currentTarget.files[0];
  
   var reader = new FileReader();
   reader.onload = function(fileLoadEvent) {
      
     fabric.Image.fromURL(reader.result, function(imgFoto) {
      imgTempImport=imgFoto;
      swal({
  title: 'Donde deseas colocarla?',
  text: 'Selecciona la forma en que se posicionara y ajustara',
  type: 'warning',
  cancelButtonColor:"#79c12a",
  showCancelButton: true,
  confirmButtonText: 'LOGO',
  cancelButtonText: 'FONDO'
}).then((result) => {
  if (result.value) {
    imgTempImport.scaleToWidth(230, false);
    canvas.add(imgTempImport);
    canvas.bringForward(imgTempImport);
  // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
  } else if (result.dismiss === 'cancel') {
    imgTempImport.scaleToWidth(360, false);
    imgTempImport.set({left: 250, top: 0});
    canvas.add(imgTempImport);

    canvas.sendToBack(imgTempImport);
  }
})
      // canvas.add(imgFoto);
      // canvas.sendToBack(imgFoto);

     })
  
}
   reader.readAsDataURL(file);
}
})
Template.videoPubli.events({
  "change .file-upload-input": function(event, template){
   var func = this;
  
   var file = event.currentTarget.files[0];
  
   var reader = new FileReader();
   reader.onload = function(fileLoadEvent) {
    Meteor.saveFile(reader.result, func._id); 
   };
   reader.readAsDataURL(file);
},
})
Template.modificarPromocion.helpers({
  
  "eti_detalle":function(){
    var idSeleccion=this._id;
    var ind=buscarIndice(this.idPublicidad,this.promociones);
    console.log(idSeleccion,this)
  return'promociones.'+ind+'.detalle';
  },

  "eti_ahorroEn":function(){
    var idSeleccion=this._id;
    var ind=buscarIndice(this.idPublicidad,this.promociones);
  return'promociones.'+ind+'.ahorroEn';
  },
  "eti_cantidad":function(){
    var idSeleccion=this._id;
    var ind=buscarIndice(this.idPublicidad,this.promociones);
  return'promociones.'+ind+'.cantidad';
  },
  "eti_cantidadCuotas":function(){
    var idSeleccion=this._id;
    var ind=buscarIndice(this.idPublicidad,this.promociones);
  return'promociones.'+ind+'.cantidadCuotas';
  },
  "eti_logo":function(){
    var idSeleccion=this._id;
    var ind=buscarIndice(this.idPublicidad,this.promociones);
  return'promociones.'+ind+'.logo';
  }

})

Template.accionesPublicidades.helpers({
  "tieneVideo":function(){
    return this.tieneVideo
  }
})

Template.publicidades.helpers({
	'settings': function(){
    var data=Publicidades.find().fetch();
        return {
 collection: data?data:[],
 rowsPerPage: 100,
  //filters: ['buscadorpublicidades',"buscadorNombre"],
 class: "table table-hover table-condensed",
 showFilter: false,
 fields: [
 {
        key: 'fecha',
       label:"Fecha",
       fn:function(val,obj){
        return val.getFecha()
       }
      },

	   {
        key: 'idUsuario',
       label:"Comercio",
       fn:function(val,obj){
        var usuario= getUsuario(val);
        if(usuario)return usuario.profile.razonSocial;
        return "";
       }

      },
      
      

      {
        key: 'detalle',
        label: 'Detalle',
      },
      {
        key: 'cantidadDescuento',
        label: 'Cant. Descuento',
      },
      {
        key: 'estado',
        label: 'Estado',
      },

{
          label: '',
          headerClass: 'col-md-2',
          tmpl: Template.accionesPublicidades
        }
      
  
 ]
 };
    }

});