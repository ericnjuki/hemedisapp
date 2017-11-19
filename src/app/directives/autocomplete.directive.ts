import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';
import { ItemService } from 'app/services/items.service';
import * as fuzzy from 'fuzzy';

@Directive({
    selector: 'npAutoComplete'
})
export class AutoCompleteDirective {
    /**
     *
     */
    @Output() itemData: EventEmitter<any> = new EventEmitter();
    private someData;
    constructor(el: ElementRef, private itemService: ItemService) {
        // because .autocomplete is an extenstion of a jQuery object
        const $contentEditableElement = $('[data-text=Item]');
        // TO-DO: fix this, get this event HERE!!
        itemService.event = this.itemData;

        $(function () {
            const itemNames: Array<string> = [];
            let matches = [];
            itemService.getAllItems()
                .subscribe(jsonItems => {
                    for (const item of jsonItems) {
                        itemNames.push(item.itemName);
                    }
                    // console.log(itemNames);
                    // (<any>$($contentEditableElement)).autocomplete({ // jQuery docs
                    (<any>$('[data-text=Item]')).autocomplete({ // jQuery docs
                        source: function (request, response) {
                            const result = fuzzy.filter(request.term, itemNames);
                            matches = result.map(item => { return item.string; });
                            response(matches);

                            // clear the items on the list on every callback !important
                            // itemNames = [];
                        },
                        select: function (event, ui) {
                            jsonItems.forEach(function (item) {
                                if (item.itemName === ui.item.value) {
                                    console.log(item);
                                    itemService.event.emit(item);
                                }
                            })
                        },
                        minLength: 1
                    });
                });
        });
    }
}
