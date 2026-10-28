/* ==========================================================================
   CATALOGUE DATA: this is where you add and edit the parts shown on
   catalogue.html. You do not need to touch any other file.

   To add a part, copy one block between { and }, paste it after the last one
   (do not forget the comma between blocks), and change the values:

     id          a short unique name with no spaces, for example "toyota-camry-grille"
     name        what customers see, for example "Front grille, Toyota Camry"
     category    groups parts into filter buttons. Use the same wording for parts
                 in the same group, for example "Grilles and front trim"
     brands      vehicle makes it fits, for example ["Toyota", "Lexus"]. Use [] if unsure.
                 Only list a make when you are sure it fits.
     description one or two honest sentences about the part
     image       the photo file name. Upload the photo to the same place as this file.
     alt         a short description of the photo for people who cannot see it
     keywords    extra words people might search, separated by spaces
     note        optional small line under the description. Use "" for none.

   Prices are not shown on purpose: they change and are confirmed for each request.
   Never put passwords, keys or private information in this file.
   ========================================================================== */
window.PARTS_DATA = [
  {
    id: "chrome-front-grille",
    name: "Chrome front grille",
    category: "Grilles and front trim",
    brands: [],
    description:
      "Front grille with a chrome surround and honeycomb insert, as displayed in our shop. Tell us your make, model and year and we confirm fitment and availability.",
    image: "catalogue-grille.jpg",
    alt: "Chrome-framed black honeycomb front grille hanging on a shop wall.",
    keywords: "grille grill front chrome honeycomb radiator badge",
    note: ""
  },
  {
    id: "honeycomb-lower-grille",
    name: "Black honeycomb lower grille",
    category: "Grilles and front trim",
    brands: [],
    description:
      "Gloss black lower grille with honeycomb mesh and angled side vents, as displayed in our shop. Fitment depends on the vehicle, so we check it with you first.",
    image: "catalogue-lower-grille.jpg",
    alt: "Gloss black honeycomb lower grille with angled side vents on a shop wall.",
    keywords: "grille grill lower bumper black honeycomb mesh vent fog lamp surround",
    note: ""
  },
  {
    id: "side-steps",
    name: "Side steps (running boards)",
    category: "Side steps and running boards",
    brands: [],
    description:
      "Aluminium tread-plate side steps as displayed in our shop. Ask us about fixed and powered versions for your SUV or pickup.",
    image: "catalogue-side-steps.jpg",
    alt: "Aluminium tread-plate side steps with mounting brackets on a shop counter.",
    keywords: "side steps step running board board suv pickup aluminium tread plate powered electric",
    note: ""
  },
  {
    id: "led-headlamps-assorted",
    name: "LED headlamps, assorted styles",
    category: "Headlamps and lighting",
    brands: [],
    description:
      "Headlamps with LED light signatures and halo rings. Tell us your vehicle and we find the style that fits.",
    image: "catalogue-headlamps.jpg",
    alt: "Glass showcase holding several headlamps with bright LED rings.",
    keywords: "headlamp headlight head lamp light lights lighting led halo ring projector",
    note: "Seen at our supplier's showroom in China."
  }
];
