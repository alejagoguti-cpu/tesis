// =============================================================================
// PROYECTO AULA AMBIENTAL | TIERRA BOMBA / BOCACHICA COMO AULA AMBIENTAL
// Programa marco v0.1 — Datos íntegros del documento de 24 páginas
// =============================================================================

export const AULA_META = {
  encabezado: 'PROYECTO AULA AMBIENTAL | TIERRA BOMBA / BOCACHICA COMO AULA AMBIENTAL',
  version: 'Programa marco v0.1',
  titulo: 'Tierra Bomba, Aula Ambiental',
  subtitulo: 'Memorias territoriales, planificación y diseño sostenible en Bocachica',
  promotorRol: 'Promotor académico',
  promotorNombre: 'Arq. Alejandro Serrano Sierra',
  institucion: 'Facultad de Arquitectura y Diseño, Programa de Arquitectura, Pontificia Universidad Javeriana',
  fecha: '26 de octubre de 2026',
  horizonte: 'Horizonte propuesto de ejecución: X meses (24 meses en cronograma relativo)',
  notaPortada:
    'Versión para discusión y formulación conjunta. La participación de cada organización, los recursos y las intervenciones deberán formalizarse antes de su ejecución.',
  lecturaDocumento: [
    'Las referencias R1 a R8 remiten a los documentos base relacionados en la sección 17. Las fases, metas, responsabilidades y pilotos son propuestas de formulación. Su adopción requiere validación comunitaria, revisión técnica y acuerdos de las instituciones participantes.',
    'Las figuras conceptuales y el cronograma se presentan con estructuras editables y verificables. El mes 1 corresponde al inicio que se acuerde para el programa; no equivale a una fecha confirmada.',
  ],
};

export const CONTENIDO_INDICE = [
  { num: '01', id: 'cap-01', titulo: 'Resumen ejecutivo y propósito del programa', pag: 3 },
  { num: '02', id: 'cap-02', titulo: 'Antecedentes y base documental', pag: 4 },
  { num: '03', id: 'cap-03', titulo: 'Territorio y problema de investigación', pag: 5 },
  { num: '04', id: 'cap-04', titulo: 'Justificación y pertinencia', pag: 6 },
  { num: '05', id: 'cap-05', titulo: 'Marco conceptual y memorias territoriales', pag: 7 },
  { num: '06', id: 'cap-06', titulo: 'Preguntas de investigación e hipótesis de trabajo', pag: 8 },
  { num: '07', id: 'cap-07', titulo: 'Objetivos', pag: 9 },
  { num: '08', id: 'cap-08', titulo: 'Arquitectura del Aula Ambiental', pag: 10 },
  { num: '09', id: 'cap-09', titulo: 'Líneas de investigación y pilotos', pag: 11 },
  { num: '10', id: 'cap-10', titulo: 'Componente digital y modelo territorial', pag: 13 },
  { num: '11', id: 'cap-11', titulo: 'Metodología de investigación y participación', pag: 14 },
  { num: '12', id: 'cap-12', titulo: 'Fases y cronograma de 24 meses', pag: 16 },
  { num: '13', id: 'cap-13', titulo: 'Actores y gobernanza', pag: 18 },
  { num: '14', id: 'cap-14', titulo: 'Productos e indicadores', pag: 20 },
  { num: '15', id: 'cap-15', titulo: 'Financiación y sostenibilidad', pag: 21 },
  { num: '16', id: 'cap-16', titulo: 'Criterios éticos y gestión de riesgos', pag: 22 },
  { num: '17', id: 'cap-17', titulo: 'Ruta de formulación y referencias', pag: 23 },
];

// -----------------------------------------------------------------------------
// 01. RESUMEN EJECUTIVO Y PROPÓSITO DEL PROGRAMA (Pág. 3)
// -----------------------------------------------------------------------------
export const CAP_01 = {
  parrafos: [
    'Se propone estructurar Tierra Bomba como un Aula Ambiental territorial, con un primer núcleo de trabajo en Bocachica. El programa articula investigación, formación y experimentación situada alrededor de la generación de memorias territoriales y de su traducción en decisiones de planificación, diseño, cuidado ambiental y fortalecimiento de las capacidades comunitarias.',
    'El Aula Ambiental se concibe como una red de relaciones entre escuela, comunidad, paisaje, agua, oficios, patrimonio y herramientas digitales. Su desarrollo puede comenzar con un archivo territorial y cartografías construidos por estudiantes y semilleros; continuar con la devolución y validación de conocimientos; y avanzar hacia pilotos de pequeña escala cuyos resultados puedan observarse, discutirse y ajustarse con la comunidad.',
    'El plan metodológico de la salida de campo aporta un principio operativo: devolver, validar y transformar. Los capítulos a desarrollar amplían el reconocimiento de Bocachica desde las defensas históricas y el patrimonio hasta el territorio vivido, la escuela, los oficios del mar y los flujos turísticos. El diagnóstico comunitario aporta las voces y aspiraciones recogidas, además de advertir límites en la sistematización de algunos talleres. [R1–R8]',
    'El horizonte inicial propuesto es de X meses (24 meses en cronograma), organizado en fases superpuestas. El programa buscará producir una línea base territorial, un modelo digital progresivo, un archivo de memorias, propuestas de planificación, experiencias pedagógicas y una primera cartera de pilotos sobre agua, sombra y vegetación, residuos y materiales, oficios y patrimonio.',
  ],
  destacado:
    'Su desarrollo puede comenzar con un archivo territorial y cartografías construidos por estudiantes y semilleros; continuar con la devolución y validación de conocimientos; y avanzar hacia pilotos de pequeña escala cuyos resultados puedan observarse, discutirse y ajustarse con la comunidad.',
  decisionInterlocutores:
    'Conformar una mesa de formulación con representación comunitaria, académica, público y privada, fundaciones y equipos científicos. Esa mesa deberá acordar el alcance de una primera convocatoria, definir las responsabilidades efectivas y seleccionar los pilotos según pertinencia local, viabilidad y capacidad de mantenimiento.',
  tabla1: {
    id: 'tabla-1',
    titulo: 'Tabla 1 · Síntesis para la formulación',
    columnas: ['Aspecto', 'Propuesta inicial'],
    filas: [
      ['Ámbito', 'Isla de Tierra Bomba; Bocachica como primer núcleo de investigación y validación.'],
      ['Eje articulador', 'Memorias territoriales vivas y su relación con sostenibilidad y planificación.'],
      ['Enfoque', 'Investigación interdisciplinaria, participación comunitaria y aprendizaje situado.'],
      ['Horizonte', 'X meses desde el inicio acordado; ejecución sujeta a recursos y acuerdos.'],
      ['Primer resultado', 'Agenda compartida, línea base trazable y selección de pilotos pertinentes.'],
      ['Estado de alianzas', 'Antecedentes de colaboración y aliados propuestos; los compromisos del programa deben formalizarse.'],
    ],
  },
};

// -----------------------------------------------------------------------------
// 02. ANTECEDENTES Y BASE DOCUMENTAL (Pág. 4)
// -----------------------------------------------------------------------------
export const CAP_02 = {
  parrafos: [
    'El punto de partida es el proceso realizado por parte de ACOPI y el proyecto arquitectónico de pregrado, dirigido por el arquitecto Alejandro Serrano en Bocachica. El plan de salida describe una primera fase de reconocimiento y trabajo participativo con niños, familias y docentes, seguida por una fase prevista de devolución, validación y acción ambiental en el espacio escolar. La programación de la visita se entiende aquí como antecedente metodológico; sus fechas no acreditan por sí mismas que todas las actividades o intervenciones hayan sido ejecutadas. [R1]',
    'Los talleres incluyeron dibujos del territorio cotidiano, ejercicios de imaginación sobre la escuela, recorridos perceptivos y cartografías. La propuesta del patio escolar como refugio climático y aula ambiental vinculó sombra, vegetación, suelo, juego y permanencia, con una consolidación por fases condicionada por recursos, criterios técnicos y mantenimiento. [R1]',
  ],
  tabla2: {
    id: 'tabla-2',
    titulo: 'Tabla 2 · Aportes de los documentos base al programa',
    columnas: ['Ref.', 'Contenido de origen', 'Aporte a la investigación'],
    filas: [
      ['R1', 'Plan metodológico salida vol. 2', 'Devolución y validación; escuela como núcleo; intervención gradual; registro y cuidado.'],
      ['R2', 'Capítulo 1', 'Cartografía defensiva, bahía y relaciones entre arquitectura, control y trabajo vivo.'],
      ['R3', 'Capítulo 2', 'Patrimonio fortificado entendido como paisaje habitado, conservado y narrado.'],
      ['R4', 'Capítulo 3', 'Agua, movilidad, vivienda, cuidado y esfuerzo cotidiano que sostiene el territorio.'],
      ['R5', 'Capítulo 4', 'Escuela comunitaria, infancia, memoria afrodescendiente y pedagogía del cuidado.'],
      ['R6', 'Capítulo 5', 'Pesca, carpintería de ribera, materialidad, transmisión de saberes y paisaje productivo.'],
      ['R7', 'Capítulo 6', 'Relación entre turismo, infraestructura, trabajo, accesos y permanencia comunitaria.'],
      ['R8', 'Diagnóstico comunitario', 'Pertenencia, escuela, agua y aspiraciones infantiles; necesidad de participación y devolución.'],
    ],
  },
  r9: {
    codigo: 'R9 (en proceso)',
    titulo: 'Intervención Aula Ambiental en el Gimnasio Cristiano de Bocachica',
    texto:
      'Como R9, se está trabajando en el desarrollo de un Aula Ambiental, como desarrollo espacial y pedagógico para el Gimnasio Cristiano de Bocachica. Se cuenta con el dinero para el desarrollo de espacios de sombra y cancha para preescolar. El espacio se contempla para trabajos pedagógicos entre actores.',
  },
};

// -----------------------------------------------------------------------------
// 03. TERRITORIO Y PROBLEMA DE INVESTIGACIÓN (Pág. 5)
// -----------------------------------------------------------------------------
export const CAP_03 = {
  parrafos: [
    'El corpus desarrollado durante los talleres de pregrado permite leer Bocachica como un territorio en el que se superponen la función histórica del canal y sus fortificaciones, la vida insular cotidiana, las prácticas de trabajo y las transformaciones asociadas al turismo. El mar participa en la movilidad, la economía y la memoria; la escuela concentra actividades de cuidado y aprendizaje; el agua y la sombra condicionan el uso de viviendas, patios y espacios colectivos. [R2–R7]',
    'La investigación parte de una dificultad central: el conocimiento sobre estas relaciones se encuentra distribuido entre documentos, mapas, relatos, prácticas y experiencias que no siempre se articulan en instrumentos accesibles para la comunidad o para la toma de decisiones. Las memorias locales pueden quedar subordinadas a imágenes monumentales o turísticas del territorio, mientras los proyectos externos corren el riesgo de desconocer las capacidades y prioridades de quienes lo habitan.',
    'El diagnóstico destaca el sentido de pertenencia, la función de la escuela y las capacidades comunitarias, junto con dificultades materiales y de continuidad de los proyectos. Sus hallazgos y percepciones se tomarán como punto de partida para una nueva validación, conservando la diversidad de voces y evitando presentar a la comunidad como un conjunto homogéneo. [R8]',
  ],
  destacado:
    'Las memorias locales pueden quedar subordinadas a imágenes monumentales o turísticas del territorio, mientras los proyectos externos corren el riesgo de desconocer las capacidades y prioridades de quienes lo habitan.',
  cierre:
    'El ámbito insular ofrece un marco de relaciones; la primera investigación de campo y los pilotos deberán delimitarse con precisión en Bocachica. Los hallazgos de otros sectores de Tierra Bomba y los casos comparativos citados por los capítulos desarrollados en el marco del taller del pregrado, no se extrapolarán automáticamente al núcleo de trabajo. [R7]',
  tabla3: {
    id: 'tabla-3',
    titulo: 'Tabla 3 · Tensiones que requieren investigación situada',
    columnas: ['Dimensión', 'Pregunta territorial', 'Evidencia que se propone construir'],
    filas: [
      [
        'Agua y cuidado',
        '¿Cómo se obtiene, transporta, almacena y administra el agua?',
        'Cartografías de recorridos, tiempos, usos, costos declarados y responsabilidades de cuidado.',
      ],
      [
        'Escuela y clima',
        '¿Dónde y cuándo el calor, el sol y la falta de sombra limitan el uso?',
        'Mapas horarios de sombra y uso; observaciones y mediciones comparables.',
      ],
      [
        'Oficios y materiales',
        '¿Cómo se transmite el oficio y qué cambios atraviesa su base material?',
        'Historias de trabajo, registros de técnicas, inventario voluntario de talleres y materiales.',
      ],
      [
        'Residuos',
        '¿Qué flujos se generan y quién puede gestionarlos de forma sostenida?',
        'Caracterización local, rutas, puntos de acumulación y alternativas de operación.',
      ],
      [
        'Patrimonio y turismo',
        '¿Cómo se relacionan visita, vida cotidiana, acceso y distribución de beneficios?',
        'Dos cartografías comparables: visitante y habitante; relatos y acuerdos de uso.',
      ],
      [
        'Silvicultura y biomasa',
        '¿Cómo estructurar un plan maestro de siembra, cultivo y manejo vegetal que articule viveros, invernaderos y aprovechamiento de biomasa con las condiciones ecológicas, hídricas y comunitarias del territorio?',
        'Inventario de vegetación y suelos; cartografía de áreas potenciales de siembra, cultivo, viveros e invernaderos; requerimientos hídricos; caracterización de flujos de biomasa; y criterios de selección de especies, mantenimiento y aprovechamiento de residuos vegetales.',
      ],
    ],
  },
};

// -----------------------------------------------------------------------------
// 04. JUSTIFICACIÓN Y PERTINENCIA (Pág. 6)
// -----------------------------------------------------------------------------
export const CAP_04 = {
  bloques: [
    {
      subtitulo: 'Pertinencia comunitaria y educativa',
      refs: '[R1, R5, R8]',
      parrafos: [
        'El Aula Ambiental puede fortalecer la capacidad local de reconocer, interpretar y discutir el territorio mediante materiales que circulen en la escuela y en espacios comunitarios. El archivo de memorias y la cartografía participativa deben permitir que niños, jóvenes, familias, docentes y portadores de oficios intervengan en la definición de preguntas y en la evaluación de propuestas. La devolución será un componente del trabajo, con tiempo y recursos propios. [R1, R5, R8]',
      ],
    },
    {
      subtitulo: 'Pertinencia científica y arquitectónica',
      refs: '[Ciencias, Arquitectura y Conocimiento Comunitario]',
      destacado:
        'El programa plantea un campo común entre ciencias, arquitectura y conocimiento comunitario. La memoria hídrica puede orientar preguntas sobre usos y calidad del agua; la materialidad y los oficios pueden guiar estudios de transformación y reutilización; el patio escolar permite investigar confort, vegetación y aprendizaje. El análisis vegetal puede generar un plan maestro desde la silvicultura y la gestión y organización productiva.',
      parrafos: [
        'El programa plantea un campo común entre ciencias, arquitectura y conocimiento comunitario. La memoria hídrica puede orientar preguntas sobre usos y calidad del agua; la materialidad y los oficios pueden guiar estudios de transformación y reutilización; el patio escolar permite investigar confort, vegetación y aprendizaje. El análisis vegetal puede generar un plan maestro desde la silvicultura y la gestión y organización productiva. Cada disciplina aportará métodos específicos y explicará qué puede concluirse de sus resultados y qué requiere investigación adicional. El levantamiento y cartografía digital explora la posibilidad de vincular y reconocer el territorio como lugar. Los elementos patrimoniales y monumentales con relación a la localización y descripción de elementos patrimoniales culturales pueden generar un reconocimiento de identidad.',
        'Los equipos de microbiología, micología y estudios del agua podrán contribuir a protocolos de investigación y evaluación. Su integración deberá definirse con investigadores responsables, instalaciones disponibles y alcances acordados. Los ensayos de laboratorio no se traducirán directamente en aplicaciones territoriales sin revisar su pertinencia y condiciones de uso.',
      ],
    },
    {
      subtitulo: 'Pertinencia territorial y productiva',
      refs: '[R4, R6, R7]',
      destacado:
        'La vinculación propuesta de ACOPI Cartagena y de organizaciones ambientales y urbanas busca conectar la investigación con capacidades empresariales, gestión local, materiales y continuidad operativa. Las alternativas de aprovechamiento de residuos o fortalecimiento de oficios deberán examinarse como cadenas completas, incluyendo recolección, transformación, calidad del producto, demanda y costos de operación.',
      parrafos: [
        'La planificación rural y territorial se abordará desde las relaciones entre asentamiento, paisaje, movilidad marítima, agua, trabajo y cuidado. Las propuestas deberán considerar quién usa cada espacio, quién lo mantiene y qué efectos produce una intervención sobre los accesos, los oficios y la permanencia. El patrimonio turístico se estudiará en relación con la vida comunitaria y con su capacidad de sostener beneficios locales. [R4, R6, R7]',
        'La vinculación propuesta de ACOPI Cartagena y de organizaciones ambientales y urbanas busca conectar la investigación con capacidades empresariales, gestión local, materiales y continuidad operativa. Las alternativas de aprovechamiento de residuos o fortalecimiento de oficios deberán examinarse como cadenas completas, incluyendo recolección, transformación, calidad del producto, demanda y costos de operación.',
      ],
    },
    {
      subtitulo: 'Valor del acercamiento digital previo',
      refs: '[Modelo Territorial Abierto]',
      parrafos: [
        'El archivo, los mapas y los modelos permitirán preparar preguntas, simular, contrastar fuentes y explorar escenarios antes de programar nuevas visitas. El ahorro de traslados y consumos es una finalidad que deberá medirse; no se presupone un impacto nulo. El componente digital se actualizará con la experiencia territorial y permanecerá abierto a correcciones de la comunidad.',
      ],
    },
  ],
};

// -----------------------------------------------------------------------------
// 05. MARCO CONCEPTUAL Y MEMORIAS TERRITORIALES (Pág. 7)
// -----------------------------------------------------------------------------
export const CAP_05 = {
  parrafos: [
    'La secuencia conceptual propuesta parte de Tierra Bomba, reconoce Bocachica como núcleo situado y vincula memoria y vernacularidad con el Aula Ambiental y la planificación. La memoria se entiende como una práctica activa de recordar, narrar, hacer, transmitir y proyectar. Registrar un oficio o una ruta del agua interesa por lo que revela sobre las condiciones que permiten sostenerlos y transformarlos.',
    'La vernacularidad remite a saberes, técnicas, materiales y formas de organización desarrollados en relación con el lugar. Su estudio requiere reconocer tanto sus capacidades como las dificultades que enfrentan. Las soluciones surgidas ante la carencia no deben convertirse en una justificación para mantenerla. [R4, R6]',
    'Las memorias atraviesan todos los campos de investigación. Su construcción admite relatos diferentes y registra desacuerdos; los productos no deben imponer una única identidad o versión del pasado.',
  ],
  destacado: 'La memoria se entiende como una práctica activa de recordar, narrar, hacer, transmitir y proyectar.',
  figura1: {
    titulo: 'Figura 1 · Esquema conceptual del programa',
    centro: {
      titulo: 'Aula Ambiental',
      sub: 'Investigar y aprender',
      icono: 'escuela',
      detalle:
        'Núcleo articulador del programa: conecta la vernacularidad (saberes y materialidad) y los campos de experimentación territorial con decisiones compartidas de planificación en Bocachica y Tierra Bomba.',
    },
    nodos: [
      {
        titulo: 'Tierra Bomba',
        sub: 'Relaciones insulares',
        icono: 'isla',
        pos: [18, 18],
        detalle: 'Marco insular de relaciones territoriales, ecológicas, marítimas y socioculturales que contextualiza el programa.',
      },
      {
        titulo: 'Bocachica',
        sub: 'Núcleo de trabajo',
        icono: 'lugar',
        pos: [50, 14],
        detalle: 'Primer núcleo situado de investigación, validación comunitaria y experimentación de pilotos.',
      },
      {
        titulo: 'Memorias vivas',
        sub: 'Relatos y prácticas',
        icono: 'memoria',
        pos: [82, 18],
        detalle: 'Práctica activa de recordar, narrar, hacer, transmitir y proyectar las relaciones que sostienen el territorio.',
      },
      {
        titulo: 'Vernacularidad',
        sub: 'Saberes y materialidad',
        icono: 'oficios',
        pos: [84, 56],
        detalle: 'Saberes, técnicas, materiales y formas de organización locales, reconociendo sus capacidades sin justificar carencias.',
      },
      {
        titulo: 'Campos de experimentación',
        sub: 'Agua · residuos · vegetación · oficios · patrimonio',
        icono: 'pilotos',
        pos: [50, 88],
        detalle: 'Agua, residuos, vegetación, oficios y patrimonio como campos concretos de experimentación y cuidado territorial.',
      },
      {
        titulo: 'Planificación',
        sub: 'Decisiones compartidas',
        icono: 'plan',
        pos: [16, 56],
        detalle: 'Traducción del aprendizaje situado y de la validación comunitaria en decisiones compartidas que alimentan los campos de cuidado.',
      },
    ],
  },
  tabla4: {
    id: 'tabla-4',
    titulo: 'Tabla 4 · Dimensiones de memoria y posibles registros',
    columnas: ['Dimensión', 'Registros propuestos', 'Decisiones que pueden informar'],
    filas: [
      [
        'Cultural',
        'Relatos, prácticas, celebraciones y transmisión entre generaciones.',
        'Contenidos educativos e interpretación comunitaria del patrimonio.',
      ],
      [
        'Territorial',
        'Lugares, recorridos, bordes, cambios de uso y pertenencias.',
        'Accesos, recorridos y prioridades de planificación.',
      ],
      [
        'Material',
        'Técnicas, materiales, reparaciones y formas de construir.',
        'Criterios de diseño, mantenimiento y experimentación.',
      ],
      [
        'Productiva y oficios',
        'Pesca, navegación, carpintería y redes de trabajo.',
        'Formación, espacios de oficio y cadenas productivas.',
      ],
      [
        'Hídrica',
        'Pozos, lluvia, almacenamiento, transporte y cuidado del agua.',
        'Preguntas de investigación e infraestructuras pertinentes.',
      ],
      [
        'Ecológica y del cuidado',
        'Vegetación, sombra, suelos y experiencias de transformación ambiental.',
        'Restauración, refugios climáticos y seguimiento comunitario.',
      ],
    ],
  },
};

// -----------------------------------------------------------------------------
// 06. PREGUNTAS DE INVESTIGACIÓN E HIPÓTESIS DE TRABAJO (Pág. 8)
// -----------------------------------------------------------------------------
export const CAP_06 = {
  preguntaArticuladora:
    '¿Cómo puede la generación participativa de memorias territoriales, articulada con investigación científica, arquitectura y representación digital, sustentar un Aula Ambiental en Tierra Bomba y Bocachica que fortalezca capacidades comunitarias y oriente decisiones de sostenibilidad y planificación territorial?',
  preguntasEspecificas: [
    '¿Qué relaciones entre historia, agua, paisaje, materialidad y trabajo son relevantes para los distintos grupos de Bocachica y cómo pueden registrarse sin reducir su pluralidad?',
    '¿Cómo se relacionan los saberes locales y las lecturas científicas al definir problemas, interpretar resultados y seleccionar alternativas?',
    '¿Qué puede conocerse mediante bibliografía, cartografía y modelos digitales, y qué necesita observación de campo y conversación con habitantes?',
    '¿Qué cambios producen los pilotos en campo en las condiciones observadas de uso, cuidado, sombra, gestión de materiales o aprendizaje?',
    '¿Qué formas de gobernanza, financiación y mantenimiento permiten dar continuidad al Aula Ambiental y distribuir sus beneficios?',
  ],
  hipotesis: [
    {
      codigo: 'H1',
      titulo: 'Ampliación de criterios por archivo participativo',
      texto:
        'Un archivo de memorias construido y revisado con sus participantes puede ampliar los criterios con los que se priorizan intervenciones, al incorporar lugares, prácticas y necesidades que las representaciones externas no siempre registran.',
    },
    {
      codigo: 'H2',
      titulo: 'Representación digital con trazabilidad y validación',
      texto:
        'La combinación de representación digital y validación territorial puede mejorar la preparación de visitas y el contraste de escenarios, siempre que cada dato conserve su procedencia, fecha, escala y grado de verificación.',
    },
    {
      codigo: 'H3',
      titulo: 'Continuidad mediante corresponsabilidad y cuidado local',
      texto:
        'Los pilotos sobre talleres vinculados a responsables locales, recursos de cuidado y objetivos observables tienen mejores posibilidades de continuidad que las intervenciones que solo consideran su instalación inicial.',
    },
  ],
  notaHipotesis:
    'Estas hipótesis son propuestas para la formulación. Se contrastarán mediante el seguimiento del proceso, la comparación de registros y el análisis de acuerdos y desacuerdos; no se presentan como resultados comprobados ni como una atribución causal ya establecida.',
};

// -----------------------------------------------------------------------------
// 07. OBJETIVOS (Pág. 9)
// -----------------------------------------------------------------------------
export const CAP_07 = {
  objetivoGeneral:
    'Formular y desarrollar un programa interdisciplinario de investigación en Tierra Bomba, con núcleo inicial en Bocachica, que articule la generación participativa de memorias territoriales, la representación digital y la experimentación ambiental y arquitectónica para fortalecer capacidades comunitarias y orientar decisiones de sostenibilidad y planificación territorial.',
  objetivosEspecificos: [
    {
      codigo: 'OE1',
      titulo: 'Línea base territorial trazable',
      texto:
        'Organizar y analizar las fuentes documentales, cartográficas y comunitarias para construir una línea base territorial trazable, con vacíos de información y prioridades de validación explícitos.',
      evidencia: 'Inventario y línea base',
      criterio: 'Fuentes identificadas y vacíos registrados.',
    },
    {
      codigo: 'OE2',
      titulo: 'Memorias plurales validadas',
      texto:
        'Generar, registrar y validar memorias culturales, territoriales, materiales, productivas e hídricas con niños, jóvenes, familias, docentes, portadores de oficios y organizaciones locales.',
      evidencia: 'Archivo de memorias y actas',
      criterio: 'Autorizaciones, pluralidad y correcciones documentadas.',
    },
    {
      codigo: 'OE3',
      titulo: 'Archivo digital y modelos progresivos',
      texto:
        'Desarrollar un archivo digital, cartografías y modelos progresivos del territorio que permitan preparar el trabajo de campo, visualizar relaciones y contrastar escenarios con la comunidad.',
      evidencia: 'Modelo territorial versionado',
      criterio: 'Diferenciación entre datos, interpretaciones y escenarios.',
    },
    {
      codigo: 'OE4',
      titulo: 'Codiseño y evaluación de pilotos',
      texto:
        'Codiseñar, ensayar y evaluar pilotos pertinentes sobre agua, sombra y vegetación, residuos y materiales, oficios y patrimonio, según prioridades y condiciones acordadas.',
      evidencia: 'Fichas de pilotos y seguimiento',
      criterio: 'Condiciones iniciales y posteriores comparables.',
    },
    {
      codigo: 'OE5',
      titulo: 'Formación, grupo de estudio y semilleros',
      texto:
        'Consolidar un proceso de formación mediante grupo de estudio, semilleros y participación local que articule arquitectura, ciencias y saberes comunitarios.',
      evidencia: 'Plan formativo y portafolio',
      criterio: 'Participación y aprendizajes revisados con sus autores.',
    },
    {
      codigo: 'OE6',
      titulo: 'Gobernanza, mantenimiento y financiación',
      texto:
        'Construir una propuesta de gobernanza, mantenimiento y financiación que permita presentar proyectos a convocatorias y sostener las capacidades y productos del Aula Ambiental.',
      evidencia: 'Acuerdos y propuestas de financiación',
      criterio: 'Responsabilidades, costos y continuidad definidos.',
    },
  ],
  tabla5: {
    id: 'tabla-5',
    titulo: 'Tabla 5 · Relación entre objetivos y evidencias de cumplimiento',
    columnas: ['Objetivo', 'Evidencia principal', 'Criterio de revisión'],
    filas: [
      ['OE1', 'Inventario y línea base', 'Fuentes identificadas y vacíos registrados.'],
      ['OE2', 'Archivo de memorias y actas', 'Autorizaciones, pluralidad y correcciones documentadas.'],
      ['OE3', 'Modelo territorial versionado', 'Diferenciación entre datos, interpretaciones y escenarios.'],
      ['OE4', 'Fichas de pilotos y seguimiento', 'Condiciones iniciales y posteriores comparables.'],
      ['OE5', 'Plan formativo y portafolio', 'Participación y aprendizajes revisados con sus autores.'],
      ['OE6', 'Acuerdos y propuestas de financiación', 'Responsabilidades, costos y continuidad definidos.'],
    ],
  },
};

// -----------------------------------------------------------------------------
// 08. ARQUITECTURA DEL AULA AMBIENTAL (Pág. 10)
// -----------------------------------------------------------------------------
export const CAP_08 = {
  introduccion:
    'El Aula Ambiental se organiza en cinco componentes conectados. El archivo digital permite reunir y preparar información; las memorias aportan contenidos y preguntas; la escuela y los espacios territoriales permiten aprender y contrastar; los pilotos y laboratorios ensayan alternativas; y la gobernanza define responsabilidades, cuidados y decisiones. El conjunto puede crecer mediante nodos y actividades antes de contar con una infraestructura física consolidada.',
  funcionesRelacion: [
    'El archivo y los modelos deben ayudar a preguntar y comparar. La memoria territorial aporta relatos, experiencias y criterios de pertinencia. El trabajo en escuela y comunidad permite contrastar esas representaciones con usos y necesidades. Los laboratorios científicos y los pilotos arquitectónicos producen evidencias que regresan al archivo y a la deliberación comunitaria.',
    'La gobernanza atraviesa el sistema: cada actividad debe tener un responsable, una forma de devolución y recursos de operación. Se propone que ninguna nueva instalación se incorpore sin un acuerdo de uso y mantenimiento. Las decisiones derivadas de los pilotos se documentarán como recomendaciones y alternativas para la planificación, con sus límites de escala y evidencia.',
  ],
  figura2: {
    titulo: 'Figura 2 · Arquitectura funcional del Aula Ambiental',
    componentes: [
      {
        id: 'gobernanza',
        nivel: 'Nivel transversal superior',
        titulo: 'Gobernanza comunitaria e interinstitucional',
        subtitulo: 'Prioridades · decisiones · recursos · cuidado',
        items: ['Acuerdos de responsabilidad y operación', 'Devolución verificable en cada actividad', 'Acuerdos previos de uso y mantenimiento'],
      },
      {
        id: 'archivo',
        nivel: 'Núcleo tripartito (Izquierda)',
        titulo: 'Archivo y modelo digital',
        subtitulo: 'Reconocimiento y contraste',
        items: ['Bibliografía y cartografías', 'Datos con procedencia', 'Escenarios revisables'],
      },
      {
        id: 'memorias',
        nivel: 'Núcleo tripartito (Centro)',
        titulo: 'Memorias territoriales',
        subtitulo: 'Contenidos y criterios de pertinencia',
        items: ['Cultura y territorio', 'Materiales y oficios', 'Agua y paisaje'],
      },
      {
        id: 'escuela',
        nivel: 'Núcleo tripartito (Derecha)',
        titulo: 'Escuela y territorio',
        subtitulo: 'Espacios de aprendizaje y deliberación',
        items: ['Aprendizaje situado', 'Recorridos y talleres', 'Validación comunitaria'],
      },
      {
        id: 'laboratorios',
        nivel: 'Experimentación en campo',
        titulo: 'Laboratorios y pilotos de investigación',
        subtitulo: 'Ensayo de alternativas con evidencia',
        items: ['Agua · sombra y vegetación · residuos y plástico', 'Oficios · materiales · patrimonio turístico'],
      },
      {
        id: 'resultados',
        nivel: 'Síntesis y proyección',
        titulo: 'Resultados para la planificación y la formación',
        subtitulo: 'Recomendaciones con límites de escala y evidencia',
        items: ['Criterios de planificación territorial', 'Portafolios formativos y continuidad comunitaria'],
      },
    ],
  },
};

// -----------------------------------------------------------------------------
// 09. LÍNEAS DE INVESTIGACIÓN Y PILOTOS (Págs. 11–12)
// -----------------------------------------------------------------------------
export const CAP_09 = {
  introduccion:
    'Las líneas se proponen como campos de trabajo conectados. Cada una podrá convertirse en un proyecto específico para una convocatoria, pero deberá conservar relaciones con la memoria, el archivo y los criterios comunes de participación. Los pilotos descritos son candidatos que requieren priorización y evaluación técnica.',
  lineas: [
    {
      codigo: '9.1',
      corto: 'Memorias y vernacularidad',
      titulo: 'Memorias territoriales y vernacularidad',
      refs: '[R2–R6]',
      color: '#4fb6b0',
      descripcion:
        'Reconstruir relaciones entre historia, experiencia cotidiana, técnicas y sentidos del lugar. Se propone un archivo de relatos y lugares, cartografías de cambios y registros de prácticas. El trabajo considerará las memorias afrodescendientes y la transmisión intergeneracional presentes en el corpus, con los propios participantes definiendo qué compartir y cómo reconocer su autoría. [R2–R6]',
      piloto:
        'Atlas de memorias de Bocachica con recorridos comentados, patrimonio monumental y cultural, relatos autorizados y una selección de técnicas y lugares contrastados en talleres, además de un plan maestro desde la silvicultura.',
      cruce: 'Comunidad, arquitectura y educación',
      productoInicial: 'Atlas y archivo de memorias.',
    },
    {
      codigo: '9.2',
      corto: 'Agua y memorias hídricas',
      titulo: 'Agua y memorias hídricas',
      refs: '[R1, R4, R8]',
      color: '#8fd3ee',
      descripcion:
        'Investigar procedencia, recorridos, almacenamiento, usos y cuidado del agua a distintas escalas. La cartografía distinguirá agua de consumo, lluvia, aguas residuales y acumulaciones, siguiendo las categorías usadas en los talleres. Se propone vincular observación comunitaria, diseño arquitectónico y protocolos científicos definidos por los equipos del agua y microbiología. [R1, R4, R8]',
      piloto:
        'Reconocimiento y seguimiento de un sistema escolar o doméstico de captación y almacenamiento, si resulta viable, con responsables de operación y evaluación. Las soluciones de saneamiento o baño seco mencionadas en los antecedentes se mantendrán como alternativas por estudiar; su aceptación y desempeño no están demostrados.',
      cruce: 'Saberes locales, arquitectura, microbiología y estudios del agua',
      productoInicial: 'Cartografía hídrica y protocolo de investigación.',
    },
    {
      codigo: '9.3',
      corto: 'Vegetación y silvicultura',
      titulo: 'Vegetación y silvicultura territorial',
      refs: '[R1, R6]',
      color: '#5fb3a8',
      descripcion:
        'Estudiar sombra, paisaje, especies, suelos y mantenimiento en relación con escuela y espacio comunitario. La silvicultura se abordará según el contexto insular: manejo y cuidado de árboles, especies frutales y vegetación, restauración y aprendizaje sobre procedencia de materiales. El registro de especies asociadas a la carpintería no equivale a una lista de especies aptas para siembra local. [R1, R6]',
      piloto:
        'Refugio climático escolar con sombra vegetal y posibles complementos construidos que permitan la producción frutal y germinación de especies. Antes de sembrar se revisarán adaptación costera, viento, salinidad, raíces, agua disponible, seguridad, protección inicial y mantenimiento.',
      cruce: 'Comunidad, paisajismo, ecología y apoyo botánico',
      productoInicial: 'Criterios de siembra y seguimiento de sombra.',
    },
    {
      codigo: '9.4',
      corto: 'Residuos y plástico',
      titulo: 'Residuos y plástico',
      refs: '[Flujos y Trazabilidad]',
      color: '#c86d51',
      descripcion:
        'Caracterizar flujos de residuos, puntos de acumulación y posibilidades de prevención, separación y recuperación. Se propone examinar el plástico como problema territorial y como posible material de experimentación, sin asumir que su transformación sea viable antes de conocer composición, limpieza, logística, equipos y destino del producto.',
      piloto:
        'Ruta acordada de separación y recuperación de una fracción definida, acompañada por trazabilidad de cantidades, costos y destino. Los usos arquitectónicos de materiales recuperados requerirán ensayos de desempeño y condiciones apropiadas de fabricación y uso.',
      cruce: 'Actores locales, empresas y equipos de materiales',
      productoInicial: 'Diagnóstico de flujos y viabilidad de una ruta.',
    },
    {
      codigo: '9.5',
      corto: 'Materialidad y oficios del mar',
      titulo: 'Materialidad y oficios del mar',
      refs: '[R6]',
      color: '#e8e2d5',
      descripcion:
        'Documentar pesca, navegación y carpintería de ribera como conocimientos que producen territorio. Se estudiarán espacios de trabajo, aprendizaje, reparación, procedencia de materiales y cambios tecnológicos. La transformación de madera a otros materiales, incluida la fibra de vidrio, exige observar tanto la transmisión del oficio como sus residuos y condiciones de trabajo. [R6]',
      piloto:
        'Escuela taller itinerante o módulo de transmisión intergeneracional, formulado con maestros y aprendices. La participación se reconocerá mediante acuerdos de autoría y retribución. Las investigaciones microbiológicas y micológicas sobre materiales o procesos biológicos podrán incorporarse cuando existan preguntas y protocolos pertinentes; cualquier aplicación ambiental permanecerá condicionada a validación científica.',
      cruce: 'Maestros, aprendices, arquitectura y ciencias',
      productoInicial: 'Registro técnico y propuesta de formación.',
    },
    {
      codigo: '9.6',
      corto: 'Patrimonio y planificación',
      titulo: 'Patrimonio turístico y planificación territorial',
      refs: '[R3, R7]',
      color: '#f2d14a',
      descripcion:
        'Relacionar las fortificaciones y los lugares de memoria con recorridos, accesos, vida escolar, trabajo y servicios. La investigación comparará las redes utilizadas por habitantes y visitantes para reconocer coincidencias, conflictos y oportunidades de gestión. La planificación incorporará el cuidado de la vida cotidiana y de los espacios de oficio, además de la experiencia turística. [R3, R7]',
      piloto:
        'Recorrido pedagógico diseñado con actores locales que vincule patrimonio, agua, oficios y paisaje, con reglas de uso y reconocimiento de beneficios. Su ejecución dependerá de acuerdos, capacidades de gestión y revisión de impactos sobre los lugares visitados.',
      cruce: 'Gestores locales, educación, turismo, historia militar y planificación',
      productoInicial: 'Cartografías y recorrido pedagógico propuesto.',
    },
  ],
  tabla6: {
    id: 'tabla-6',
    titulo: 'Tabla 6 · Conexiones entre líneas y posibles equipos',
    columnas: ['Línea', 'Cruce interdisciplinario propuesto', 'Producto inicial'],
    filas: [
      ['Memorias', 'Comunidad, arquitectura y educación', 'Atlas y archivo de memorias.'],
      ['Agua', 'Saberes locales, arquitectura, microbiología y estudios del agua', 'Cartografía hídrica y protocolo de investigación.'],
      ['Vegetación', 'Comunidad, paisajismo, ecología y apoyo botánico', 'Criterios de siembra y seguimiento de sombra.'],
      ['Residuos', 'Actores locales, empresas y equipos de materiales', 'Diagnóstico de flujos y viabilidad de una ruta.'],
      ['Oficios', 'Maestros, aprendices, arquitectura y ciencias', 'Registro técnico y propuesta de formación.'],
      ['Patrimonio', 'Gestores locales, educación, turismo, historia militar y planificación', 'Cartografías y recorrido pedagógico propuesto.'],
    ],
  },
  notaEquipos: 'La lista de equipos expresa capacidades por convocar. No asigna contratos, avales institucionales ni compromisos de aportes.',
};

// -----------------------------------------------------------------------------
// 10. COMPONENTE DIGITAL Y MODELO TERRITORIAL (Pág. 13)
// -----------------------------------------------------------------------------
export const CAP_10 = {
  introduccion:
    'El componente digital se propone como un entorno de reconocimiento, archivo y exploración de escenarios. La idea de un “gemelo digital del territorio” orienta su desarrollo, pero la primera versión debe corresponder a la información disponible: un modelo territorial documentado, con capas y fechas de actualización. Su evolución hacia simulaciones o seguimiento frecuente requerirá datos suficientes y capacidades específicas.',
  tabla7: {
    id: 'tabla-7',
    titulo: 'Tabla 7 · Niveles de desarrollo del componente digital',
    columnas: ['Nivel', 'Contenido y uso', 'Condición para avanzar'],
    filas: [
      ['1 Archivo', 'Bibliografía, mapas, dibujos, fotografías y registros autorizados.', 'Inventario, metadatos, permisos y respaldo.'],
      ['2 Cartografía', 'Capas históricas, hídricas, escolares, ecológicas, productivas y patrimoniales.', 'Escala, localización y grado de verificación identificados.'],
      ['3 Modelo espacial', 'Representaciones 2D y 3D de áreas de interés y relaciones territoriales.', 'Geometría y supuestos contrastados; alcance delimitado.'],
      ['4 Escenarios', 'Alternativas de sombra, recorridos, agua, usos y materiales.', 'Variables y límites explícitos; comparación con observaciones.'],
      ['5 Actualización', 'Seguimiento de pilotos y revisión comunitaria de capas.', 'Responsables, frecuencia, recursos y control de versiones.'],
    ],
  },
  metadatosRegistro: [
    'Identificador único',
    'Título',
    'Fuente o autoría',
    'Fecha',
    'Localización (cuando corresponda)',
    'Escala',
    'Método de producción',
    'Autorización de uso',
    'Nivel de acceso',
    'Responsable de revisión',
  ],
  capasPrioritarias: [
    'Bibliografía y cartografía histórica',
    'Escuela y equipamientos',
    'Agua y cuidados',
    'Sombra y vegetación',
    'Movilidad y bordes',
    'Residuos',
    'Oficios y espacios productivos',
    'Patrimonio y turismo',
  ],
  bloques: [
    {
      subtitulo: 'Capas y trazabilidad',
      texto:
        'El archivo diferenciará documentos históricos, observación directa, testimonios, interpretaciones y propuestas. Cada registro tendrá un identificador, título, fuente o autoría, fecha, localización cuando corresponda, escala, método de producción, autorización de uso, nivel de acceso y responsable de revisión. Los testimonios podrán conservar versiones divergentes sin forzar una única representación. Los vacíos o ubicaciones aproximadas se mostrarán como tales. Los datos sensibles, personales o de lugares cuya difusión pueda generar afectaciones tendrán acceso restringido o se generalizarán.',
    },
    {
      subtitulo: 'Grupo de estudio y semilleros',
      texto:
        'Se propone organizar estudiantes y semilleros en equipos de fuentes y archivo, cartografía y modelos, y mediación y validación. Cada entrega deberá incluir evidencias de origen, preguntas pendientes y una explicación comprensible para participantes locales. La continuidad entre semestres se apoyará en repositorios organizados, bitácoras y entrega documentada de responsabilidades.',
    },
    {
      subtitulo: 'Acceso y devolución',
      texto:
        'Los productos tendrán versiones digitales, descargables o impresas, según las condiciones de conectividad. Se evaluarán el acceso, la utilidad para preparar el campo y las correcciones de usuarios; la cantidad de modelos no demostrará por sí sola apropiación comunitaria.',
    },
  ],
};

// -----------------------------------------------------------------------------
// 11. METODOLOGÍA DE INVESTIGACIÓN Y PARTICIPACIÓN (Págs. 14–15)
// -----------------------------------------------------------------------------
export const CAP_11 = {
  introduccion:
    'Se propone una metodología interdisciplinaria, participativa y de ciclos de investigación y acción. Parte de la revisión documental, formula preguntas con los participantes, produce registros, devuelve interpretaciones y ensaya alternativas cuando existen condiciones para hacerlo. Cada ciclo debe dejar tanto resultados como un registro de los cambios introducidos por la validación.',
  principio: {
    lema: 'Devolver · validar · transformar',
    subtitulo: 'Principio del plan de salida ampliado al programa de investigación [R1]',
    nota: 'Los cinco momentos del plan original —reconocer, preparar, devolver y escuchar, codiseñar, construir y entregar— se amplían aquí con una etapa explícita de evaluación y actualización. La construcción se limita a pilotos autorizados y viables; el ciclo también puede concluir con un ajuste de la pregunta o con la decisión de no ejecutar una alternativa. [R1]',
  },
  cicloPasos: [
    {
      n: '1',
      titulo: '1 Reconocer',
      items: ['Fuentes y cartografías', 'Preguntas y vacíos'],
      detalle: 'Revisión documental y cartográfica inicial que organiza fuentes, escalas, fechas, contradicciones y vacíos explícitos de información.',
    },
    {
      n: '2',
      titulo: '2 Preparar',
      items: ['Acuerdos y protocolos', 'Logística y recursos'],
      detalle: 'Definición de acuerdos comunitarios e institucionales, protocolos éticos y científicos, logística de visita y recursos disponibles.',
    },
    {
      n: '3',
      titulo: '3 Devolver y escuchar',
      items: ['Interpretaciones abiertas', 'Acuerdos y desacuerdos'],
      detalle: 'Entrega verificable de avances a los habitantes para abrir la discusión y registrar confirmaciones, matices y desacuerdos.',
    },
    {
      n: '4',
      titulo: '4 Validar y codiseñar',
      items: ['Ajustes y prioridades', 'Alternativas situadas'],
      detalle: 'Incorporación efectiva de correcciones locales en el archivo y formulación conjunta de alternativas y criterios de diseño.',
    },
    {
      n: '5',
      titulo: '5 Ensayar y cuidar',
      items: ['Pilotos viables', 'Operación y seguimiento'],
      detalle: 'Implementación acotada de pilotos con ficha previa, responsables locales de operación, recursos de mantenimiento y criterios de suspensión.',
    },
    {
      n: '6',
      titulo: '6 Evaluar y actualizar',
      items: ['Resultados y límites', 'Memorias y modelos'],
      detalle: 'Comparación de condiciones iniciales y posteriores, actualización de modelos y memorias, y retorno al reconocimiento para el siguiente ciclo.',
    },
  ],
  secciones: [
    {
      subtitulo: 'Métodos y registros',
      parrafos: [
        'La revisión documental y cartográfica organizará fuentes, escalas, fechas y contradicciones. Los recorridos comentados, entrevistas breves, historias de oficio y talleres permitirán construir registros situados. Los ejercicios con niños retomarán “Así es hoy” y “Así lo soñamos”, incorporando explicación oral o escrita del dibujo para evitar interpretaciones sin contexto. La cartografía del agua se acompañará de transcripción y fichas que permitan reconstruir lo conversado. [R1, R8]',
        'Las mediciones ambientales, caracterizaciones de residuos y ensayos científicos se definirán con protocolos disciplinares. La selección de participantes será intencional y buscará diversidad de experiencias, edades, actividades y responsabilidades de cuidado. El tamaño, las técnicas y los sitios de cada estudio deberán justificarse en el proyecto específico; los talleres no se presentarán como una muestra estadísticamente representativa de toda la isla.',
      ],
    },
    {
      subtitulo: 'Contraste de información y evaluación',
      parrafos: [
        'El análisis cruzará fuentes documentales, registros de campo y relatos de participantes. Para cada hallazgo se distinguirá lo observado, lo referido por una persona o grupo y lo interpretado por el equipo. La validación registrará confirmaciones, cambios, desacuerdos y preguntas abiertas; no se usará únicamente para ratificar una propuesta ya cerrada.',
        'Los pilotos tendrán una ficha previa con problema, responsables, condiciones iniciales, variables a observar, costos, recursos de mantenimiento y criterio de suspensión. Cuando sea pertinente se compararán registros anteriores y posteriores en condiciones semejantes. Las variaciones de estación, clima, uso y disponibilidad de recursos deberán considerarse al interpretar cambios.',
      ],
    },
    {
      subtitulo: 'Reciprocidad y continuidad',
      parrafos: [
        'Se propone que cada visita tenga un propósito compartido y una entrega verificable. La comunidad contará con copias accesibles de resultados y con oportunidades de corregir registros. El programa incorporará el trabajo local de mediación, narración, guía, operación y mantenimiento en sus tiempos y costos, evitando depender de aportes gratuitos no acordados.',
        'La participación de la escuela o de la comunidad se coordinará con sus tiempos educativos y de cuidado. La formación estudiantil y comunitaria se organizará de manera que la rotación académica no implique pérdida de información ni repetición innecesaria de consultas. Cada relevo de equipo deberá explicar qué se hizo, qué se devolvió y qué sigue pendiente.',
      ],
    },
  ],
  tabla8: {
    id: 'tabla-8',
    titulo: 'Tabla 8 · Instrumentos mínimos del proceso',
    columnas: ['Instrumento', 'Contenido mínimo', 'Función'],
    filas: [
      ['Ficha de fuente', 'Origen, fecha, alcance, ubicación y permisos.', 'Dar trazabilidad a datos y representaciones.'],
      ['Bitácora de campo', 'Lugar, participantes, observaciones y condiciones del registro.', 'Conservar contexto y preguntas emergentes.'],
      ['Ficha de memoria', 'Relato o práctica, autoría, contexto y autorización.', 'Reconocer conocimientos y condiciones de circulación.'],
      ['Matriz de validación', 'Hallazgo, comentario, acuerdo o desacuerdo y ajuste.', 'Hacer visible la incidencia de la participación.'],
      ['Ficha de piloto', 'Objetivo, diseño, responsables, costos y seguimiento.', 'Evaluar pertinencia y viabilidad antes de ejecutar.'],
      ['Acta de devolución', 'Material entregado, comentarios y compromisos aceptados.', 'Cerrar cada ciclo y organizar la continuidad.'],
    ],
  },
};

// -----------------------------------------------------------------------------
// 12. FASES Y CRONOGRAMA DE 24 MESES (Págs. 16–17)
// -----------------------------------------------------------------------------
export const CAP_12 = {
  introduccion:
    'El horizonte propuesto se cuenta desde el inicio formal que acuerden los participantes. Las fases se superponen para permitir validación y ajustes; no equivalen a compromisos de ejecución o financiación. El antecedente de septiembre de 2026 y sus fases de intervención escolar se conserva como referencia, y su estado deberá verificarse al comenzar. [R1]',
  tabla9: {
    id: 'tabla-9',
    titulo: 'Tabla 9 · Fases y resultados de paso',
    columnas: ['Fase', 'Meses', 'Trabajo principal', 'Resultado para continuar'],
    filas: [
      ['F1 Acuerdos y preparación', '1–3', 'Delimitar ámbito, actores, protocolos, recursos y compromisos.', 'Agenda, gobernanza y condiciones iniciales acordadas.'],
      ['F2 Reconocimiento documental y digital', '1–6', 'Inventario, archivo, cartografía, primera línea base y vacíos.', 'Modelo inicial y plan de validación territorial.'],
      ['F3 Memorias y validación en campo', '4–9', 'Talleres, recorridos, registros y devolución de interpretaciones.', 'Prioridades validadas y alternativas de piloto.'],
      ['F4 Codiseño y evaluación de viabilidad', '7–12', 'Diseñar, presupuestar, ensayar y acordar cuidado.', 'Fichas técnicas y decisión sobre ejecución.'],
      ['F5 Pilotos y seguimiento', '10–20', 'Implementar los pilotos viables y evaluar su funcionamiento.', 'Registros comparables y ajustes documentados.'],
      ['F6 Síntesis y continuidad', '18–24', 'Devolución final, recomendaciones, acuerdos y convocatorias.', 'Productos entregados y hoja de continuidad.'],
    ],
  },
  hitos: [
    { mes: 3, titulo: 'Mes 3', desc: 'Ámbito, protocolo participativo y responsabilidades iniciales acordados.' },
    { mes: 6, titulo: 'Mes 6', desc: 'Archivo y modelo territorial inicial disponibles para validación.' },
    { mes: 9, titulo: 'Mes 9', desc: 'Prioridades y correcciones comunitarias sistematizadas.' },
    { mes: 12, titulo: 'Mes 12', desc: 'Selección final de pilotos con viabilidad, presupuesto y cuidado definidos.' },
    { mes: 18, titulo: 'Mes 18', desc: 'Revisión intermedia de funcionamiento y ajustes de los pilotos activos.' },
    { mes: 24, titulo: 'Mes 24', desc: 'Devolución, evaluación y cartera de continuidad entregadas.' },
  ],
  cronogramaFilas: [
    { id: 'F1', actividad: 'F1 Acuerdos y preparación', inicio: 1, fin: 3, tipo: 'fase', color: '#4fb6b0' },
    { id: 'F2', actividad: 'F2 Archivo y modelo inicial', inicio: 1, fin: 6, tipo: 'fase', color: '#8fd3ee' },
    { id: 'F3', actividad: 'F3 Memorias y validación', inicio: 4, fin: 9, tipo: 'fase', color: '#5fb3a8' },
    { id: 'F4', actividad: 'F4 Codiseño y viabilidad', inicio: 7, fin: 12, tipo: 'fase', color: '#f2d14a' },
    { id: 'F5', actividad: 'F5 Pilotos y seguimiento', inicio: 10, fin: 20, tipo: 'fase', color: '#c86d51' },
    { id: 'F6', actividad: 'F6 Síntesis y continuidad', inicio: 18, fin: 24, tipo: 'fase', color: '#e8e2d5' },
    { id: 'T1', actividad: 'Formación y semilleros', inicio: 1, fin: 24, tipo: 'transversal', color: '#4fb6b0' },
    { id: 'T2', actividad: 'Gobernanza y devolución', inicio: 1, fin: 24, tipo: 'transversal', color: '#5fb3a8' },
    { id: 'T3', actividad: 'Archivo y actualización', inicio: 1, fin: 24, tipo: 'transversal', color: '#8fd3ee' },
  ],
  semestres: [
    { sem: 'Semestre 1', meses: 'Meses 1 a 6', desc: 'Acuerdos, preparación y primera representación del territorio.' },
    { sem: 'Semestre 2', meses: 'Meses 7 a 12', desc: 'Validación, codiseño y decisiones de viabilidad.' },
    { sem: 'Semestre 3', meses: 'Meses 13 a 18', desc: 'Experimentación, formación y seguimiento.' },
    { sem: 'Semestre 4', meses: 'Meses 19 a 24', desc: 'Evaluación, devolución y continuidad.' },
  ],
  dependencias:
    'La ejecución de cada piloto depende de la validación de la necesidad, el acuerdo de uso del espacio, el diseño y evaluación técnica, el presupuesto y la disponibilidad de responsables de mantenimiento. Un atraso en estos requisitos debe traducirse en una revisión del cronograma y del alcance, no en una promesa de construcción sin respaldo.',
  notaVisitas:
    'Las visitas se programarán según necesidades de investigación, calendarios locales, recursos y condiciones de transporte. La frecuencia del seguimiento ambiental deberá ajustarse al fenómeno estudiado; una visita aislada no permite atribuir cambios estacionales o de largo plazo.',
};

// -----------------------------------------------------------------------------
// 13. ACTORES Y GOBERNANZA (Págs. 18–19)
// -----------------------------------------------------------------------------
export const CAP_13 = {
  introduccion:
    'Se propone una gobernanza que vincule representación comunitaria, coordinación académica y capacidades técnicas y productivas. Las decisiones sobre preguntas, registros públicos y uso de espacios se construirán con los participantes locales. La matriz distingue la vinculación consignada en antecedentes de los compromisos que todavía deben acordarse para este programa.',
  estadoAcuerdos:
    'Estado de acuerdos: la documentación examinada no acredita convenios, financiación ni asignación formal de responsabilidades para el programa marco de X meses. El plan de salida identifica actores vinculados al proceso precedente; esa referencia no constituye por sí misma un compromiso con el nuevo programa. [R1]',
  tabla10: {
    id: 'tabla-10',
    titulo: 'Tabla 10 · Matriz de actores y participación propuesta',
    columnas: ['Actor', 'Vinculación documentada o prevista', 'Papel propuesto y formalización requerida'],
    filas: [
      [
        'Comunidad de Bocachica y organizaciones locales',
        'Participación en talleres y diagnóstico. [R1, R8]',
        'Definir prioridades, validar y cogestionar. Acordar representación, tiempos y retribución.',
      ],
      [
        'Gimnasio Cristiano de Bocachica',
        'Identificado como aliado de la salida. [R1]',
        'Nodo escolar y piloto de cuidado climático. Acordar uso, calendario, autorizaciones y mantenimiento.',
      ],
      [
        'Proyecto de Arquitectura Javeriana',
        'Promotor académico del proceso descrito. [R1]',
        'Coordinación y formación. Formalizar equipo, avales, dedicaciones y recursos del programa.',
      ],
      [
        'Estudiantes y semilleros',
        'El plan organiza trabajo estudiantil; el promotor propone grupo de estudio.',
        'Archivo, cartografías, modelos y campo. Definir tutoría, relevo y continuidad.',
      ],
      [
        'Fundación Verde que te Quiero Verde',
        'Identificada como aliada de la salida. [R1]',
        'Apoyo ambiental y vegetal. Confirmar disponibilidad, alcances y aportes.',
      ],
      [
        'ACOPI Cartagena',
        'Aliado propuesto por el promotor.',
        'Articulación empresarial y capacidades productivas. Acordar interlocución, aportes y alcance.',
      ],
      [
        'Fundación Laboratorios Urbanos de Cartagena',
        'Aliado propuesto; denominación institucional por confirmar.',
        'Mediación territorial y experimentación urbana. Verificar vinculación y responsabilidades.',
      ],
      [
        'Microbiología y micología Javeriana',
        'Participación prevista por el promotor.',
        'Formulación de preguntas y ensayos pertinentes. Confirmar investigadores, protocolos y laboratorios.',
      ],
      [
        'Instituto del Agua Javeriana',
        'Participación prevista por el promotor; unidad por precisar.',
        'Diseño y evaluación de estudios hídricos. Confirmar equipo, alcances y recursos.',
      ],
    ],
  },
  tabla11: {
    id: 'tabla-11',
    titulo: 'Tabla 11 · Actores por convocar según necesidades',
    columnas: ['Actor', 'Antecedente o pertinencia', 'Participación por acordar'],
    filas: [
      [
        'Equipo psicosocial vinculado a la Universidad de Lleida',
        'El plan atribuye apoyo al diagnóstico. [R1]',
        'Continuidad de la lectura psicosocial y validación, si existe disponibilidad.',
      ],
      [
        'Jardín Botánico de Cartagena Guillermo Piñeres',
        'Visita y apoyo competente previstos por el plan. [R1]',
        'Orientación botánica y criterios de siembra; confirmar participación técnica.',
      ],
      [
        'Maestros de oficios, pescadores, navegantes y gestores culturales',
        'Conocimientos y actividades abordados. [R6, R7]',
        'Registro, formación y diseño de pilotos con reconocimiento de autoría y trabajo.',
      ],
      [
        'Otras escuelas, Casa de la Cultura y organizaciones del territorio',
        'Actores identificados por el diagnóstico. [R8]',
        'Ampliar escucha y participación sin presumir representación o adhesión.',
      ],
      [
        'Sector público y autoridades competentes',
        'Interlocutores necesarios según ámbitos de intervención.',
        'Verificar competencias, permisos y articulación con instrumentos vigentes.',
      ],
      [
        'Empresas y fundaciones financiadoras',
        'Capacidades potenciales según convocatoria y piloto.',
        'Aportes económicos o en especie con condiciones, responsabilidades y destino claros.',
      ],
    ],
  },
  estructuraPropuesta: [
    'Una mesa territorial y comunitaria revisará prioridades, resultados y condiciones de las intervenciones. Un comité académico y técnico coordinará métodos, archivo, calidad de la información y evaluación. Una coordinación operativa organizará agenda, presupuesto, logística y seguimiento. Esta estructura deberá acordarse con los actores y podrá simplificarse para el primer proyecto.',
    'Se propone realizar revisiones ordinarias trimestrales y sesiones específicas antes de cada piloto y de cada entrega pública. Las actas distinguirán propuestas, decisiones aceptadas, responsables y fechas. Ningún actor asumirá compromisos por otro; el uso de nombres y logotipos como aliados requerirá autorización.',
  ],
  instrumentosFormalizacion:
    'La mesa de formulación definirá los instrumentos apropiados para cada vínculo: carta de interés, acuerdo de colaboración, asignación de equipo, autorización de uso o convenio, según corresponda. Cada instrumento deberá precisar objetivos, vigencia, aportes, manejo de datos, autoría, responsabilidades, mantenimiento y forma de cierre.',
};

// -----------------------------------------------------------------------------
// 14. PRODUCTOS E INDICADORES (Pág. 20)
// -----------------------------------------------------------------------------
export const CAP_14 = {
  introduccion:
    'Los productos se proponen para orientar la formulación y deben ajustarse al presupuesto y a los criterios de cada convocatoria. Las metas de actividad no equivalen a resultados de impacto. En los meses iniciales se establecerá una línea base para revisar su factibilidad y acordar indicadores de cambio pertinentes.',
  tabla12: {
    id: 'tabla-12',
    titulo: 'Tabla 12 · Matriz inicial de productos y verificación',
    columnas: ['Producto', 'Meta propuesta', 'Verificación', 'Objetivo'],
    filas: [
      ['P1 Línea base territorial', '1 informe y un inventario trazable.', 'Fuentes, mapas y vacíos documentados.', 'OE1'],
      ['P2 Archivo de memorias', '1 archivo organizado y versionado.', 'Registros autorizados y revisiones de participantes.', 'OE2'],
      ['P3 Atlas y modelo territorial', '1 conjunto cartográfico y modelo inicial con actualización final.', 'Capas, metadatos y registro de cambios.', 'OE3'],
      ['P4 Validación comunitaria', 'Al menos 3 momentos de devolución, ajustables a la agenda local.', 'Actas, correcciones y materiales entregados.', 'OE2–4'],
      ['P5 Cartera de pilotos', 'Al menos 3 fichas evaluadas; ejecución según viabilidad.', 'Diseño, presupuesto, decisión y acuerdo de cuidado.', 'OE4'],
      ['P6 Pilotos implementados', 'Cantidad por acordar al mes 12.', 'Actas y registros de seguimiento de cada piloto.', 'OE4'],
      ['P7 Formación', '1 plan de grupo de estudio y semilleros; ciclos por acordar.', 'Portafolios, bitácoras y evaluación de aprendizajes.', 'OE5'],
      ['P8 Recomendaciones', '1 documento de criterios de planificación y continuidad.', 'Revisión técnica y comunitaria.', 'OE4–6'],
      ['P9 Formulación', 'Al menos 1 propuesta para convocatoria pertinente.', 'Documento, presupuesto y avales efectivos.', 'OE6'],
    ],
  },
  indicadoresCalidad:
    'Se propone observar la proporción de registros con fuente y autorización completas; las correcciones comunitarias incorporadas o discutidas; la diversidad de participantes según criterios acordados; el acceso efectivo a los productos; y la existencia de responsables y recursos de cuidado. Cada indicador tendrá definición, denominador cuando aplique, periodicidad y responsable de registro.',
  indicadoresPilotos:
    'Según el piloto seleccionado podrán medirse área y horarios de sombra, condiciones térmicas comparables, supervivencia de plantas, uso y cuidado de instalaciones, cantidades recuperadas de residuos y destino verificable, o aprendizajes y continuidad de talleres. Los indicadores hídricos y microbiológicos dependerán del protocolo científico; no se declarará potabilidad ni desempeño ambiental a partir de observaciones informales.',
};

// -----------------------------------------------------------------------------
// 15. FINANCIACIÓN Y SOSTENIBILIDAD (Pág. 21)
// -----------------------------------------------------------------------------
export const CAP_15 = {
  introduccion:
    'La estrategia propuesta combina un programa marco común con proyectos de alcance delimitado. Una primera convocatoria puede financiar línea base, archivo y formulación de pilotos; otras podrán apoyar estudios específicos, formación o infraestructura. Cada propuesta deberá ser coherente con las capacidades efectivamente comprometidas y las condiciones de participación comunitaria.',
  tabla13: {
    id: 'tabla-13',
    titulo: 'Tabla 13 · Rubros que deben presupuestarse',
    columnas: ['Rubro', 'Base de estimación', 'Condición a verificar'],
    filas: [
      ['Equipo y trabajo local', 'Dedicaciones, honorarios y tiempos por actividad.', 'Responsables, reconocimiento del trabajo y disponibilidad.'],
      ['Campo y mediación', 'Visitas, transporte marítimo y terrestre, materiales y espacios.', 'Agenda, logística segura y costos reales.'],
      ['Archivo y modelo digital', 'Equipos, almacenamiento, herramientas y publicación.', 'Compatibilidad, acceso y continuidad de la operación.'],
      ['Investigación científica', 'Muestreo, ensayos, análisis y gestión de materiales.', 'Protocolos, instalaciones y costos confirmados por equipo.'],
      ['Pilotos', 'Diseño, materiales, mano de obra e instalación.', 'Viabilidad, autorizaciones y responsables definidos.'],
      ['Cuidado y mantenimiento', 'Agua, reposiciones, reparaciones y seguimiento.', 'Plan de operación durante y después del proyecto.'],
      ['Devolución y formación', 'Talleres, impresión, accesibilidad y reconocimientos.', 'Productos y formatos pertinentes para participantes.'],
      ['Gestión y contingencias', 'Coordinación, imprevistos y exigencias de convocatoria.', 'Reglas del financiador y escenarios de costo.'],
    ],
  },
  notaPresupuesto:
    'No se fija una cifra total en esta versión. El presupuesto se construirá a partir de actividades, cantidades y costos verificables, con aportes monetarios y en especie separados y con la fuente de financiación indicada. Un aporte previsto no se registrará como contrapartida confirmada sin aceptación del actor responsable.',
  continuidadCriterios: [
    'Se propone evaluar las oportunidades de financiación por afinidad con las preguntas del programa, elegibilidad de las instituciones, tiempos, posibilidad de participación comunitaria, rubros permitidos y costos de continuidad. La elección de una convocatoria no deberá obligar a prometer aplicaciones o impactos que excedan la evidencia y los recursos.',
    'La sostenibilidad requiere conservar el archivo, formar personas capaces de utilizarlo, asegurar responsables de cuidado y evitar cargas operativas que la comunidad no pueda asumir. El cierre de cada piloto identificará costos recurrentes, riesgos y opciones de continuidad o retiro. El acompañamiento empresarial podrá fortalecer rutas productivas cuando exista viabilidad y una distribución de responsabilidades acordada.',
  ],
};

// -----------------------------------------------------------------------------
// 16. CRITERIOS ÉTICOS Y GESTIÓN DE RIESGOS (Pág. 22)
// -----------------------------------------------------------------------------
export const CAP_16 = {
  participacionReconocimiento: [
    'La comunidad será reconocida como productora de conocimiento y participante en las decisiones. Se explicarán los propósitos, usos y límites de cada actividad antes de registrar información. Se acordarán formas de reconocimiento de autoría, uso de imágenes, retribución y devolución. Los desacuerdos se conservarán como parte de la investigación. [R1, R8]',
    'El trabajo con niños requerirá las autorizaciones correspondientes y procedimientos adecuados a su edad, con participación voluntaria y protección de identidad e imagen. La evaluación ética y los protocolos institucionales pertinentes se definirán antes del trabajo de campo. Los productos públicos evitarán divulgar información sensible de personas, prácticas o lugares.',
  ],
  investigacionResponsable:
    'Los ensayos con agua, microorganismos, hongos y materiales tendrán responsables científicos, protocolos y condiciones de manejo definidos. Cualquier aplicación territorial deberá revisar los riesgos y requisitos que correspondan. La experimentación escolar se adaptará a su contexto y no trasladará procedimientos de laboratorio sin evaluación.',
  tabla14: {
    id: 'tabla-14',
    titulo: 'Tabla 14 · Riesgos y respuestas propuestas',
    columnas: ['Riesgo', 'Respuesta prevista', 'Responsabilidad por asignar'],
    filas: [
      ['Expectativas sin recursos', 'Comunicar alcances y distinguir propuestas de compromisos.', 'Coordinación y mesa territorial.'],
      ['Participación parcial', 'Ampliar escucha, registrar ausencias y facilitar formatos accesibles.', 'Mediación comunitaria y equipo académico.'],
      ['Lecturas sin contexto', 'Acompañar dibujos y mapas con explicación y validación.', 'Equipo de memorias y participantes.'],
      ['Difusión de datos sensibles', 'Definir permisos, niveles de acceso y versiones públicas.', 'Custodia del archivo y titulares de registros.'],
      ['Falta de agua o cuidado vegetal', 'Verificar disponibilidad y responsables antes de sembrar.', 'Equipo técnico y responsables del sitio.'],
      ['Pilotos sin continuidad', 'Incluir operación, presupuesto recurrente y criterios de cierre.', 'Comité técnico y responsables locales.'],
      ['Riesgos de campo y transporte', 'Planificar condiciones de desplazamiento y actividades.', 'Coordinación operativa e instituciones.'],
      ['Afectaciones de usos y accesos', 'Contrastar alternativas con actores y revisar efectos.', 'Mesa territorial y equipo de planificación.'],
    ],
  },
  notaNormativa:
    'El programa no sustituye las competencias de las autoridades ni los instrumentos de planificación. Antes de una intervención se verificarán las condiciones del sitio, las autorizaciones, los requisitos técnicos y los alcances normativos aplicables, con apoyo competente cuando corresponda.',
};

// -----------------------------------------------------------------------------
// 17. RUTA DE FORMULACIÓN Y REFERENCIAS (Págs. 23–24)
// -----------------------------------------------------------------------------
export const CAP_17 = {
  agendaInicial:
    'El siguiente paso propuesto es una reunión de formulación con el promotor académico, representación comunitaria y los interlocutores disponibles. La sesión deberá producir decisiones concretas sobre el ámbito inicial, los actores que aceptan participar y el proyecto que conviene formular primero para convocatorias.',
  tabla15: {
    id: 'tabla-15',
    titulo: 'Tabla 15 · Hoja de ruta para convertir el programa en proyecto',
    columnas: ['Paso', 'Decisión o tarea', 'Resultado esperado'],
    filas: [
      ['1 Delimitar', 'Acordar lugares, participantes y problema prioritario.', 'Acta de alcance y agenda de validación.'],
      ['2 Confirmar', 'Verificar estado de antecedentes, vínculos y aportes.', 'Matriz de compromisos respaldados.'],
      ['3 Organizar', 'Conformar equipo y grupo de estudio; asignar tutorías.', 'Responsables y plan de trabajo inicial.'],
      ['4 Diseñar', 'Definir métodos, ética, productos y pilotos candidatos.', 'Proyecto técnico y protocolos pertinentes.'],
      ['5 Costear', 'Estimar actividades, operación y aportes.', 'Presupuesto y plan de continuidad.'],
      ['6 Seleccionar', 'Revisar convocatorias y requisitos de elegibilidad.', 'Ruta de postulación y calendario.'],
      ['7 Validar y presentar', 'Revisar con participantes y obtener avales efectivos.', 'Propuesta lista para presentación.'],
    ],
  },
  asuntosPorResolver: [
    'Al iniciar se verificará qué actividades e intervenciones del plan de salida se realizaron, qué resultados se devolvieron y qué acuerdos permanecen vigentes. También se precisarán la denominación y participación de Laboratorios Urbanos, el equipo del agua y los investigadores de ciencias; la representación de organizaciones locales; el acceso a registros originales; y las condiciones de uso, operación y mantenimiento de los sitios candidatos.',
    'La primera cartera de pilotos deberá priorizarse con criterios explícitos: necesidad reconocida, aporte al aprendizaje, calidad de la evidencia, viabilidad técnica, costo total, responsables de cuidado y posibilidad de evaluación. La decisión de posponer o descartar una alternativa se documentará junto con sus razones.',
  ],
  referencias: [
    {
      ref: 'R1',
      cita: 'Serrano Sierra, Alejandro. Plan metodológico integral de la salida de campo. Cartagena, Turbaco y Bocachica, Isla de Tierra Bomba. Proyecto Nuevos Territorios, Programa de Arquitectura, Pontificia Universidad Javeriana. Archivo Plan metodológico salida v2.docx. Programación del 7 al 11 de septiembre de 2026.',
    },
    {
      ref: 'R2',
      cita: 'Proyecto AKOS Bocachica. Capítulo 1. Cartográfico-defensivo: Bocachica entre la arquitectura del control y el trabajo vivo del lugar. Versión 0.1. Archivo Capítulo_1_v0.1.docx. Sin fecha indicada.',
    },
    {
      ref: 'R3',
      cita: 'Proyecto AKOS Bocachica. Capítulo 2. Patrimonio fortificado: de la piedra monumental a la piedra habitada. Versión 0.1. Archivo Capítulo_2_v0.1.docx. Sin fecha indicada.',
    },
    {
      ref: 'R4',
      cita: 'Proyecto AKOS Bocachica. Capítulo 3. Territorio vivido: arquitectura de la necesidad y trabajo vivo en Bocachica. Versión 0.2. Archivo Capitulo_3_v0.2.docx. Sin fecha indicada.',
    },
    {
      ref: 'R5',
      cita: 'Proyecto AKOS Bocachica. Capítulo 4. Escuela y comunidad: el territorio que aprende, cuida y se imagina. Versión 0.1. Archivo Capitulo_4_v0.1.docx. Sin fecha indicada.',
    },
    {
      ref: 'R6',
      cita: 'Proyecto AKOS Bocachica. Capítulo 5. Oficios y saberes del mar: trabajo vivo, patrimonio y transformación en Tierra Bomba. Versión 0.2. Archivo Capitulo_5_v0.2.docx. Sin fecha indicada.',
    },
    {
      ref: 'R7',
      cita: 'Proyecto AKOS Bocachica. Capítulo 6. Arquitecturas de la valorización: turismo, infraestructura y disputa territorial en Bocachica. Versión 0.1. Archivo Capitulo_6_v0.1.docx. Sin fecha indicada.',
    },
    {
      ref: 'R8',
      cita: 'Resultados. Análisis del diagnóstico comunitario. Traducción al español del diagnóstico de Bocachica. Archivo RESULTADOS DIAGNÓSTICO BOCACHICA TRADUCCIÓN.pdf, 19 páginas. Sin fecha indicada en el documento consultado. El plan metodológico relaciona su elaboración con psicólogas vinculadas a la Universidad de Lleida.',
    },
    {
      ref: 'R9',
      cita: 'Intervención Aula Ambiental en el Gimnasio Cristiano de Bocachica (en proceso). Desarrollo espacial y pedagógico para el Gimnasio Cristiano de Bocachica con recursos para espacios de sombra y cancha para preescolar, contemplado para trabajos pedagógicos entre actores.',
    },
  ],
  usoReferencias: [
    'Las referencias identifican los documentos base y sus aportes al programa. Las fuentes bibliográficas citadas dentro de los capítulos AKOS deberán revisarse directamente al desarrollar los proyectos específicos y su marco teórico. El diagnóstico aporta relatos y lecturas situadas; sus límites de sistematización deben conservarse en cualquier reutilización de los datos.',
    'Las figuras, las matrices de formulación y el cronograma organizan la propuesta de programa marco. Las metas y los periodos propuestos deberán actualizarse al confirmar participantes, recursos y convocatoria.',
  ],
};
