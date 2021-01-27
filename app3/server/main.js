import { Meteor } from 'meteor/meteor'; 

var fs = Npm.require('fs');
var Future = Npm.require('fibers/future');
var getPromociones=function(principales){
      var sal=[];
      

      var arr= Publicidades.find(filtro).fetch()
      for(var i=0;i<arr.length;i++){
        var aux=arr[i];
        var comercio=Meteor.users.findOne({_id:aux.idUsuario}).profile;
        aux.logoEmpresa=comercio.logo;
        aux.domicilio=comercio.domicilio;
        aux.telefono=comercio.telefono;
        aux.email=comercio.email;
        
        sal.push(aux) 
      }
      return sal
      
} 
Meteor.methods({
   
  "getSvgBanner":function(id)
  {
    var fs = Npm.require('fs');
    Future = Npm.require('fibers/future');
    var fut1 = new Future();
    //Publicidades.update({_id:id},{$set:{logo:"",imagenBanner:""}})
    var path = Settings.findOne({clave:"pathImagenes"}).valor+"/banner_"+id+".txt";
    var text = fs.readFileSync(path,'utf8')

    return text;
  },
  "publicidades.remove":function(id){
    return Publicidades.remove({_id:id})
  },
  "publicidades.guardarBanner":function(id,data)
  {
     var fs = Npm.require('fs');
    Future = Npm.require('fibers/future');
    var fut1 = new Future();
    //Publicidades.update({_id:id},{$set:{logo:"",imagenBanner:""}})
    var path = Settings.findOne({clave:"pathImagenes"}).valor+"/banner_"+id+".txt";
    if(data){
      
        //fs.unlinkSync(path)
        fs.writeFile(path, data, 'binary', function(err) {

        // Meteor.wrapAsync(function(err,res){
        //   Publicidades.update({_id:id},{$set:{logo:"",imagenBanner:""}})
        // })
        fut1.return(err) 
        });
    }
    
    // fs.writeFile(path, data, 
    //     function (err,res) {
    //         if (err) throw err;
    //           console.log('Done!');
    //           fut1.return(res) 
    //     }
    // );
     return fut1.wait();
  },
  "publicidades.guardarImagen":function(id,data)
  { 

    //Publicidades.update({_id:id},{$set:{imagenBanner:data}})
     var fs = Npm.require('fs');
    Future = Npm.require('fibers/future');
    var fut1 = new Future();
    //Publicidades.update({_id:id},{$set:{logo:"",imagenBanner:""}})
    var path = Settings.findOne({clave:"pathImagenes"}).valor+"/banner_"+id+".png";
    
    if(data){
      Publicidades.update({_id:id},{$set:{logo:"",imagenBanner:""}})
        // var base64Data  =   data.replace(/^data:image\/png;base64,/, "");
        // var base64Data  =   base64Data.replace(/^data:image\/jpeg;base64,/, "");
        var base64Data=data.split(",")[1];
        base64Data  +=  base64Data.replace('+', ' ');
        var binaryData  =   new Buffer(base64Data, 'base64').toString('binary');
       
         if (fs.existsSync(path)) fs.unlinkSync(path)
        fs.writeFile(path, binaryData, 'binary', function(err) {

        // Meteor.wrapAsync(function(err,res){
        //   Publicidades.update({_id:id},{$set:{logo:"",imagenBanner:""}})
        // })
        fut1.return(err) 
        });
    }
    
    // fs.writeFile(path, data, 
    //     function (err,res) {
    //         if (err) throw err;
    //           console.log('Done!');
    //           fut1.return(res) 
    //     }
    // );
     return fut1.wait();
  },
  "enviarMensaje":function(data)
  {
      const accountSid = 'AC1091ce1c8be5d4a72073398f8e8aefe4';
const authToken = 'b53bcfd9a7d538d8b773632f10882b1c';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     from: 'whatsapp:+14155238886',
     body: 'Hi Joe! Thanks for placing an order with us. We’ll let you know once your order has been processed and delivered. Your order number is O12235234',
     to: 'whatsapp:+542975447771'
   })
  .then(message => console.log(message));

  },
  "images.guardar":function(data,id)
  { 

    //Publicidades.update({_id:id},{$set:{imagenBanner:data}})
     var fs = Npm.require('fs');
    Future = Npm.require('fibers/future');
    var fut1 = new Future();
    var path = Settings.findOne({clave:"pathImagenes"}).valor+"/"+id+".png";
    var base64Data  =   data.replace(/^data:image\/png;base64,/, "");
    base64Data  +=  base64Data.replace('+', ' ');
    var binaryData  =   new Buffer(base64Data, 'base64').toString('binary');
   console.log(path)
    fs.writeFile(path, binaryData, 'binary', function(err) {
fut1.return(err) 
});
    // fs.writeFile(path, data, 
    //     function (err,res) {
    //         if (err) throw err;
    //           console.log('Done!');
    //           fut1.return(res) 
    //     }
    // );
     return fut1.wait();
  },
  'publicidades.updateContrato':function(id,data)
  {
    return Publicidades.update({_id:id},{$set:{textoContrato:data }});
  },
"publicidades.cambiaCampo":function(id,campo,valor)
{
  var data={};

  data[campo]=valor;
return Publicidades.update({_id:id},{$set:data});
},
  'users.cargarInicial'(data) {
  	var hayUsuarios = Meteor.users.find().count()>0;
     if (!hayUsuarios) {
     	var perfil={nombres:"alejandro",rol:"administrador"};

        Accounts.createUser({ username:"admin", password:"admin", profile: perfil });
      }
  },
  "users.perfil"(id)
  {
    return Meteor.users.findOne({_id:id}).profile;
  },
  "publicidades.subirVideo"(video64,id)
  {
    var fs = Npm.require('fs');
    console.log(id)
    Future = Npm.require('fibers/future');
    var fut1 = new Future();

    var path = process.cwd() + '/../web.browser/app/images/'+id;

    fs.writeFile(path, video64, 
        function (err,res) {
            if (err) throw err;
              console.log('Done!');
              fut1.return(res) 
        }
    );
    return fut1.wait();
  }, 
  "getSitio"()
  {
    var sitio= Settings.findOne({clave:"sitio"});
    if(sitio)return sitio.valor;
    console.log(sitio)
    return "no hay sitio" 
  },
  "guardarIndex"(data,i)
  {
    // var sitio=Settings.findOne({clave:"sitio"});
    // if(sitio)return Settings.update({clave:"sitio"},{$set:{valor:data}});
    // else return Settings.insert({clave:"sitio",valor:data})
    
    var fut1 = new Future(); 
var sett=Settings.findOne({clave:"pathImagenes"});
    var path = sett.valor + '/contenido.html';
    console.log(path)
    if(i==0)fs.writeFile(path, data, 
        function (err,res) {
            if (err) throw err;
              fut1.return(i+1) 
        } 
    ); 
      else
    fs.appendFile(path, data, 
        function (err,res) {
            if (err) throw err;
              fut1.return(i+1) 
        }
    );
    return fut1.wait();
  }, 
  "publicidades.quitarPromo"(idPromo,id){
    console.log(idPromo,id)
    return Publicidades.update(
        {_id: id }, 
        { $pull: { "promociones": { "_id": idPromo } } },
        { getAutoValues: false } // SIN ESTE PARAMETRO NO QUITA!!
    );
  },
  'users.list'(data) {
    return Meteor.users.find().fetch(); 
  },
  'publicidades.all'() {
    return Publicidades.find({})
  },
  'publicidades.promociones'(principales) {
    var ordenar = {
      $sort: {
        _id: 1
      }
    };
    var filtro={estado:"ACTIVO"};
      if(principales)filtro.muestraSlide=true;
    var unw = { $unwind: "$promociones" };
    var match = { $match: filtro };

    var proyecto = {
      $project: {
        _id: "$_id",
        idUsuario: "$idUsuario",
        detalle: "$detalle",
        estado: "$estado",
        logo: "$logo",
        detallePromocion: "$detalle",
        cantidad: "$cantidadDescuento",
        muestraSlide: "$muestraSlide",
        ahorroEn: "$tipoDescuento",
        tieneVideo: "$tieneVideo",
        detalleSlide: "$detalleSlide",
        imagenBanner: "$imagenBanner",
        videoYoutube:"$videoYoutube",
        link:"$link"
        
        
      }
    };
    var look={
     $lookup:
       {
         from: "users",
         localField: "idUsuario",
         foreignField: "_id",
         as: "usuario"
       }
  }
    var pipeline = [ proyecto,match,look ];
    //if(grupo)pipeline.push(grupo)
    
    var res = Publicidades.aggregate(pipeline);
  
    return res;
  },
  'users.one'(id) {
    return Meteor.users.findOne({_id:id}); 
  },
  'users.add'(usuario,clave,perfil) {
  	return Accounts.createUser({ username:usuario, password:clave, profile: perfil });
  },
  'users.update'(_id,usuario,perfil) {
  	return Meteor.users.update({_id:_id},{$set:{profile:perfil,username:usuario}});
  },
  'users.remove'(_id) {
  	return Meteor.users.remove({_id:_id});
  }, 
  'users.resetPassword'(_id,clave) {
  	return Accounts.setPassword(_id,clave);
  },
  'settings.generarVariables'(){
    Settings.remove({});
    if (!Settings.findOne({ clave: "hostInyeccion"  })) Settings.insert({ clave: "hostInyeccion", valor: "192.155.543.5" });
    if (!Settings.findOne({ clave: "usuarioInyeccion"  })) Settings.insert({ clave: "usuarioInyeccion", valor: "root" });
    if (!Settings.findOne({ clave: "claveInyeccion"  })) Settings.insert({ clave: "claveInyeccion", valor: "vertrigo" });
    if (!Settings.findOne({ clave: "dbInyeccion"  })) Settings.insert({ clave: "dbInyeccion", valor: "asociacion" });
    if (!Settings.findOne({ clave: "proxNroLiquidacion"  })) Settings.insert({ clave: "proxNroLiquidacion", valor: "1" });
    if (!Settings.findOne({ clave: "pathImagenes"  })) Settings.insert({ clave: "pathImagenes", valor: "/var/www/appCai/imagenes/" });
    if (!Settings.findOne({ clave: "dirImagenes"  })) Settings.insert({ clave: "dirImagenes", valor: "localhost:81" });
  },
  'settings.remove'(id) {
    return Settings.remove({_id:id}); 
  },
  'settings.oneClave'(clave) {
    return Settings.findOne({clave:clave}); 
  },
  "settings.autoincrementaNroLiquidacion"(){
    console.log("fdd")
    var nuevoValor=Number(Settings.findOne({ clave: "proxNroLiquidacion"  }).valor)+1;
    Settings.update({clave:"proxNroLiquidacion"},{$set:{valor:nuevoValor}});
    console.log("cambio")
  },
  "remote.syncLiquidacion":function(data)
  {
     var Future = Npm.require('fibers/future');
    var fut1 = new Future();
    var exec = Npm.require("child_process").exec;
    var path = process.cwd() + '/../web.browser/app/shellPython/syncLiquidacion.py';
    
    var command="python "+path+" "+data._id; 
  
      exec(command,function(error,stdout,stderr){ 
        
        fut1.return(stderr);
      });
      return fut1.wait();
    
    return fut1.wait();
  },
  "remote.syncOs":function()
  {
    Future = Npm.require('fibers/future');
    var fut1 = new Future();
    var exec = Npm.require("child_process").exec;

    var path = process.cwd() + '/../web.browser/app/shellPython/importarOs.py';
    
    var command="python "+path; 
      exec(command,function(error,stdout,stderr){
        if(error){
          console.log(error);
          throw new Meteor.Error(500,command+" failed");
        }
        console.log(stdout)
        fut1.return(stdout.toString());
      });
      return fut1.wait();
    
    return fut1.wait();
  },
  'liquidaciones.one'(id) {
    
    return Liquidaciones.findOne({_id:id});
  },
  'liquidaciones.remove'(id) {
    
    return Liquidaciones.remove({_id:id});
  },
  "liquidaciones.updateFactura"(data,res){
    console.log(data);
    console.log(res);
    return true
  },
  'liquidaciones_factura.remove'(idLiquidacion,id) {
    return Liquidaciones.update(
        {_id: idLiquidacion }, 
        { $pull: { "facturas": { "_id": id } } },
        { getAutoValues: false } // SIN ESTE PARAMETRO NO QUITA!!
        )
  },

});
if(Meteor.isServer){

Meteor.publish('liquidaciones.all', function (usuario) {

if(usuario){
	if(usuario.profile.rol==="secretaria")return Liquidaciones.find({idUsuario:usuario._id});
  return Liquidaciones.find();
}
return [];
  
});
Meteor.publish('publicidades.all', function () {
  return Publicidades.find({},{logo:0});
});
Meteor.publish('nomencladores.one', function (idNomenclador) {
  var res= Nomencladores.find({_id:Number(idNomenclador)});
  return res;
});
Meteor.publish('settings.all', function () {
  return Settings.find();
});
}