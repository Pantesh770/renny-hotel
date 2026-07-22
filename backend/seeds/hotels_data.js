const hotels = [
  // 1. ARUSHA
  {
    name: 'Arusha Serena Hotel', city: 'Arusha', region: 'Arusha',
    description: 'A colonial-era coffee farm turned lakeside retreat on the slopes of Mount Meru beside Lake Duluti.',
    price: 210, stars: 4, rating: 4.4,
    address: 'Lake Duluti, Tengeru Road, Arusha', contact: '+255 787 222 222',
    image: 'https://www.serenahotels.com/sites/default/files/styles/hero_image_desktop/public/2021-12/Arusha-Serena-Hotel-Exterior.jpg',
    image2: 'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-12/Arusha-Serena-Hotel-Pool.jpg',
    image3: 'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-12/Arusha-Serena-Hotel-Dining.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Garden', 'Parking']
  },
  {
    name: 'Mount Meru Hotel', city: 'Arusha', region: 'Arusha',
    description: 'Arusha’s premier luxury hotel, offering breathtaking views of Mount Meru and lush landscaped gardens.',
    price: 185, stars: 4, rating: 4.3,
    address: 'Kanisa Road, Arusha', contact: '+255 27 297 0000',
    image: 'https://www.mountmeruhotel.co.tz/wp-content/uploads/2019/10/Exterior.jpg',
    image2: 'https://www.mountmeruhotel.co.tz/wp-content/uploads/2019/10/Poolside.jpg',
    image3: 'https://www.mountmeruhotel.co.tz/wp-content/uploads/2019/10/Executive-Room.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Garden']
  },
  {
    name: 'Gran Melia Arusha', city: 'Arusha', region: 'Arusha',
    description: 'A sanctuary of luxury nestled between the peaks of Mount Meru and the coffee plantations.',
    price: 330, stars: 5, rating: 4.7,
    address: 'Simeon Road, Arusha', contact: '+255 746 982 500',
    image: 'https://images.melia.com/hotel/4912/gallery/0.jpg',
    image2: 'https://images.melia.com/hotel/4912/gallery/1.jpg',
    image3: 'https://images.melia.com/hotel/4912/gallery/2.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Room Service']
  },

  // 2. DAR ES SALAAM
  {
    name: 'Hyatt Regency Dar Es Salaam', city: 'Dar es Salaam', region: 'Dar es Salaam',
    description: 'A 5-star landmark overlooking the harbor, featuring a rooftop bar and an infinity pool.',
    price: 260, stars: 5, rating: 4.6,
    address: '24 Kivukoni Front, Dar es Salaam', contact: '+255 764 701 234',
    image: 'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1517/DARRS-P037-Exterior.jpg/DARRS-P037-Exterior.16x9.jpg',
    image2: 'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1517/DARRS-P011-Pool.jpg/DARRS-P011-Pool.16x9.jpg',
    image3: 'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1517/DARRS-P024-Level-8.jpg/DARRS-P024-Level-8.16x9.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Casino']
  },
  {
    name: 'Johari Rotana', city: 'Dar es Salaam', region: 'Dar es Salaam',
    description: 'A modern luxury hotel within the MNF Square building, offering sophisticated rooms with ocean views.',
    price: 225, stars: 5, rating: 4.7,
    address: 'Sokoine Drive, Dar es Salaam', contact: '+255 22 219 1000',
    image: 'https://www.rotana.com/magellan/Property/84/MainImage/MainImage.jpg',
    image2: 'https://www.rotana.com/magellan/Property/84/Gallery/Pool.jpg',
    image3: 'https://www.rotana.com/magellan/Property/84/Gallery/Room.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Room Service']
  },
  {
    name: 'Dar es Salaam Serena Hotel', city: 'Dar es Salaam', region: 'Dar es Salaam',
    description: 'Surrounded by tropical gardens, this hotel blends Swahili architecture with modern luxury.',
    price: 215, stars: 5, rating: 4.5,
    address: 'Ohio Street, Dar es Salaam', contact: '+255 22 211 2416',
    image: 'https://www.serenahotels.com/sites/default/files/styles/hero_image_desktop/public/2021-11/Dar-es-Salaam-Serena-Hotel-Exterior.jpg',
    image2: 'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-11/Dar-es-Salaam-Serena-Hotel-Pool.jpg',
    image3: 'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-11/Dar-es-Salaam-Serena-Hotel-Room.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Free WiFi', 'Garden']
  },

  // 3. DODOMA
  {
    name: 'Best Western Dodoma City Hotel', city: 'Dodoma', region: 'Dodoma',
    description: 'A top choice for government officials and business travelers, featuring rooftop dining.',
    price: 115, stars: 4, rating: 4.2,
    address: 'Plot 23, Block A, Kuu Street, Dodoma', contact: '+255 748 502 701',
    image: 'https://www.bestwestern.com/content/dam/bestwestern/hotels/92015/92015-exterior-1.jpg',
    image2: 'https://www.bestwestern.com/content/dam/bestwestern/hotels/92015/92015-interior-1.jpg',
    image3: 'https://www.bestwestern.com/content/dam/bestwestern/hotels/92015/92015-interior-2.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Business Center']
  },
  {
    name: 'New Dodoma Hotel', city: 'Dodoma', region: 'Dodoma',
    description: 'A historic hotel with high ceilings and spacious gardens, located near the railway station.',
    price: 85, stars: 4, rating: 4.0,
    address: 'Plot No. 1, Dodoma', contact: '+255 26 232 1641',
    image: 'https://newdodomahotel.com/images/gallery/exterior.jpg',
    image2: 'https://newdodomahotel.com/images/gallery/garden.jpg',
    image3: 'https://newdodomahotel.com/images/gallery/room.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Garden', 'Parking']
  },
  {
    name: 'Moreena Hotel Dodoma', city: 'Dodoma', region: 'Dodoma',
    description: 'A modern boutique hotel offering elegant rooms and high-quality service in the capital.',
    price: 130, stars: 4, rating: 4.4,
    address: 'Area D, Dodoma', contact: '+255 754 555 666',
    image: 'https://moreenahotel.com/images/exterior.jpg',
    image2: 'https://moreenahotel.com/images/pool.jpg',
    image3: 'https://moreenahotel.com/images/suite.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Spa']
  },

  // 4. GEITA
  {
    name: 'Gold Stone Hotel', city: 'Geita', region: 'Geita',
    description: 'A modern hotel offering upscale conveniences and a welcoming atmosphere for business.',
    price: 80, stars: 4, rating: 4.1,
    address: 'Mission Street, Geita', contact: '+255 788 010 293',
    image: 'https://goldstonehotel.co.tz/wp-content/uploads/2021/01/hotel-exterior.jpg',
    image2: 'https://goldstonehotel.co.tz/wp-content/uploads/2021/01/restaurant.jpg',
    image3: 'https://goldstonehotel.co.tz/wp-content/uploads/2021/01/room.jpg',
    sound_url: '', amenities: ['Spa', 'Restaurant', 'Bar', 'Free WiFi', 'Air Conditioning']
  },
  {
    name: 'Mazinzi Hotel', city: 'Geita', region: 'Geita',
    description: 'Features multiple dining options and bars, making it a social hub for travelers.',
    price: 50, stars: 3, rating: 3.7,
    address: 'Kalangalala Area, Geita', contact: '+255 777 000 000',
    image: 'https://mazinzihotel.com/images/main.jpg',
    image2: 'https://mazinzihotel.com/images/bar.jpg',
    image3: 'https://mazinzihotel.com/images/garden.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Garden', 'Parking']
  },
  {
    name: 'Lennox Hotel Geita', city: 'Geita', region: 'Geita',
    description: 'Comfortable accommodation with modern amenities, catering to both business and leisure.',
    price: 65, stars: 3, rating: 3.9,
    address: 'Geita Town Center', contact: '+255 754 111 222',
    image: 'https://lennoxgeita.com/images/ext.jpg',
    image2: 'https://lennoxgeita.com/images/lobby.jpg',
    image3: 'https://lennoxgeita.com/images/room.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'AC', 'Parking']
  },

  // 5. IRINGA
  {
    name: 'Ruaha River Lodge', city: 'Ruaha National Park', region: 'Iringa',
    description: 'The oldest lodge in Ruaha, built along the river banks where wildlife visits frequently.',
    price: 360, stars: 4, rating: 4.5,
    address: 'Ruaha National Park, Iringa', contact: '+255 22 212 8485',
    image: 'https://foxesafricasafaris.com/wp-content/uploads/2019/06/Ruaha-River-Lodge-Exterior.jpg',
    image2: 'https://foxesafricasafaris.com/wp-content/uploads/2019/06/Ruaha-River-Lodge-Dining.jpg',
    image3: 'https://foxesafricasafaris.com/wp-content/uploads/2019/06/Ruaha-River-Lodge-Wildlife.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Game Drives', 'Parking', 'Solar Power']
  },
  {
    name: 'Tandala Tented Camp', city: 'Ruaha National Park', region: 'Iringa',
    description: 'Offering an authentic safari experience with tented accommodation and great wildlife viewing.',
    price: 290, stars: 4, rating: 4.4,
    address: 'Ruaha National Park Border, Iringa', contact: '+255 754 033 131',
    image: 'https://www.tandalatentedcamp.com/images/gallery/tent.jpg',
    image2: 'https://www.tandalatentedcamp.com/images/gallery/pool.jpg',
    image3: 'https://www.tandalatentedcamp.com/images/gallery/safari.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Game Drives', 'Free WiFi']
  },
  {
    name: 'Iringa Sunset Hotel', city: 'Iringa', region: 'Iringa',
    description: 'Located on the Gangilonga Hills, offering panoramic views of Iringa town and beautiful sunsets.',
    price: 110, stars: 4, rating: 4.2,
    address: 'Gangilonga, Iringa', contact: '+255 26 270 2636',
    image: 'https://iringasunset.com/images/sunset-view.jpg',
    image2: 'https://iringasunset.com/wp-content/uploads/2021/08/Iringa-Sunset-Hotel-View.jpg',
    image3: 'https://iringasunset.com/images/dining.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Hill View', 'Garden']
  },

  // 6. KAGERA
  {
    name: 'Walkgard Transit Hotel', city: 'Bukoba', region: 'Kagera',
    description: 'Located near Bukoba Bus Terminal, it offers clean, lake-breeze-cooled rooms.',
    price: 60, stars: 3, rating: 4.0,
    address: 'Uganda Road, Bukoba', contact: '+255 754 538 412',
    image: 'https://www.walkgard.com/images/hotel.jpg',
    image2: 'https://www.walkgard.com/images/room.jpg',
    image3: 'https://www.walkgard.com/images/restaurant.jpg',
    sound_url: '', amenities: ['Restaurant', 'Free WiFi', 'Parking', 'Tour Desk']
  },
  {
    name: 'Victorious Perch Hotel', city: 'Bukoba', region: 'Kagera',
    description: 'A premium hotel in Bukoba offering stunning views of Lake Victoria and excellent hospitality.',
    price: 90, stars: 4, rating: 4.3,
    address: 'Bukoba Waterfront, Kagera', contact: '+255 28 222 0000',
    image: 'https://victoriousperchhotel.com/images/ext.jpg',
    image2: 'https://victoriousperchhotel.com/images/pool.jpg',
    image3: 'https://victoriousperchhotel.com/images/lake.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Lake View']
  },
  {
    name: 'Space Lodge Bukoba', city: 'Bukoba', region: 'Kagera',
    description: 'Known for its personalized adventure tour services and comfortable lakefront stay.',
    price: 45, stars: 3, rating: 3.8,
    address: 'Bukoba Waterfront, Kagera', contact: '+255 777 000 000',
    image: 'https://spacelodge.co.tz/images/main.jpg',
    image2: 'https://spacelodge.co.tz/images/tour.jpg',
    image3: 'https://spacelodge.co.tz/images/garden.jpg',
    sound_url: '', amenities: ['Lake View', 'Tour Desk', 'Restaurant', 'Bar', 'Garden']
  },

  // 7. KATAVI
  {
    name: 'Chada Katavi', city: 'Katavi National Park', region: 'Katavi',
    description: 'A legendary, remote bush camp offering an authentic "old school" safari experience.',
    price: 980, stars: 5, rating: 4.8,
    address: 'Chada Plain, Katavi NP', contact: '+255 22 212 8485',
    image: 'https://www.nomad-tanzania.com/sites/default/files/styles/hero_image/public/2017-06/Chada%20Katavi%20Exterior.jpg',
    image2: 'https://www.nomad-tanzania.com/sites/default/files/styles/gallery_image/public/2017-06/Chada%20Katavi%20Tent.jpg',
    image3: 'https://www.nomad-tanzania.com/sites/default/files/styles/gallery_image/public/2017-06/Chada%20Katavi%20Dining.jpg',
    sound_url: '', amenities: ['Bar', 'Game Drives', 'Solar Power', 'Bush Meals']
  },
  {
    name: 'Nangero Royal Hotel', city: 'Mpanda', region: 'Katavi',
    description: 'A comfortable mid-range hotel in Mpanda town, serving as a primary gateway to Katavi.',
    price: 95, stars: 4, rating: 4.0,
    address: 'Mpanda Town, Katavi', contact: '+255 754 590 000',
    image: 'https://nangerohotel.com/images/gallery/ext.jpg',
    image2: 'https://nangerohotel.com/images/gallery/room.jpg',
    image3: 'https://nangerohotel.com/images/gallery/pool.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'AC']
  },
  {
    name: 'Arena Executive Hotel', city: 'Mpanda', region: 'Katavi',
    description: 'Modern executive accommodation offering premium services and comfort in the Katavi region.',
    price: 110, stars: 4, rating: 4.2,
    address: 'Mpanda, Katavi', contact: '+255 765 745 055',
    image: 'https://arenaexecutivehotel.com/images/main.jpg',
    image2: 'https://arenaexecutivehotel.com/images/room.jpg',
    image3: 'https://arenaexecutivehotel.com/images/bar.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Conference Room', 'Gym']
  },

  // 8. KIGOMA
  {
    name: 'Kigoma Hilltop Hotel', city: 'Kigoma', region: 'Kigoma',
    description: 'Perched on a hill overlooking Lake Tanganyika, offering spectacular sunset views.',
    price: 190, stars: 4, rating: 4.2,
    address: 'Hilltop Road, Kigoma', contact: '+255 28 244 0444',
    image: 'https://www.mbalimbali.com/sites/default/files/styles/hero_image/public/2017-06/Kigoma%20Hilltop%20Hotel%20Exterior.jpg',
    image2: 'https://www.mbalimbali.com/sites/default/files/styles/gallery_image/public/2017-06/Kigoma%20Hilltop%20Hotel%20Pool.jpg',
    image3: 'https://www.mbalimbali.com/sites/default/files/styles/gallery_image/public/2017-06/Kigoma%20Hilltop%20Hotel%20View.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Gym', 'Lake View']
  },
  {
    name: 'Lake Tanganyika Hotel', city: 'Kigoma', region: 'Kigoma',
    description: 'Located on the shores of Lake Tanganyika, featuring beautiful gardens and a serene atmosphere.',
    price: 150, stars: 4, rating: 4.1,
    address: 'Lake Front, Kigoma', contact: '+255 28 244 0000',
    image: 'https://www.laketanganyikahotel.com/images/slideshow/slide1.jpg',
    image2: 'https://www.laketanganyikahotel.com/images/slideshow/slide2.jpg',
    image3: 'https://www.laketanganyikahotel.com/images/slideshow/slide3.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Garden', 'Lake Access']
  },
  {
    name: 'Gombe Forest Lodge', city: 'Gombe', region: 'Kigoma',
    description: 'A small, intimate lodge hidden in the forest of Gombe Stream National Park, home to the chimpanzees.',
    price: 450, stars: 4, rating: 4.6,
    address: 'Gombe Stream National Park', contact: '+255 22 212 8485',
    image: 'https://www.mbalimbali.com/sites/default/files/styles/hero_image/public/2017-06/Gombe%20Forest%20Lodge%20Exterior.jpg',
    image2: 'https://www.mbalimbali.com/sites/default/files/styles/gallery_image/public/2017-06/Gombe%20Forest%20Lodge%20Tent.jpg',
    image3: 'https://www.mbalimbali.com/sites/default/files/styles/gallery_image/public/2017-06/Gombe%20Forest%20Lodge%20Chimps.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Chimpanzee Trekking', 'Beach Access']
  },

  // 9. KILIMANJARO
  {
    name: 'Kilimanjaro Wonders Hotel', city: 'Moshi', region: 'Kilimanjaro',
    description: 'A modern luxury hotel in Moshi offering great views of Mt. Kilimanjaro from its rooftop bar.',
    price: 160, stars: 4, rating: 4.5,
    address: 'Kiboriloni, Moshi', contact: '+255 27 275 1984',
    image: 'https://www.kiliwonders.com/images/gallery/ext.jpg',
    image2: 'https://www.kiliwonders.com/images/gallery/roof.jpg',
    image3: 'https://www.kiliwonders.com/images/gallery/view.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Mountain View']
  },
  {
    name: 'Salinero Kilimanjaro Hotel', city: 'Moshi', region: 'Kilimanjaro',
    description: 'Nestled in the quiet suburbs of Moshi, providing a peaceful base for Kilimanjaro climbers.',
    price: 140, stars: 4, rating: 4.2,
    address: 'Lyamungo Road, Moshi', contact: '+255 754 553 078',
    image: 'https://salinerohotels.com/wp-content/uploads/2019/04/salinero-moshi-exterior.jpg',
    image2: 'https://salinerohotels.com/wp-content/uploads/2019/04/salinero-moshi-pool.jpg',
    image3: 'https://salinerohotels.com/wp-content/uploads/2019/04/salinero-moshi-room.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Garden']
  },
  {
    name: 'Parkview Inn Moshi', city: 'Moshi', region: 'Kilimanjaro',
    description: 'A centrally located hotel in Moshi known for its cleanliness, comfort, and views of the mountain.',
    price: 120, stars: 3, rating: 4.3,
    address: 'Aga Khan Road, Moshi', contact: '+255 27 275 0711',
    image: 'https://www.parkviewinnmoshi.com/images/ext.jpg',
    image2: 'https://www.parkviewinnmoshi.com/images/view.jpg',
    image3: 'https://www.parkviewinnmoshi.com/images/room.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Free WiFi', 'AC', 'Mountain View']
  },

  // 10. LINDI
  {
    name: 'Sea View Beach Resort', city: 'Lindi', region: 'Lindi',
    description: 'Situated on the Lindi waterfront, offering a relaxing coastal experience.',
    price: 65, stars: 3, rating: 4.0,
    address: 'Waterfront Road, Lindi', contact: '+255 777 000 000',
    image: 'https://lindi-seaview.com/images/exterior.jpg',
    image2: 'https://lindi-seaview.com/images/beach.jpg',
    image3: 'https://lindi-seaview.com/images/room.jpg',
    sound_url: '', amenities: ['Pool', 'Beach Access', 'Restaurant', 'Bar', 'Free WiFi']
  },
  {
    name: 'Burka Coffee Lounge', city: 'Lindi', region: 'Lindi',
    description: 'A boutique-style accommodation offering a personalized experience in Lindi town.',
    price: 155, stars: 4, rating: 4.4,
    address: 'Lindi Town Center', contact: '+255 777 000 000',
    image: 'https://burkalounge.com/images/main.jpg',
    image2: 'https://burkalounge.com/images/cafe.jpg',
    image3: 'https://burkalounge.com/images/bed.jpg',
    sound_url: '', amenities: ['Gourmet Restaurant', 'Terrace', 'AC', 'Free WiFi', 'Breakfast Included']
  },
  {
    name: 'Lindi Beach Hotel', city: 'Lindi', region: 'Lindi',
    description: 'Modern beach hotel offering standard amenities and proximity to the ocean.',
    price: 55, stars: 3, rating: 3.8,
    address: 'Beach Road, Lindi', contact: '+255 712 000 111',
    image: 'https://lindibeach.com/images/ext.jpg',
    image2: 'https://lindibeach.com/images/bar.jpg',
    image3: 'https://lindibeach.com/images/room.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'AC', 'Parking']
  },

  // 11. MANYARA
  {
    name: 'Lake Manyara Serena Safari Lodge', city: 'Lake Manyara', region: 'Manyara',
    description: 'Perched on the Rift Valley Escarpment with infinity pool views of the lake.',
    price: 460, stars: 4, rating: 4.6,
    address: 'Mto wa Mbu Escarpment, Manyara', contact: '+255 27 253 9160',
    image: 'https://www.serenahotels.com/sites/default/files/styles/hero_image_desktop/public/2021-12/Lake-Manyara-Serena-Safari-Lodge-Exterior.jpg',
    image2: 'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-12/Lake-Manyara-Serena-Safari-Lodge-Pool.jpg',
    image3: 'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-12/Lake-Manyara-Serena-Safari-Lodge-Wildlife.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Bush Dining', 'Boutique']
  },
  {
    name: 'Lake Manyara Kilimamoja Lodge', city: 'Lake Manyara', region: 'Manyara',
    description: 'A luxury lodge offering panoramic views of the lake and surrounding highlands.',
    price: 560, stars: 5, rating: 4.8,
    address: 'Rim of Great Rift Valley, Manyara', contact: '+255 784 233 444',
    image: 'https://kilimamoja-lodge.com/images/gallery/exterior.jpg',
    image2: 'https://kilimamoja-lodge.com/images/gallery/pool.jpg',
    image3: 'https://kilimamoja-lodge.com/images/gallery/view.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Free WiFi']
  },
  {
    name: 'Manyara Wildlife Safari Camp', city: 'Lake Manyara', region: 'Manyara',
    description: 'Ten luxury tents and sixteen self-contained cottages located at the edge of the escarpment.',
    price: 250, stars: 4, rating: 4.2,
    address: 'Mto wa Mbu, Manyara', contact: '+255 784 555 111',
    image: 'https://www.lakemanyara.net/images/camp-exterior.jpg',
    image2: 'https://www.lakemanyara.net/images/camp-pool.jpg',
    image3: 'https://www.lakemanyara.net/images/camp-safari.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Game Drives', 'Free WiFi']
  },

  // 12. MARA
  {
    name: 'Four Seasons Safari Lodge', city: 'Serengeti', region: 'Mara',
    description: 'A world-class safari lodge perched on elevated platforms overlooking a wildlife watering hole.',
    price: 1250, stars: 5, rating: 4.8,
    address: 'Central Serengeti, Serengeti NP', contact: '+255 768 981 981',
    image: 'https://assets.fourseasons.com/content/dam/fourseasons/images/web/SER/SER_024_original.jpg',
    image2: 'https://assets.fourseasons.com/content/dam/fourseasons/images/web/SER/SER_042_original.jpg',
    image3: 'https://assets.fourseasons.com/content/dam/fourseasons/images/web/SER/SER_125_original.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Game Drives']
  },
  {
    name: 'Singita Sasakwa Lodge', city: 'Serengeti', region: 'Mara',
    description: 'A magnificent Edwardian-style manor with unmatched old-world luxury.',
    price: 2600, stars: 5, rating: 4.9,
    address: 'Grumeti Game Reserve, Serengeti', contact: '+255 768 982 982',
    image: 'https://singita.com/images/lodges/sasakwa/sasakwa-exterior.jpg',
    image2: 'https://singita.com/images/lodges/sasakwa/sasakwa-pool.jpg',
    image3: 'https://singita.com/images/lodges/sasakwa/sasakwa-cottage.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Game Drives', 'Concierge']
  },
  {
    name: 'Melia Serengeti Lodge', city: 'Serengeti', region: 'Mara',
    description: 'Sustainable luxury lodge in the heart of the Serengeti with an infinity pool and incredible views.',
    price: 550, stars: 5, rating: 4.7,
    address: 'Nyamuma Hills, Serengeti', contact: '+255 746 982 500',
    image: 'https://images.melia.com/hotel/4913/gallery/0.jpg',
    image2: 'https://images.melia.com/hotel/4913/gallery/1.jpg',
    image3: 'https://images.melia.com/hotel/4913/gallery/2.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Eco Friendly']
  },

  // 13. MBEYA
  {
    name: 'Utengule Coffee Lodge', city: 'Mbeya', region: 'Mbeya',
    description: 'A luxury lodge set on a working coffee plantation on the slopes of the Mbeya Range.',
    price: 145, stars: 4, rating: 4.4,
    address: 'Utengule, Mbeya', contact: '+255 25 250 0001',
    image: 'https://utengule.com/wp-content/uploads/2019/10/lodge-exterior.jpg',
    image2: 'https://utengule.com/wp-content/uploads/2019/10/pool.jpg',
    image3: 'https://utengule.com/wp-content/uploads/2019/10/coffee.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Garden', 'Tennis Court']
  },
  {
    name: 'Royal Mgwasi Hotel', city: 'Mbeya', region: 'Mbeya',
    description: 'Modern luxury hotel offering top-tier amenities and comfort in the heart of Mbeya.',
    price: 100, stars: 4, rating: 4.1,
    address: 'Mbeya City Center', contact: '+255 754 416 161',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/415555622.jpg',
    image2: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/415555625.jpg',
    image3: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/415555628.jpg',
    sound_url: '', amenities: ['Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Conference Room']
  },
  {
    name: 'Hillview Hotel Mbeya', city: 'Mbeya', region: 'Mbeya',
    description: 'Offering scenic views of the surrounding mountains and comfortable executive rooms.',
    price: 85, stars: 4, rating: 4.0,
    address: 'Hillview St., Mbeya', contact: '+255 754 888 777',
    image: 'https://www.hillviewhotel.co.tz/images/garden-view.jpg',
    image2: 'https://www.hillviewhotel.co.tz/images/executive-room.jpg',
    image3: 'https://www.hillviewhotel.co.tz/images/reception.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'AC', 'Parking']
  },

  // 14. MOROGORO
  {
    name: 'Nashera Hotel', city: 'Morogoro', region: 'Morogoro',
    description: 'A boutique hotel offering stunning mountain views and elegant, modern rooms.',
    price: 135, stars: 4, rating: 4.2,
    address: 'Boma Road, Morogoro', contact: '+255 716 678 233',
    image: 'https://nasherahotels.com/gallery/exterior.jpg',
    image2: 'https://nasherahotels.com/rooms/standard.jpg',
    image3: 'https://nasherahotels.com/rooms/premium.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Mountain View']
  },
  {
    name: 'Morogoro Hotel', city: 'Morogoro', region: 'Morogoro',
    description: 'One of the oldest and most trusted hotels, set on expansive grounds at the foot of the mountains.',
    price: 70, stars: 3, rating: 3.9,
    address: 'Rwegasore Road, Morogoro', contact: '+255 23 261 3270',
    image: 'https://www.morogorohotel.com/uploads/1/3/2/6/13262705/morogoro-hotel-main-building_orig.jpg',
    image2: 'https://www.morogorohotel.com/uploads/1/3/2/6/13262705/morogoro-hotel-pool-view_orig.jpg',
    image3: 'https://www.morogorohotel.com/uploads/1/3/2/6/13262705/morogoro-hotel-garden_orig.jpg',
    sound_url: '', amenities: ['Pool', 'Tennis Court', 'Casino', 'Garden', 'Free Breakfast']
  },
  {
    name: 'Arc Hotel Morogoro', city: 'Morogoro', region: 'Morogoro',
    description: 'Modern hotel located near the city center, offering clean rooms and reliable service.',
    price: 60, stars: 3, rating: 3.8,
    address: 'Kihonda, Morogoro', contact: '+255 23 260 0000',
    image: 'https://archotel.co.tz/images/deluxe-room.jpg',
    image2: 'https://archotel.co.tz/images/pizza-restaurant.jpg',
    image3: 'https://archotel.co.tz/images/conference-hall.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'AC', 'Parking']
  },

  // 15. MTWARA
  {
    name: 'Tiffany Diamond Hotel Mtwara', city: 'Mtwara', region: 'Mtwara',
    description: 'A premier business hotel in Mtwara, offering modern facilities.',
    price: 90, stars: 4, rating: 4.1,
    address: 'Makonde Road, Mtwara', contact: '+255 23 233 3034',
    image: 'https://tiffanydiamondhotels.com/wp-content/uploads/2023/12/Mtwara-Branch-Home-1.jpg',
    image2: 'https://tiffanydiamondhotels.com/wp-content/uploads/2023/12/Mtwara-Room-Gallery.jpg',
    image3: 'https://tiffanydiamondhotels.com/wp-content/uploads/2023/12/Mtwara-Restaurant.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Business Center']
  },
  {
    name: 'Luwa Evergreen Hotel', city: 'Mtwara', region: 'Mtwara',
    description: 'Comfortable hotel known for its lush green gardens and peaceful environment.',
    price: 75, stars: 3, rating: 4.0,
    address: 'Ligula, Mtwara', contact: '+255 677 066 338',
    image: 'https://static.com-tanzania.com/hotels/luwa-evergreen-hotel/luwa-evergreen-hotel-exterior.jpg',
    image2: 'https://static.com-tanzania.com/hotels/luwa-evergreen-hotel/luwa-evergreen-hotel-pool.jpg',
    image3: 'https://static.com-tanzania.com/hotels/luwa-evergreen-hotel/luwa-evergreen-hotel-room.jpg',
    sound_url: '', amenities: ['Garden', 'Restaurant', 'Bar', 'Free WiFi', 'AC']
  },
  {
    name: 'Cashewnut Hotel', city: 'Mtwara', region: 'Mtwara',
    description: 'Classic hotel in Mtwara offering spacious rooms and local hospitality.',
    price: 55, stars: 3, rating: 3.7,
    address: 'Mtwara Town', contact: '+255 718 258 463',
    image: 'https://nyumbafy.co.tz/wp-content/uploads/2024/01/Cashewnut-Hotel-Mtwara-Exterior.jpg',
    image2: 'https://nyumbafy.co.tz/wp-content/uploads/2024/01/Cashewnut-Hotel-Dining.jpg',
    image3: 'https://nyumbafy.co.tz/wp-content/uploads/2024/01/Cashewnut-Hotel-Room.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'AC']
  },

  // 16. MWANZA
  {
    name: 'Malaika Beach Resort', city: 'Mwanza', region: 'Mwanza',
    description: 'A premier lakeside resort on Lake Victoria with an infinity pool and stunning sunsets.',
    price: 155, stars: 4, rating: 4.3,
    address: 'Capri Point, Mwanza', contact: '+255 763 111 111',
    image: 'https://malaikabeachresort.com/wp-content/uploads/2020/07/MOHB6554-Copy-scaled.jpg',
    image2: 'https://malaikabeachresort.com/wp-content/uploads/2020/07/lake-side-spa-3.jpg',
    image3: 'https://malaikabeachresort.com/wp-content/uploads/2020/08/An_independent_elite_resort_right_on_lake_Victoria_shores-scaled.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Garden', 'Water Sports']
  },
  {
    name: 'Gold Crest Hotel', city: 'Mwanza', region: 'Mwanza',
    description: 'A stylish city hotel offering luxury accommodation and panoramic views of Lake Victoria.',
    price: 130, stars: 4, rating: 4.2,
    address: 'Makongoro Road, Mwanza', contact: '+255 677 353 500',
    image: 'https://goldcresthotel.com/wp-content/uploads/2021/08/Gold-Crest-Hotel-Mwanza.jpg',
    image2: 'https://goldcresthotel.com/wp-content/uploads/2021/08/Lake-View-Room.jpg',
    image3: 'https://goldcresthotel.com/wp-content/uploads/2021/08/Gold-Crest-Mwanza-Pool.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Lake View']
  },
  {
    name: 'Ryan’s Bay Hotel', city: 'Mwanza', region: 'Mwanza',
    description: 'Ideally situated on the shores of Lake Victoria, offering tranquil luxury.',
    price: 140, stars: 4, rating: 4.4,
    address: 'Capri Point, Mwanza', contact: '+255 784 699 393',
    image: 'http://www.ryansbayhotel.com/wp-content/uploads/2014/11/Ryans-Bay-Hotel-1.jpg',
    image2: 'http://www.ryansbayhotel.com/wp-content/uploads/2014/11/Ryans-Bay-Suite.jpg',
    image3: 'http://www.ryansbayhotel.com/wp-content/uploads/2014/11/Ryans-Bay-Lake-View.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Garden', 'Lake View']
  },

  // 17. NJOMBE
  {
    name: 'Ngailo Lodge', city: 'Njombe', region: 'Njombe',
    description: 'Highly rated for its modern touch, offering clean and well-furnished rooms.',
    price: 35, stars: 3, rating: 4.5,
    address: 'Vegas Road, Njombe', contact: '+255 745 524 719',
    image: 'https://ngailolodge.co.tz/wp-content/uploads/2023/10/Ngailo-Lodge-exterior-building-Best-hotel-in-Njombe.jpg',
    image2: 'https://ngailolodge.co.tz/wp-content/uploads/2023/10/Ngailo-Lodge-standard-room.jpg',
    image3: 'https://ngailolodge.co.tz/wp-content/uploads/2023/10/Ngailo-Lodge-dining-area.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Parking', 'Room Service']
  },
  {
    name: 'Hillside Hotel Njombe', city: 'Njombe', region: 'Njombe',
    description: 'Known for its spectacular views of the Njombe landscape and beautiful gardens.',
    price: 45, stars: 3, rating: 4.1,
    address: 'Uzunguni St., Njombe', contact: '+255 758 584 691',
    image: 'https://www.hillsidehotel.co.tz/images/garden-view.jpg',
    image2: 'https://www.hillsidehotel.co.tz/images/executive-room.jpg',
    image3: 'https://www.hillsidehotel.co.tz/images/reception.jpg',
    sound_url: '', amenities: ['Garden', 'Terrace', 'Restaurant', 'Bar', 'Free WiFi']
  },
  {
    name: 'Njombe Hotel', city: 'Njombe', region: 'Njombe',
    description: 'A classic town hotel providing essential comfort and friendly service.',
    price: 30, stars: 2, rating: 3.5,
    address: 'Njombe Town Center', contact: '+255 26 273 0000',
    image: 'https://njombehotel.com/images/ext.jpg',
    image2: 'https://njombehotel.com/images/room.jpg',
    image3: 'https://njombehotel.com/images/bar.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Parking']
  },

  // 18. PEMBA NORTH
  {
    name: 'The Manta Resort', city: 'Kigomasha', region: 'Pemba North',
    description: 'World-famous for its Underwater Room, offering a luxury island escape.',
    price: 650, stars: 5, rating: 4.8,
    address: 'Kigomasha Peninsula, Pemba', contact: '+255 776 718 852',
    image: 'https://themantaresort.com/wp-content/uploads/2013/10/underwater-room-night.jpg',
    image2: 'https://themantaresort.com/wp-content/uploads/2013/10/beach-villas.jpg',
    image3: 'https://themantaresort.com/wp-content/uploads/2013/10/pool.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Dive Center', 'Private Beach', 'Underwater Room']
  },
  {
    name: 'Amani Shore Pemba', city: 'Kigomasha', region: 'Pemba North',
    description: 'A boutique luxury retreat offering absolute privacy and stunning ocean views.',
    price: 400, stars: 5, rating: 4.7,
    address: 'North Pemba Coast', contact: '+255 777 000 001',
    image: 'https://amanipemba.com/images/gallery/ext.jpg',
    image2: 'https://amanipemba.com/images/gallery/beach.jpg',
    image3: 'https://amanipemba.com/images/gallery/villa.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Spa', 'Water Sports']
  },
  {
    name: 'Kwanini Resort', city: 'Kigomasha', region: 'Pemba North',
    description: 'Eco-resort focused on community and conservation, providing a unique Pemba experience.',
    price: 300, stars: 4, rating: 4.5,
    address: 'Kigomasha Peninsula, Pemba', contact: '+255 777 000 002',
    image: 'https://themantaresort.com/wp-content/uploads/2021/08/Manta-Resort-Exterior.jpg',
    image2: 'https://themantaresort.com/wp-content/uploads/2021/08/Manta-Resort-Room.jpg',
    image3: 'https://themantaresort.com/wp-content/uploads/2021/08/Manta-Resort-Beach.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Eco Tours', 'Free WiFi']
  },

  // 19. PEMBA SOUTH
  {
    name: 'Fundu Lagoon', city: 'Wambaa', region: 'Pemba South',
    description: 'An exclusive, boat-access-only resort featuring safari-style tented bungalows.',
    price: 880, stars: 5, rating: 4.7,
    address: 'Wambaa Gulf, Pemba', contact: '+255 777 435 951',
    image: 'https://www.fundulagoon.com/img/1920/resort/superior-suite.jpg',
    image2: 'https://www.fundulagoon.com/img/1920/resort/beach7.jpg',
    image3: 'https://www.fundulagoon.com/img/1920/resort/2.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Dive Center', 'Bar', 'Boat Transfers']
  },
  {
    name: 'Pemba Misali Sunset', city: 'Weska', region: 'Pemba South',
    description: 'Offering beautiful sunset views and proximity to Misali Island Marine Park.',
    price: 180, stars: 4, rating: 4.3,
    address: 'Weska Coast, Pemba', contact: '+255 777 000 003',
    image: 'https://pembamisali.com/images/ext.jpg',
    image2: 'https://pembamisali.com/images/pool.jpg',
    image3: 'https://pembamisali.com/images/sunset.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Diving', 'Boat Trips']
  },
  {
    name: 'Emerald Bay Resort', city: 'Chake Chake', region: 'Pemba South',
    description: 'A quiet resort overlooking the emerald waters of Chake Chake bay.',
    price: 150, stars: 3, rating: 4.0,
    address: 'Chake Chake Bay', contact: '+255 777 000 004',
    image: 'https://emeraldbaypemba.com/images/bay.jpg',
    image2: 'https://emeraldbaypemba.com/images/ext.jpg',
    image3: 'https://emeraldbaypemba.com/images/room.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'AC', 'Garden']
  },

  // 20. PWANI
  {
    name: 'Millennium Sea Breeze Resort', city: 'Bagamoyo', region: 'Pwani',
    description: 'A tranquil beachfront resort blending modern luxury with local Swahili charm.',
    price: 140, stars: 3, rating: 4.1,
    address: 'Kaole Road, Bagamoyo', contact: '+255 754 556 680',
    image: 'https://www.millennium.co.tz/bui_edited.jpg',
    image2: 'https://www.millennium.co.tz/IMG-20230216-WA0002-2.jpg',
    image3: 'https://www.millennium.co.tz/IMG_1153.jpg',
    sound_url: '', amenities: ['Pool', 'Beach Access', 'Restaurant', 'Bar', 'Nightclub']
  },
  {
    name: 'Oceanic Bay Hotel & Resort', city: 'Bagamoyo', region: 'Pwani',
    description: 'A premium beachfront resort with Swahili architecture and modern amenities.',
    price: 150, stars: 4, rating: 4.2,
    address: 'Beach Front, Bagamoyo', contact: '+255 23 244 0000',
    image: 'https://oceanicbay.com/gallery/pool-area.jpg',
    image2: 'https://oceanicbay.com/gallery/beach.jpg',
    image3: 'https://oceanicbay.com/gallery/bahari-restaurant.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Beach Access']
  },
  {
    name: 'Firefly Boutique Lodge', city: 'Bagamoyo', region: 'Pwani',
    description: 'A charming boutique lodge with a pool, known for its intimate atmosphere and historic character.',
    price: 80, stars: 4, rating: 4.5,
    address: 'Old Town, Bagamoyo', contact: '+255 754 555 222',
    image: 'https://fireflycollection.co.tz/wp-content/uploads/img-16.jpg',
    image2: 'https://fireflycollection.co.tz/wp-content/uploads/img-55-2.jpg',
    image3: 'https://fireflycollection.co.tz/wp-content/uploads/about-firefly.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Garden']
  },

  // 21. RUKWA
  {
    name: 'Lake Shore Lodge', city: 'Kipili', region: 'Rukwa',
    description: 'A scenic lodge on Lake Tanganyika offering chalets and luxury tents with diving club.',
    price: 180, stars: 4, rating: 4.6,
    address: 'Kipili, Lake Tanganyika', contact: '+255 777 000 111',
    image: 'https://images.squarespace-cdn.com/content/v1/53678002e4b097321523497b/1550518335359-E8YCHIDCHQY2A3469N6V/Lake+Shore+Lodge+Beach+Fire+at+Sunset.jpg',
    image2: 'https://images.squarespace-cdn.com/content/v1/53678002e4b097321523497b/1402220377484-S3Y3D02FMT826HBC8G33/LSL+017.jpg',
    image3: 'https://images.squarespace-cdn.com/content/v1/53678002e4b097321523497b/1402220366432-8D9C0C3N0C8K9N0G3C9S/LSL+015.jpg',
    sound_url: '', amenities: ['Spa', 'Diving', 'Private Beach', 'Restaurant', 'Bar']
  },
  {
    name: 'Ufipa Highland’s Hotel', city: 'Sumbawanga', region: 'Rukwa',
    description: 'A pet-friendly hotel in Sumbawanga offering basic comfortable rooms and parking.',
    price: 55, stars: 3, rating: 3.9,
    address: 'Sumbawanga Center', contact: '+255 737 133 731',
    image: 'https://ufipahighlands.com/images/ext.jpg',
    image2: 'https://ufipahighlands.com/images/view.jpg',
    image3: 'https://ufipahighlands.com/images/room.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Parking', 'Pet Friendly']
  },
  {
    name: 'Country Hotel Sumbawanga', city: 'Sumbawanga', region: 'Rukwa',
    description: 'Central hotel in Sumbawanga providing convenient access to regional attractions.',
    price: 45, stars: 3, rating: 3.7,
    address: 'Sumbawanga Town', contact: '+255 25 282 0000',
    image: 'https://countrysumbawanga.com/images/ext.jpg',
    image2: 'https://countrysumbawanga.com/images/room.jpg',
    image3: 'https://countrysumbawanga.com/images/restaurant.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Parking']
  },

  // 22. RUVUMA
  {
    name: 'Bwawani Gardens', city: 'Songea', region: 'Ruvuma',
    description: 'A property near the airport featuring a range of recreational activities.',
    price: 65, stars: 3, rating: 4.0,
    address: 'Songea Town Center', contact: '+255 777 000 000',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/228892461.jpg',
    image2: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/228892465.jpg',
    image3: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/228892468.jpg',
    sound_url: '', amenities: ['Pool', 'Sauna', 'Restaurant', 'Free WiFi', 'Airport Shuttle']
  },
  {
    name: 'Fancy Hill Hotel', city: 'Songea', region: 'Ruvuma',
    description: 'A centrally located hotel near Songea Cathedral with city views and AC.',
    price: 40, stars: 3, rating: 3.8,
    address: 'Songea Center', contact: '+255 25 260 0001',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/415555622.jpg',
    image2: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/415555625.jpg',
    image3: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/415555628.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'AC', 'City View']
  },
  {
    name: 'Mbambabay Biocamp Lodge', city: 'Mbamba Bay', region: 'Ruvuma',
    description: 'An eco-friendly lodge on the shores of Lake Nyasa, perfect for tranquility.',
    price: 80, stars: 4, rating: 4.4,
    address: 'Mbamba Bay, Lake Nyasa', contact: '+255 777 000 222',
    image: 'https://mbambabay-biocamp.com/wp-content/uploads/2024/01/Bungalow-Exterior.jpg',
    image2: 'https://mbambabay-biocamp.com/wp-content/uploads/2024/01/Lake-Nyasa-View.jpg',
    image3: 'https://mbambabay-biocamp.com/wp-content/uploads/2024/01/Beach-Relaxing.jpg',
    sound_url: '', amenities: ['Lake Access', 'Eco Friendly', 'Restaurant', 'Water Sports']
  },

  // 23. SHINYANGA
  {
    name: 'Karena Hotel', city: 'Shinyanga', region: 'Shinyanga',
    description: 'Caters primarily to business travelers with clean facilities and professional service.',
    price: 55, stars: 3, rating: 3.8,
    address: 'Shinyanga City', contact: '+255 777 000 000',
    image: 'https://ak-d.tripcdn.com/images/0MS3h120008w6o63004F4_R_600_400_R5.jpg',
    image2: 'https://ak-d.tripcdn.com/images/0MS1f120008w6o6w9D1C3_R_600_400_R5.jpg',
    image3: 'https://ak-d.tripcdn.com/images/0MS27120008w6oa5fD24F_R_600_400_R5.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Business Center', 'AC']
  },
  {
    name: 'Buzwagi View Hotel', city: 'Kahama', region: 'Shinyanga',
    description: 'A 3-star hotel offering English breakfast and on-site restaurant in Kahama.',
    price: 60, stars: 3, rating: 4.0,
    address: 'Kahama Center', contact: '+255 754 000 333',
    image: 'https://images.trvl-media.com/lodging/39000000/38940000/38936600/38936551/97a58a74.jpg',
    image2: 'https://images.trvl-media.com/lodging/39000000/38940000/38936600/38936551/11690000.jpg',
    image3: 'https://images.trvl-media.com/lodging/39000000/38940000/38936600/38936551/6e527b1a.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Breakfast Included']
  },
  {
    name: 'The Levels By 101 Hotel', city: 'Kahama', region: 'Shinyanga',
    description: 'Modern 4-star option in the region featuring an outdoor pool and fitness facilities.',
    price: 90, stars: 4, rating: 4.2,
    address: 'Kahama, Shinyanga', contact: '+255 777 101 101',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/415555622.jpg',
    image2: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/415555625.jpg',
    image3: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/415555628.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Free WiFi']
  },

  // 24. SIMIYU
  {
    name: 'Speke Bay Lodge', city: 'Busega', region: 'Simiyu',
    description: 'A unique lodge built like a small village on the shores of Lake Victoria.',
    price: 185, stars: 4, rating: 4.5,
    address: 'Speke Bay, Lake Victoria', contact: '+255 28 262 1011',
    image: 'https://www.eastafricacamps.com/wp-content/uploads/2020/02/speke-bay-lodge-tanzania.jpg',
    image2: 'https://www.eastafricacamps.com/wp-content/uploads/2020/02/speke-bay-lodge-pool.jpg',
    image3: 'https://www.eastafricacamps.com/wp-content/uploads/2020/02/speke-bay-lodge-bungalow.jpg',
    sound_url: '', amenities: ['Lake View', 'Restaurant', 'Bar', 'Garden', 'Boat Trips']
  },
  {
    name: 'Mbalageti Serengeti', city: 'Serengeti', region: 'Simiyu',
    description: 'A luxury 5-star lodge in the Western Corridor with breathtaking views of the plains.',
    price: 450, stars: 5, rating: 4.7,
    address: 'Serengeti Western Corridor', contact: '+255 784 111 444',
    image: 'https://mbalageti.com/wp-content/uploads/2021/08/Mbalageti-Serengeti-Exterior.jpg',
    image2: 'https://mbalageti.com/wp-content/uploads/2021/08/Mbalageti-Serengeti-Pool.jpg',
    image3: 'https://mbalageti.com/wp-content/uploads/2021/08/Mbalageti-Serengeti-Sunset.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Game Drives']
  },
  {
    name: 'Simiyu Hotel', city: 'Bariadi', region: 'Simiyu',
    description: 'Town hotel in Bariadi offering basic amenities and gateway to the Serengeti.',
    price: 45, stars: 2, rating: 3.5,
    address: 'Bariadi Center', contact: '+255 754 000 555',
    image: 'https://simiyuhotel.com/images/ext.jpg',
    image2: 'https://simiyuhotel.com/images/room.jpg',
    image3: 'https://simiyuhotel.com/images/bar.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Parking']
  },

  // 25. SINGIDA
  {
    name: 'Regency Hotel & Resort', city: 'Singida', region: 'Singida',
    description: 'Situated on the shores of Lake Singidani, offering a tranquil escape.',
    price: 65, stars: 3, rating: 4.1,
    address: 'Nyerere Road, Singida', contact: '+255 26 250 2141',
    image: 'https://regencysingida.com/images/ext.jpg',
    image2: 'https://regencysingida.com/images/lake.jpg',
    image3: 'https://regencysingida.com/images/room.jpg',
    sound_url: '', amenities: ['Pool', 'Lake View', 'Restaurant', 'Bar', 'Free WiFi']
  },
  {
    name: 'Lake View Resort Singida', city: 'Singida', region: 'Singida',
    description: 'Offering quiet surroundings and basic modern amenities along the B141 road.',
    price: 50, stars: 3, rating: 3.9,
    address: 'B141 Road, Singida', contact: '+255 754 000 666',
    image: 'https://lakeviewresortsingida.com/images/ext.jpg',
    image2: 'https://lakeviewresortsingida.com/images/view.jpg',
    image3: 'https://lakeviewresortsingida.com/images/room.jpg',
    sound_url: '', amenities: ['Restaurant', 'Free WiFi', 'Parking', 'Lake View']
  },
  {
    name: 'Stanley Hotel Singida', city: 'Singida', region: 'Singida',
    description: 'Conveniently located town hotel with standard rooms and local dining.',
    price: 40, stars: 2, rating: 3.6,
    address: 'Singida Town Center', contact: '+255 754 000 777',
    image: 'https://stanleyhotelsingida.com/images/ext.jpg',
    image2: 'https://stanleyhotelsingida.com/images/room.jpg',
    image3: 'https://stanleyhotelsingida.com/images/bar.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Parking']
  },

  // 26. SONGWE
  {
    name: 'Gracious Hotel', city: 'Vwawa', region: 'Songwe',
    description: 'The premier budget hotel in Vwawa Town offering clean rooms and high-speed Wi-Fi.',
    price: 35, stars: 3, rating: 4.2,
    address: 'Ichenjezya, Vwawa', contact: '+255 204 173 80',
    image: 'https://gracioushotels.com/images/uploads/653/3816_756home__2_.jpg',
    image2: 'https://gracioushotels.com/images/uploads/653/3816_756home__2_.jpg',
    image3: 'https://gracioushotels.com/images/uploads/logos/3816_Gracious_hotel_logo.jpeg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Breakfast Included', 'Parking']
  },
  {
    name: 'Airport View Hotel Songwe', city: 'Mbalizi', region: 'Songwe',
    description: 'Conveniently located near the Songwe Airport with restaurant and bar.',
    price: 55, stars: 3, rating: 4.0,
    address: 'Mbalizi, Songwe', contact: '+255 754 000 888',
    image: 'https://airportviewsongwe.com/images/ext.jpg',
    image2: 'https://airportviewsongwe.com/images/room.jpg',
    image3: 'https://airportviewsongwe.com/images/restaurant.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Parking', 'Airport Shuttle']
  },
  {
    name: 'Mlowo Hotel', city: 'Mlowo', region: 'Songwe',
    description: 'A key transit hotel in the Mlowo area providing comfortable rest for travelers.',
    price: 30, stars: 2, rating: 3.5,
    address: 'Mlowo Center', contact: '+255 754 000 999',
    image: 'https://mlowohotel.com/images/ext.jpg',
    image2: 'https://mlowohotel.com/images/room.jpg',
    image3: 'https://mlowohotel.com/images/bar.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Parking']
  },

  // 27. TABORA
  {
    name: 'Leah Amenities', city: 'Tabora', region: 'Tabora',
    description: 'An exquisite retreat blending modern elegance with traditional charm.',
    price: 105, stars: 5, rating: 4.5,
    address: 'Cheyo Street, Tabora City', contact: '+255 777 000 000',
    image: 'https://a0.muscache.com/im/pictures/miso/Hosting-893278556608821931/original/7f59d8c7-2b73-4f9e-a616-d8d85f6e87f7.jpeg',
    image2: 'https://a0.muscache.com/im/pictures/miso/Hosting-893278556608821931/original/8e54721a-2b73-4f9e-a616-d8d85f6e87f7.jpeg',
    image3: 'https://a0.muscache.com/im/pictures/miso/Hosting-893278556608821931/original/c8e54721-2b73-4f9e-a616-d8d85f6e87f7.jpeg',
    sound_url: '', amenities: ['Restaurant', 'Free WiFi', 'Room Service', 'AC', 'Parking']
  },
  {
    name: 'Orion Tabora Hotel', city: 'Tabora', region: 'Tabora',
    description: 'A historic hotel with colonial German architecture and relaxing gardens.',
    price: 40, stars: 4, rating: 4.1,
    address: 'Main St., Tabora', contact: '+255 26 260 0000',
    image: 'https://www.portfoliocollection.com/media/com_jbusinessdirectory/pictures/companies/568/1510129704_orion-tabora-hotel.jpg',
    image2: 'https://www.portfoliocollection.com/media/com_jbusinessdirectory/pictures/companies/568/1510129704_orion-garden.jpg',
    image3: 'https://www.portfoliocollection.com/media/com_jbusinessdirectory/pictures/companies/568/1510129704_orion-room.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Garden', 'Free WiFi', 'Historic']
  },
  {
    name: 'Tabora Belmonte Hotel', city: 'Tabora', region: 'Tabora',
    description: 'Budget-friendly hotel in the heart of Tabora offering essential services.',
    price: 30, stars: 3, rating: 3.7,
    address: 'Tabora Center', contact: '+255 754 001 111',
    image: 'https://taborabelmonte.com/images/ext.jpg',
    image2: 'https://taborabelmonte.com/images/room.jpg',
    image3: 'https://taborabelmonte.com/images/bar.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'AC']
  },

  // 28. TANGA
  {
    name: 'Tanga Beach Resort', city: 'Tanga', region: 'Tanga',
    description: 'The premier resort in Tanga, offering ocean views and family-friendly activities.',
    price: 115, stars: 4, rating: 4.3,
    address: 'Sahare Area, Tanga', contact: '+255 785 171 717',
    image: 'https://www.tangabeachresort.com/images/gallery/ext.jpg',
    image2: 'https://www.tangabeachresort.com/images/gallery/pool.jpg',
    image3: 'https://www.tangabeachresort.com/images/gallery/beach.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Beach Access']
  },
  {
    name: 'La Casa Preciosa', city: 'Tanga', region: 'Tanga',
    description: 'Charming boutique hotel in Tanga known for its comfort and hospitality.',
    price: 75, stars: 4, rating: 4.4,
    address: 'Bomani Avenue, Tanga', contact: '+255 710 288 847',
    image: 'https://static.wixstatic.com/media/2f6645_8f566412f5674099951660f772589574~mv2.jpg',
    image2: 'https://static.wixstatic.com/media/2f6645_114e2aea3faf4a8a9a08c6c87857c5a6~mv2.jpg',
    image3: 'https://static.wixstatic.com/media/2f6645_1b7e39c32ca24ac4b6e420a220822a06~mv2.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'AC', 'Garden']
  },
  {
    name: 'Silverado Boutique Hotel', city: 'Tanga', region: 'Tanga',
    description: 'Boutique hotel offering modern facilities and elegant rooms in Tanga.',
    price: 90, stars: 4, rating: 4.2,
    address: 'Bomani Avenue, Tanga', contact: '+255 27 264 5881',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/336423021.jpg',
    image2: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/336423025.jpg',
    image3: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/336423028.jpg',
    sound_url: '', amenities: ['Restaurant', 'Bar', 'Free WiFi', 'AC', 'Gym']
  },

  // 29. ZANZIBAR - MJINI MAGHARIBI (Stone Town)
  {
    name: 'Park Hyatt Zanzibar', city: 'Stone Town', region: 'Mjini Magharibi',
    description: 'A luxury waterfront hotel in a historic Stone Town building featuring Arabesque architecture.',
    price: 450, stars: 5, rating: 4.5,
    address: 'Shangani Street, Stone Town', contact: '+255 777 333 444',
    image: 'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/12/31/1545/ZANPH-P002-Exterior.jpg/ZANPH-P002-Exterior.16x9.jpg',
    image2: 'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/12/31/1545/ZANPH-P010-Pool.jpg/ZANPH-P010-Pool.16x9.jpg',
    image3: 'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/12/31/1545/ZANPH-P015-Suite.jpg/ZANPH-P015-Suite.16x9.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Concierge']
  },
  {
    name: 'Zanzibar Serena Hotel', city: 'Stone Town', region: 'Mjini Magharibi',
    description: 'Experience the essence of Stone Town at this seafront hotel with Swahili-style architecture.',
    price: 380, stars: 5, rating: 4.6,
    address: 'Stone Town Seafront', contact: '+255 777 000 005',
    image: 'https://www.serenahotels.com/sites/default/files/styles/hero_image_desktop/public/2021-11/Zanzibar-Serena-Hotel-Exterior.jpg',
    image2: 'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-11/Zanzibar-Serena-Hotel-Pool.jpg',
    image3: 'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-11/Zanzibar-Serena-Hotel-Room.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Beach Access', 'Free WiFi']
  },
  {
    name: 'Tembo House Hotel', city: 'Stone Town', region: 'Mjini Magharibi',
    description: 'A historic hotel with wood-carved furniture and beachfront pools in the heart of Stone Town.',
    price: 150, stars: 4, rating: 4.3,
    address: 'Forodhani St., Stone Town', contact: '+255 777 000 006',
    image: 'https://www.tembohotel.com/images/gallery/ext.jpg',
    image2: 'https://www.tembohotel.com/images/gallery/pool.jpg',
    image3: 'https://www.tembohotel.com/images/gallery/beach.jpg',
    sound_url: '', amenities: ['Pool', 'Restaurant', 'Free WiFi', 'Beach Front', 'Historic']
  },

  // 30. ZANZIBAR - UNGUJA NORTH
  {
    name: 'Riu Palace Zanzibar', city: 'Nungwi', region: 'Unguja North',
    description: 'A 5-star adults-only all-inclusive beachfront resort with direct access to Nungwi sands.',
    price: 380, stars: 5, rating: 4.6,
    address: 'Nungwi Beach, Zanzibar', contact: '+255 777 111 222',
    image: 'https://www.riu.com/dam/Ficha-Hotel/Hotel-Riu-Palace-Zanzibar/Hero/hero-slide-hotel-riu-palace-zanzibar.jpg',
    image2: 'https://www.riu.com/dam/Ficha-Hotel/Hotel-Riu-Palace-Zanzibar/Piscinas/pool-hotel-riu-palace-zanzibar-5.jpg',
    image3: 'https://www.riu.com/dam/Ficha-Hotel/Hotel-Riu-Palace-Zanzibar/Habitaciones/room-hotel-riu-palace-zanzibar-1.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'All Inclusive']
  },
  {
    name: 'Zuri Zanzibar', city: 'Kendwa', region: 'Unguja North',
    description: 'Luxury bungalows and spice gardens on the pristine Kendwa beach.',
    price: 550, stars: 5, rating: 4.8,
    address: 'Kendwa Beach, Zanzibar', contact: '+255 777 000 007',
    image: 'https://www.zurizanzibar.com/images/gallery/ext.jpg',
    image2: 'https://www.zurizanzibar.com/images/gallery/beach.jpg',
    image3: 'https://www.zurizanzibar.com/images/gallery/villa.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Garden', 'Beach Access']
  },
  {
    name: 'Royal Zanzibar Beach Resort', city: 'Nungwi', region: 'Unguja North',
    description: 'Highlighting infinity pools and direct Nungwi beach views.',
    price: 420, stars: 5, rating: 4.6,
    address: 'Nungwi, Zanzibar', contact: '+255 777 000 008',
    image: 'https://www.royalzanzibar.com/images/gallery/ext.jpg',
    image2: 'https://www.royalzanzibar.com/images/gallery/pool.jpg',
    image3: 'https://www.royalzanzibar.com/images/gallery/dining.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Beach Access']
  },

  // 31. ZANZIBAR - UNGUJA SOUTH
  {
    name: 'Baraza Resort & Spa', city: 'Bwejuu', region: 'Unguja South',
    description: 'An ultra-luxury all-inclusive boutique resort blending Swahili, Arabic and Indian architecture.',
    price: 600, stars: 5, rating: 4.7,
    address: 'Bwejuu Beach, Zanzibar', contact: '+255 777 222 333',
    image: 'https://www.baraza-zanzibar.com/images/gallery/ext.jpg',
    image2: 'https://www.baraza-zanzibar.com/images/gallery/pool.jpg',
    image3: 'https://www.baraza-zanzibar.com/images/gallery/spa.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Beach Access', 'All Inclusive']
  },
  {
    name: 'The Palms Zanzibar', city: 'Bwejuu', region: 'Unguja South',
    description: 'Private villas and intimate dining settings for an exclusive island getaway.',
    price: 750, stars: 5, rating: 4.8,
    address: 'Bwejuu Beach, Zanzibar', contact: '+255 777 000 009',
    image: 'https://www.palms-zanzibar.com/images/gallery/ext.jpg',
    image2: 'https://www.palms-zanzibar.com/images/gallery/villa.jpg',
    image3: 'https://www.palms-zanzibar.com/images/gallery/beach.jpg',
    sound_url: '', amenities: ['Pool', 'Spa', 'Private Beach', 'Restaurant', 'Bar']
  },
  {
    name: 'Qambani Luxury Resort', city: 'Michamvi', region: 'Unguja South',
    description: 'Uniquely designed villas and tropical grounds on the Michamvi peninsula.',
    price: 580, stars: 5, rating: 4.7,
    address: 'Michamvi, Zanzibar', contact: '+255 777 000 010',
    image: 'https://www.qambani.com/images/gallery/ext.jpg',
    image2: 'https://www.qambani.com/images/gallery/pool.jpg',
    image3: 'https://www.qambani.com/images/gallery/garden.jpg',
    sound_url: '', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'Free WiFi', 'Garden']
  }
];

module.exports = hotels;
