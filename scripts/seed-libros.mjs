// scripts/seed-libros.mjs
// Inserta categorías y un catálogo extenso de libros en Firestore.
// Ejecutar desde la raíz del proyecto:
//   node scripts/seed-libros.mjs

import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, addDoc, getDocs,
  serverTimestamp, query, where,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            'AIzaSyB_QJs15qdZOD8niEQ-VIr9kmN52_Fa9nc',
  authDomain:        'biblioteca-firebase-mtn.firebaseapp.com',
  projectId:         'biblioteca-firebase-mtn',
  storageBucket:     'biblioteca-firebase-mtn.firebasestorage.app',
  messagingSenderId: '704184921514',
  appId:             '1:704184921514:web:920d3c71bae1e82ab50fd3',
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function upsertCategoria(nombre) {
  const snap = await getDocs(
    query(collection(db, 'categorias'), where('nombre', '==', nombre))
  );
  if (!snap.empty) return snap.docs[0].id;
  const ref = await addDoc(collection(db, 'categorias'), {
    nombre,
    createdAt: serverTimestamp(),
  });
  console.log(`  📂  Categoría creada: "${nombre}" (${ref.id})`);
  return ref.id;
}

async function crearLibro(datos) {
  const ref = await addDoc(collection(db, 'libros'), {
    ...datos,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── Categorías ───────────────────────────────────────────────────────────────

console.log('\n📚  Biblioteca Firebase MTN — Seed de Libros');
console.log('━'.repeat(52));
console.log('\n📂  Creando / verificando categorías...');

const cat = {};
for (const nombre of [
  'Novela', 'Ciencia Ficción', 'Terror', 'Romance',
  'Historia', 'Fantasía', 'Misterio', 'Autoayuda',
  'Clásicos', 'Aventura',
]) {
  cat[nombre] = await upsertCategoria(nombre);
}

// ─── Libros ───────────────────────────────────────────────────────────────────

console.log('\n📖  Insertando libros...\n');

const libros = [

  // ── NOVELA ──────────────────────────────────────────────────────────────────
  {
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    categoriaId: cat['Novela'],
    cantidadPaginas: 496,
    contenido: `Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo. Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos.

El mundo era tan reciente, que muchas cosas carecían de nombre, y para mencionarlas había que señalarlas con el dedo. Todos los años, por el mes de marzo, una familia de gitanos desarrapados plantaba su carpa cerca de la aldea, y con un grande alboroto de pitos y timbales daban a conocer los nuevos inventos.

La familia Buendía fue fundada por José Arcadio Buendía y Úrsula Iguarán, y su historia es la de Macondo mismo: un ciclo eterno de guerras, amores prohibidos, locuras y el implacable peso de la soledad que persigue a cada generación como una maldición bíblica. Esta novela es un monumento de la literatura latinoamericana y uno de los pilares del realismo mágico.`,
  },
  {
    titulo: 'El amor en los tiempos del cólera',
    autor: 'Gabriel García Márquez',
    categoriaId: cat['Novela'],
    cantidadPaginas: 348,
    contenido: `En su tierra natal, Florentino Ariza esperó más de cincuenta años para decirle a Fermina Daza que la amaba. La primera vez que le confesó su amor tenía apenas dieciséis años, y ella lo rechazó con una severidad que a él le pareció un destello de su grandeza. Pero Florentino nunca olvidó. Mientras ella se casaba con el doctor Juvenal Urbino, el hombre más respetado de la ciudad, él acumulaba sus fracasos de amor como colecciones, convencido de que la espera tenía un fin.

Esta novela es una exploración magistral de las formas del amor: el amor joven e impetuoso, el amor conyugal asentado en la costumbre, y el amor que madura con los años como un vino añejo. García Márquez demuestra que el corazón no tiene edad y que algunas historias solo pueden contarse cuando ya todo parece perdido.`,
  },
  {
    titulo: 'La casa de los espíritus',
    autor: 'Isabel Allende',
    categoriaId: cat['Novela'],
    cantidadPaginas: 432,
    contenido: `La pequeña Clara del Valle tenía tres años cuando vio por primera vez la muerte. Miraba desde la ventana cómo sacaban el ataúd de su abuela Rosa la Bella, la mujer más hermosa que había nacido en esas tierras, y en lugar de llorar como los demás, preguntó en voz alta por qué todos usaban ropa negra si Rosa siempre había preferido el verde.

Así comienza la saga de las Trueba y del Valle, cuatro generaciones de mujeres extraordinarias que viven entre la realidad y el sueño, entre la política y la magia, mientras Chile avanza hacia una de sus horas más oscuras. Isabel Allende teje con maestría el amor, la traición, el poder y la resistencia en una historia que es al mismo tiempo íntima y épica.`,
  },
  {
    titulo: 'Ficciones',
    autor: 'Jorge Luis Borges',
    categoriaId: cat['Novela'],
    cantidadPaginas: 224,
    contenido: `En la Biblioteca de Babel, que algunos llaman el universo, cada libro es la repetición exacta de todos los demás con el mínimo de variación posible. En algún anaquel de algún hexágono, razonan los hombres, debe existir el libro que sea la clave y el compendio perfecto de todos los demás. Algunos bibliófilos han recorrido los corredores en su busca; ya he conocido ancianos que pasaron muchos lustros buscándolo y que murieron sin haberlo hallado.

Este volumen reúne los cuentos que convirtieron a Borges en un referente mundial de la literatura: El jardín de los senderos que se bifurcan, La lotería en Babilonia, Pierre Menard autor del Quijote. Cada relato es un laberinto de ideas donde la filosofía, la matemática y la imaginación se funden en algo completamente nuevo.`,
  },
  {
    titulo: 'Rayuela',
    autor: 'Julio Cortázar',
    categoriaId: cat['Novela'],
    cantidadPaginas: 635,
    contenido: `A su manera este libro es muchos libros, pero sobre todo es dos libros. El lector tiene la opción de elegir entre una lectura corriente que termina en el capítulo 56, o una lectura activa que salta de capítulo en capítulo según una tabla al final del libro. Este segundo libro es un salto en la oscuridad, una invitación a perderse en París junto a Horacio Oliveira y la Maga.

Cortázar propone con Rayuela un nuevo contrato entre autor y lector: no hay un camino único, no hay una verdad establecida. Como en la rayuela que juegan los niños, hay que saltar con un pie, cerrar un ojo, y confiar en que el cielo —el último cuadro— existe aunque no siempre lo alcancemos.`,
  },

  // ── CIENCIA FICCIÓN ─────────────────────────────────────────────────────────
  {
    titulo: '1984',
    autor: 'George Orwell',
    categoriaId: cat['Ciencia Ficción'],
    cantidadPaginas: 328,
    contenido: `Era un día luminoso y frío de abril, y los relojes daban las trece. Winston Smith, con la barbilla hundida en el pecho, trataba de escapar del molesto viento, y pasó rápidamente por las puertas de cristal del edificio Victory Mansions. El vestíbulo olía a col hervida y a esteras viejas.

En el fondo del vestíbulo, un cartel de colores vivos cubría la pared. Representaba solo una cara enorme, de más de un metro de ancha: el rostro de un hombre de unos cuarenta y cinco años, con un grueso bigote negro y facciones atractivas y severas. Big Brother te vigila, decía el pie del cartel. En el mundo de Orwell, el lenguaje es un arma, el pasado se reescribe a diario y el amor es un acto de rebeldía. Una advertencia que sigue siendo tan urgente hoy como cuando fue escrita.`,
  },
  {
    titulo: 'Un mundo feliz',
    autor: 'Aldous Huxley',
    categoriaId: cat['Ciencia Ficción'],
    cantidadPaginas: 311,
    contenido: `Un Centro de Incubación y Condicionamiento del Estado Mundial, en Londres: una tarde de verano, el Director de Incubación y Condicionamiento, acompañado de sus estudiantes, les explicaba el proceso mediante el cual los seres humanos eran creados en probetas, clasificados en castas (Alpha, Beta, Gamma, Delta, Epsilon) y condicionados desde antes de nacer para ser felices en el rol que se les había asignado.

En este mundo futuro nadie sufre, nadie envejece visiblemente, nadie está solo. El soma —una droga perfecta sin resaca— resuelve cualquier incomodidad emocional. La pregunta que Huxley plantea es perturbadora: ¿qué precio pagamos cuando eliminamos el sufrimiento? ¿Puede existir la humanidad sin conflicto, sin arte, sin amor verdadero?`,
  },
  {
    titulo: 'Crónicas marcianas',
    autor: 'Ray Bradbury',
    categoriaId: cat['Ciencia Ficción'],
    cantidadPaginas: 268,
    contenido: `Enero de 1999: Cohete de verano. La noche antes del lanzamiento, los hombres de la misión no podían dormir. Yacían en sus catres pensando en el viaje que les esperaba, en las rojas llanuras de Marte, en los canales que los astrónomos habían fotografiado durante cincuenta años. Nadie sabía qué encontrarían. Nadie sabía si los marcianos existían realmente.

Ray Bradbury construye con estas historias interconectadas una elegía a lo que se pierde cuando una civilización conquista a otra. Los marcianos tienen telepatía y sueños de cristal. Los humanos llevan hamburguesas, hot dogs y todas las neurosis del siglo XX. Lo que ocurre en su encuentro dice más de nosotros que de ningún ser alienígena.`,
  },
  {
    titulo: 'Fundación',
    autor: 'Isaac Asimov',
    categoriaId: cat['Ciencia Ficción'],
    cantidadPaginas: 244,
    contenido: `El Imperio Galáctico abarca doce millones de planetas habitados y ha existido durante doce mil años. El matemático Hari Seldon, creador de la psicohistoria —ciencia que predice el comportamiento de grandes poblaciones usando ecuaciones estadísticas— ha calculado que el Imperio caerá en los próximos tres siglos y que seguirán treinta mil años de oscuridad y barbarie.

A menos que alguien actúe ahora. Con ese propósito Seldon funda la Fundación: un refugio del conocimiento humano en el extremo más apartado de la galaxia. Pero los planes de Seldon están llenos de variables que ni él mismo contempló. Fundación es la base de uno de los edificios narrativos más ambiciosos de la ciencia ficción.`,
  },
  {
    titulo: 'El marciano',
    autor: 'Andy Weir',
    categoriaId: cat['Ciencia Ficción'],
    cantidadPaginas: 369,
    contenido: `Día 6. Estoy jodido. Para que conste en el registro, en caso de que alguien lo encuentre algún día: estoy atrapado en Marte. Soy el único ser humano en este planeta. Mi nave se fue. Mis compañeros creen que estoy muerto. Tengo comida para quizás 300 días marcianos. La siguiente misión a Marte llega en cuatro años.

Mark Watney, botánico y astronauta, tiene que resolver un problema cada vez más complicado con ingenio, ciencia y un sentido del humor que nunca pierde. El marciano es una oda a la resolución de problemas, a la física, a la química, y a la obstinada negativa del ser humano a rendirse ante lo inevitable.`,
  },

  // ── TERROR ──────────────────────────────────────────────────────────────────
  {
    titulo: 'It',
    autor: 'Stephen King',
    categoriaId: cat['Terror'],
    cantidadPaginas: 1138,
    contenido: `El verano de 1958, en Derry, Maine, algo asesinó a Georgie Denbrough. Era un niño de seis años que perseguía un barco de papel por las alcantarillas bajo la lluvia de octubre cuando una mano salió de la oscuridad. Los adultos de Derry prefirieron no verlo, no hablar de ello. Pero un grupo de niños que se llamaban a sí mismos el Club de los Perdedores supieron la verdad: algo muy antiguo y muy hambrienta vivía debajo de la ciudad.

Treinta años después, los que sobrevivieron del Club reciben una llamada. Han olvidado casi todo de ese verano, pero el olvido ha llegado a su fin. Stephen King construye con It un retrato devastador del miedo infantil y de la memoria que traicionamos para seguir viviendo.`,
  },
  {
    titulo: 'El resplandor',
    autor: 'Stephen King',
    categoriaId: cat['Terror'],
    cantidadPaginas: 447,
    contenido: `Jack Torrance era escritor, exprofesor de literatura y alcohólico en recuperación. El trabajo de cuidador de invierno en el hotel Overlook, a cuatro mil metros de altura en las montañas de Colorado, era exactamente lo que necesitaba: soledad, silencio, tiempo para escribir. Llevó a su esposa Wendy y a su hijo Danny, que tenía un don que los mayores no entendían: el resplandor.

El hotel Overlook llevaba décadas absorbiendo el mal de sus huéspedes como una esponja. Cuando llegó el invierno y cortó todos los caminos, el hotel empezó a despertar. King explora con maestría la degradación de un hombre bueno, el horror de la familia como trampa, y la lealtad imposible de un hijo hacia un padre que lo destruye.`,
  },
  {
    titulo: 'Drácula',
    autor: 'Bram Stoker',
    categoriaId: cat['Terror'],
    cantidadPaginas: 418,
    contenido: `3 de mayo. Bistritz. Partí de Munich a las 8:35 de la noche del primero de mayo, llegando a Viena temprano a la mañana siguiente. Tomé el tren para Klausenburg donde pasé la noche en el Hotel Royale. Tengo poca memoria de ella pues dormí profundamente hasta la mañana. El propietario del hotel, al leer el nombre de mi destino en mi itinerario, hizo todos los esfuerzos posibles por disuadirme de continuar el viaje.

Así comienza el diario de Jonathan Harker, abogado inglés enviado al castillo del conde Drácula en los Cárpatos. Lo que empieza como un viaje de negocios se convierte en la pesadilla que definió para siempre la figura del vampiro en la literatura occidental.`,
  },

  // ── ROMANCE ─────────────────────────────────────────────────────────────────
  {
    titulo: 'Orgullo y prejuicio',
    autor: 'Jane Austen',
    categoriaId: cat['Romance'],
    cantidadPaginas: 432,
    contenido: `Es una verdad universalmente reconocida que un hombre soltero, poseedor de una gran fortuna, necesita una esposa. Sin embargo, poco se sabe de los sentimientos u opiniones de tal hombre cuando hace su primera entrada en el vecindario; esta verdad es tan arraigada en la mente de las familias con hijas, que dicho hombre es considerado propiedad legítima de alguna de ellas.

Elizabeth Bennet es la segunda de cinco hermanas en una familia sin fortuna. El señor Darcy es rico, orgulloso y parece incapaz de la amabilidad más básica. Pero entre ellos hay algo que ninguno sabe reconocer aún. Austen construye con ironía y precisión quirúrgica una de las historias de amor más perfectas de la literatura inglesa.`,
  },
  {
    titulo: 'Cumbres borrascosas',
    autor: 'Emily Brontë',
    categoriaId: cat['Romance'],
    cantidadPaginas: 337,
    contenido: `1801. Acabo de volver de una visita a mi arrendatario, el solitario dueño de esta región. Cumbres Borrascosas es el nombre de la residencia de Heathcliff. Es una palabra del dialecto local que significa tumulto atmosférico. Efectivamente, el lugar está expuesto a las tormentas del norte en toda su fuerza.

Heathcliff llegó de niño a Cumbres Borrascosas, traído por el señor Earnshaw como un expolio de las calles de Liverpool. Desde ese día, su amor por Catherine Earnshaw y el odio de su hijo Hindley tejieron una trama de pasión y venganza que se extendería a dos generaciones. El amor de Heathcliff y Cathy es puro, salvaje e imposible: existe más allá de la muerte.`,
  },
  {
    titulo: 'El cuaderno de Noah',
    autor: 'Nicholas Sparks',
    categoriaId: cat['Romance'],
    cantidadPaginas: 214,
    contenido: `Era una tarde de otoño cuando Noah Calhoun vio por primera vez a Allie Nelson en un carnaval del pueblo de New Bern, Carolina del Norte. Ella tenía diecisiete años y era todo lo que él no era: rica, refinada, destinada a una universidad del norte y a un futuro ya trazado. Él era hijo de un carpintero y leía a Whitman en su tiempo libre.

Ese verano ocurrió algo que ninguno de los dos pudo prever: se enamoraron con la intensidad desmedida de quienes todavía no saben que el mundo puede separar a las personas que se quieren. Años después, un cuaderno escrito con letra temblorosa empieza a leer una historia que Allie ha olvidado.`,
  },
  {
    titulo: 'Bajo la misma estrella',
    autor: 'John Green',
    categoriaId: cat['Romance'],
    cantidadPaginas: 313,
    contenido: `Hazel Grace Lancaster tiene dieciséis años y cáncer de pulmón. Lleva un tanque de oxígeno portátil a donde va y pasa los días leyendo Un dolor imperial, novela favorita de su autora favorita. En un grupo de apoyo para jóvenes con cáncer conoce a Augustus Waters, que perdió una pierna al osteosarcoma y tiene una metáfora: un cigarrillo entre los dientes que nunca enciende.

Hazel y Augustus comienzan a escribirse, a leer juntos, a imaginar un viaje a Ámsterdam para conocer al autor ermitaño de ese libro que los obsesiona. Green escribe sobre el amor y la muerte con una honestidad que muy pocas novelas juveniles se permiten.`,
  },

  // ── HISTORIA ────────────────────────────────────────────────────────────────
  {
    titulo: 'Sapiens: De animales a dioses',
    autor: 'Yuval Noah Harari',
    categoriaId: cat['Historia'],
    cantidadPaginas: 443,
    contenido: `Hace cien mil años, al menos seis especies de seres humanos habitaban la Tierra. Hoy solo queda una. Nosotros. Homo sapiens. ¿Cómo llegamos a dominar el planeta? ¿Qué nos hizo capaces de construir ciudades y enviar cohetes al espacio, pero también de cometer genocidios y destruir ecosistemas enteros?

Harari responde estas preguntas con una narrativa que atraviesa la prehistoria, la revolución agrícola, el surgimiento de los imperios, las religiones, el capitalismo y la ciencia. Sapiens es un libro que obliga a repensar casi todo lo que creemos saber sobre nuestra especie y sobre el lugar que ocupamos en este planeta.`,
  },
  {
    titulo: 'El nombre de la rosa',
    autor: 'Umberto Eco',
    categoriaId: cat['Historia'],
    cantidadPaginas: 502,
    contenido: `Era una mañana hermosa al final de noviembre cuando llegamos a la abadía. La nieve reciente cubría la cima de la montaña como una sábana y el frío era tan intenso que daba la impresión de que el aire mismo podría romperse como vidrio. El novicio Adso de Melk seguía a su maestro Guillermo de Baskerville, fraile franciscano de aguda inteligencia, comisionado para resolver una serie de muertes misteriosas en un monasterio benedictino.

La biblioteca del monasterio guarda un secreto que alguien quiere mantener oculto a cualquier precio. Eco entreteje teología medieval, filosofía, semiología y un thriller de suspenso en un laberinto narrativo que es imposible de soltar.`,
  },
  {
    titulo: 'Breve historia del tiempo',
    autor: 'Stephen Hawking',
    categoriaId: cat['Historia'],
    cantidadPaginas: 212,
    contenido: `Un conocido científico (algunos dicen que fue Bertrand Russell) dio una vez una conferencia pública sobre astronomía. Describió cómo la Tierra orbita alrededor del sol y cómo el sol, a su vez, orbita alrededor del centro de una vasta colección de estrellas llamada galaxia. Al final de la conferencia, una anciana al fondo de la sala se levantó y dijo: Lo que ha dicho es una sandez. El mundo es una plataforma plana sostenida en el lomo de una tortuga gigante.

Hawking responde a esa anciana con todo el poder de la física moderna. Desde el Big Bang hasta los agujeros negros, desde la relatividad hasta la mecánica cuántica, esta obra hace comprensible lo más profundo del cosmos.`,
  },

  // ── FANTASÍA ────────────────────────────────────────────────────────────────
  {
    titulo: 'El señor de los anillos: La comunidad del anillo',
    autor: 'J.R.R. Tolkien',
    categoriaId: cat['Fantasía'],
    cantidadPaginas: 531,
    contenido: `Cuando Bilbo Bolsón celebró su cumpleaños número ciento once y desapareció de La Comarca, su sobrino Frodo heredó una casa, algunos muebles, y un anillo dorado que parecía absolutamente ordinario. Gandalf el Gris sabía que no lo era. Ese anillo había sido forjado en el Monte del Destino por el Señor Oscuro Sauron, quien había puesto en él parte de su propia voluntad de dominio.

Frodo debe emprender un viaje que lo llevará de La Comarca pacífica hasta los rincones más oscuros de la Tierra Media. Tolkien creó con esta obra no solo una historia sino un mundo completo: con sus lenguas, su historia, su geografía y su mitología propia.`,
  },
  {
    titulo: 'Harry Potter y la piedra filosofal',
    autor: 'J.K. Rowling',
    categoriaId: cat['Fantasía'],
    cantidadPaginas: 309,
    contenido: `El señor y la señora Dursley, de Privet Drive número 4, podían decir con orgullo que eran muy normales, muy aburridos, muchísimas gracias. Eran las últimas personas del mundo a las que esperaría encontrar mezcladas en algo raro o misterioso, porque sencillamente no aguantaban ese tipo de cosas.

Harry Potter tenía once años y creía ser un niño completamente ordinario cuando una carta dirigida a él llegó al 4 de Privet Drive. No sabía que era un mago, que su nombre era conocido en un mundo que él no conocía, y que una cicatriz en su frente tenía forma de rayo por una razón. La historia de Rowling redefinió la fantasía juvenil para toda una generación.`,
  },
  {
    titulo: 'Canción de hielo y fuego: Juego de tronos',
    autor: 'George R.R. Martin',
    categoriaId: cat['Fantasía'],
    cantidadPaginas: 694,
    contenido: `Cuando el verano lleva nueve años y el invierno puede durar una generación, la lucha por el Trono de Hierro que une a los Siete Reinos de Westeros puede esperar. Pero los Stark de Invernalia conocen una verdad: el invierno se acerca. Y del norte, más allá del Muro, algo peor que el invierno comienza a moverse.

Martin construye una epopeya medieval donde ningún personaje está a salvo, donde los héroes mueren y los villanos tienen razones, y donde el poder corrupto tiene consecuencias reales. Juego de tronos es un estudio brutal y fascinante sobre la política, la lealtad y el precio del honor.`,
  },

  // ── MISTERIO ────────────────────────────────────────────────────────────────
  {
    titulo: 'Asesinato en el Orient Express',
    autor: 'Agatha Christie',
    categoriaId: cat['Misterio'],
    cantidadPaginas: 274,
    contenido: `El Orient Express salió de Estambul con su carga habitual de pasajeros de distintas nacionalidades. Hercule Poirot, el famoso detective belga, viajaba en él de regreso a Londres. Era invierno y la nieve caía sobre los Balcanes cuando el tren quedó completamente detenido en un ventisquero. A la mañana siguiente, uno de los pasajeros apareció muerto en su compartimento, con doce puñaladas.

Ningún extraño había subido o bajado del tren. El asesino era uno de los doce pasajeros. Poirot debía encontrarlo antes de que la policía local llegara. Christie diseña aquí uno de los puzzles más ingeniosos de la literatura policial, con un giro final que revolucionó el género.`,
  },
  {
    titulo: 'El perro de los Baskerville',
    autor: 'Arthur Conan Doyle',
    categoriaId: cat['Misterio'],
    cantidadPaginas: 256,
    contenido: `La leyenda de los Baskerville habla de un enorme perro infernal que acosó a Hugo Baskerville hace dos siglos después de que este cometió un crimen brutal en el páramo de Dartmoor. Desde entonces, una maldición cae sobre los herederos de la familia. Cuando Sir Charles Baskerville muere de un aparente ataque al corazón, con la expresión del terror en su rostro y las huellas de un perro gigante en el barro, Sherlock Holmes y el doctor Watson son llamados a investigar.

Conan Doyle utiliza el páramo brumoso de Dartmoor como un personaje más: un lugar donde la razón parece insuficiente y donde lo sobrenatural acecha en cada niebla. Pero Holmes no cree en lo sobrenatural.`,
  },
  {
    titulo: 'Millenium: Los hombres que no amaban a las mujeres',
    autor: 'Stieg Larsson',
    categoriaId: cat['Misterio'],
    cantidadPaginas: 533,
    contenido: `Desde hace cuarenta años, Henrik Vanger recibe cada cumpleaños una flor enmarcada: el mismo regalo que le hacía su sobrina niña Harriet antes de desaparecer en 1966 sin dejar rastro en la isla familiar de Hedeby. Cuando contrata al periodista Mikael Blomkvist para investigar el caso, no espera que lo ayude una investigadora privada llamada Lisbeth Salander: una joven con piercings, memoria fotográfica y una historia personal que ella misma preferiría no recordar.

Larsson construye una novela de misterio que es también una denuncia feroz de la violencia de género en la sociedad sueca y una galería de secretos familiares enterrados bajo décadas de silencio.`,
  },

  // ── AUTOAYUDA ───────────────────────────────────────────────────────────────
  {
    titulo: 'El poder del ahora',
    autor: 'Eckhart Tolle',
    categoriaId: cat['Autoayuda'],
    cantidadPaginas: 229,
    contenido: `No soy mis pensamientos, emociones, percepciones sensoriales ni experiencias. No soy el contenido de mi vida. Soy el Espacio de la Consciencia en el que todas esas cosas ocurren. Soy el Presente. Yo Soy.

Eckhart Tolle sufrió durante años una depresión severa hasta que una noche, a los veintinueve años, algo cambió en él. Comenzó a observar sus pensamientos en lugar de ser sus pensamientos. El poder del ahora es el resultado de esa transformación: una guía práctica para vivir en el momento presente, liberarse del sufrimiento generado por la mente y encontrar la paz interior que no depende de las circunstancias externas.`,
  },
  {
    titulo: 'Los siete hábitos de la gente altamente efectiva',
    autor: 'Stephen R. Covey',
    categoriaId: cat['Autoayuda'],
    cantidadPaginas: 358,
    contenido: `Hay principios que gobiernan la efectividad humana como las leyes de la física gobiernan el universo material. Son verdades profundas y fundamentales de aplicación universal. No cambian. Se aplican a individuos, matrimonios, familias, organizaciones privadas y públicas.

Los siete hábitos que Covey presenta no son una colección de trucos de motivación ni técnicas de rendimiento. Son un enfoque basado en el carácter, en la ética, en la comprensión profunda de que ser efectivo no significa hacer más cosas sino hacer las cosas correctas y construir relaciones basadas en la confianza mutua.`,
  },

  // ── CLÁSICOS ────────────────────────────────────────────────────────────────
  {
    titulo: 'Don Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
    categoriaId: cat['Clásicos'],
    cantidadPaginas: 1023,
    contenido: `En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.

Alonso Quijano leyó tanto sobre caballeros andantes que perdió el juicio y decidió convertirse en uno. Tomó el nombre de Don Quijote de la Mancha, armó su viejo caballo Rocinante y salió al mundo a desfacer entuertos acompañado por el fiel Sancho Panza. Cervantes escribió la primera novela moderna y la más leída en lengua española de todos los tiempos.`,
  },
  {
    titulo: 'Crimen y castigo',
    autor: 'Fiódor Dostoievski',
    categoriaId: cat['Clásicos'],
    cantidadPaginas: 671,
    contenido: `Rodión Romanovich Raskolnikov era un ex estudiante de derecho en San Petersburgo, pobre hasta la miseria, que había dejado de ir a la universidad por no poder pagar la matrícula. Vivía en una buhardilla tan pequeña que parecía un ataúd y se alimentaba apenas. Tenía una idea que lo consumía desde hacía meses: ¿tienen los hombres extraordinarios el derecho de traspasar los límites de la moral común si su fin es suficientemente grande?

Para probar su teoría, planeó matar a una vieja usurera. Dostoievski no cuenta el crimen como un thriller: lo cuenta como una disección del alma humana. El verdadero castigo no viene del Estado sino de la conciencia.`,
  },
  {
    titulo: 'Madame Bovary',
    autor: 'Gustave Flaubert',
    categoriaId: cat['Clásicos'],
    cantidadPaginas: 412,
    contenido: `Emma Rouault se casó con el médico rural Charles Bovary creyendo que el matrimonio la salvaría del aburrimiento de la vida campesina en Normandía. Había leído demasiadas novelas románticas. Esperaba pasión, aventura, refinamiento, los bailes de la aristocracia que había atisbado una vez en el castillo de Vaubyessard. Lo que encontró fue un marido bueno pero mediocre, deudas crecientes y la asfixia de una vida que nunca fue la que ella soñó.

Flaubert creó en Emma Bovary uno de los retratos más complejos y controvertidos de la literatura del siglo XIX: una mujer que busca escapar de su mundo pero que lleva dentro el germen de su propia destrucción.`,
  },

  // ── AVENTURA ────────────────────────────────────────────────────────────────
  {
    titulo: 'La isla del tesoro',
    autor: 'Robert Louis Stevenson',
    categoriaId: cat['Aventura'],
    cantidadPaginas: 292,
    contenido: `Squire Trelawney, el doctor Livesey y los demás caballeros me han pedido que escriba todo sobre la Isla del Tesoro, desde el principio hasta el final, sin omitir nada excepto la posición geográfica de la isla; y eso sólo porque todavía hay allí riqueza sin rescatar. Así que tomo la pluma en el año de gracia 17__, y vuelvo a la época en que mi padre tenía la posada del Almirante Benbow.

Jim Hawkins tenía doce años cuando el viejo marinero Billy Bones llegó a la posada de su padre con un mapa y un secreto que costó muchas vidas. El mapa marcaba el lugar donde el pirata Flint había enterrado quince años de saqueos. La aventura que siguió definió para siempre el género de piratas y tesoros escondidos.`,
  },
  {
    titulo: 'Veinte mil leguas de viaje submarino',
    autor: 'Julio Verne',
    categoriaId: cat['Aventura'],
    cantidadPaginas: 338,
    contenido: `El año 1866 fue señalado por un acontecimiento extraño, inexplicable e inexplicado hasta hoy. Varios buques habían encontrado en el mar un objeto enorme, fusiforme y a veces fosforescente, muy superior en tamaño y rapidez de movimientos a una ballena. Los hechos consignados en los diferentes cuadernos de bitácora coincidían en la forma del objeto, su velocidad prodigiosa y la potencia motriz que parecía ser el origen de sus movimientos.

El profesor Aronnax, naturalista del Museo de Historia Natural de París, embarca en la expedición enviada a cazar al monstruo. Lo que encuentra no es ninguna bestia: es el Nautilus, el submarino del enigmático capitán Nemo. Verne imaginó la exploración submarina un siglo antes de que fuera posible.`,
  },
  {
    titulo: 'Las aventuras de Tom Sawyer',
    autor: 'Mark Twain',
    categoriaId: cat['Aventura'],
    cantidadPaginas: 274,
    contenido: `¡Tom! No hubo respuesta. ¡Tom! No hubo respuesta. ¿Qué le habrá pasado a ese chico? La señora Polly bajó sus anteojos y miró sobre ellos por encima del cuarto, luego los subió y miró por abajo. Rara vez los usaba para algo tan trivial como buscar a un chico; eran su par de ceremonia, el orgullo de su corazón, adoptados más por distinción que para usarlos.

Tom Sawyer tiene once años y vive en el pueblo de St. Petersburg, a orillas del Mississippi. Le encanta hacer travesuras, escaparse a nadar, conquistar chicas y evitar a toda costa ir a la escuela. Pero la noche que él y su amigo Huck Finn fueron al cementerio a probar un remedio para las verrugas, vieron algo que no debían ver.`,
  },
];

// ─── Insertar libros ──────────────────────────────────────────────────────────

let creados = 0;
for (const libro of libros) {
  const id = await crearLibro(libro);
  console.log(`  ✅  "${libro.titulo}" — ${libro.autor} (${id})`);
  creados++;
}

console.log('\n' + '━'.repeat(52));
console.log(`\n✔  ${creados} libros insertados correctamente.`);
console.log(`   Categorías usadas: ${Object.keys(cat).join(', ')}\n`);
process.exit(0);
