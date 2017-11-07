
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
            let arrayOfItems: Array<string> = [];
            itemService.searchItems()
                .subscribe(jsonObject => {
                    for (const name of jsonObject) {
                        arrayOfItems.push(name);
                    }
                });

            (<any>$($contentEditableElement)).autocomplete({
                // source: ['eric', 'erric', 'eerrrric'],
                source: arrayOfItems,
                // source: 'localhost:51191/api/v1.0/items/g',
                minLength: 2
            });
        });

    }
}
