Settings = new Mongo.Collection('settings');
Publicidades = new Mongo.Collection('publicidades');
Socios = new Mongo.Collection('socios');

Settings.attachSchema ( new SimpleSchema({
  _id: {
    type: String,
    label: "ID",
  },
  clave: {
    type: String,
    optional:false,
    label: 'Clave',
  },
  valor: {
    type: String,
     label: 'Valor',
  },
}))
Socios.attachSchema ( new SimpleSchema({
  _id: {
    type: String,
    label: "ID",
  },
  nombreSocio: {
    type: String,
    optional:false,
    label: 'Nombres',
  },
  nroSocio: {
    type: String,
     label: 'Nro Socio',
  },
  estado: {
    type: String,
     label: 'Estado',
  },
  alDia: {
    type: Boolean,
     label: 'Esta al dia?',
  },
}))

Publicidades.attachSchema ( new SimpleSchema({
  idUsuario: {
    type: String,
    label: "Comercio",
     optional:true,
     autoform: {
       
       type: "select2",
       
       select2Options:{
           placeholder: 'Comercio...',
         width:"400px",
         allowClear:true,
       },
     }
  },
  fecha: {
    type: Date,
    autoform: {
       style: "width:160px",
      defaultValue: new Date(),
      },
    optional:false,
    label: 'Fecha',
  },
  detalle: {
    type: String,
     label: 'Detalle',
  },
  imagenBanner: {
    type: String,
     label: 'Imagen Banner',
     optional:true,
  },
  textoContrato: {
    type: String,
     label: 'Texto Contrato',
     optional:true,
      optional:true,
  },
  tipoDescuento: {
    type: String,
     label: 'Tipo descuento',
     optional:true,
  },
  cantidadDescuento: {
    type: String,
     label: 'Cant. descuento',
  },
  detalleSlide: {
    type: String,
     label: 'Detalle Slide',
     optional:true
  },
   link: {
    type: String,
     label: 'Link Banner',
     optional:true
  },
  muestraSlide: {
    type: Boolean,
     label: 'Muestra en Slide',
     optional:true
  },
   logo: {
    type: String,
     label: 'Logo',
     optional:true
  },
   videoYoutube: {
    type: String,
     label: 'Video YOUTBE',
     optional:true,
  },
  tieneVideo: {
    type: Boolean,
     label: 'Tiene Video',
     optional:true,
  },
  estado:{
     type: String,
    optional: true,
    label:"Estado",
    
     autoform: {
     defaultValue:"PENDIENTE",
         type:"select-radio-inline",
         trueLabel:"Yes", falseLabel:"No",
      options: [
        {label: "ACTIVO", value: "ACTIVO"},
         {label: "INACTIVO", value: "INACTIVO"},
      ]
    }
  },

     usoSocios:{
     type: Array,
    optional:true,
    label:"Uso Socios"
  },
    
  "usoSocios.$":{
    type:Object,
  },
   "usoSocios.$._id":{

    type: String,
    autoValue: function() {
      return Meteor.uuid();  
    }
 
  },
  "usoSocios.$.fecha": {
    type: Date,
    optional: false,
    label:"Fecha"
  },
  "usoSocios.$.idSocio": {
    type: String,
    optional: true,
    label:"Socio"
  },
  "usoSocios.$.idPromocion": {
    type: String,
    optional: true,
    label:"Promocion"
  },
     promociones:{
     type: Array,
    optional:true,
    label:"Promociones"
  },
    
  "promociones.$":{
    type:Object,
  },
   "promociones.$._id":{

    type: String,
    autoValue: function() {
      return Meteor.uuid();  
    }
 
  },

  //  "promociones.$.fechaHasta": {
  //   type: Date,
    
  //   label:"Fecha Hasta"
  // },
   "promociones.$.detalle": {
    type: String,
    optional: false,
    label:"Detalle"
  },
   "promociones.$.ahorroEn": {
    type: String,
    optional: false,
    label:"Ahorro En..."
  },
   "promociones.$.cantidad": {
    type: String,
    optional: false,
    label:"Cantidad"
  },
   "promociones.$.logo": {
    type: String,
    optional: true,
    label:"Logo"
  },
  "promociones.$.cantidaCuotas": {
    type: String,
    optional: true,
    label:"Cant. Cuotas"
  },
  "promociones.$.cantidadCuotas": {
    type: String,
    optional: true,
    label:"Cant. Cuotas"
  },
  

 
}, {tracker: Tracker}) );