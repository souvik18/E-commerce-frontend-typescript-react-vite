import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid, GridChildProps } from "react-window";
import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import api from "../api/axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imagePath: string;
}

interface ProductGridProps {
  onEnquiryClick: (product: Product) => void;
}

export default function ProductGrid({ onEnquiryClick }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!hasMore) return;
    try {
      setLoading(true);
      const response = await api.get<Product[]>(
        `/products?offset=${page * 10}&limit=10`
      );

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => {
          const ids = new Set(prev.map(p => p.id));
          const newItems = response.data.filter(p => !ids.has(p.id));
          return [...prev, ...newItems];
        });
        setPage(prev => prev + 1);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, hasMore]);

  useEffect(() => {
    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const columnCount = 3;
  const rowCount = Math.ceil(products.length / columnCount);

  const handleScroll = ({ scrollTop }: { scrollTop: number }) => {
    const threshold = 200;
    const totalHeight = rowCount * 450;
    // AutoSizer gives us dynamic height, so use that instead of fixed 800
    if (hasMore && !loading && scrollTop + threshold >= totalHeight) {
      fetchProducts();
    }
  };

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ height: "100vh" }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of professional services designed to
            help your business grow
          </p>
        </div>

        <div style={{ width: "100%", height: "95%" }}>
          <AutoSizer>
            {({ width, height }) => (
              <FixedSizeGrid
                columnCount={columnCount}
                columnWidth={width / columnCount}   // responsive column width
                height={height}                     // full parent height
                rowCount={rowCount}
                rowHeight={450}
                width={width}                       // full parent width
                onScroll={handleScroll}
              >
                {({ columnIndex, rowIndex, style }: GridChildProps) => {
                  const productIndex = rowIndex * columnCount + columnIndex;
                  const product = products[productIndex];
                  if (!product) {
                    return (
                      <div style={style} className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      </div>
                    );
                  }

                  return (
                    <div style={{ ...style, padding: "0.5rem" }}>
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="h-48 overflow-hidden">
                          <img
                            src={`http://localhost:3000/${product.imagePath}`}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-blue-600">
                              {product.price}/-
                            </span>
                            <button
                              onClick={() => onEnquiryClick(product)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </FixedSizeGrid>
            )}
          </AutoSizer>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        )}
      </div>
    </section>
  );
}
