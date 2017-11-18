import { Directive, ElementRef } from '@angular/core';
import { ItemService } from 'app/services/items.service';
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
                            const matches = result.map(item => { return item.string; });
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
        });
    }
}
