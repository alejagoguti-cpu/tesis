import React, { useState } from 'react';
import {
  BookOpen, Users, Building2, Waves, Home, Ship, House, Leaf, RotateCcw,
  Sparkles, CheckCircle2, ChevronRight, X, Eye, Maximize2, Layers,
  Compass, Wind, Droplets, Sun, Hammer, Shield, GraduationCap, AlertCircle,
  FileText, ArrowRight, Activity, TreePine, Award, ExternalLink
} from 'lucide-react';

const W = 1000;
const H = 680;
const CARD = { w: 236, h: 86 };

const pct = (v, t) => `${(v / t) * 100}%`;

// 4 Redes Temáticas con la información exacta requerida por el usuario
const NETWORKS_DATA = {
  fundamentacion: {
    id: 'fundamentacion',
    badge: 'Capítulo 1 & 2 // Diagnóstico & Epistemología',
    title: 'Estructuración Territorial & Marco Teórico',
    subtitle: 'Vulnerabilidad territorial, fundamentación teórica y ejes estratégicos de intervención en Tierra Bomba.',
    center: {
      id: 'centro',
      title: 'Tierra Bomba',
      sub: 'Desarticulación Insular',
      x: 500,
      y: 340,
      r: 90
    },
    nodes: {
      problema: {
        id: 'problema',
        n: 'Formulación del Problema',
        tag: 'Diagnóstico',
        icon: AlertCircle,
        color: '#dc2626',
        tint: '#fee2e2',
        x: 180,
        y: 110,
        details: {
          title: '1. Formulación del Problema',
          badge: 'Condición Territorial Crítica',
          summary: 'Tierra Bomba presenta una condición de desarticulación socioespacial e insularidad periférica, caracterizada por una desconexión crítica respecto a las dinámicas de desarrollo de Cartagena, a pesar de su proximidad geográfica.',
          points: [
            { label: 'Carencia de servicios básicos', text: 'Carencia o intermitencia severa en servicios básicos (agua potable por red, saneamiento y manejo de residuos).' },
            { label: 'Erosión costera acelerada', text: 'Erosión costera acelerada por corrientes marítimas y cambio climático, amenazando la infraestructura habitacional y el patrimonio histórico (fuertes virreinales como San Fernando y el Ángel San Rafael).' }
          ]
        }
      },
      pregunta: {
        id: 'pregunta',
        n: 'Pregunta Problema Central',
        tag: 'Eje de Investigación',
        icon: Compass,
        color: '#ea580c',
        tint: '#ffedd5',
        x: 500,
        y: 85,
        details: {
          title: 'Pregunta Problema Central de Tesis',
          badge: 'Interrogante Rector',
          summary: 'La estructuración proyectual articula las tres escalas espaciales clave (casa, escuela abierta y espacio público) a partir del habitar insular:',
          quote: '¿De qué manera los modos de habitar del Caribe insular determinan la articulación espacial entre la casa, la escuela abierta y el espacio público en Tierra Bomba?',
          points: [
            { label: 'Modos de habitar caribeños', text: 'Pautas colectivas, rituales cotidianos de pesca, cocina comunitaria y sociabilidad en umbrales y porches.' },
            { label: 'Tríada espacial articulada', text: 'Conexión sinérgica y continua entre la unidad habitacional (la casa), el equipamiento de puertas abiertas (la escuela) y los senderos/plazas litorales (el espacio público).' }
          ]
        }
      },
      harvey: {
        id: 'harvey',
        n: 'Justicia Espacial & Derecho a Ciudad',
        tag: 'David Harvey & Edward Soja',
        icon: Building2,
        color: '#2563eb',
        tint: '#dbeafe',
        x: 820,
        y: 110,
        details: {
          title: 'Marco Teórico 1: Justicia Espacial y Derecho a la Ciudad',
          badge: 'Harvey & Soja',
          summary: 'Explica cómo la proximidad física a enclaves de alta renta turística (Bocagrande, Castillogrande) contrasta con la marginación en el acceso a bienes públicos, planteando la necesidad de redistribución de recursos e integración territorial equitativa.',
          points: [
            { label: 'Contraste territorial abismal', text: 'A menos de 1 km de distancia náutica conviven los rascacielos de Bocagrande con la ausencia total de alcantarillado formal en la isla.' },
            { label: 'Redistribución de recursos', text: 'El ordenamiento insular debe redistribuir las inversiones públicas y proteger a los residentes tradicionales de la especulación inmobiliaria.' },
            { label: 'Derecho a permanecer', text: 'Garantizar el arraigo digno en el territorio insular para frenar el desplazamiento silencioso.' }
          ],
          references: [
            {
              title: 'The Right to the City (New Left Review, Issue 53)',
              author: 'David Harvey (2008)',
              source: 'New Left Review',
              url: 'https://newleftreview.org/issues/ii53/articles/david-harvey-the-right-to-the-city'
            },
            {
              title: 'Social Justice and the City (Geographies of Justice)',
              author: 'David Harvey (1973 / 2009)',
              source: 'University of Georgia Press',
              url: 'https://ugapress.org/book/9780820334035/social-justice-and-the-city/'
            },
            {
              title: 'Seeking Spatial Justice (Spatial Futures Series)',
              author: 'Edward W. Soja (2010)',
              source: 'University of Minnesota Press',
              url: 'https://www.upress.umn.edu/9780816666682/seeking-spatial-justice/'
            }
          ]
        }
      },
      folke: {
        id: 'folke',
        n: 'Ecología Política & SbN',
        tag: 'Carl Folke & Fikret Berkes',
        icon: Leaf,
        color: '#16a34a',
        tint: '#dcfce7',
        x: 830,
        y: 340,
        details: {
          title: 'Marco Teórico 2: Ecología Política y Resiliencia Socioecológica',
          badge: 'Folke & Berkes',
          summary: 'Permite entender que el deterioro costero no es solo un fenómeno biofísico, sino el resultado de intervenciones antrópicas históricas (obras marítimas, canalizaciones y abandono de defensas costeras).',
          points: [
            { label: 'Coevolución socioecológica', text: 'La comunidad y el ecosistema costero deben coevolucionar mediante estrategias de adaptación basadas en la naturaleza (SbN).' },
            { label: 'Restauración ecosistémica', text: 'Integración de manglares de borde, escolleras sumergidas y arrecifes bio-remediadores en lugar de murallas grises rígidas que trasladan el problema.' },
            { label: 'Capacidad adaptativa', text: 'Monitoreo ambiental continuo gestionado de forma comunitaria.' }
          ],
          references: [
            {
              title: 'Resilience: The emergence of a perspective for social-ecological systems analyses',
              author: 'Carl Folke (2006)',
              source: 'Global Environmental Change (Elsevier, DOI: 10.1016/j.gloenvcha.2006.04.002)',
              url: 'https://doi.org/10.1016/j.gloenvcha.2006.04.002'
            },
            {
              title: 'Navigating Social-Ecological Systems: Building Resilience for Complexity and Change',
              author: 'Fikret Berkes, Johan Colding & Carl Folke (2003)',
              source: 'Cambridge University Press',
              url: 'https://doi.org/10.1017/CBO9780511541957'
            },
            {
              title: 'IUCN Global Standard for Nature-based Solutions (SbN)',
              author: 'IUCN (2020)',
              source: 'International Union for Conservation of Nature',
              url: 'https://portals.iucn.org/library/node/49070'
            }
          ]
        }
      },
      sen: {
        id: 'sen',
        n: 'Desarrollo Endógeno & Saberes',
        tag: 'Amartya Sen & Arturo Escobar',
        icon: Users,
        color: '#7c3aed',
        tint: '#ede9fe',
        x: 810,
        y: 560,
        details: {
          title: 'Marco Teórico 3: Desarrollo Endógeno y Agenciamiento Comunitario',
          badge: 'Sen & Escobar',
          summary: 'Sostiene que las soluciones sostenibles provienen del fortalecimiento de las capacidades locales, los saberes ancestrales de las comunidades afrodescendientes y la gobernanza colectiva del territorio, evitando modelos extractivos foráneos.',
          points: [
            { label: 'Saberes ancestrales afro', text: 'Puesta en valor de la arquitectura vernácula en madera, el conocimiento de mareas y la pesca artesanal.' },
            { label: 'Contra el extractivismo', text: 'Evitar enclaves turísticos excluyentes de espaldas a los cuatro corregimientos insulares.' },
            { label: 'Agenciamiento local', text: 'El Consejo Comunitario como sujeto decisor vinculante en el diseño y gestión territorial.' }
          ],
          references: [
            {
              title: 'Development as Freedom (Desarrollo y Libertad)',
              author: 'Amartya Sen (1999)',
              source: 'Oxford University Press',
              url: 'https://global.oup.com/academic/product/development-as-freedom-9780198297581'
            },
            {
              title: 'Autonomía y diseño: La realización de lo comunal',
              author: 'Arturo Escobar (2016)',
              source: 'Universidad del Cauca / Tinta Limón',
              url: 'https://www.aacademica.org/arturo.escobar/68'
            },
            {
              title: 'Encountering Development: The Making and Unmaking of the Third World',
              author: 'Arturo Escobar (1995 / 2012)',
              source: 'Princeton University Press',
              url: 'https://press.princeton.edu/books/paperback/9780691150451/encountering-development'
            }
          ]
        }
      },
      ejes: {
        id: 'ejes',
        n: '3 Ejes de Acción Estratégica',
        tag: 'Propuesta Proyectual',
        icon: Sparkles,
        color: '#0f766e',
        tint: '#ccfbf1',
        x: 500,
        y: 590,
        details: {
          title: 'Líneas de Acción Estratégica (Propuesta de Tesis)',
          badge: '3 Ejes Articulados',
          summary: 'La propuesta articula tres frentes de intervención física y social en Tierra Bomba:',
          points: [
            { label: 'Eje 1: Borde Costero Resiliente y Adaptativo', text: 'Diseño de defensas litorales combinadas (Soluciones Basadas en la Naturaleza: manglares y arrecifes artificiales) articuladas a un paseo peatonal inundable con zócalos de disipación de oleaje.' },
            { label: 'Eje 2: Infraestructura Híbrida de Servicios Básicos', text: 'Micro-redes comunitarias: captación y potabilización pluvial con almacenamiento estanco, tratamiento descentralizado de aguas residuales mediante biofiltros (fitodepuración) y energía solar distribuida.' },
            { label: 'Eje 3: Nodo de Soberanía Económica y Cultural', text: 'Centro productivo y educativo con talleres de oficios tradicionales náuticos, centro de acopio pesquero con cadena de frío solar, espacios de gobernanza colectiva y turismo regenerativo administrado por los Consejos Comunitarios.' }
          ]
        }
      },
      variables: {
        id: 'variables',
        n: 'Variables de Co-creación',
        tag: 'Metodología Mixta',
        icon: Activity,
        color: '#b45309',
        tint: '#fef3c7',
        x: 180,
        y: 560,
        details: {
          title: 'Recursos Metodológicos y Estudio de Variables (Co-creación)',
          badge: 'Metodología de Co-creación',
          summary: 'Diseño metodológico mixto (cuali-cuantitativo) sustentado en procesos de co-creación y 4 dimensiones integradas:',
          points: [
            { label: 'Dimensión Físico-Ambiental', text: 'Tasa de retroceso costero (hasta 1.8 m/año), salinidad de acuíferos, pérdida de barreras arrecifales. Métodos: mapeo GIS multitemporal, sensores remotos, batimetría y aforos de agua.' },
            { label: 'Dimensión Socioeconómica', text: 'Ingreso medio, alta informalidad, pérdida de relevo generacional en pesca. Métodos: encuestas estratificadas en Tierra Bomba, Punta Arena, Caño del Oro y Bocachica.' },
            { label: 'Dimensión Sociocultural & Gobernanza', text: 'Cohesión comunitaria y legitimidad de Consejos Comunitarios. Métodos: cartografía social participativa, grupos focales, entrevistas semiestructuradas y talleres de memoria oral.' },
            { label: 'Dimensión Espacial & Habitacional', text: 'Déficit cualitativo, hacinamiento, tipología tradicional despegada del suelo. Métodos: fichas de caracterización tipológica y fotogrametría con dron.' }
          ]
        }
      }
    },
    edges: [
      ['centro', 'problema'], ['centro', 'pregunta'], ['centro', 'harvey'],
      ['centro', 'folke'], ['centro', 'sen'], ['centro', 'ejes'], ['centro', 'variables'],
      ['problema', 'pregunta'], ['harvey', 'folke'], ['folke', 'sen'], ['sen', 'ejes'], ['variables', 'ejes']
    ],
    reveals: {
      centro: ['problema', 'pregunta', 'harvey', 'folke', 'sen', 'ejes', 'variables'],
      problema: ['pregunta', 'variables'],
      harvey: ['folke'],
      folke: ['sen'],
      sen: ['ejes']
    }
  },

  vivienda: {
    id: 'vivienda',
    badge: 'Criterios Integrados // Módulo Habitacional',
    title: 'Criterios de Diseño de Vivienda para Tierra Bomba',
    subtitle: 'Respuestas bioclimáticas, constructivas, hidrosanitarias y productivas para habitar el litoral insular.',
    center: {
      id: 'centro',
      title: 'Vivienda Resiliente',
      sub: 'Tierra Bomba',
      x: 500,
      y: 340,
      r: 90
    },
    nodes: {
      bioclimatico: {
        id: 'bioclimatico',
        n: '1. Criterio Bioclimático',
        tag: 'Control Solar & Viento',
        icon: Wind,
        color: '#0284c7',
        tint: '#e0f2fe',
        x: 210,
        y: 130,
        details: {
          title: '1. Criterio Bioclimático de la Vivienda',
          badge: 'Confort Pasivo Extremo',
          summary: 'Diseño térmico adaptado al clima cálido húmedo del Caribe sin dependencia de climatización mecánica:',
          points: [
            { label: 'Orientación y control de radiación', text: 'Eje longitudinal orientado Este-Oeste; fachadas cortas expuestas al sol naciente y poniente con muros ciegos o cámaras ventiladas. Aleros perimetrales profundos y quiebrasoles móviles que protegen vanos y galerías de la radiación directa durante todo el año.' },
            { label: 'Ventilación cruzada pasiva', text: 'Disposición de vanos enfrentados en barlovento (vientos alisios del Noreste/Norte) y sotavento, maximizando la permeabilidad con celosías, calados y carpinterías basculantes con una relación de apertura mínima del 25–30% del área de piso habitable.' },
            { label: 'Efecto chimenea y desfogue térmico', text: 'Cubiertas inclinadas (20–30%) a dos o cuatro aguas equipadas con cumbreras ventiladas, linternas o lucernarios altos que facilitan la evacuación continua del aire caliente acumulado por estratificación térmica.' },
            { label: 'Amortiguamiento del calor por cubierta', text: 'Sistema de techo multicapa (cubierta exterior reflectante + cámara de aire ventilada + falso techo aislante o permeable) para reducir la transmitancia térmica hacia los recintos de descanso.' }
          ]
        }
      },
      constructivo: {
        id: 'constructivo',
        n: '2. Criterio Constructivo',
        tag: 'Tectónica & Resistencia Marina',
        icon: Hammer,
        color: '#d97706',
        tint: '#fef3c7',
        x: 790,
        y: 130,
        details: {
          title: '2. Criterio Constructivo de la Vivienda',
          badge: 'Durabilidad Marina C5-M',
          summary: 'Sistemas constructivos durables frente a la agresividad salina y la logística insular:',
          points: [
            { label: 'Despegue del suelo (Zócalo / Palafito ventilado)', text: 'Elevación del plano de piso entre 0.40 m y 0.80 m sobre zapatas aisladas o dados de concreto/mampostería para evitar la humedad por capilaridad salina, escorrentías pluviales y permitir la refrigeración inferior de la losa.' },
            { label: 'Durabilidad ante ambiente marino', text: 'Concretos de alta compacidad con aditivos puzolánicos/hidrófugos y recubrimientos de armadura no menores a 50 mm para contener la penetración de cloruros. Maderas de origen legal debidamente secadas e inmunizadas contra xilófagos y salitre (clase de uso 4/marino).' },
            { label: 'Modulación y prefabricación ligera', text: 'Estructuración modular basada en luces repetitivas (3.00 × 3.00 m o 3.60 × 3.60 m) que optimizan el despiece de madera o perfiles metálicos livianos con protección epóxica, facilitando el transporte marítimo en embarcaciones menores y el montaje manual en seco sin requerir maquinaria pesada.' },
            { label: 'Progresividad y autoconstrucción asistida', text: 'Diseño a partir de un "núcleo básico" estructural y húmedo ampliable por fases, con uniones mecánicas desmontables (pernos de acero inoxidable o galvanizado por inmersión en caliente) que permiten la reparación o sustitución selectiva de piezas sin comprometer la estabilidad global.' }
          ]
        }
      },
      hidrosanitario: {
        id: 'hidrosanitario',
        n: '3. Criterio Hidrosanitario',
        tag: 'Autosuficiencia en Agua',
        icon: Droplets,
        color: '#0d9488',
        tint: '#ccfbf1',
        x: 790,
        y: 550,
        details: {
          title: '3. Criterio Hidrosanitario y Autosuficiencia de la Vivienda',
          badge: 'Soberanía Hídrica & Saneamiento',
          summary: 'Autonomía frente a la inexistencia de redes urbanas centralizadas en Tierra Bomba:',
          points: [
            { label: 'Cosecha de aguas pluviales', text: 'Planos de cubierta configurados como cuencas de captación con pendientes hacia canaletas sobredimensionadas; sistema de desvío del primer lavado de lluvia (first-flush) y almacenamiento en cisternas o tanques modulares protegidos de la radiación solar para prevenir la proliferación de algas.' },
            { label: 'Saneamiento seco / descentralizado', text: 'Implementación de baños secos composteros o sistemas sépticos de dos cámaras seguidos de humedales artificiales subsuperficiales con biofiltros de grava y vegetación fito-remediadora (como vetiver o totora) para el tratamiento in situ de aguas grises antes de su infiltración o reúso en riego.' },
            { label: 'Energía solar pasiva y activa', text: 'Integración en el plano de cubierta de paneles solares fotovoltaicos para suplir la demanda básica de iluminación y refrigeración, con inclinación optimizada para la latitud de Cartagena (aprox. 10–12° con orientación Sur o cenital limpia).' }
          ]
        }
      },
      sociocultural: {
        id: 'sociocultural',
        n: '4. Criterio Sociocultural',
        tag: 'Modos de Habitar & Pesca',
        icon: Users,
        color: '#8b5cf6',
        tint: '#ede9fe',
        x: 210,
        y: 550,
        details: {
          title: '4. Criterio Sociocultural y Productivo de la Vivienda',
          badge: 'Identidad y Trabajo Comunitario',
          summary: 'Integración espacial de las formas de vida litorales, la pesca y la sociabilidad afrocaribeña:',
          points: [
            { label: 'Espacio intermedio (Galería / Porche frontal)', text: 'Plataforma frontal cubierta abierta hacia la calle que funciona como umbral de transición social, donde la familia cuelga chinchorros, conversa con la comunidad y mantiene el control visual espontáneo de la vida pública insular.' },
            { label: 'Patio productivo y área de secado', text: 'Zona exterior protegida pero ventilada destinada al secado de redes, limpieza de aperos de pesca, secado de pescado o siembra de huertos de subsistencia y plantas medicinales tradicionales.' },
            { label: 'Flexibilidad tipológica', text: 'Espacios internos de tabiquería liviana o paneles móviles que permiten transformar áreas sociales en dormitorios colectivos según las dinámicas de familias extensas o estancias temporales por festividades locales.' }
          ]
        }
      }
    },
    edges: [
      ['centro', 'bioclimatico'], ['centro', 'constructivo'],
      ['centro', 'hidrosanitario'], ['centro', 'sociocultural'],
      ['bioclimatico', 'constructivo'], ['constructivo', 'hidrosanitario'],
      ['hidrosanitario', 'sociocultural'], ['sociocultural', 'bioclimatico']
    ],
    reveals: {
      centro: ['bioclimatico', 'constructivo', 'hidrosanitario', 'sociocultural'],
      bioclimatico: ['constructivo'],
      constructivo: ['hidrosanitario'],
      hidrosanitario: ['sociocultural']
    }
  },

  colegio: {
    id: 'colegio',
    badge: 'Equipamiento Pedagógico // Módulo Comunitario',
    title: 'Criterios de Diseño para el Equipamiento Educativo',
    subtitle: 'El equipamiento educativo como infraestructura cívica híbrida, refugio bioclimático y escuela comunitaria.',
    center: {
      id: 'centro',
      title: 'Colegio Bioclimático',
      sub: 'Centro Cívico Insular',
      x: 500,
      y: 340,
      r: 90
    },
    nodes: {
      edu_bioclimatico: {
        id: 'edu_bioclimatico',
        n: '1. Bioclimatismo Pedagógico',
        tag: 'Aulas sin Climatización',
        icon: Wind,
        color: '#0891b2',
        tint: '#cffafe',
        x: 210,
        y: 130,
        details: {
          title: '1. Criterio Bioclimático del Equipamiento Educativo',
          badge: 'Acondicionamiento Pasivo Escolar',
          summary: 'Aulas naturalmente frescas sin recurrir a equipos mecánicos costosos ni redes eléctricas frágiles:',
          points: [
            { label: 'Implantación y orientación de pabellones', text: 'Disposición lineal de los bloques pedagógicos en sentido Este-Oeste, exponiendo las fachadas cortas al sol y garantizando que las caras largas (Norte y Sur) reciban iluminación cenital y difusa sin ganancia térmica directa.' },
            { label: 'Ventilación cruzada masiva en aulas', text: 'Altura libre generosa (3.40 m a 4.00 m) con vanos inferiores a barlovento (vientos alisios) y aberturas altas a sotavento. Se prescinde de ventanas de vidrio herméticas en favor de celosías cerámicas, persianas de madera orientables o mampostería calada continua.' },
            { label: 'Termosifón en grandes cubiertas', text: 'Techos a dos aguas de gran pendiente (25–35%) con caballetes o cumbreras ventiladas continuas y linternas longitudinales para evacuar el aire caliente por flotabilidad térmica. Aislamiento superior mediante cámara de aire ventilada.' },
            { label: 'Patios bioclimáticos y microclima', text: 'Aulas articuladas alrededor de patios intermedios arborizados con especies nativas de bosque seco tropical y litoral (campano, guayacán, totumo, uvita de playa), que humedecen y enfrían el aire previo a su ingreso a los espacios de clase.' },
            { label: 'Aleros protectores y galerías exteriores', text: 'Voladizos perimetrales profundos (2.00 m a 3.00 m) con triple función: pasillo de circulación exterior techado, amortiguador solar de las fachadas y protección contra lluvias torrenciales acompañadas de ráfagas de viento marino.' }
          ]
        }
      },
      edu_constructivo: {
        id: 'edu_constructivo',
        n: '2. Tectónica y Resistencia C5-M',
        tag: 'Mantenimiento Mínimo',
        icon: Building2,
        color: '#d97706',
        tint: '#fef3c7',
        x: 790,
        y: 130,
        details: {
          title: '2. Criterio Constructivo del Equipamiento Educativo',
          badge: 'Durabilidad Agresiva C5-M',
          summary: 'Estructuración robusta frente a la corrosión costera extrema y transporte en barcazas:',
          points: [
            { label: 'Zócalo elevado y protección contra la salinidad', text: 'Estructuración sobre dados o losas elevadas entre 0.50 m y 1.00 m sobre el terreno para prevenir el embate del nivel freático salino, permitir el drenaje de escorrentías pluviales y generar una cámara de aire inferior que refrigere el piso de las aulas.' },
            { label: 'Resistencia a corrosión extrema (Ambiente C5-M)', text: 'Concreto armado de alta durabilidad: relación a/c <= 0.40, aditivos puzolánicos/escoria y recubrimientos mínimos de acero de 60 mm. Perfiles metálicos galvanizados en caliente con epóxico-poliuretano o maderas duras inmunizadas en autoclave (guayacán, teca, abarco).' },
            { label: 'Modulación tectónica y logística insular', text: 'Luces estructurales de 6.00 × 6.00 m o 7.20 × 7.20 m moduladas para componentes livianos transportables en barcazas desde Cartagena. Ensamble en seco que reduce fundiciones masivas y consumo de agua dulce de mezclado.' },
            { label: 'Muros transpirables y de bajo mantenimiento', text: 'Cerramientos con bloques de tierra comprimida (BTC) estabilizados con cal/cemento o mampostería de arcilla cocida a la vista, eliminando estucos y pinturas degradables por el salitre.' }
          ]
        }
      },
      edu_hidraulico: {
        id: 'edu_hidraulico',
        n: '3. Hidrosanitario Comunitario',
        tag: 'Macro-Captación Pluvial',
        icon: Droplets,
        color: '#0284c7',
        tint: '#e0f2fe',
        x: 790,
        y: 550,
        details: {
          title: '3. Criterio Hidrosanitario del Equipamiento Educativo',
          badge: 'Seguridad Hídrica & Ecosaneamiento',
          summary: 'El colegio como gran recolector y reserva de agua dulce para la comunidad:',
          points: [
            { label: 'Gran cubierta recolectora pluvial', text: 'Cubiertas diseñadas con pendientes coordinadas hacia canaletas sobredimensionadas con rejillas autolimpiantes y desarenadores de primeras aguas (first-flush). Conducción por gravedad hacia tanques de concreto subterráneos o semienterrados.' },
            { label: 'Macro-almacenamiento de emergencia comunitaria', text: 'Cisternas dimensionadas no solo para el consumo escolar de 200 a 300 estudiantes, sino como reserva estratégica de agua potable para la población insular durante los meses de sequía (diciembre a abril).' },
            { label: 'Saneamiento ecológico por biojardineras', text: 'Tratamiento de aguas servidas mediante tanques sépticos impermeabilizados seguidos de biojardineras de flujo subsuperficial con grava y vegetación fito-remediadora; cero vertimiento al mar.' }
          ]
        }
      },
      edu_comunidad: {
        id: 'edu_comunidad',
        n: '4. Infraestructura Cívica Híbrida',
        tag: 'Doble Turno & Refugio',
        icon: GraduationCap,
        color: '#059669',
        tint: '#d1fae5',
        x: 210,
        y: 550,
        details: {
          title: '4. Criterio Sociocultural y Pedagógico Comunitario',
          badge: 'Equipamiento de Doble Turno',
          summary: 'La escuela trasciende su horario pedagógico para convertirse en el corazón cívico de Tierra Bomba:',
          points: [
            { label: 'Equipamiento de doble turno (Uso híbrido)', text: 'Aulas polivalentes, biblioteca comunitaria, talleres de oficios náuticos y comedor que abren a la comunidad en horario nocturno y fines de semana para asambleas del Consejo Comunitario y formación técnica.' },
            { label: 'Refugio climático y punto de encuentro seguro', text: 'El equipamiento se concibe como infraestructura resiliente capaz de funcionar como albergue temporal seguro con reserva de agua y energía fotovoltaica autónoma ante eventos de mar de leva o ciclones.' },
            { label: 'Integración comunitaria activa', text: 'Espacios de encuentro, huertos pedagógicos de manglar y talleres prácticos donde los saberes de los pescadores se transmiten formalmente a las nuevas generaciones.' }
          ]
        }
      }
    },
    edges: [
      ['centro', 'edu_bioclimatico'], ['centro', 'edu_constructivo'],
      ['centro', 'edu_hidraulico'], ['centro', 'edu_comunidad'],
      ['edu_bioclimatico', 'edu_constructivo'], ['edu_constructivo', 'edu_hidraulico'],
      ['edu_hidraulico', 'edu_comunidad'], ['edu_comunidad', 'edu_bioclimatico']
    ],
    reveals: {
      centro: ['edu_bioclimatico', 'edu_constructivo', 'edu_hidraulico', 'edu_comunidad'],
      edu_bioclimatico: ['edu_constructivo'],
      edu_constructivo: ['edu_hidraulico'],
      edu_hidraulico: ['edu_comunidad']
    }
  },

  transcodificacion: {
    id: 'transcodificacion',
    badge: 'Diseño del Proyecto // Matriz Social a la Forma',
    title: 'Proyecto: Del Habitar a la Zonificación',
    subtitle: 'Cómo los rituales, relatos comunitarios y rutinas cotidianas se convierten en distancias, umbrales y zonificación.',
    center: {
      id: 'centro',
      title: 'Proyecto',
      sub: 'Del Relato a la Forma',
      x: 500,
      y: 340,
      r: 90
    },
    nodes: {
      docentes: {
        id: 'docentes',
        n: 'Docentes & Aula',
        tag: 'Carga Vocal & Logística',
        icon: GraduationCap,
        color: '#4f46e5',
        tint: '#e0e7ff',
        x: 190,
        y: 110,
        details: {
          title: 'Matriz de Proyecto: Profesores y Docentes',
          badge: 'Rutinas Pedagógicas & Bienestar',
          summary: 'Traducción de la fatiga térmica, acústica y logística en decisiones arquitectónicas directas:',
          quote: 'A las 11:00 AM ya no doy más de la garganta compitiendo contra el eco del salón, el viento y el grito de la cancha, además de que el calor aletarga a los muchachos.',
          points: [
            { label: 'Zonificación acústica protegida', text: 'Bloques de aulas aislados del polideportivo por patios arbolados. Cielorrasos inclinados de madera o caña con absorción acústica y muros laterales con celosía desfasada (el aire entra laminar, sin silbidos ni arrastre de ruido exterior).' },
            { label: 'Sala de profesores como núcleo intermedio ventilado', text: 'Ubicada entre los pabellones de aulas (no en la entrada cívica), con orientación sur/norte para luz difusa sin reflejos en pantallas, mobiliario de guardado estanco con deshumidificación pasiva y visual directa a los patios de recreo.' },
            { label: 'Vigilancia pasiva no invasiva', text: 'Pasillos-galería anchos perimetrales sin rejas carcelarias, permitiendo el control visual del recreo desde la sombra sin fatiga física.' }
          ]
        }
      },
      estudiantes: {
        id: 'estudiantes',
        n: 'Estudiantes & Patios',
        tag: 'Confort Térmico & Identidad',
        icon: Users,
        color: '#0284c7',
        tint: '#e0f2fe',
        x: 500,
        y: 85,
        details: {
          title: 'Matriz de Proyecto: Estudiantes y Juventud',
          badge: 'Desarrollo Sensorial & Aprendizaje',
          summary: 'Espacios escolares concebidos a escala humana, corporal y cultural infantil:',
          quote: 'El salón a mediodía parece un horno; nos salimos a buscar la sombrita de los palos porque el pupitre quema y da dolor de cabeza.',
          points: [
            { label: 'Patios con microclima sombreado', text: 'Patios arbolados con especies nativas, fuentes de agua fresca filtrada y mobiliario de descanso en madera protegida que disipa el calor radiante.' },
            { label: 'Apropiación e identidad territorial', text: 'Aulas abiertas a huertos de manglar y talleres prácticos de carpintería de ribera, fortaleciendo el vínculo con su territorio insular.' },
            { label: 'Transición juego-concentración', text: 'Galerías intermedias de descompresión sensorial entre la cancha deportiva y los módulos de lectura.' }
          ]
        }
      },
      pescadores: {
        id: 'pescadores',
        n: 'Pescadores & Talleres',
        tag: 'Oficios de Ribera',
        icon: Ship,
        color: '#0f766e',
        tint: '#ccfbf1',
        x: 820,
        y: 110,
        details: {
          title: 'Matriz de Proyecto: Pescadores y Artesanos Navales',
          badge: 'Cultura Marítima Tradicional',
          summary: 'La faena de madrugada, limpieza de redes y resguardo seguro de motores fuera de borda:',
          quote: 'Salimos de madrugada; al volver al mediodía necesitamos un espacio techado con piso rústico donde destripar pescado, lavar atarrayas con agua salobre y guardar los motores bajo candado sin ensuciar las áreas limpias.',
          points: [
            { label: 'Zona de Talleres y Oficios en el perímetro bajo/exterior', text: 'Se ubica en el borde con acceso directo a la calle o sendero costero, a sotavento de las aulas para evitar olores. Piso en concreto afinado de fácil lavado con canaleta de drenaje hacia biofiltro y bodega estanca para motores fuera de borda.' },
            { label: 'Separación higiénica y ambiental', text: 'Independencia funcional absoluta respecto a las aulas de clases para no mezclar efluvios ni escombros con los recintos pedagógicos.' }
          ]
        }
      },
      madres: {
        id: 'madres',
        n: 'Madres & Cocineras',
        tag: 'Cocina Comunitaria Colectiva',
        icon: Home,
        color: '#c026d3',
        tint: '#fae8ff',
        x: 830,
        y: 340,
        details: {
          title: 'Matriz de Proyecto: Madres Comunitarias y Cocineras',
          badge: 'Soberanía Alimentaria & Cuidado',
          summary: 'Cocinar en comunidad como acto colectivo, de cooperación y vigilancia protectora:',
          quote: 'Cocinar no es un encierro de una sola persona; picamos en grupo, hacemos sancochos en leña o fogón grande, necesitamos ver a los niños mientras juegan y hablar con las vecinas que traen la yuca o el pescado.',
          points: [
            { label: 'Cocina-Comedor Comunitaria abierta y pasante', text: 'Núcleo social articulado entre el acceso exterior y los patios de recreo. Mesones corridos de preparación colectiva, campana con tiro alto de ventilación (efecto chimenea para desalojar humos pesados sin concentrar calor) y conexión visual directa con el patio de recreo infantil.' },
            { label: 'Acopio y logística', text: 'Plataforma de descargue directo para alimentos e insumos de la canasta comunitaria.' }
          ]
        }
      },
      lideres: {
        id: 'lideres',
        n: 'Consejos & Asambleas',
        tag: 'Gobernanza Cívica',
        icon: Building2,
        color: '#d97706',
        tint: '#fef3c7',
        x: 810,
        y: 560,
        details: {
          title: 'Matriz de Proyecto: Líderes y Consejos Comunitarios',
          badge: 'Gobernanza Colectiva Autónoma',
          summary: 'Lugares representativos de reunión ciudadana, toma de decisiones y acuerdos comunitarios:',
          quote: 'Cuando hay asamblea del Consejo Comunitario o viene alguien de la Alcaldía de Cartagena, nos toca amontonarnos en un salón caliente o bajo un palo; necesitamos un lugar digno que se sienta nuestro.',
          points: [
            { label: 'Aula Máxima / Ágora Cívica en el frente público', text: 'Ubicada sobre el acceso principal del complejo, accesible directamente desde el sendero comunal sin atravesar las zonas de aulas. Configuración espacial abierta en herradura o circular que evite jerarquías autoritarias y garantice ventilación pasiva por las cuatro caras.' },
            { label: 'Uso nocturno autónomo', text: 'Capacidad de operar en fines de semana o noches sin vulnerar la seguridad del bloque de aulas.' }
          ]
        }
      },
      zonificacion: {
        id: 'zonificacion',
        n: '3 Franjas Operativas',
        tag: 'Esquema de Zonificación',
        icon: Layers,
        color: '#059669',
        tint: '#d1fae5',
        x: 500,
        y: 590,
        details: {
          title: 'Esquema de Zonificación en 3 Franjas Funcionales Operativas',
          badge: 'Organización del Masterplan',
          summary: 'Resolución espacial derivada directamente de la matriz de proyecto:',
          points: [
            { label: '1. Franja Cívica y Productiva (Pública / Frente Costero y Sendero)', text: 'Ágora cívica, muelle pesquero, talleres náuticos, cocina comunitaria y acceso principal. Acoge las actividades ruidosas, logísticas y comunitarias.' },
            { label: '2. Franja Pedagógica y de Concentración (Semi-restringida / Núcleo Central)', text: 'Pabellones de aulas teóricas y laboratorios bioclimáticos, biblioteca comunitaria y sala de docentes. Protegida acústicamente y orientada Este-Oeste para máxima sombra y ventilación laminar.' },
            { label: '3. Franja Ambiental y de Amortiguamiento (Ecológica / Borde Posterior)', text: 'Patios arbolados nativos, biojardineras fito-remediadoras, canchas deportivas periféricas, huertos de mangle y tanques de captación pluvial.' }
          ]
        }
      },
      jovenes: {
        id: 'jovenes',
        n: 'Jóvenes & Expresión',
        tag: 'Cultura, Deporte & Sonido',
        icon: Activity,
        color: '#be185d',
        tint: '#fce7f3',
        x: 190,
        y: 560,
        details: {
          title: 'Matriz de Proyecto: Jóvenes, Deporte y Música',
          badge: 'Energía Vital & Convivencia',
          summary: 'Espacios dinámicos para deporte, champeta, danza afro y percusión sin colisionar con las aulas:',
          quote: 'Los fines de semana nos gusta escuchar música, bailar champeta y jugar bola de trapo o microfútbol; si lo hacemos en la calle la policía nos molesta y no hay canchas buenas con sombra.',
          points: [
            { label: 'Polideportivo y Talleres de Expresión en borde perimetral', text: 'Ubicados en el extremo opuesto a las aulas teóricas, delimitados por un seto vivo de árboles nativos que actúa como amortiguador acústico natural. Gradas integradas al talud del terreno con cubierta ligera ventilada.' },
            { label: 'Apertura comunitaria', text: 'Iluminación solar autónoma para torneos comunitarios nocturnos sin costo para las familias.' }
          ]
        }
      }
    },
    edges: [
      ['centro', 'docentes'], ['centro', 'estudiantes'], ['centro', 'pescadores'],
      ['centro', 'madres'], ['centro', 'lideres'], ['centro', 'zonificacion'], ['centro', 'jovenes'],
      ['docentes', 'estudiantes'], ['pescadores', 'madres'], ['madres', 'lideres'],
      ['lideres', 'zonificacion'], ['zonificacion', 'jovenes']
    ],
    reveals: {
      centro: ['docentes', 'estudiantes', 'pescadores', 'madres', 'lideres', 'zonificacion', 'jovenes'],
      docentes: ['estudiantes'],
      pescadores: ['madres'],
      madres: ['lideres'],
      lideres: ['zonificacion']
    }
  }
};

export default function RedesCriteriosTesis() {
  const [activeTab, setActiveTab] = useState('fundamentacion');
  const [visible, setVisible] = useState(['centro']);
  const [opened, setOpened] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const currentNetwork = NETWORKS_DATA[activeTab];
  const { center, nodes, edges, reveals } = currentNetwork;

  const show = (id) => visible.includes(id);

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    setVisible(['centro']);
    setOpened([]);
    setSelectedNode(null);
  };

  const click = (id) => {
    if (id === 'centro') {
      if (opened.includes('centro')) {
        // Reset diagram
        setVisible(['centro']);
        setOpened([]);
        setSelectedNode(null);
        return;
      }
      setOpened(['centro']);
      setVisible(Array.from(new Set(['centro', ...(reveals['centro'] || [])])));
      return;
    }

    // Node click
    setSelectedNode(nodes[id] || null);
    if (!opened.includes(id)) {
      setOpened((o) => [...o, id]);
      setVisible((v) => Array.from(new Set([...v, ...(reveals[id] || [])])));
    }
  };

  const expandAll = () => {
    const allNodeIds = ['centro', ...Object.keys(nodes)];
    setVisible(allNodeIds);
    setOpened(allNodeIds);
  };

  const resetAll = () => {
    setVisible(['centro']);
    setOpened([]);
    setSelectedNode(null);
  };

  // Helper geometry matching RedTerritorio
  const shapeOf = (id) => {
    if (id === 'centro') {
      return { kind: 'circle', x: center.x, y: center.y, r: center.r };
    }
    const n = nodes[id];
    return n ? { kind: 'rect', x: n.x, y: n.y, w: CARD.w, h: CARD.h } : { kind: 'circle', x: 500, y: 340, r: 80 };
  };

  function anchor(shape, tx, ty) {
    const dx = tx - shape.x;
    const dy = ty - shape.y;
    const len = Math.hypot(dx, dy) || 1;
    if (shape.kind === 'circle') {
      return [shape.x + (dx / len) * shape.r, shape.y + (dy / len) * shape.r];
    }
    const hw = shape.w / 2;
    const hh = shape.h / 2;
    const t = Math.min(hw / (Math.abs(dx) || 1e-6), hh / (Math.abs(dy) || 1e-6));
    return [shape.x + dx * t, shape.y + dy * t];
  }

  function curve(aId, bId) {
    const A = shapeOf(aId);
    const B = shapeOf(bId);
    const [ax, ay] = anchor(A, B.x, B.y);
    const [bx, by] = anchor(B, A.x, A.y);
    const dx = bx - ax;
    const dy = by - ay;
    if (Math.abs(dx) >= Math.abs(dy)) {
      const k = Math.abs(dx) * 0.5;
      return `M ${ax} ${ay} C ${ax + Math.sign(dx) * k} ${ay}, ${bx - Math.sign(dx) * k} ${by}, ${bx} ${by}`;
    }
    const k = Math.abs(dy) * 0.5;
    return `M ${ax} ${ay} C ${ax} ${ay + Math.sign(dy) * k}, ${bx} ${by - Math.sign(dy) * k}, ${bx} ${by}`;
  }

  const fade = (on, dx = 0) => ({
    opacity: on ? 1 : 0,
    transform: on ? 'translateX(0) scale(1)' : `translateX(${dx}px) scale(.95)`,
    transition: 'opacity .55s cubic-bezier(.2,.8,.2,1), transform .55s cubic-bezier(.2,.8,.2,1)',
    pointerEvents: on ? 'auto' : 'none'
  });

  const lineStyle = (on) => ({
    strokeDasharray: 1,
    strokeDashoffset: on ? 0 : 1,
    transition: 'stroke-dashoffset .75s ease'
  });

  const edgeColor = (a, b) => {
    if (nodes[b]) return nodes[b].color;
    if (nodes[a]) return nodes[a].color;
    return '#0d9488';
  };

  return (
    <div id="criterios-diagramas" className="w-full flex flex-col items-center select-none py-6 px-2 sm:px-6">
      
      {/* Network Tabs & Header */}
      <div className="w-full max-w-6xl mb-4 bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-700 font-mono text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Diagramas de Red Interactivos // Sustentación de Tesis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
              {currentNetwork.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {currentNetwork.subtitle}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={expandAll}
              className="h-9 px-4 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-teal-300" />
              <span>Desplegar Todo</span>
            </button>
            <button
              onClick={resetAll}
              className="h-9 px-4 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Network Selectors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {[
            { id: 'fundamentacion', label: '1. Marco & Problema', icon: BookOpen, badge: 'Epistemología' },
            { id: 'vivienda', label: '2. Criterios Vivienda', icon: House, badge: '4 Dimensiones' },
            { id: 'colegio', label: '3. Criterios Colegio', icon: GraduationCap, badge: 'Equipamiento' },
            { id: 'transcodificacion', label: '4. Proyecto', icon: Layers, badge: 'Habitar a Forma' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-teal-500/30'
                    : 'bg-slate-50 hover:bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-500'}`} />
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    isActive ? 'bg-white/20 text-teal-200' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                </div>
                <p className="font-bold text-xs sm:text-sm leading-snug">{tab.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        className="w-full max-w-6xl rounded-3xl border border-slate-200/90 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-3 sm:p-6"
        style={{
          background: 'radial-gradient(circle at 1px 1px, #cbd5e1 1.2px, transparent 0) 0 0/24px 24px, #ffffff',
          minHeight: '640px'
        }}
      >
        <div
          className="relative w-full"
          style={{
            aspectRatio: `${W} / ${H}`,
            maxHeight: '100%',
            maxWidth: `calc((100vh - 180px) * ${W / H})`,
            containerType: 'inline-size'
          }}
        >
          {/* SVG Connector Bezier Curves */}
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            fill="none"
            style={{ overflow: 'visible' }}
          >
            {edges.map(([a, b]) => (
              <path
                key={a + b}
                pathLength="1"
                d={curve(a, b)}
                stroke={edgeColor(a, b)}
                strokeOpacity=".55"
                strokeWidth="2.8"
                strokeLinecap="round"
                style={lineStyle(show(a) && show(b))}
              />
            ))}
          </svg>

          {/* Central Circular Glowing Node */}
          <div
            onClick={() => click('centro')}
            className={`absolute grid place-items-center rounded-full text-center transition-transform duration-300 select-none z-10 ${
              opened.includes('centro') ? '' : 'cursor-pointer hover:scale-[1.04]'
            }`}
            style={{
              left: pct(center.x - center.r, W),
              top: pct(center.y - center.r, H),
              width: pct(center.r * 2, W),
              height: pct(center.r * 2, H),
              background: 'radial-gradient(circle at 30% 25%, #1e3a52, #0f2433 70%)',
              boxShadow: '0 0 0 1.2cqw rgba(15,36,51,.1), 0 0 0 2.5cqw rgba(15,36,51,.04), 0 20px 45px -12px rgba(15,36,51,.6)'
            }}
          >
            <div style={{ padding: '0 8%' }}>
              <p className="font-serif font-bold text-white leading-tight" style={{ fontSize: '1.7cqw' }}>
                {center.title}
              </p>
              <p className="font-sans text-teal-200/90 leading-tight font-medium" style={{ fontSize: '1.2cqw' }}>
                {center.sub}
              </p>
              <div className="mx-auto mt-[0.6cqw] h-[2px] w-[3cqw] rounded bg-teal-400" />
            </div>
          </div>

          {/* Callout Indicator if center not yet clicked */}
          {opened.length === 0 && (
            <div
              className="absolute pointer-events-none z-20 animate-pulse"
              style={{
                left: pct(center.x + center.r + 18, W),
                top: pct(center.y - 18, H)
              }}
            >
              <p className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide shadow-xl border border-teal-400/40 flex items-center space-x-1.5">
                <span className="text-teal-300">←</span>
                <span>Haz clic en el centro</span>
              </p>
            </div>
          )}

          {/* Connected Cards */}
          {Object.entries(nodes).map(([id, n]) => {
            const Icon = n.icon;
            const isVisible = show(id);
            const isSelected = selectedNode?.id === id;

            return (
              <div
                key={id}
                onClick={() => click(id)}
                className={`absolute flex items-center bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? 'ring-4 ring-teal-500/40 scale-[1.03] z-30 shadow-2xl'
                    : 'hover:-translate-y-1 hover:shadow-xl z-20 shadow-md'
                }`}
                style={{
                  left: pct(n.x - CARD.w / 2, W),
                  top: pct(n.y - CARD.h / 2, H),
                  width: pct(CARD.w, W),
                  height: pct(CARD.h, H),
                  borderColor: isSelected ? n.color : `${n.color}40`,
                  ...fade(isVisible, n.x < center.x ? -20 : 20)
                }}
              >
                {/* Left accent color bar */}
                <div className="self-stretch" style={{ width: '0.7cqw', background: n.color }} />

                {/* Icon pill */}
                <div
                  className="shrink-0 grid place-items-center rounded-xl"
                  style={{
                    width: '4.4cqw',
                    height: '4.4cqw',
                    margin: '0 0.8cqw 0 1cqw',
                    background: n.tint
                  }}
                >
                  <Icon style={{ width: '2.2cqw', height: '2.2cqw', color: n.color }} strokeWidth={2} />
                </div>

                {/* Card text content */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono font-bold uppercase tracking-wider text-slate-500 block truncate"
                      style={{ fontSize: '0.9cqw' }}
                    >
                      {n.tag}
                    </span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: n.color }} />
                  </div>
                  <p
                    className="font-serif font-bold text-slate-900 leading-snug line-clamp-2"
                    style={{ fontSize: '1.35cqw' }}
                  >
                    {n.n}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-500 px-2 font-mono">
          <span>* Haz clic en cualquier nodo para abrir el inspector de criterios y detalles técnicos</span>
          <span className="hidden sm:inline">Coord. Nodal: 1000 x 680 SVG Tesis</span>
        </div>
      </div>

      {/* Interactive Detail Inspector Drawer / Modal */}
      {selectedNode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedNode(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{ background: selectedNode.tint }}
                >
                  {React.createElement(selectedNode.icon, {
                    className: 'w-6 h-6',
                    style: { color: selectedNode.color }
                  })}
                </div>
                <div>
                  <span
                    className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md inline-block uppercase"
                    style={{ background: selectedNode.tint, color: selectedNode.color }}
                  >
                    {selectedNode.details?.badge || selectedNode.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-serif">
                    {selectedNode.details?.title || selectedNode.n}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summary */}
            {selectedNode.details?.summary && (
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
                {selectedNode.details.summary}
              </p>
            )}

            {/* Highlighted Quote (if any) */}
            {selectedNode.details?.quote && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg space-y-1.5 border-l-4 border-teal-400">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-300">
                  Formulación / Testimonio
                </span>
                <p className="font-serif italic text-sm sm:text-base text-amber-100 leading-relaxed">
                  "{selectedNode.details.quote}"
                </p>
              </div>
            )}

            {/* Detailed Points & Variables */}
            {/* Academic References & URLs */}
            {selectedNode.details?.references && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-2 text-teal-800">
                  <ExternalLink className="w-4 h-4 text-teal-600" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                    Fuentes Teóricas & Enlaces Académicos (URLs)
                  </h4>
                </div>
                <div className="space-y-2">
                  {selectedNode.details.references.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 transition-all group shadow-2xs"
                    >
                      <div className="min-w-0 pr-3 space-y-0.5">
                        <strong className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900 truncate">
                          {ref.title}
                        </strong>
                        <p className="text-[11px] font-mono text-slate-500 group-hover:text-teal-700 truncate">
                          {ref.author} &bull; {ref.source}
                        </p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 group-hover:bg-teal-600 group-hover:text-white transition-colors text-[11px] font-mono font-bold flex items-center space-x-1">
                        <span>URL</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {selectedNode.details?.points && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  Criterios y Especificaciones Verificables
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedNode.details.points.map((pt, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-colors flex items-start space-x-3"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                        style={{ background: selectedNode.color }}
                      />
                      <div>
                        <strong className="block text-xs sm:text-sm font-bold text-slate-900">
                          {pt.label}
                        </strong>
                        <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                          {pt.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">Tierra Bomba • Arquitectura & Urbanismo</span>
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-xs cursor-pointer"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
