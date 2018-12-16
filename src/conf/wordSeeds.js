const ACCENTS = ['*é*', '*è*', '*ê*', '*ë*', '*â*', '*ï*']; // conf
const RARE_ACCENTS = ['*á*', '*å*', '*ë*', '*â*', '*í*', '*ö*', '*ó*', '*ü*', '*ú*'];

const THINGS = [
    'cow', 'vegetables', 'car', 'tree', 'cat', 'zebra', 'book', 'bread', 'shoes', 'belt', 'helmet',
    'bulb', 'potato', 'rock', 'door', 'key', 'plane', 'letter', 'sand', 'fire', 'alarm', 'dice',
    'water', 'art', 'song', 'radio', 'pot', 'dishes', 'camera', 'flower', 'sock', 'animal',
];

const PLACES = [
    'dungeon', 'coast', 'town', 'house', 'garden', 'earth', 'stairs', 'island', 'space', 'place',
    'outside', 'station', 'market', 'cinema', 'tower', 'parking', 'jungle',
];

const IDEAS = [
    'effect', 'officer', 'king', 'hour', 'idea', 'economy', 'customer', 'power', 'walk', 'think',
    'eat', 'way', 'take', 'through', 'inside', 'deal', 'cast', 'hard', 'hunger', 'liberty', 'very',
    'when', 'for', 'eleven', 'habit', 'daily', 'travel', 'artist', 'butcher',
];

const THINGS_FR = [
    'salade', 'voiture', 'chat', 'pain', 'ceinture', 'livre', 'ballon', 'drogue', 'truc',
    'clé', 'ampoule', 'chanson', 'télé', 'lettre', 'sable', 'feu', 'alarme', 'eau', 'tasse',
    'fleur', 'table', 'pate', 'bague', 'sac', 'riz', 'vache',
];

const OTHERS_FR = [
    'tombe', 'porte', 'marché', 'travers', 'dur', 'terre', 'rire', 'trop', 'jour', 'dix', 'faim',
    'route', 'alors', 'zip', 'troupe', 'ville', 'bouton', 'test', 'filet', 'régler', 'nouveau',
    'os', 'pied', 'poisson',
];

const EMERGENCY = [...THINGS, ...IDEAS];

export default {
    accents() {
        return ACCENTS;
    },
    rareAccents() {
        return RARE_ACCENTS;
    },
    things() {
        return THINGS;
    },
    places() {
        return PLACES;
    },
    ideas() {
        return IDEAS;
    },
    thingsFr() {
        return THINGS_FR;
    },
    othersFr() {
        return OTHERS_FR;
    },
    emergency() {
        return EMERGENCY;
    },
};
