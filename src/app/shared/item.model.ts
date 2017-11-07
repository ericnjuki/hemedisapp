import { IItem } from "app/interfaces/item.interface";

export class Item implements IItem {
    public itemName: string;
    public quantity: number;
    public purchaseCost: number;
    public sellingPrice: number;
}