export const STRINGS = {
  es: {
    tagline: 'Práctica de mecanografía en español',
    practice: 'Práctica',
    test: 'Test 1 min',
    kids: 'Niños',
    noAccents: 'Sin tildes',
    stats: 'Estadísticas',
    help: 'Ayuda',
    wpm: 'PPM',
    accuracy: 'Precisión',
    time: 'Tiempo',
    level: 'Nivel',
    restart: 'Reiniciar',
    newText: 'Nuevo texto',
    hint: 'Empieza a escribir el texto. Pulsa Tab para reiniciar.',
    keyboard: 'Teclado',
    done: '¡Terminado!',
    resultLine: (w, a) => `${w} PPM con ${a}% de precisión.`,
    best: 'Mejor PPM',
    avg: 'Media PPM',
    sessions: 'Sesiones',
    history: 'Últimas sesiones',
    reset: 'Borrar estadísticas',
    confirmReset: '¿Borrar todas las estadísticas guardadas en este dispositivo?',
    empty: 'Aún no hay sesiones. ¡Completa un texto para empezar!',
    levels: ['Principiante', 'Básico', 'Intermedio', 'Avanzado', 'Experto'],
    theme: 'Cambiar tema',
    language: 'Idioma',
    install: 'Instalar app',
    offline: 'Sin conexión: la app sigue funcionando.',
    updated: 'Nueva versión disponible.',
    reload: 'Actualizar',
    helpTitle: 'Cómo practicar',
    helpBody: [
      'Coloca los dedos en la fila guía: A S D F con la mano izquierda y J K L Ñ con la derecha. Las teclas F y J tienen un relieve para encontrarlas sin mirar.',
      'Cada color del teclado indica qué dedo debe pulsar la tecla. La tecla resaltada es la siguiente que debes escribir.',
      'Para las tildes, pulsa primero la tecla ´ (a la derecha de la Ñ) y después la vocal. Para la diéresis, Mayús + ´.',
      'Prioriza la precisión. La velocidad llega con la práctica diaria: diez minutos al día son suficientes.',
      'Tus resultados se guardan solo en este dispositivo. La app funciona sin conexión.'
    ],
    close: 'Cerrar',
    about: 'Acerca de',
    privacy: 'Privacidad'
  },
  en: {
    tagline: 'Touch typing practice',
    practice: 'Practice',
    test: '1 min test',
    kids: 'Kids',
    noAccents: 'No accents',
    stats: 'Statistics',
    help: 'Help',
    wpm: 'WPM',
    accuracy: 'Accuracy',
    time: 'Time',
    level: 'Level',
    restart: 'Restart',
    newText: 'New text',
    hint: 'Start typing the text. Press Tab to restart.',
    keyboard: 'Keyboard',
    done: 'Finished!',
    resultLine: (w, a) => `${w} WPM at ${a}% accuracy.`,
    best: 'Best WPM',
    avg: 'Average WPM',
    sessions: 'Sessions',
    history: 'Recent sessions',
    reset: 'Clear statistics',
    confirmReset: 'Clear all statistics saved on this device?',
    empty: 'No sessions yet. Finish a text to get started!',
    levels: ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'],
    theme: 'Toggle theme',
    language: 'Language',
    install: 'Install app',
    offline: 'Offline: the app keeps working.',
    updated: 'A new version is available.',
    reload: 'Update',
    helpTitle: 'How to practice',
    helpBody: [
      'Rest your fingers on the home row: A S D F with the left hand and J K L ; with the right. The F and J keys have a bump so you can find them without looking.',
      'Each keyboard colour shows which finger presses the key. The highlighted key is the next one to type.',
      'Focus on accuracy first. Speed comes with daily practice: ten minutes a day is enough.',
      'Your results are stored only on this device. The app works offline.'
    ],
    close: 'Close',
    about: 'About',
    privacy: 'Privacy'
  },
  ca: {
    tagline: 'Pràctica de mecanografia',
    practice: 'Pràctica',
    test: 'Test 1 min',
    kids: 'Infants',
    noAccents: 'Sense accents',
    stats: 'Estadístiques',
    help: 'Ajuda',
    wpm: 'PPM',
    accuracy: 'Precisió',
    time: 'Temps',
    level: 'Nivell',
    restart: 'Reinicia',
    newText: 'Text nou',
    hint: 'Comença a escriure el text. Prem Tab per reiniciar.',
    keyboard: 'Teclat',
    done: 'Acabat!',
    resultLine: (w, a) => `${w} PPM amb un ${a}% de precisió.`,
    best: 'Millor PPM',
    avg: 'Mitjana PPM',
    sessions: 'Sessions',
    history: 'Darreres sessions',
    reset: 'Esborra les estadístiques',
    confirmReset: 'Vols esborrar totes les estadístiques d\'aquest dispositiu?',
    empty: 'Encara no hi ha sessions. Completa un text per començar!',
    levels: ['Principiant', 'Bàsic', 'Intermedi', 'Avançat', 'Expert'],
    theme: 'Canvia el tema',
    language: 'Idioma',
    install: 'Instal·la l\'app',
    offline: 'Sense connexió: l\'app continua funcionant.',
    updated: 'Hi ha una versió nova.',
    reload: 'Actualitza',
    helpTitle: 'Com practicar',
    helpBody: [
      'Col·loca els dits a la fila guia: A S D F amb la mà esquerra i J K L Ñ amb la dreta.',
      'Cada color del teclat indica quin dit ha de prémer la tecla. La tecla ressaltada és la següent.',
      'Per als accents, prem primer la tecla d\'accent i després la vocal.',
      'Prioritza la precisió. La velocitat arriba amb la pràctica diària.',
      'Els resultats es desen només en aquest dispositiu. L\'app funciona sense connexió.'
    ],
    close: 'Tanca',
    about: 'Quant a',
    privacy: 'Privadesa'
  }
};

export function detectLang() {
  const saved = safeGet('mi.lang');
  if (saved && STRINGS[saved]) return saved;
  const nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
  return STRINGS[nav] ? nav : 'es';
}

export function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}
