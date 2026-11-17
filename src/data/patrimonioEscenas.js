const FUERTES = 'https://fortificacionescartagena.com.co/es/servicios/reservas/fortificaciones-de-bocachica/';
export const PATRIMONIO_ESCENAS = {
  sanFernando: {
    nombre:'San Fernando', sub:'La arquitectura de un paso marítimo.', pista:'El fuerte se forma. El barco atraviesa el canal.',
    descripcion:'Escena de partículas en movimiento: San Fernando se forma en volumen, el agua ondula y una embarcación atraviesa el canal hacia la bahía.',
    contexto:'San Fernando y San José formaban parte del sistema defensivo del paso de Bocachica.',
    fases:[{titulo:'El fuerte toma forma',texto:'Una arquitectura orientada al paso de agua.'},{titulo:'La embarcación entra al canal',texto:'La forma curva de San Fernando se abre hacia el canal de Bocachica.'},{titulo:'Dos orillas, una defensa',texto:'San Fernando y San José se relacionaban a través del paso marítimo.'}],
    fuentes:[['Fortificaciones de Bocachica',FUERTES],['Fuerte de San José','https://fortificacionescartagena.com.co/es/destination/fuerte-de-san-jose/']],
  },
  sanJose: {
    nombre:'San José', sub:'Defender el canal desde el agua.', pista:'La batería emerge. Una embarcación pasa frente a sus muros.',
    descripcion:'Escena animada de San José en puntos: una plataforma angular a ras del agua, un cuerpo de bóvedas y una embarcación que recorre el canal; se ilumina la relación con la orilla de San Fernando.',
    contexto:'San José complementaba a San Fernando con baterías bajas junto al agua. La relación entre ambas orillas era parte del sistema defensivo.',
    fases:[{titulo:'Una batería a ras del agua',texto:'La plataforma baja y el cuerpo abovedado aparecen sobre el islote.'},{titulo:'El barco pasa frente a San José',texto:'La cercanía al agua permite entender la posición de sus baterías.'},{titulo:'La defensa conecta dos orillas',texto:'El recorrido revela la relación de San José con San Fernando, frente al mismo canal.'}],
    fuentes:[['Fuerte de San José','https://fortificacionescartagena.com.co/es/destination/fuerte-de-san-jose/'],['Fortificaciones de Bocachica',FUERTES]],
  },
  casco: {
    nombre:'Casco Histórico', sub:'Bocachica se construye al caminar.', pista:'Se forman las fachadas. Las personas recorren la calle y la plaza.',
    descripcion:'Escena animada del poblado de Bocachica: viviendas, cubiertas y un volumen de iglesia en puntos alrededor de una plaza. Figuras humanas caminan desde el borde de agua y se encuentran en el espacio público.',
    contexto:'El poblado de Bocachica reúne arquitectura, calles y espacios de encuentro. Esta interpretación muestra la relación entre el tejido construido y el recorrido cotidiano, sin reproducir una manzana real.',
    fases:[{titulo:'Las fachadas forman la calle',texto:'Viviendas y cubiertas se materializan alrededor de un recorrido peatonal.'},{titulo:'Caminar conecta los lugares',texto:'Las figuras recorren la calle entre el borde de agua, las viviendas y la plaza.'},{titulo:'La plaza reúne al poblado',texto:'Los recorridos se encuentran frente al volumen de iglesia: el patrimonio también se vive a pie.'}],
    fuentes:[['POT Cartagena · Caracterización de Bocachica','https://pot.cartagena.gov.co/sites/default/files/documentos/normativa/2025-09/D-F-07_32%20Caracterizaci%C3%B3n%20f%C3%ADsico%20espacial%20centro%20poblado%20-%20Bocachica.pdf'],['POT de Cartagena · Decreto 0977 de 2001','https://vuc.cartagena.gov.co/documentos/normatividad/DECRETO_0977_de_2001.pdf']],
  },
  sanRafael: {
    nombre:'San Rafael', sub:'La defensa sigue la forma del cerro.', pista:'El cerro aparece. Una figura asciende hasta la batería.',
    descripcion:'Escena animada en partículas de la batería del Ángel San Rafael: la fortificación se forma sobre una colina, una persona asciende por un recorrido esquemático y líneas móviles relacionan la posición elevada con el paisaje.',
    contexto:'La batería del Ángel San Rafael se encuentra en el cerro del Horno. Su posición elevada y la adaptación de sus muros al relieve forman parte de su lógica territorial.',
    fases:[{titulo:'Primero, el cerro',texto:'El relieve se materializa y la batería aparece en una posición elevada.'},{titulo:'Ascender cambia la perspectiva',texto:'Una figura recorre la ladera hasta la fortificación. El camino es una interpretación, no una ruta real de acceso.'},{titulo:'La altura relaciona el paisaje',texto:'La batería y el cerro forman un conjunto: las líneas ilustran su relación con el territorio, sin calcular visibilidad.'}],
    fuentes:[['Batería del Ángel San Rafael','https://fortificacionescartagena.com.co/es/destination/bateria-del-angel-san-rafael/'],['Fortificaciones de Bocachica',FUERTES]],
  },
};
export function idPatrimonio(id){return Object.hasOwn(PATRIMONIO_ESCENAS,id)?id:'sanFernando';}
