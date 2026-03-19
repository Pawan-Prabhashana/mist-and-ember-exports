import ProductSpecs from "@/components/product/product-specs";

export default function SpecsDemoGrouped() {
  return (
    <ProductSpecs
      groups={[
        {
          title: "General",
          items: {
            brand: "Mist & Ember Exports",
            model: "CR-TEA-250",
            origin: "Sri Lanka",
          },
        },
        {
          title: "Dimensions",
          items: { weight: "250 g", height: "12 cm", width: "7 cm", depth: "7 cm" },
        },
        {
          title: "Composition",
          items: {
            ingredients: "100% Ceylon Cinnamon",
            additives: "None",
            organic: true,
          },
          defaultOpen: true,
        },
      ]}
      groupsDefaultOpen
      bordered
    />
  );
}
