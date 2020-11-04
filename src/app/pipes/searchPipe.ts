import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'searchpipe'
})
@Injectable()
export class SearchPipe implements PipeTransform {
	// transform(items: any[], field: string, value: string): any[] {
	// 	if (!items) return [];

	// 	if (field == 'all') {
	// 		//return items.filter((item) => Object.keys(item).some((k) => item[k].includes(value.toLowerCase())));
	// 		return items.filter((it) => {
	// 			return JSON.stringify(it).toLowerCase().includes(value);
	// 		});
	// 	} else {
	// 		return items.filter((it) => it[field].includes(value));
	// 	}
	// }

	/* New Filter */
	transform(items: any, filter: any): any {
		if (filter && Array.isArray(items)) {
			let filterKeys = Object.keys(filter);

			return items.filter((item) => {
				return filterKeys.some((keyName) => {
					//var re = new RegExp(args, 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
					//return value.replace(re, "<mark>" + args + "</mark>");

					//let searchValue = new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] === '';

					return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] === '';
				});
			});
		} else {
			return items;
		}
	}
}
