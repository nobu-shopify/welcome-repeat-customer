import {
  Banner,
  reactExtension,
  useApi,
  BlockStack,
  Image,
  useAppMetafields,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {

  // Get customer metafield to indicate repeat customer
  const customer_tags = useAppMetafields({
    type: "customer",
    namespace: "customer",
    key: "tags",
  });
//  console.log(customer_tags);
  const welcome_tag = customer_tags.filter(tag => tag.metafield.value.includes("REPEAT_CUSTOMER"));
  console.log(welcome_tag);
  console.log(welcome_tag.length);

  // custom web pixel event
  const {analytics} = useApi();

  if (welcome_tag.length < 1) {
    analytics.publish("checkout_custom_event", {"extension_point": `welcome tag not found`, "comment": `new customer`});
    return null;
  }

  analytics.publish("checkout_custom_event", {"extension_point": `welcome tag REPEAT_CUSTOMER`, "comment": `REPEAT customer`});
  return (
    <BlockStack>
      <Banner title="welcome-message" status="success"> WELCOME BAAACK!!! </Banner>
      <Image source="https://cdn.shopify.com/s/files/1/0611/4158/1880/files/thank-you-for-your-service.jpg?v=1694219606" />
    </BlockStack>
  );
}
