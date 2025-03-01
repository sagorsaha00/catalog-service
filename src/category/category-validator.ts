import { body } from "express-validator";
export default [
  body("name")
    .exists()
    .withMessage("name is required")
    .isString()
    .withMessage("name shoud be string"),
  body("priceConfiguration")
    .exists()
    .withMessage("priceConfiguration is requried"),
  body("priceConfiguration.*.priceType")
    .exists()
    .withMessage("pricetype is requried")
    .custom((value: "base" | "aditional") => {
      const validKeys = ["base", "aditional"];
      if (!validKeys.includes(value)) {
        throw new Error(
          `${value} is invalid for priceType filed, Possible Value are : [${validKeys.join()}] `
        );
      }
    }),
  body("attributes").exists().withMessage("attrebuties shoud be requried"),
];
