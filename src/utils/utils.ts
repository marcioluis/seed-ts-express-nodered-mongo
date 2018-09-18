import * as crypto from 'crypto';
import * as _ from 'lodash';

const UNMISTAKABLE_CHARS = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
export const DISCARD_WORDS = [
	'ante', 'apos', 'ate', 'com', 'conforme', 'contra',
	'consoante', 'desde', 'durante', 'exceto', 'entre',
	'mediante ', 'para', 'perante', 'por', 'salvo', 'sem',
	'sob', 'sobre', 'tras', 'uma', 'uns', 'umas', 'aos',
	'dos', 'das', 'dum', 'duma', 'duns', 'dumas', 'nos',
	'nas', 'num', 'numa', 'nuns', 'numas', 'pelo', 'pela',
	'pelos', 'pelas'
];

export class Utils {

	public static stringify(o: object) {
		const cache: any[] = [];
		return JSON.stringify(
			o,
			(key, value) => {
				if (typeof value === 'object' && value !== null) {
					if (cache.indexOf(value) !== -1) {
						return;
					}
					cache.push(value);
				}
				return value;
			},
			2
		);
	}

	public static generateId() {
		const id = [];
		for (let i = 0; i < 17; i++) {
			let bytes: string;
			try {
				bytes = crypto.randomBytes(4).toString('hex').substring(0, 8);
			} catch (e) {
				bytes = crypto.pseudoRandomBytes(4).toString('hex').substring(0, 8);
			}
			const random = parseInt(bytes, 16) * 2.3283064365386963e-10; // 2^-32
			const index = Math.floor(random * UNMISTAKABLE_CHARS.length);
			id.push(UNMISTAKABLE_CHARS.substr(index, 1));
		}
		return id.join('');
	}

	public static cleanup(phrase: string) {
		return _.join(
			_.map(
				_.split(phrase, ' '), (w, i) => {
					if ((_.size(w) > 3 || i === 0) && !_.includes(DISCARD_WORDS, _.lowerCase(w))) {
						return _.capitalize(w);
					} else {
						return _.lowerCase(w);
					}
				}), ' ');
	}

}
