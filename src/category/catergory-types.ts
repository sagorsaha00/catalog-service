export interface priceConfiguration {
  [key: string]: {
    priceType: "base" | "aditional";
    availableOptions: string[];
  };
}
export interface Attributes {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}
export interface Category {
  _id:string;
  name: string;
  priceConfiguration: priceConfiguration;
  attributes: Attributes[];
}
 
