import { UtensilsCrossedIcon } from "lucide-react";
import { ApproveFooter, CardShell, MetaPill, type CardProps } from "./card-shell";

const sizes = ['10"', '12"', '16"'] as const;

const pizzas: { name: string; prices: [number, number, number] }[] = [
  { name: "Margherita", prices: [12, 15, 19] },
  { name: "Pepperoni", prices: [13, 16, 21] },
  { name: "BBQ Chicken", prices: [15, 18, 23] },
];

const toppingGroups = [
  {
    name: "Veggies",
    prices: "$1.50 · $2.00 · $2.50",
    items: ["Mushrooms", "Red onion", "Peppers", "Olives", "Jalapeños"],
  },
  {
    name: "Meats & cheese",
    prices: "$2.00 · $2.50 · $3.00",
    items: ["Pepperoni", "Sausage", "Bacon", "Extra mozzarella"],
  },
];

export function MenuDraftCard({ approved, onApprove }: CardProps) {
  return (
    <CardShell
      icon={<UtensilsCrossedIcon />}
      title="Pizza · new category"
      meta={
        <MetaPill tone={approved ? "success" : "warning"}>
          {approved ? "Approved" : "Draft"}
        </MetaPill>
      }
      footer={
        <ApproveFooter
          summary="3 pizzas · 3 sizes · 9 toppings"
          actionLabel="Approve & publish"
          approvedLabel="Approved in preview. Nothing was published."
          approved={approved}
          onApprove={onApprove}
        />
      }
    >
      <table className="w-full text-[13px]">
        <caption className="sr-only">
          Draft pizza menu with prices by size (example data)
        </caption>
        <thead>
          <tr className="text-left font-mono text-[11px] text-muted-foreground">
            <th scope="col" className="pb-1.5 font-normal">
              Item
            </th>
            {sizes.map((size) => (
              <th
                key={size}
                scope="col"
                className="pb-1.5 text-right font-normal tabular"
              >
                {size}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pizzas.map((pizza) => (
            <tr key={pizza.name} className="border-t border-border/70">
              <th scope="row" className="py-1.5 text-left font-medium">
                {pizza.name}
              </th>
              {pizza.prices.map((price, i) => (
                <td key={sizes[i]} className="py-1.5 text-right tabular">
                  ${price}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 rounded-lg border border-dashed border-border px-2.5 py-2">
        <p className="text-[12px] font-medium">
          Extra toppings{" "}
          <span className="font-normal text-muted-foreground">· modifier group · up to 5</span>
        </p>
        <dl className="mt-1.5 space-y-1 text-[12px]">
          {toppingGroups.map((group) => (
            <div key={group.name} className="flex flex-wrap gap-x-2">
              <dt className="font-mono text-[11px] text-muted-foreground">
                {group.name} {group.prices}
              </dt>
              <dd className="text-foreground/85">{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </CardShell>
  );
}
