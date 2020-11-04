import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
	name: 'sortpipe',
	pure: false
})
@Injectable()
export class SortPipe implements PipeTransform {
	/*
	transform(value: any[], direcion: string, prop?: string): any {
		console.log('Sort Filter called');
		console.log(value);
		console.log(direcion);
		console.log(prop);
		if (!value) {
			return [];
		}
		if (!direcion || !prop) {
			console.log('second if');
			return value;
		}
		if (value.length > 0) {
			console.log('third if');
			const _direction = direcion === 'asc' ? -1 : 1,
				_isArr = Array.isArray(value),
				_type = typeof value[0],
				_flag = _isArr && _type === 'object' ? true : _isArr && _type !== 'object' ? false : true;


			value.sort((a, b) => {
				a = _flag ? a[prop] : a;
				b = _flag ? b[prop] : b;
				if (typeof a === 'string') {
					return a > b ? -1 * _direction : 1 * _direction;
				} else if (typeof a === 'number') {
					return a - b > 0 ? -1 * _direction : 1 * _direction;
				}
			});
		}
		return value;
	}
	*/

	transform(records: Array<any>, args?: any): any {
		if (args == undefined) {
			return records;
		}

		return records.sort(function(a, b) {
			if (a[args.property] < b[args.property]) {
				return -1 * args.direction;
			} else if (a[args.property] > b[args.property]) {
				return 1 * args.direction;
			} else {
				return 0;
			}
		});

		// return records.sort(function(a, b) {
		// 	console.log(a[args.property] + ' - ' + b[args.property]);
		// 	if (a[args.property] < b[args.property]) {
		// 		console.log(1);
		// 		return -1 * args.direction;
		// 	} else if (a[args.property] > b[args.property]) {
		// 		console.log(2);
		// 		return 1 * args.direction;
		// 	} else {
		// 		console.log(3);
		// 		return 0;
		// 	}
		// });
	}
}
