// On-screen keyboard layouts with finger assignment.
// Each key: [base, shifted, finger]. Fingers: lp lr lm li ri rm rr rp th (thumb).
const ES = [
  [['º', 'ª', 'lp'], ['1', '!', 'lp'], ['2', '"', 'lr'], ['3', '·', 'lm'], ['4', '$', 'li'], ['5', '%', 'li'],
   ['6', '&', 'ri'], ['7', '/', 'ri'], ['8', '(', 'rm'], ['9', ')', 'rr'], ['0', '=', 'rp'], ["'", '?', 'rp'], ['¡', '¿', 'rp']],
  [['q', 'Q', 'lp'], ['w', 'W', 'lr'], ['e', 'E', 'lm'], ['r', 'R', 'li'], ['t', 'T', 'li'],
   ['y', 'Y', 'ri'], ['u', 'U', 'ri'], ['i', 'I', 'rm'], ['o', 'O', 'rr'], ['p', 'P', 'rp'], ['`', '^', 'rp'], ['+', '*', 'rp']],
  [['a', 'A', 'lp'], ['s', 'S', 'lr'], ['d', 'D', 'lm'], ['f', 'F', 'li'], ['g', 'G', 'li'],
   ['h', 'H', 'ri'], ['j', 'J', 'ri'], ['k', 'K', 'rm'], ['l', 'L', 'rr'], ['ñ', 'Ñ', 'rp'], ['´', '¨', 'rp'], ['ç', 'Ç', 'rp']],
  [['<', '>', 'lp'], ['z', 'Z', 'lp'], ['x', 'X', 'lr'], ['c', 'C', 'lm'], ['v', 'V', 'li'], ['b', 'B', 'li'],
   ['n', 'N', 'ri'], ['m', 'M', 'ri'], [',', ';', 'rm'], ['.', ':', 'rr'], ['-', '_', 'rp']]
];

const US = [
  [['`', '~', 'lp'], ['1', '!', 'lp'], ['2', '@', 'lr'], ['3', '#', 'lm'], ['4', '$', 'li'], ['5', '%', 'li'],
   ['6', '^', 'ri'], ['7', '&', 'ri'], ['8', '*', 'rm'], ['9', '(', 'rr'], ['0', ')', 'rp'], ['-', '_', 'rp'], ['=', '+', 'rp']],
  [['q', 'Q', 'lp'], ['w', 'W', 'lr'], ['e', 'E', 'lm'], ['r', 'R', 'li'], ['t', 'T', 'li'],
   ['y', 'Y', 'ri'], ['u', 'U', 'ri'], ['i', 'I', 'rm'], ['o', 'O', 'rr'], ['p', 'P', 'rp'], ['[', '{', 'rp'], [']', '}', 'rp']],
  [['a', 'A', 'lp'], ['s', 'S', 'lr'], ['d', 'D', 'lm'], ['f', 'F', 'li'], ['g', 'G', 'li'],
   ['h', 'H', 'ri'], ['j', 'J', 'ri'], ['k', 'K', 'rm'], ['l', 'L', 'rr'], [';', ':', 'rp'], ["'", '"', 'rp']],
  [['z', 'Z', 'lp'], ['x', 'X', 'lr'], ['c', 'C', 'lm'], ['v', 'V', 'li'], ['b', 'B', 'li'],
   ['n', 'N', 'ri'], ['m', 'M', 'ri'], [',', '<', 'rm'], ['.', '>', 'rr'], ['/', '?', 'rp']]
];

export const LAYOUTS = { es: ES, us: US };

const ACUTE = '́';
const DIAERESIS = '̈';
const GRAVE = '̀';

// Returns the list of key ids (and shift side) needed to type `ch` on a layout.
export function keysFor(ch, layoutName) {
  const rows = LAYOUTS[layoutName];
  const find = (c) => {
    for (const row of rows) {
      for (const [base, shifted, finger] of row) {
        if (c === base) return { id: base, shift: false, finger };
        if (c === shifted) return { id: base, shift: true, finger };
      }
    }
    return null;
  };

  if (ch === ' ') return [{ id: 'space', shift: false, finger: 'th' }];
  if (ch === undefined) return [];

  const direct = find(ch);
  if (direct) return [direct];

  // Accented letters on the Spanish layout use a dead key followed by the vowel.
  const [letter, mark] = ch.normalize('NFD');
  const base = find(letter);
  if (!base || !mark || layoutName !== 'es') return base ? [base] : [];
  const dead = mark === ACUTE ? find('´') : mark === DIAERESIS ? find('¨') : mark === GRAVE ? find('`') : null;
  return dead ? [dead, base] : [base];
}

// Left-hand fingers press keys whose shift is on the right, and vice versa.
export function shiftSide(finger) {
  return finger.startsWith('l') ? 'shift-r' : 'shift-l';
}
