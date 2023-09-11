// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";
// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").InputQuery} InputQuery
* @typedef {import("../generated/api").FunctionResult} FunctionResult
* @typedef {import("../generated/api").Target} Target
* @typedef {import("../generated/api").ProductVariant} ProductVariant
*/
/**
* @type {FunctionResult}
*/
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};
// The @shopify/shopify_function package will use the default export as your function entrypoint
export default /**
* @param {InputQuery} input
* @returns {FunctionResult}
*/
  (input) => {

    const secret_sale = input.cart.buyerIdentity?.customer?.hasAnyTag;
    const email = input.cart.buyerIdentity?.email;

    // Tag not found - no discount
    if (!secret_sale) {
      // You can use STDERR for debug logs in your function
      console.error("SECRET_SALE tag not found.");
      return EMPTY_DISCOUNT;
    }

    const targets = input.cart.lines
      .map(line => {
        const variant = /** @type {ProductVariant} */ (line.merchandise);
        return /** @type {Target} */ ({
          // Use the variant ID to create a discount target
          productVariant: {
            id: variant.id
          }
        })
      });

    console.error("SECRET_SALE tag found for:", email);
    return {
      discounts: [
        {
          message: "SPECIAL DISCOUNT --- 30%!!",
          // Apply the discount to the collected targets
          targets,
          // Define a percentage-based discount
          value: {
            percentage: {
              value: "30.0"
            }
          }
        }
      ],
      discountApplicationStrategy: DiscountApplicationStrategy.First
    };
  };