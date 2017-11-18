import { Directive, ElementRef } from '@angular/core';
import { ItemService } from 'app/services/items.service';
import * as Fuse from 'fuse.js';
import * as fuzzy from 'fuzzy';

@Directive({ selector: '[appAutoComplete]' })
export class AutoCompleteDirective {
    /**
     *
     */
    constructor(el: ElementRef, private itemService: ItemService) {
        // because .autocomplete is an extenstion of a jQuery object
        const $contentEditableElement = $(el.nativeElement);

        $(function () {
            let arrayOfNames: Array<string> = [];
            itemService.searchItems()
                .subscribe(jsonItemNames => {
                    (<any>$($contentEditableElement)).autocomplete({ // jQuery docs
                        source: function (request, response) {
                            const result = fuzzy.filter(request.term, jsonItemNames);
                            const matches = result.map(item => {return item.string; } );
                            console.log(matches);
                            response(matches);
                            // clear the items on the list on every callback !important
                            arrayOfNames = [];
                        },
                        select: function () {

                        },
                        minLength: 1
                    });
                });
            // .subscribe(jsonItems => {
            //     // arrayOfNames = jsonItems;
            //     // jsonItems is an array of strings
            //     (<any>$($contentEditableElement)).autocomplete({ // jQuery docs
            //         source: function (request, response) {
            //             // fuse docs show only how to search array of objects
            //             // this implementations does it for array of only strings
            //             // new array to store search results
            //             const fuseOptions = {
            //                 shouldSort: false,
            //                 tokenize: true,
            //                 matchAllTokens: true,
            //                 threshold: 0.6,
            //                 location: 0,
            //                 distance: 100,
            //                 maxPatternLength: 32,
            //                 minMatchCharLength: 1,
            //             };
            //             const fuse = new Fuse(jsonItems, fuseOptions);
            //             const result = fuse.search(request.term);
            //             // result returns array of indices of items yielded by the search
            //             // so i had to get the items themselves:
            //             for (const index of result) {
            //                 arrayOfNames.push(jsonItems[+index]);
            //             }
            //             response(arrayOfNames);
            //             // clear the items on the list on every callback !important
            //             arrayOfNames = [];
            //         },
            //         select: function () {

            //         },
            //         minLength: 1
            //     });
            //     // why this doesn't work:
            //     // source: 'localhost:51191/api/v1.0/items/g',
            //     // even though i have cors enabled on my api
            // });
        });
    }
}
