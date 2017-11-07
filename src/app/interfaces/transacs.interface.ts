import { Item } from "app/shared/item.model";
import { IItem } from "app/interfaces/item.interface";

export interface ITransactionData {
    date: String;
    items: IItem[];
    transactionType: number;
}
