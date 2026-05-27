// Database abstraction layer supporting local storage fallback and Supabase compatibility.

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  offerBadge?: string;
  stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock';
  featured: boolean;
  newArrival: boolean;
}

export interface Category {
  slug: string;
  name: string;
  iconName: string;
  image: string;
  count: number;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  productName?: string;
  date: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  image: string;
  active: boolean;
}

export interface ShopInfo {
  name: string;
  tagline: string;
  location: string;
  phone: string;
  hours: string;
  owner: string;
  cashWithdrawal: boolean;
  formFilling: boolean;
}

const CATEGORIES: Category[] = [
  { slug: 'notebook', name: 'Notebooks', iconName: 'Book', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=60', count: 10 },
  { slug: 'pen-pencil', name: 'Pens & Pencils', iconName: 'PenTool', image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=60', count: 10 },
  { slug: 'eraser', name: 'Erasers', iconName: 'Eraser', image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=500&auto=format&fit=crop&q=60', count: 3 },
  { slug: 'sharpener', name: 'Sharpeners', iconName: 'Scissors', image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=500&auto=format&fit=crop&q=60', count: 3 },
  { slug: 'geometry-box', name: 'Geometry Box', iconName: 'Box', image: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=500&auto=format&fit=crop&q=60', count: 3 },
  { slug: 'school-bag', name: 'School Bags', iconName: 'Backpack', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60', count: 4 },
  { slug: 'files-folders', name: 'Files & Folders', iconName: 'FolderClosed', image: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=500&auto=format&fit=crop&q=60', count: 3 },
  { slug: 'art-craft', name: 'Art & Craft Items', iconName: 'Palette', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=60', count: 4 },
  { slug: 'office-stationery', name: 'Office Stationery', iconName: 'Briefcase', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60', count: 4 },
  { slug: 'school-books', name: 'School Books', iconName: 'BookOpen', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60', count: 4 },
  { slug: 'competitive-books', name: 'Competitive Exam Books', iconName: 'GraduationCap', image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&auto=format&fit=crop&q=60', count: 5 }
];

const SEED_PRODUCTS: Product[] = [
  // Notebooks
  { id: 'nb-1', name: 'Small Copy', price: 25, originalPrice: 30, category: 'notebook', image: 'https://images.unsplash.com/photo-1612367980327-7454a7276aa7?w=500&auto=format&fit=crop&q=60', description: 'Pocket sized standard single line small copy for daily notes and homework.', stockStatus: 'in_stock', featured: false, newArrival: true },
  { id: 'nb-2', name: 'Classmate Notebook', price: 45, originalPrice: 50, category: 'notebook', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=60', description: 'High quality classmate notebook with premium white papers.', offerBadge: 'Best Seller', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'nb-3', name: 'Long Notebook', price: 60, originalPrice: 70, category: 'notebook', image: 'https://images.unsplash.com/photo-1598620617148-c9e8ddee6711?w=500&auto=format&fit=crop&q=60', description: 'Long copy for school and college use with standard ruling.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'nb-4', name: 'Practical Copy', price: 70, originalPrice: 80, category: 'notebook', image: 'https://plus.unsplash.com/premium_photo-1683309567810-4d232ee83d2f?w=500&auto=format&fit=crop&q=60', description: 'Practical workbook with alternate blank and ruled pages for science experiments.', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'nb-5', name: 'Drawing Copy', price: 80, originalPrice: 90, category: 'notebook', image: 'https://images.unsplash.com/photo-1683921045461-b8dc5ad37740?w=500&auto=format&fit=crop&q=60', description: 'Plain white pages drawing book, ideal for kids and hobby artists.', stockStatus: 'in_stock', featured: false, newArrival: true },
  { id: 'nb-6', name: 'A4 Notebook', price: 90, originalPrice: 100, category: 'notebook', image: 'https://images.unsplash.com/photo-1601001435957-74f0958a93fb?w=500&auto=format&fit=crop&q=60', description: 'Large A4 size notebook for comprehensive notes.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'nb-7', name: 'College Notebook', price: 110, originalPrice: 130, category: 'notebook', image: 'https://plus.unsplash.com/premium_photo-1664368832368-9d6b5f88a516?w=500&auto=format&fit=crop&q=60', description: '3-subject spiral bound notebook for college students.', offerBadge: '15% OFF', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'nb-8', name: 'Spiral Notebook', price: 120, originalPrice: 140, category: 'notebook', image: 'https://images.unsplash.com/photo-1587135991058-8816b028691f?w=500&auto=format&fit=crop&q=60', description: 'Flexible spiral binding notebook with high durability.', stockStatus: 'low_stock', featured: true, newArrival: true },
  { id: 'nb-9', name: 'Register Book', price: 150, originalPrice: 180, category: 'notebook', image: 'https://images.unsplash.com/photo-1647559709298-c0e3dcb47092?w=500&auto=format&fit=crop&q=60', description: 'Hardcover thick register for official record-keeping.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'nb-10', name: 'Premium Hard Cover Notebook', price: 180, originalPrice: 200, category: 'notebook', image: 'https://plus.unsplash.com/premium_photo-1774350362692-8542d5035295?w=500&auto=format&fit=crop&q=60', description: 'Elegant luxury notebook with leatherette hard cover and ribbon bookmark.', offerBadge: 'Premium', stockStatus: 'in_stock', featured: true, newArrival: false },

  // Pen & Pencil
  { id: 'pp-1', name: 'Ball Pen', price: 5, category: 'pen-pencil', image: 'https://plus.unsplash.com/premium_photo-1683120746952-651521089299?w=500&auto=format&fit=crop&q=60', description: 'Smooth writing budget blue/black ballpoint pen.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'pp-2', name: 'Cello Pen', price: 10, category: 'pen-pencil', image: 'https://images.unsplash.com/photo-1623228639000-3c9f7908dc88?w=500&auto=format&fit=crop&q=60', description: 'Popular Cello Butterflow ball pen for effortlessly fast writing.', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'pp-3', name: 'Gel Pen', price: 15, category: 'pen-pencil', image: 'https://images.unsplash.com/photo-1568205612837-017257d2310a?w=500&auto=format&fit=crop&q=60', description: 'Smudge-proof waterproof ink gel pen.', stockStatus: 'in_stock', featured: false, newArrival: true },
  { id: 'pp-4', name: 'Reynolds Pen', price: 20, category: 'pen-pencil', image: 'https://images.unsplash.com/photo-1565359184520-fcff70f99c24?w=500&auto=format&fit=crop&q=60', description: 'Classic Reynolds 045 fine carbure ballpoint pen.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'pp-5', name: 'Trimax Pen', price: 25, originalPrice: 30, category: 'pen-pencil', image: 'https://plus.unsplash.com/premium_photo-1663040669845-e4ff569ee5f7?w=500&auto=format&fit=crop&q=60', description: 'Pilot Trimax gel pen with refillable fluid ink system.', offerBadge: 'Popular', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'pp-6', name: 'Marker Pen', price: 30, category: 'pen-pencil', image: 'https://images.unsplash.com/photo-1605641987825-c1664626d79f?w=500&auto=format&fit=crop&q=60', description: 'Permanent black/blue board marker.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'pp-7', name: 'Highlighter', price: 50, category: 'pen-pencil', image: 'https://images.unsplash.com/photo-1587366802443-f5690cfebc79?w=500&auto=format&fit=crop&q=60', description: 'Fluorescent green highlight pen for markings.', stockStatus: 'in_stock', featured: false, newArrival: true },
  { id: 'pp-8', name: 'Pencil Pack', price: 20, originalPrice: 25, category: 'pen-pencil', image: 'https://images.unsplash.com/photo-1510936994138-07e06c7c5add?w=500&auto=format&fit=crop&q=60', description: 'Pack of 10 Apsara/Nataraj extra dark pencils with eraser & sharpener.', offerBadge: 'Pack Offer', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'pp-9', name: 'Color Pencil Set', price: 60, category: 'pen-pencil', image: 'https://plus.unsplash.com/premium_photo-1670958553886-d41ba40061df?w=500&auto=format&fit=crop&q=60', description: '12 shades color pencil set for school art assignments.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'pp-10', name: 'Sketch Pen Set', price: 80, originalPrice: 100, category: 'pen-pencil', image: 'https://images.unsplash.com/photo-1517237284472-3b62e4863e4b?w=500&auto=format&fit=crop&q=60', description: 'Pack of 12 vibrant watercolor sketch pens.', offerBadge: '20% OFF', stockStatus: 'in_stock', featured: false, newArrival: true },

  // Eraser
  { id: 'er-1', name: 'Small Eraser', price: 5, category: 'eraser', image: 'https://images.unsplash.com/photo-1698365902200-360ea4eea247?w=500&auto=format&fit=crop&q=60', description: 'Small non-dust clean eraser.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'er-2', name: 'Dust Free Eraser', price: 10, category: 'eraser', image: 'https://images.unsplash.com/photo-1593171333952-6a8da72d1877?w=500&auto=format&fit=crop&q=60', description: 'Apsara dust-free eraser for clean rubbings.', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'er-3', name: 'Fancy Cartoon Eraser', price: 20, category: 'eraser', image: 'https://plus.unsplash.com/premium_photo-1723579332266-3a387cf58377?w=500&auto=format&fit=crop&q=60', description: 'Fun shaped multi-colored eraser toys for school kids.', offerBadge: 'Kids Favorite', stockStatus: 'in_stock', featured: false, newArrival: true },

  // Sharpener
  { id: 'sh-1', name: 'Small Sharpener', price: 5, category: 'sharpener', image: 'https://images.unsplash.com/photo-1559312171-dd6390da4fa8?w=500&auto=format&fit=crop&q=60', description: 'Regular single-hole plastic sharpener.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'sh-2', name: 'Double Sharpener', price: 15, category: 'sharpener', image: 'https://images.unsplash.com/photo-1588014328030-b82fb9b89ba3?w=500&auto=format&fit=crop&q=60', description: 'Dual hole sharpener for standard and jumbo pencils.', stockStatus: 'in_stock', featured: false, newArrival: true },
  { id: 'sh-3', name: 'Fancy Sharpener', price: 25, category: 'sharpener', image: 'https://plus.unsplash.com/premium_photo-1669904022364-2395d17d24c1?w=500&auto=format&fit=crop&q=60', description: 'Cute cartoon shaped sharpener with dust collector box.', offerBadge: 'Trending', stockStatus: 'in_stock', featured: true, newArrival: false },

  // Geometry Box
  { id: 'gb-1', name: 'Basic Geometry Box', price: 80, originalPrice: 90, category: 'geometry-box', image: 'https://images.unsplash.com/photo-1631193816258-28b44b21e78b?w=500&auto=format&fit=crop&q=60', description: 'Budget geometry set containing compass, divider, ruler, and set-squares.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'gb-2', name: 'Camlin Geometry Box', price: 150, originalPrice: 170, category: 'geometry-box', image: 'https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?w=500&auto=format&fit=crop&q=60', description: 'Camlin Flora classic precision mathematical drawing instruments set.', offerBadge: 'Best Value', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'gb-3', name: 'Premium Box', price: 250, originalPrice: 300, category: 'geometry-box', image: 'https://images.unsplash.com/photo-1549637642-90187f64f420?w=500&auto=format&fit=crop&q=60', description: 'Metal alloy heavy-duty premium math setup with click-lock cases.', offerBadge: 'Premium', stockStatus: 'in_stock', featured: false, newArrival: true },

  // School Bags
  { id: 'sb-1', name: 'Kids School Bag', price: 450, originalPrice: 500, category: 'school-bag', image: 'https://plus.unsplash.com/premium_photo-1663127330677-8d15656d6c39?w=500&auto=format&fit=crop&q=60', description: 'Small sized school bag with colorful animated design for young children.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'sb-2', name: 'Cartoon Bag', price: 650, originalPrice: 750, category: 'school-bag', image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=500&auto=format&fit=crop&q=60', description: 'Premium cartoon print bag with heavy cushioning and multiple pockets.', offerBadge: 'Sale', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'sb-3', name: 'Waterproof Bag', price: 850, originalPrice: 1000, category: 'school-bag', image: 'https://images.unsplash.com/photo-1726726192148-af52008ff663?w=500&auto=format&fit=crop&q=60', description: 'High durability waterproof polyester school bag with rain cover.', offerBadge: 'Waterproof', stockStatus: 'in_stock', featured: false, newArrival: true },
  { id: 'sb-4', name: 'College Backpack', price: 1200, originalPrice: 1500, category: 'school-bag', image: 'https://images.unsplash.com/photo-1622560481156-01fc7e1693e6?w=500&auto=format&fit=crop&q=60', description: 'Premium large college backpack with integrated laptop compartment.', offerBadge: 'Hot Item', stockStatus: 'in_stock', featured: true, newArrival: false },

  // Files & Folders
  { id: 'ff-1', name: 'Plastic File', price: 25, category: 'files-folders', image: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=500&auto=format&fit=crop&q=60', description: 'L-shape transparent plastic folder for project reports.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'ff-2', name: 'Office Folder', price: 60, category: 'files-folders', image: 'https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?w=500&auto=format&fit=crop&q=60', description: 'Sturdy hard board clip file folder for certificates.', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'ff-3', name: 'Document File', price: 120, originalPrice: 150, category: 'files-folders', image: 'https://images.unsplash.com/photo-1560264280-88b68371db39?w=500&auto=format&fit=crop&q=60', description: 'Multi-pocket expanding file bag to organize documents.', offerBadge: '20% OFF', stockStatus: 'in_stock', featured: false, newArrival: true },

  // Art & Craft
  { id: 'ac-1', name: 'Crayons', price: 40, category: 'art-craft', image: 'https://images.unsplash.com/photo-1572521165329-b197f9ea3da6?w=500&auto=format&fit=crop&q=60', description: 'Pack of 12 bright oil pastel crayons.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'ac-2', name: 'Water Color', price: 80, originalPrice: 100, category: 'art-craft', image: 'https://plus.unsplash.com/premium_photo-1661931749081-23d69ddb62d1?w=500&auto=format&fit=crop&q=60', description: 'Palette set of 12 cake watercolors with premium brush.', offerBadge: 'Best Seller', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'ac-3', name: 'Craft Paper Set', price: 120, category: 'art-craft', image: 'https://plus.unsplash.com/premium_photo-1681487178876-a1156952ec60?w=500&auto=format&fit=crop&q=60', description: '50 sheets multi-color origami craft paper pack.', stockStatus: 'in_stock', featured: false, newArrival: true },
  { id: 'ac-4', name: 'Glitter Pack', price: 50, category: 'art-craft', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=500&auto=format&fit=crop&q=60', description: '6 tubes glitter glue set for project decorations.', stockStatus: 'in_stock', featured: false, newArrival: false },

  // Office Stationery
  { id: 'os-1', name: 'Stapler', price: 120, category: 'office-stationery', image: 'https://plus.unsplash.com/premium_photo-1661963899181-3adc0a644f7b?w=500&auto=format&fit=crop&q=60', description: 'Heavy duty metallic stapler including 1 pin box.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'os-2', name: 'Punch Machine', price: 180, category: 'office-stationery', image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=500&auto=format&fit=crop&q=60', description: '2-hole metallic paper punch machine.', stockStatus: 'in_stock', featured: false, newArrival: true },
  { id: 'os-3', name: 'Calculator', price: 350, originalPrice: 400, category: 'office-stationery', image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=500&auto=format&fit=crop&q=60', description: '12-digit desktop basic business calculator.', offerBadge: 'Popular', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'os-4', name: 'Office Register', price: 150, category: 'office-stationery', image: 'https://plus.unsplash.com/premium_photo-1683880731785-e5b632e0ea13?w=500&auto=format&fit=crop&q=60', description: 'Ruled high page register for record-keeping and attendance.', stockStatus: 'in_stock', featured: false, newArrival: false },

  // School Books
  { id: 'sbk-1', name: 'NCERT Books', price: 150, category: 'school-books', image: 'https://plus.unsplash.com/premium_photo-1669652639337-c513cc42ead6?w=500&auto=format&fit=crop&q=60', description: 'Official NCERT syllabus textbooks for class 1 to 12.', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'sbk-2', name: 'CBSE Books', price: 250, category: 'school-books', image: 'https://images.unsplash.com/photo-1517770413964-df8ca61194a6?w=500&auto=format&fit=crop&q=60', description: 'Reference guides and textbooks for CBSE board exams.', stockStatus: 'in_stock', featured: false, newArrival: true },
  { id: 'sbk-3', name: 'State Board Books', price: 120, category: 'school-books', image: 'https://images.unsplash.com/photo-1591951425600-d09958978584?w=500&auto=format&fit=crop&q=60', description: 'Official State Board school textbooks in Hindi and English.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'sbk-4', name: 'English Grammar Books', price: 180, originalPrice: 200, category: 'school-books', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&auto=format&fit=crop&q=60', description: 'Wren & Martin and other essential English grammar guidebooks.', offerBadge: 'Best Seller', stockStatus: 'in_stock', featured: true, newArrival: false },

  // Competitive Books
  { id: 'cb-1', name: 'SSC Book', price: 350, originalPrice: 400, category: 'competitive-books', image: 'https://plus.unsplash.com/premium_photo-1677187301660-5e557d9c0724?w=500&auto=format&fit=crop&q=60', description: 'SSC CGL Mathematics and English solved question bank.', offerBadge: 'Top Selling', stockStatus: 'in_stock', featured: true, newArrival: false },
  { id: 'cb-2', name: 'Railway Book', price: 280, category: 'competitive-books', image: 'https://images.unsplash.com/photo-1591951425328-48c1fe7179cd?w=500&auto=format&fit=crop&q=60', description: 'RRB NTPC Group D Reasoning and General Science guidebook.', stockStatus: 'in_stock', featured: false, newArrival: true },
  { id: 'cb-3', name: 'Banking Book', price: 400, category: 'competitive-books', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=60', description: 'IBPS PO & SBI Clerk quant and reasoning shortcuts compilation.', stockStatus: 'in_stock', featured: false, newArrival: false },
  { id: 'cb-4', name: 'UPSC Notes', price: 500, originalPrice: 600, category: 'competitive-books', image: 'https://images.unsplash.com/photo-1508169351866-777fc0047ac5?w=500&auto=format&fit=crop&q=60', description: 'Comprehensive GS notes compiled by expert educators for IAS aspirants.', offerBadge: 'Highly Rated', stockStatus: 'low_stock', featured: true, newArrival: true },
  { id: 'cb-5', name: 'Bihar Police Book', price: 320, category: 'competitive-books', image: 'https://plus.unsplash.com/premium_photo-1669652639356-f5cb1a086976?w=500&auto=format&fit=crop&q=60', description: 'Bihar Police Constable Recruitment exam practice set book.', stockStatus: 'in_stock', featured: false, newArrival: false }
];

const SEED_OFFERS: Offer[] = [
  { id: 'of-1', title: 'Festive Stationery Sale', subtitle: 'Get flat discounts on all school supply items!', discount: 'Flat 15% OFF', image: '/logo.png', active: true },
  { id: 'of-2', title: 'Back To School Combo', subtitle: 'Buy Classmate notebook bundle and get pens free!', discount: 'Combo Offers', image: '/logo.png', active: true }
];

const DEFAULT_SHOP_INFO: ShopInfo = {
  name: 'KV Pustakalaya',
  tagline: 'पढ़ाई का Perfect Partner',
  location: 'Harari Chowk',
  phone: '8340383252',
  hours: '09:00 AM to 08:00 PM',
  owner: 'Prabhat Kumar Prabhakar',
  cashWithdrawal: true,
  formFilling: true
};

const DEFAULT_MESSAGES: Inquiry[] = [
  { id: 'msg-1', name: 'Raman Singh', phone: '9876543210', message: 'Do you have the Bihar Board Class 10 Sanskrit textbooks available?', date: '2026-05-26T14:30:00Z' },
  { id: 'msg-2', name: 'Neha Kumari', phone: '8294718420', message: 'I need Classmate Register copies in bulk. Do you offer special discounts for bulk purchases?', productName: 'Register Book', date: '2026-05-27T09:15:00Z' }
];

// Helper to check if window is available
const isClient = typeof window !== 'undefined';

function getStoredData<T>(key: string, defaultValue: T): T {
  if (!isClient) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading localStorage key ' + key, error);
    return defaultValue;
  }
}

function setStoredData<T>(key: string, value: T): void {
  if (!isClient) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing localStorage key ' + key, error);
  }
}

// Database module interface
export const db = {
  // Initialize Database inside browser
  init() {
    if (!isClient) return;
    const currentSeedVersion = 'v5'; // Forced re-seed to load unique distinct product visuals
    const storedSeedVersion = localStorage.getItem('kv_seed_version');
    
    if (storedSeedVersion !== currentSeedVersion) {
      // Clear legacy storage items to force re-seed
      localStorage.removeItem('kv_products');
      localStorage.removeItem('kv_categories');
      localStorage.removeItem('kv_offers');
      localStorage.setItem('kv_seed_version', currentSeedVersion);
    }

    if (!localStorage.getItem('kv_products')) {
      setStoredData('kv_products', SEED_PRODUCTS);
    }
    if (!localStorage.getItem('kv_categories')) {
      setStoredData('kv_categories', CATEGORIES);
    }
    if (!localStorage.getItem('kv_offers')) {
      setStoredData('kv_offers', SEED_OFFERS);
    }
    if (!localStorage.getItem('kv_shop_info')) {
      setStoredData('kv_shop_info', DEFAULT_SHOP_INFO);
    }
    if (!localStorage.getItem('kv_inquiries')) {
      setStoredData('kv_inquiries', DEFAULT_MESSAGES);
    }
  },

  // Products CRUD
  getProducts(): Product[] {
    this.init();
    return getStoredData('kv_products', SEED_PRODUCTS);
  },

  getProduct(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  },

  getProductsByCategory(categorySlug: string): Product[] {
    return this.getProducts().filter(p => p.category === categorySlug);
  },

  addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: 'p-' + Math.random().toString(36).substr(2, 9)
    };
    products.push(newProduct);
    setStoredData('kv_products', products);
    this.updateCategoryCounts();
    return newProduct;
  },

  updateProduct(id: string, updatedFields: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updatedFields };
    setStoredData('kv_products', products);
    this.updateCategoryCounts();
    return products[index];
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (products.length === filtered.length) return false;
    
    setStoredData('kv_products', filtered);
    this.updateCategoryCounts();
    return true;
  },

  updateCategoryCounts() {
    const categories = this.getCategories();
    const products = this.getProducts();
    const updated = categories.map(cat => {
      const count = products.filter(p => p.category === cat.slug).length;
      return { ...cat, count };
    });
    setStoredData('kv_categories', updated);
  },

  // Categories
  getCategories(): Category[] {
    this.init();
    return getStoredData('kv_categories', CATEGORIES);
  },

  // Offers
  getOffers(): Offer[] {
    this.init();
    return getStoredData('kv_offers', SEED_OFFERS);
  },

  addOffer(offer: Omit<Offer, 'id'>): Offer {
    const offers = this.getOffers();
    const newOffer: Offer = {
      ...offer,
      id: 'of-' + Math.random().toString(36).substr(2, 9)
    };
    offers.push(newOffer);
    setStoredData('kv_offers', offers);
    return newOffer;
  },

  updateOffer(id: string, updatedFields: Partial<Offer>): Offer | null {
    const offers = this.getOffers();
    const index = offers.findIndex(o => o.id === id);
    if (index === -1) return null;

    offers[index] = { ...offers[index], ...updatedFields };
    setStoredData('kv_offers', offers);
    return offers[index];
  },

  deleteOffer(id: string): boolean {
    const offers = this.getOffers();
    const filtered = offers.filter(o => o.id !== id);
    if (offers.length === filtered.length) return false;
    setStoredData('kv_offers', filtered);
    return true;
  },

  // Shop Info
  getShopInfo(): ShopInfo {
    this.init();
    return getStoredData('kv_shop_info', DEFAULT_SHOP_INFO);
  },

  updateShopInfo(info: Partial<ShopInfo>): ShopInfo {
    const current = this.getShopInfo();
    const updated = { ...current, ...info };
    setStoredData('kv_shop_info', updated);
    return updated;
  },

  // Inquiries
  getInquiries(): Inquiry[] {
    this.init();
    const inquiries = getStoredData('kv_inquiries', DEFAULT_MESSAGES);
    // Sort descending by date
    return inquiries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addInquiry(inquiry: Omit<Inquiry, 'id' | 'date'>): Inquiry {
    const inquiries = this.getInquiries();
    const newInquiry: Inquiry = {
      ...inquiry,
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    inquiries.push(newInquiry);
    setStoredData('kv_inquiries', inquiries);
    return newInquiry;
  },

  deleteInquiry(id: string): boolean {
    const inquiries = this.getInquiries();
    const filtered = inquiries.filter(i => i.id !== id);
    if (inquiries.length === filtered.length) return false;
    setStoredData('kv_inquiries', filtered);
    return true;
  }
};
