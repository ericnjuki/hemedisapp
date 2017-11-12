
import { Directive, ElementRef, Input } from '@angular/core';
import { ItemService } from 'app/services/items.service';

@Directive({ selector: '[appAutoComplete]' })
export class AutoCompleteDirective {
    /**
     *
     */
    constructor(el: ElementRef, private itemService: ItemService) {
        const $contentEditableElement = $(el.nativeElement);

        $(function () {
            let arrayOfNames: Array<string> = [];
            itemService.searchItems()
                .subscribe(jsonItems => {
                    for (const name of jsonItems) {
                        arrayOfNames.push(name);
                    }
                });

            (<any>$($contentEditableElement)).autocomplete({
                source: arrayOfNames,
                // why this doesn't work:
                // source: 'localhost:51191/api/v1.0/items/g',
                minLength: 2
            });
        });

    }
}
