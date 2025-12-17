import { useState } from 'react';
import Header from './components/Header';
import BannerSlider from './components/BannerSlider';
import ProductGrid from './components/ProductGrid';
import EnquiryModal from './components/EnquiryModal';
import Footer from './components/Footer';
import type { Product } from './lib/supabase';

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEnquiryClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BannerSlider />
      <ProductGrid onEnquiryClick={handleEnquiryClick} />
      <Footer />
      <EnquiryModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
