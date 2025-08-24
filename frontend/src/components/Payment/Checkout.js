import React, { useState } from 'react';
import { createCheckoutSession, simulatePayment } from '../../services/api';

const Checkout = ({ product, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Créer une session de paiement simulée
      const { id: sessionId } = await createCheckoutSession({
        productId: product.id,
        quantity: 1
      });

      // Simuler le paiement réussi
      const paymentResult = await simulatePayment({
        sessionId: sessionId,
        productId: product.id,
        quantity: 1
      });

      if (paymentResult.success) {
        alert('✅ Paiement simulé avec succès !');
        onSuccess(paymentResult.order);
      } else {
        alert('❌ Erreur lors du paiement simulé');
      }
    } catch (error) {
      console.error('Payment simulation error:', error);
      alert('Erreur lors de la simulation de paiement');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="payment-modal">
      <div className="payment-content">
        <h3>🎯 Simulation de Paiement</h3>
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          Mode simulation activé - Aucun vrai paiement
        </div>

        <div className="product-info">
          <h4>{product.name}</h4>
          <p>{product.description}</p>
          <p className="price">{product.price} €</p>
        </div>

        <div className="payment-methods">
          <div className="payment-method">
            <i className="fas fa-credit-card fa-2x"></i>
            <span>Carte de test</span>
          </div>
          <div className="payment-method">
            <i className="fas fa-mobile-alt fa-2x"></i>
            <span>Paiement simulé</span>
          </div>
        </div>

        <button 
          className="btn btn-success w-100 py-3"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Simulation...
            </>
          ) : (
            `Simuler le paiement de ${product.price} €`
          )}
        </button>

        <button className="btn btn-outline-secondary w-100 mt-2" onClick={onClose}>
          Annuler
        </button>

        <div className="mt-3 p-2 bg-light rounded">
          <small className="text-muted">
            <i className="fas fa-lightbulb me-1"></i>
            En production, cette fonctionnalité utiliserait un vrai système de paiement.
          </small>
        </div>
      </div>
    </div>
  );
};

export default Checkout;