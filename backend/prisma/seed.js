const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database with Raymond products...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@raymond.com' },
        update: {},
        create: {
            email: 'admin@raymond.com',
            password: adminPassword,
            name: 'Raymond Admin',
            role: 'ADMIN'
        }
    });
    console.log('Created admin user:', admin.email);

    // Create test user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            password: userPassword,
            name: 'John Doe',
            phone: '9876543210',
            cart: { create: {} },
            wishlist: { create: {} }
        }
    });
    console.log('Created test user:', user.email);

    // Create Raymond categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'suits-blazers' },
            update: {},
            create: {
                name: 'Suits & Blazers',
                slug: 'suits-blazers',
                description: 'Raymond premium suits and blazers - The Complete Man',
                image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'
            }
        }),
        prisma.category.upsert({
            where: { slug: 'formal-shirts' },
            update: {},
            create: {
                name: 'Formal Shirts',
                slug: 'formal-shirts',
                description: 'Raymond premium formal shirts for every occasion',
                image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'
            }
        }),
        prisma.category.upsert({
            where: { slug: 'trousers' },
            update: {},
            create: {
                name: 'Trousers',
                slug: 'trousers',
                description: 'Raymond perfectly tailored trousers',
                image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
            }
        }),
        prisma.category.upsert({
            where: { slug: 'accessories' },
            update: {},
            create: {
                name: 'Accessories',
                slug: 'accessories',
                description: 'Raymond premium accessories - Ties, cufflinks, belts',
                image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800'
            }
        }),
        prisma.category.upsert({
            where: { slug: 'ethnic-wear' },
            update: {},
            create: {
                name: 'Ethnic Wear',
                slug: 'ethnic-wear',
                description: 'Raymond Ethnix - Traditional wear with contemporary designs',
                image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'
            }
        }),
        prisma.category.upsert({
            where: { slug: 'fabrics' },
            update: {},
            create: {
                name: 'Fabrics',
                slug: 'fabrics',
                description: 'Raymond premium suiting and shirting fabrics',
                image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800'
            }
        })
    ]);
    console.log('Created categories:', categories.length);

    // Raymond Products with authentic styling
    const products = [
        // ==================== SUITS & BLAZERS ====================
        {
            name: 'Raymond Classico Navy Blue Suit',
            slug: 'raymond-classico-navy-blue-suit',
            description: 'The Raymond Classico collection brings you this impeccably tailored navy blue suit. Crafted from premium Australian Merino wool, it features a modern slim fit with peak lapels, working button cuffs, and a fully canvased construction for superior drape and longevity. Perfect for the complete man.',
            price: 32999,
            comparePrice: 39999,
            images: [
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
                'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800'
            ],
            categorySlug: 'suits-blazers',
            featured: true,
            isNew: false,
            variants: [
                { size: '38', color: 'Navy Blue', stock: 10 },
                { size: '40', color: 'Navy Blue', stock: 15 },
                { size: '42', color: 'Navy Blue', stock: 12 },
                { size: '44', color: 'Navy Blue', stock: 8 },
                { size: '46', color: 'Navy Blue', stock: 5 }
            ]
        },
        {
            name: 'Raymond Premium Charcoal Wool Blazer',
            slug: 'raymond-premium-charcoal-wool-blazer',
            description: 'Sophisticated charcoal grey blazer from the Raymond Premium collection. Made from fine Italian Super 120s wool with Loro Piana fabric. Features notch lapels, two-button closure, and patch pockets. The perfect versatile piece for office to evening transitions.',
            price: 24999,
            comparePrice: 29999,
            images: [
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
                'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800'
            ],
            categorySlug: 'suits-blazers',
            featured: true,
            isNew: true,
            variants: [
                { size: '38', color: 'Charcoal Grey', stock: 8 },
                { size: '40', color: 'Charcoal Grey', stock: 12 },
                { size: '42', color: 'Charcoal Grey', stock: 10 },
                { size: '44', color: 'Charcoal Grey', stock: 6 }
            ]
        },
        {
            name: 'Raymond Black Ceremony Tuxedo',
            slug: 'raymond-black-ceremony-tuxedo',
            description: 'Make a statement with this elegant black tuxedo from Raymond Ceremony collection. Features satin peak lapels, single-button closure, and satin-trimmed pockets. The jacket comes with matching tuxedo trousers featuring a satin side stripe. Perfect for galas, weddings, and black-tie events.',
            price: 44999,
            comparePrice: 54999,
            images: [
                'https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=800',
                'https://images.unsplash.com/photo-1598808503491-a253332c8cdd?w=800'
            ],
            categorySlug: 'suits-blazers',
            featured: true,
            isNew: true,
            variants: [
                { size: '38', color: 'Black', stock: 5 },
                { size: '40', color: 'Black', stock: 8 },
                { size: '42', color: 'Black', stock: 7 },
                { size: '44', color: 'Black', stock: 4 }
            ]
        },
        {
            name: 'Raymond Next Look Brown Check Blazer',
            slug: 'raymond-next-look-brown-check-blazer',
            description: 'Contemporary brown check blazer from the Raymond Next Look collection. Designed for the modern professional who appreciates classic patterns with a contemporary twist. Features a subtle windowpane check pattern and versatile styling.',
            price: 18999,
            comparePrice: 22999,
            images: [
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'
            ],
            categorySlug: 'suits-blazers',
            featured: false,
            isNew: false,
            variants: [
                { size: '38', color: 'Brown Check', stock: 6 },
                { size: '40', color: 'Brown Check', stock: 10 },
                { size: '42', color: 'Brown Check', stock: 8 },
                { size: '44', color: 'Brown Check', stock: 5 }
            ]
        },

        // ==================== FORMAL SHIRTS ====================
        {
            name: 'Raymond Park Avenue White Shirt',
            slug: 'raymond-park-avenue-white-shirt',
            description: 'The quintessential white formal shirt from Raymond Park Avenue. Made from 100% Premium Egyptian cotton with 2-ply yarn construction. Features a spread collar, French cuffs, and mother-of-pearl buttons. Wrinkle-resistant finish for all-day crispness.',
            price: 4999,
            comparePrice: 5999,
            images: [
                'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
                'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800'
            ],
            categorySlug: 'formal-shirts',
            featured: true,
            isNew: false,
            variants: [
                { size: '38', color: 'White', stock: 20 },
                { size: '39', color: 'White', stock: 25 },
                { size: '40', color: 'White', stock: 22 },
                { size: '42', color: 'White', stock: 15 },
                { size: '44', color: 'White', stock: 10 }
            ]
        },
        {
            name: 'Raymond Contemporary Blue Oxford',
            slug: 'raymond-contemporary-blue-oxford',
            description: 'Refined light blue Oxford shirt from Raymond Contemporary collection. Made from premium cotton Oxford cloth with button-down collar. Perfect for smart casual occasions and weekend meetings.',
            price: 3999,
            comparePrice: 4799,
            images: [
                'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800',
                'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=800'
            ],
            categorySlug: 'formal-shirts',
            featured: false,
            isNew: true,
            variants: [
                { size: '38', color: 'Light Blue', stock: 18 },
                { size: '39', color: 'Light Blue', stock: 22 },
                { size: '40', color: 'Light Blue', stock: 20 },
                { size: '42', color: 'Light Blue', stock: 12 }
            ]
        },
        {
            name: 'Raymond Premium Pink Slim Fit',
            slug: 'raymond-premium-pink-slim-fit',
            description: 'Contemporary pink shirt in a modern slim fit silhouette from Raymond Premium collection. Features a cutaway collar and single-button cuffs. Made from soft cotton poplin with stretch for all-day comfort.',
            price: 3499,
            comparePrice: 4299,
            images: [
                'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
                'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800'
            ],
            categorySlug: 'formal-shirts',
            featured: false,
            isNew: false,
            variants: [
                { size: '38', color: 'Pink', stock: 15 },
                { size: '39', color: 'Pink', stock: 18 },
                { size: '40', color: 'Pink', stock: 16 },
                { size: '42', color: 'Pink', stock: 10 }
            ]
        },
        {
            name: 'Raymond Executive Blue Stripe',
            slug: 'raymond-executive-blue-stripe',
            description: 'Elegant blue and white striped shirt from Raymond Executive collection. Features spread collar and barrel cuffs with premium fabric construction. Ideal for boardroom presentations and important meetings.',
            price: 4299,
            comparePrice: 4999,
            images: [
                'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800',
                'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800'
            ],
            categorySlug: 'formal-shirts',
            featured: true,
            isNew: false,
            variants: [
                { size: '38', color: 'Blue Stripe', stock: 14 },
                { size: '39', color: 'Blue Stripe', stock: 20 },
                { size: '40', color: 'Blue Stripe', stock: 18 },
                { size: '42', color: 'Blue Stripe', stock: 10 }
            ]
        },
        {
            name: 'Raymond Silky Touch Lavender',
            slug: 'raymond-silky-touch-lavender',
            description: 'Luxurious lavender shirt from Raymond Silky Touch collection. Made from silk-cotton blend for an incredibly soft feel. Features a hidden button-down collar and premium finish.',
            price: 4499,
            comparePrice: 5499,
            images: [
                'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
                'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'
            ],
            categorySlug: 'formal-shirts',
            featured: false,
            isNew: true,
            variants: [
                { size: '38', color: 'Lavender', stock: 12 },
                { size: '39', color: 'Lavender', stock: 15 },
                { size: '40', color: 'Lavender', stock: 14 },
                { size: '42', color: 'Lavender', stock: 8 }
            ]
        },

        // ==================== TROUSERS ====================
        {
            name: 'Raymond Ready To Wear Black Trousers',
            slug: 'raymond-rtw-black-trousers',
            description: 'Essential black formal trousers from Raymond Ready To Wear collection. Made from wrinkle-resistant premium wool blend. Features a flat front design, side pockets, and single back pocket with button closure.',
            price: 5999,
            comparePrice: 6999,
            images: [
                'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
                'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'
            ],
            categorySlug: 'trousers',
            featured: true,
            isNew: false,
            variants: [
                { size: '30', color: 'Black', stock: 15 },
                { size: '32', color: 'Black', stock: 20 },
                { size: '34', color: 'Black', stock: 18 },
                { size: '36', color: 'Black', stock: 12 },
                { size: '38', color: 'Black', stock: 8 }
            ]
        },
        {
            name: 'Raymond Next Navy Chinos',
            slug: 'raymond-next-navy-chinos',
            description: 'Smart navy blue chinos from Raymond Next collection. Features a slim tapered fit with stretch cotton twill for comfort and mobility. Includes concealed coin pocket and button-through back pockets.',
            price: 4499,
            comparePrice: 5299,
            images: [
                'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
                'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'
            ],
            categorySlug: 'trousers',
            featured: false,
            isNew: true,
            variants: [
                { size: '30', color: 'Navy Blue', stock: 12 },
                { size: '32', color: 'Navy Blue', stock: 16 },
                { size: '34', color: 'Navy Blue', stock: 14 },
                { size: '36', color: 'Navy Blue', stock: 10 }
            ]
        },
        {
            name: 'Raymond Premium Grey Wool Trousers',
            slug: 'raymond-premium-grey-wool-trousers',
            description: 'Sophisticated grey dress trousers from Raymond Premium collection. Made from fine Australian wool with single pleats. Perfect for creating a polished office look with superior comfort.',
            price: 6999,
            comparePrice: 7999,
            images: [
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
                'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
            ],
            categorySlug: 'trousers',
            featured: true,
            isNew: false,
            variants: [
                { size: '30', color: 'Medium Grey', stock: 10 },
                { size: '32', color: 'Medium Grey', stock: 14 },
                { size: '34', color: 'Medium Grey', stock: 12 },
                { size: '36', color: 'Medium Grey', stock: 8 }
            ]
        },
        {
            name: 'Raymond Khaki Casual Trousers',
            slug: 'raymond-khaki-casual-trousers',
            description: 'Versatile khaki trousers from Raymond Casual collection. Made from premium cotton twill with comfortable fit. Perfect for weekend outings and casual Fridays.',
            price: 3999,
            comparePrice: 4799,
            images: [
                'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
                'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'
            ],
            categorySlug: 'trousers',
            featured: false,
            isNew: false,
            variants: [
                { size: '30', color: 'Khaki', stock: 14 },
                { size: '32', color: 'Khaki', stock: 18 },
                { size: '34', color: 'Khaki', stock: 16 },
                { size: '36', color: 'Khaki', stock: 10 }
            ]
        },

        // ==================== ACCESSORIES ====================
        {
            name: 'Raymond Signature Silk Paisley Tie',
            slug: 'raymond-signature-silk-paisley-tie',
            description: 'Luxurious silk tie from Raymond Signature collection with elegant paisley pattern in deep burgundy and gold. Hand-finished with wool blend interlining for the perfect knot. Made in Italy.',
            price: 2499,
            comparePrice: 2999,
            images: [
                'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800',
                'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800'
            ],
            categorySlug: 'accessories',
            featured: true,
            isNew: false,
            variants: [
                { size: 'One Size', color: 'Burgundy', stock: 25 },
                { size: 'One Size', color: 'Navy', stock: 20 },
                { size: 'One Size', color: 'Black', stock: 22 }
            ]
        },
        {
            name: 'Raymond Sterling Silver Cufflinks',
            slug: 'raymond-sterling-silver-cufflinks',
            description: 'Classic sterling silver cufflinks from Raymond Premium collection. Features polished finish with subtle Raymond branding. Toggle fastening for secure wear. Comes in premium gift box.',
            price: 3999,
            comparePrice: 4699,
            images: [
                'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800',
                'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'
            ],
            categorySlug: 'accessories',
            featured: false,
            isNew: true,
            variants: [
                { size: 'One Size', color: 'Silver', stock: 30 },
                { size: 'One Size', color: 'Gold', stock: 25 }
            ]
        },
        {
            name: 'Raymond Italian Leather Belt',
            slug: 'raymond-italian-leather-belt',
            description: 'Premium Italian leather belt from Raymond collection. Features brushed silver buckle with single prong closure and subtle Raymond branding. Width: 35mm. Perfect finishing touch for formal attire.',
            price: 2999,
            comparePrice: 3499,
            images: [
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
                'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800'
            ],
            categorySlug: 'accessories',
            featured: true,
            isNew: false,
            variants: [
                { size: '32', color: 'Black', stock: 15 },
                { size: '34', color: 'Black', stock: 18 },
                { size: '36', color: 'Black', stock: 16 },
                { size: '32', color: 'Brown', stock: 12 },
                { size: '34', color: 'Brown', stock: 15 },
                { size: '36', color: 'Brown', stock: 14 }
            ]
        },
        {
            name: 'Raymond Silk Pocket Square',
            slug: 'raymond-silk-pocket-square',
            description: 'Hand-rolled silk pocket square from Raymond collection. Features elegant geometric pattern. Adds a refined finishing touch to any suit or blazer.',
            price: 1299,
            comparePrice: 1599,
            images: [
                'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800',
                'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800'
            ],
            categorySlug: 'accessories',
            featured: false,
            isNew: false,
            variants: [
                { size: 'One Size', color: 'White', stock: 30 },
                { size: 'One Size', color: 'Navy', stock: 25 },
                { size: 'One Size', color: 'Burgundy', stock: 22 }
            ]
        },
        {
            name: 'Raymond Premium Leather Wallet',
            slug: 'raymond-premium-leather-wallet',
            description: 'Premium bi-fold wallet from Raymond collection. Made from genuine Italian leather with RFID protection. Features multiple card slots, bill compartment, and coin pocket.',
            price: 2499,
            comparePrice: 2999,
            images: [
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
                'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800'
            ],
            categorySlug: 'accessories',
            featured: false,
            isNew: true,
            variants: [
                { size: 'One Size', color: 'Black', stock: 20 },
                { size: 'One Size', color: 'Brown', stock: 18 }
            ]
        },

        // ==================== ETHNIC WEAR ====================
        {
            name: 'Raymond Ethnix Royal Blue Sherwani',
            slug: 'raymond-ethnix-royal-blue-sherwani',
            description: 'Majestic royal blue sherwani from Raymond Ethnix collection. Features intricate gold zari embroidery with mandarin collar and hidden button placket. Made from premium silk blend fabric. Perfect for weddings and celebrations.',
            price: 34999,
            comparePrice: 42999,
            images: [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'
            ],
            categorySlug: 'ethnic-wear',
            featured: true,
            isNew: true,
            variants: [
                { size: '38', color: 'Royal Blue', stock: 6 },
                { size: '40', color: 'Royal Blue', stock: 8 },
                { size: '42', color: 'Royal Blue', stock: 7 },
                { size: '44', color: 'Royal Blue', stock: 4 }
            ]
        },
        {
            name: 'Raymond Ethnix Ivory Silk Kurta Set',
            slug: 'raymond-ethnix-ivory-silk-kurta-set',
            description: 'Elegant ivory kurta set from Raymond Ethnix collection. Includes matching churidar. Made from pure silk with delicate chikankari thread work. Perfect for festive occasions and celebrations.',
            price: 14999,
            comparePrice: 17999,
            images: [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
                'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800'
            ],
            categorySlug: 'ethnic-wear',
            featured: true,
            isNew: false,
            variants: [
                { size: 'S', color: 'Ivory', stock: 10 },
                { size: 'M', color: 'Ivory', stock: 14 },
                { size: 'L', color: 'Ivory', stock: 12 },
                { size: 'XL', color: 'Ivory', stock: 8 }
            ]
        },
        {
            name: 'Raymond Ethnix Black Nehru Jacket',
            slug: 'raymond-ethnix-black-nehru-jacket',
            description: 'Contemporary black Nehru jacket from Raymond Ethnix collection. Features subtle jacquard pattern with mandarin collar and concealed button front. Versatile piece that pairs well with kurtas or shirts.',
            price: 9999,
            comparePrice: 11999,
            images: [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800'
            ],
            categorySlug: 'ethnic-wear',
            featured: true,
            isNew: false,
            variants: [
                { size: 'S', color: 'Black', stock: 8 },
                { size: 'M', color: 'Black', stock: 12 },
                { size: 'L', color: 'Black', stock: 10 },
                { size: 'XL', color: 'Black', stock: 6 }
            ]
        },
        {
            name: 'Raymond Ethnix Maroon Bandhgala',
            slug: 'raymond-ethnix-maroon-bandhgala',
            description: 'Sophisticated maroon bandhgala from Raymond Ethnix collection. Features traditional mandarin collar with premium fabric and impeccable tailoring. Perfect for formal Indian occasions.',
            price: 16999,
            comparePrice: 19999,
            images: [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'
            ],
            categorySlug: 'ethnic-wear',
            featured: false,
            isNew: true,
            variants: [
                { size: 'S', color: 'Maroon', stock: 6 },
                { size: 'M', color: 'Maroon', stock: 10 },
                { size: 'L', color: 'Maroon', stock: 8 },
                { size: 'XL', color: 'Maroon', stock: 5 }
            ]
        },

        // ==================== FABRICS ====================
        {
            name: 'Raymond Premium Suiting Fabric - Navy',
            slug: 'raymond-premium-suiting-fabric-navy',
            description: 'Premium navy blue suiting fabric from Raymond mills. Made from Super 100s Australian Merino wool. 3.5 meters length, perfect for a complete suit. Includes lining fabric.',
            price: 8999,
            comparePrice: 10999,
            images: [
                'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800',
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'
            ],
            categorySlug: 'fabrics',
            featured: true,
            isNew: false,
            variants: [
                { size: '3.5 meters', color: 'Navy Blue', stock: 25 },
                { size: '3.5 meters', color: 'Charcoal', stock: 20 },
                { size: '3.5 meters', color: 'Black', stock: 30 }
            ]
        },
        {
            name: 'Raymond Fine Shirting Fabric',
            slug: 'raymond-fine-shirting-fabric',
            description: 'Premium Egyptian cotton shirting fabric from Raymond mills. 2-ply yarn with 120 thread count. 2.5 meters length, perfect for a formal shirt. Soft finish with wrinkle resistance.',
            price: 1999,
            comparePrice: 2499,
            images: [
                'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800',
                'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'
            ],
            categorySlug: 'fabrics',
            featured: false,
            isNew: true,
            variants: [
                { size: '2.5 meters', color: 'White', stock: 40 },
                { size: '2.5 meters', color: 'Light Blue', stock: 35 },
                { size: '2.5 meters', color: 'Pink', stock: 25 }
            ]
        },
        {
            name: 'Raymond Wool Blend Trouser Fabric',
            slug: 'raymond-wool-blend-trouser-fabric',
            description: 'Premium wool blend trouser fabric from Raymond mills. Features wrinkle-resistant finish with comfortable stretch. 1.5 meters length, perfect for formal trousers.',
            price: 2499,
            comparePrice: 2999,
            images: [
                'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800',
                'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
            ],
            categorySlug: 'fabrics',
            featured: false,
            isNew: false,
            variants: [
                { size: '1.5 meters', color: 'Black', stock: 30 },
                { size: '1.5 meters', color: 'Navy', stock: 25 },
                { size: '1.5 meters', color: 'Grey', stock: 28 }
            ]
        }
    ];

    // Create products
    for (const productData of products) {
        const category = categories.find(c => c.slug === productData.categorySlug);

        const existingProduct = await prisma.product.findUnique({
            where: { slug: productData.slug }
        });

        if (!existingProduct) {
            const product = await prisma.product.create({
                data: {
                    name: productData.name,
                    slug: productData.slug,
                    description: productData.description,
                    price: productData.price,
                    comparePrice: productData.comparePrice,
                    images: productData.images,
                    categoryId: category.id,
                    featured: productData.featured,
                    isNew: productData.isNew,
                    variants: {
                        create: productData.variants
                    }
                }
            });
            console.log('Created product:', product.name);
        } else {
            console.log('Product already exists:', productData.name);
        }
    }

    console.log('Seeding complete! Raymond products have been added.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
