// Gino's Pizzeria — Olde Towne Portsmouth.
// Organizing idea: COURT & QUEEN. The shop sits at the corner of those two
// streets, west of the Elizabeth River. The whole site is built on that
// meeting point — two streets, two menus, one corner.
// Facts from ginospizzeriava.com. Named plates from the live order menu.

export const brand = {
  name: "Gino's Pizzeria",
  wordmark: "Gino's",
  streets: ['Court', 'Queen'] as const,
  tagline: 'Meet you at the corner.',
  sub: 'West of the Elizabeth. Brick-oven pies, calzones, subs, and homemade tiramisu in Olde Towne Portsmouth.',
  cta: 'Order for the corner',
  ctaHref: 'https://www.ginospizzeriava.com/',
  phone: '(757) 998-2040',
  phoneHref: 'tel:+17579982040',
}

export const place = {
  kicker: 'Olde Towne',
  heading: 'Court Street hits Queen Street. That’s the shop.',
  body: [
    '455 Court Street, Portsmouth. West of the Elizabeth River, on the corner the city already named.',
    'Pizza, pasta, subs, calzones, wings. Cheesecake if you want it. Homemade tiramisu if you know.',
  ],
  address: '455 Court St',
  city: 'Portsmouth, VA 23704',
  mapsHref: 'https://maps.google.com/?q=455+Court+St+Portsmouth+VA+23704',
}

export const hours = [
  ['Mon – Thu', '11:00 AM – 7:30 PM'],
  ['Fri & Sat', '11:00 AM – 8:30 PM'],
  ['Sunday', 'Noon – 7:00 PM'],
] as const

// Two streets, two sides of the menu. Court is the oven. Queen is the rest
// of the table. The Giant Gino is the one that does not fit a lane.
export const court = {
  street: 'Court',
  kicker: 'The oven side',
  heading: 'Pies, calzones, and the roll that feeds the table.',
  plates: [
    {
      name: 'Brick Oven Pizza',
      fill: 'By the slice or the pie. Start here if you walked in hungry.',
      flag: 'The reason the lights are on',
    },
    {
      name: 'Bianca',
      fill: 'Mozzarella, ricotta, fresh garlic, Parmesan. No red, on purpose.',
    },
    {
      name: 'Margherita',
      fill: 'Sliced tomato, fresh basil, sauce, mozzarella.',
    },
    {
      name: 'Rustica',
      fill: 'Sausage, black olives, roasted red peppers, pancetta.',
    },
    {
      name: 'Artichoke',
      fill: 'Ricotta, mozzarella, tomatoes, spinach, garlic, olive oil.',
    },
    {
      name: 'Meat Lovers',
      fill: 'Pepperoni, sausage, meatballs, ham.',
    },
  ],
}

export const queen = {
  street: 'Queen',
  kicker: 'The rest of the table',
  heading: 'Subs, dinners, and the sweets they told you not to skip.',
  plates: [
    {
      name: 'The Bomb Sub',
      fill: 'Ham, turkey, roast beef, salami, provolone. All the meat plus the heat.',
    },
    {
      name: 'Milano Sub',
      fill: 'Capocollo, ham, salami, provolone, banana peppers.',
    },
    {
      name: 'Steak Philly',
      fill: 'Cheese, sautéed onions and peppers. The one people reorder.',
    },
    {
      name: 'Chicken Parmigiana',
      fill: 'Dinner with garlic bread. Or the sub, if you are walking it.',
    },
    {
      name: 'Spaghetti and Meatballs',
      fill: 'The weeknight plate. Kids have their own.',
    },
    {
      name: 'Homemade Tiramisu',
      fill: 'They also have cheesecake and cannoli. This is the one they make here.',
      flag: 'Do not forget dessert',
    },
  ],
}

export const giant = {
  name: 'The Giant Gino',
  fill: 'Meat, veggie, or supreme. A stromboli the size of the corner. Bring people.',
  note: 'Not a slice. Not a suggestion.',
}

export const menuPlates = [
  ...court.plates.map((plate) => ({ name: plate.name, fill: plate.fill })),
  ...queen.plates.map((plate) => ({ name: plate.name, fill: plate.fill })),
  { name: giant.name, fill: giant.fill },
]

export const asides = [
  'Slice or pie. Do not make it a whole conversation.',
  'Gino’s Bacon Bread Stick exists. So do the Chewy Sticks.',
  'Pickup and delivery from the same corner.',
]

// George Haroon — the corner calls him Gino; the user calls him Giorgio.
// Facts from WTKR (2024 Super Bowl story) and WYDaily (2017 Mini Italia piece).
export const giorgio = {
  kicker: 'The man in the flour',
  name: 'Giorgio',
  aka: 'George Haroon. The corner has always called him Gino.',
  heading: 'Still in the dough.',
  body: [
    'Born in Iraq, raised on Sicilian pizza kitchens from age seven, then a Brooklyn dishwasher. Capone’s at twenty-two. Hampton Roads in 1991. Eighteen shops in the 757. In 2017 he handed this corner to his kids — and stayed in the flour anyway.',
    '“I love food. I love to cook. If I tell you I’m going to stop, I lie.”',
  ],
  quoteAttr: 'Giorgio, to WTKR, Super Bowl week',
}
