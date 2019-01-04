export const ACCENTS = ['*é*', '*è*', '*ê*', '*ë*', '*â*', '*ï*'];
export const RARE_ACCENTS = ['*á*', '*å*', '*ë*', '*â*', '*í*', '*ö*', '*ó*', '*ü*', '*ú*'];

export const THINGS = [
    'cow', 'vegetables', 'car', 'tree', 'cat', 'zebra', 'book', 'bread', 'shoes', 'belt', 'helmet',
    'bulb', 'potato', 'rock', 'door', 'key', 'plane', 'letter', 'sand', 'fire', 'alarm', 'dice',
    'water', 'art', 'song', 'radio', 'pot', 'dishes', 'camera', 'flower', 'sock', 'animal',
];

export const PLACES = [
    'dungeon', 'coast', 'town', 'house', 'garden', 'earth', 'stairs', 'island', 'space', 'place',
    'outside', 'station', 'market', 'cinema', 'tower', 'parking', 'jungle',
];

export const IDEAS = [
    'effect', 'officer', 'king', 'hour', 'idea', 'economy', 'customer', 'power', 'walk', 'think',
    'eat', 'way', 'take', 'through', 'inside', 'deal', 'cast', 'hard', 'hunger', 'liberty', 'very',
    'when', 'for', 'eleven', 'habit', 'daily', 'travel', 'artist', 'butcher',
];

export const THINGS_FR = [
    'salade', 'voiture', 'chat', 'pain', 'ceinture', 'livre', 'ballon', 'drogue', 'truc',
    'clé', 'ampoule', 'chanson', 'télé', 'lettre', 'sable', 'feu', 'alarme', 'eau', 'tasse',
    'fleur', 'table', 'pate', 'bague', 'sac', 'riz', 'vache',
];

export const OTHERS_FR = [
    'tombe', 'porte', 'marché', 'travers', 'dur', 'terre', 'rire', 'trop', 'jour', 'dix', 'faim',
    'route', 'alors', 'zip', 'troupe', 'ville', 'bouton', 'test', 'filet', 'régler', 'nouveau',
    'os', 'pied', 'poisson',
];

export const SPANISH = [
    'ahora', 'porque', 'pero', 'aquí', 'nosotros', 'nuestro', 'nuestra', 'nada', 'sino', 'madrid',
    'barcelona', 'españa', 'eso', 'usted', 'digo', 'luis', 'juan', 'francesca', 'entonces',
];

export const EMERGENCY = [...THINGS, ...PLACES, ...IDEAS];

export const ALL_WORDS = [...ACCENTS, ...RARE_ACCENTS, ...THINGS, ...PLACES, ...IDEAS, ...OTHERS_FR, ...SPANISH];
