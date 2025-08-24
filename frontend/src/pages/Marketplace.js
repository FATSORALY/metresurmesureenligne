import React, { useState, useEffect, useContext } from 'react'; // ← AJOUTEZ CET IMPORT
import { AuthContext } from '../services/auth';
import { getProducts, createOrder } from '../services/api';
import Checkout from '../components/Payment/Checkout'; // ← IMPORT DU COMPOSANT CHECKOUT

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false); // ← ÉTAT POUR AFFICHER LE PANIER
  const [selectedProduct, setSelectedProduct] = useState(null); // ← ÉTAT POUR LE PRODUIT SÉLECTIONNÉ
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handlePurchase = async (productId) => {
    if (!user) {
      alert('Veuillez vous connecter pour acheter');
      return;
    }

    // Trouver le produit sélectionné
    const productToBuy = products.find(p => p.id === productId);
    if (!productToBuy) {
      alert('Produit non trouvé');
      return;
    }

    // Afficher la modal de checkout
    setSelectedProduct(productToBuy);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (order) => {
    console.log('Paiement réussi, commande créée:', order);
    setShowCheckout(false);
    setSelectedProduct(null);
    alert('Commande passée avec succès!');
  };

  const handlePaymentClose = () => {
    setShowCheckout(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Boutique de Services</h1>
      
      <div className="row">
        {products.map(product => (
          <div key={product.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card product-card h-100">
              {/* Affichage de l'image si elle existe */}
              {product.image_url && (
                <img 
                  src={product.image_url} 
                  className="card-img-top product-image"
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Service';
                  }}
                />
              )}
              {!product.image_url && (
                <div 
                  className="product-image-placeholder"
                  style={{ 
                    height: '200px', 
                    background: '#f8f9fa', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#6c757d'
                  }}
                >
                  <i className="fas fa-image fa-3x"></i>
                </div>
              )}
              
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text flex-grow-1">{product.description}</p>
                
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="product-price fw-bold text-primary">
                      {product.price} €
                    </span>
                    <span className="badge bg-secondary">{product.category}</span>
                  </div>
                  
                  <button 
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => handlePurchase(product.id)}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Acheter
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
          <h4>Aucun service disponible</h4>
          <p className="text-muted">Les services seront bientôt disponibles.</p>
        </div>
      )}

      {/* Modal de paiement */}
      {showCheckout && selectedProduct && (
        <Checkout 
          product={selectedProduct}
          onClose={handlePaymentClose}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Marketplace;