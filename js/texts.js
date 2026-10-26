// Practice texts grouped by mode. All texts are original and safe to ship offline.
export const TEXTS = {
  es: [
    'La práctica diaria convierte la mecanografía en un hábito natural. Diez minutos al día bastan para notar el cambio en pocas semanas.',
    '¿Sabías que la letra ñ está a la derecha de la L en el teclado español? Pulsa con el meñique derecho y vuelve a la fila guía.',
    'El secreto no es la velocidad, sino la precisión. Cuando dejas de mirar el teclado, la velocidad llega sola.',
    '¡Qué alegría escribir sin mirar! Los dedos encuentran cada tecla como si conocieran el camino de memoria.',
    'Mantén la espalda recta, los hombros relajados y las muñecas ligeramente elevadas. La postura también forma parte del aprendizaje.',
    'En la fila guía descansan los dedos: A, S, D y F para la mano izquierda; J, K, L y Ñ para la derecha.',
    'Escribir bien en español exige dominar las tildes: canción, árbol, también, después, último y corazón.',
    'El otoño llegó con hojas doradas, café caliente y largas tardes de lectura junto a la ventana.',
    'Un buen mecanógrafo respira con calma, corrige con paciencia y celebra cada pequeño progreso.',
    'La biblioteca del barrio abre a las nueve. Allí estudian jóvenes, jubilados y algún que otro pingüino de peluche.',
    'Cuando el árbitro pitó el final, la grada entera se levantó: ¡había sido un partido inolvidable!',
    'Programar, redactar correos o tomar apuntes: escribir rápido y sin errores ahorra horas cada semana.',
    'El cigüeñal, la pingüinera y el vergüenzómetro son palabras raras, pero excelentes para practicar la diéresis.',
    'Mañana por la mañana iremos al mercado a comprar piña, jamón, queso manchego y pan recién horneado.',
    'No hay atajos: cada pulsación correcta construye la memoria muscular que te hará escribir sin pensar.'
  ],
  kids_es: [
    'El gato duerme en la cama.',
    'Mi perro juega con la pelota.',
    'La luna sale de noche.',
    'Me gusta comer fruta.',
    'El sol es grande y brilla.',
    'Mamá lee un cuento.',
    'Los peces nadan en el mar.',
    'Tengo un lápiz azul.',
    'El niño salta muy alto.',
    'La rana vive en el lago.',
    'Hoy vamos al parque.',
    'Mi amigo se llama Tomás.'
  ],
  kids_en: [
    'The cat sleeps on the bed.',
    'My dog plays with a ball.',
    'The moon comes out at night.',
    'I like to eat fruit.',
    'The sun is big and bright.',
    'Fish swim in the sea.',
    'I have a blue pencil.',
    'We go to the park today.'
  ],
  kids_ca: [
    'El gat dorm al llit.',
    'El meu gos juga amb la pilota.',
    'La lluna surt de nit.',
    'M\'agrada menjar fruita.',
    'El sol és gran i brilla.',
    'Els peixos neden al mar.',
    'Tinc un llapis blau.',
    'Avui anem al parc.'
  ],
  en: [
    'Daily practice turns touch typing into a natural habit. Ten minutes a day is enough to notice real progress within a few weeks.',
    'Accuracy comes first. Once you stop looking at the keyboard, speed follows on its own.',
    'Keep your back straight, shoulders relaxed and wrists slightly raised. Good posture is part of learning to type.',
    'Your fingers rest on the home row: A, S, D and F for the left hand; J, K, L and the semicolon for the right.',
    'A quick brown fox jumps over the lazy dog while the typist smiles and keeps a steady rhythm.',
    'Writing emails, code or notes faster and without mistakes saves hours every single week.',
    'Breathe calmly, correct patiently and celebrate every small improvement on your way to mastery.',
    'The library opens at nine. Students, retirees and the occasional stuffed penguin gather there to read.'
  ],
  ca: [
    'La pràctica diària converteix la mecanografia en un hàbit natural. Deu minuts al dia són suficients per notar el canvi.',
    'El secret no és la velocitat, sinó la precisió. Quan deixes de mirar el teclat, la velocitat arriba sola.',
    'Mantén l\'esquena recta, les espatlles relaxades i els canells lleugerament elevats.',
    'A la tardor, les fulles cauen dels arbres i els carrers s\'omplen de colors càlids.',
    'Escriure bé en català vol dir dominar els accents: cançó, també, després, això i força.',
    'La biblioteca del barri obre a les nou. Hi estudien joves, jubilats i algun pingüí de peluix.'
  ]
};

// "Sin tildes" mode: strip diacritics and Spanish-only punctuation.
export function stripAccents(text) {
  // Keep ñ/Ñ: it is a letter, not an accent.
  return text
    .replace(/ñ/g, '\u0001').replace(/Ñ/g, '\u0002')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿¡]/g, '')
    .replace(/\u0001/g, 'ñ').replace(/\u0002/g, 'Ñ');
}
