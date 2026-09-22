import Link from 'next/link';

export default function HomePage() {
  const categories = [
    { name: "Resin Jewellery", slug: "resin-jewellery", image: "https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=600&auto=format&fit=crop" },
    { name: "Custom Photo Frames", slug: "customised-resin-photo-frames", image: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?q=80&w=600&auto=format&fit=crop" },
    { name: "Wedding Preservation", slug: "wedding-memory-preservation-products", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop" },
    { name: "Puja Thali", slug: "resin-puja-thali-pooja-decor", image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop" },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 w-full">
        <h1 className="font-heading text-5xl md:text-7xl text-text-primary font-bold mb-6 tracking-wide">
          Crafted in Resin, <br />
          <span className="text-champagne-gold italic font-normal">Preserved in Gold</span>
        </h1>
        
        <p className="max-w-2xl text-text-secondary mb-10 text-lg md:text-xl leading-relaxed font-sans">
          Premium handmade resin jewellery, customized photo frames, and elegant wedding memory preservation. Transform your cherished moments into timeless art.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/shop" className="btn-primary">
            Explore Collection
          </Link>
          <Link href="/custom-order" className="btn-secondary">
            Request Custom Quote
          </Link>
        </div>
      </section>

      {/* Shop By Category Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-text-primary font-bold mb-4 tracking-wider">
            Curated Collections
          </h2>
          <div className="h-1 w-20 bg-champagne-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/collections/${category.slug}`} className="group relative block h-80 overflow-hidden rounded-sm shadow-sm">
              {/* Fallback Unsplash Images for visual testing */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              ></div>
              <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/20"></div>
              <div className="absolute inset-0 flex items-end justify-center pb-6">
                <h3 className="text-white font-heading text-xl font-bold tracking-widest text-center px-4 drop-shadow-md">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}