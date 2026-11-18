/**
 * Scripted scenarios for the concept preview. Nothing here comes from a real
 * restaurant: "Corner Slice" is fictional and every number is example data.
 */

export type ScenarioId =
  | "menu"
  | "revenue"
  | "printer"
  | "prices"
  | "bestsellers"
  | "discount";

export type Scenario = {
  id: ScenarioId;
  /** Short label for the prompt picker. */
  label: string;
  /** What kind of job this is, shown as a tiny tag. */
  kind: "Menu" | "Insights" | "Diagnostics" | "Pricing" | "Promotions";
  /** The owner's message, typed into the composer. */
  prompt: string;
  /** Tool steps the agent "runs" before answering. */
  steps: string[];
  /** The agent's short reply above its result card. */
  reply: string;
  /** A natural next question, offered as a chip when the run finishes. */
  followUp?: ScenarioId;
};

export const SAMPLE_RESTAURANT = "Corner Slice";

export const scenarios: Record<ScenarioId, Scenario> = {
  menu: {
    id: "menu",
    label: "Build a pizza menu",
    kind: "Menu",
    prompt: "Create a pizza menu with three sizes and extra toppings.",
    steps: [
      "Reading current menu (38 items)",
      'Creating sizes: 10", 12", 16"',
      "Building an “Extra toppings” modifier group",
    ],
    reply:
      "Here’s a draft. Toppings cost a little more on bigger pizzas, and meats cost more than veggies. Nothing goes live until you approve it.",
    followUp: "prices",
  },
  revenue: {
    id: "revenue",
    label: "Today vs. last Friday",
    kind: "Insights",
    prompt: "Show me today’s revenue and compare it with last Friday.",
    steps: [
      "Pulling today’s sales through 3:00 PM",
      "Matching last Friday, same hours",
      "Comparing hour by hour",
    ],
    reply:
      "You’re up 11% on last Friday at the same time. The lunch rush did most of the work.",
    followUp: "bestsellers",
  },
  printer: {
    id: "printer",
    label: "Kitchen printer is down",
    kind: "Diagnostics",
    prompt: "Why aren’t my kitchen orders printing?",
    steps: [
      "Checking terminals and network",
      "Pinging printers on the kitchen route",
      "Reviewing recent print jobs",
    ],
    reply:
      "Found it. Orders are reaching the kitchen route, but the kitchen printer stopped answering at 12:41 PM.",
  },
  prices: {
    id: "prices",
    label: "Raise burger prices 10%",
    kind: "Pricing",
    prompt: "Change burger prices by 10%.",
    steps: [
      "Finding items in Burgers (5)",
      "Calculating +10%",
      "Checking which menus show these items",
    ],
    reply:
      "Here are the new prices. Want them rounded? Nothing changes until you approve.",
  },
  bestsellers: {
    id: "bestsellers",
    label: "Best sellers this week",
    kind: "Insights",
    prompt: "Which items are selling best this week?",
    steps: [
      "Reading this week’s orders",
      "Ranking items by quantity sold",
      "Looking for items ordered together",
    ],
    reply:
      "Pepperoni is running away with it this week. One pattern stood out, too.",
    followUp: "discount",
  },
  discount: {
    id: "discount",
    label: "Weekday lunch discount",
    kind: "Promotions",
    prompt: "Set up a 20% lunch discount for weekdays.",
    steps: [
      "Checking lunch menu items (24)",
      "Setting schedule: weekdays, 11 AM–2 PM",
      "Checking for overlapping discounts",
    ],
    reply:
      "Here’s the discount. I left out alcohol and gift cards. Want anything else excluded?",
  },
};

export const scenarioOrder: ScenarioId[] = [
  "menu",
  "revenue",
  "printer",
  "prices",
  "bestsellers",
  "discount",
];

export const FALLBACK_REPLY =
  "I’m a scripted concept preview, so I only know a few examples for now. Try one of these:";
