import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../services/auth';
import { 
  getAdminUsers, 
  deleteUser, 
  getAdminProjects, 
  deleteProject, 
  getAdminProducts, 
  addProduct,
  updateProduct,
  deleteProduct 
} from '../../services/api';
import '../../styles/Admin.css';

// Composant Formulaire Produit - DÉPLACÉ AU DÉBUT
const ProductForm = ({ formData, onChange, onSubmit, isEditing, onCancel }) => (
  <div className="card mb-4">
    <div className="card-header">
      <h5>{isEditing ? 'Modifier le Service' : 'Nouveau Service'}</h5>
    </div>
    <div className="card-body">
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nom du service</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Prix (€)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={onChange}
              required
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={onChange}
            rows="3"
            required
          />
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Catégorie</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={onChange}
            >
              <option value="service">Service</option>
              <option value="formation">Formation</option>
              <option value="audit">Audit</option>
              <option value="consulting">Consulting</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">URL de l'image</label>
            <input
              type="url"
              className="form-control"
              name="image_url"
              value={formData.image_url}
              onChange={onChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">
            {isEditing ? 'Modifier' : 'Ajouter'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Composant pour la table des produits avec édition - DÉPLACÉ AVANT le composant principal
const ProductsTable = ({ products, onEditProduct, onDeleteProduct }) => (
  <div className="table-responsive">
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Prix</th>
          <th>Catégorie</th>
          <th>Description</th>
          <th>Créé le</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>
              <strong>{product.name}</strong>
              {product.image_url && (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', marginLeft: '10px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </td>
            <td>{product.price} €</td>
            <td>
              <span className="badge bg-info">{product.category}</span>
            </td>
            <td>{product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}</td>
            <td>{new Date(product.created_at).toLocaleDateString()}</td>
            <td>
              <div className="btn-group">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => onEditProduct(product)}
                  title="Modifier"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => onDeleteProduct(product.id)}
                  title="Supprimer"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Composant pour la table des utilisateurs
const UsersTable = ({ users, onDeleteUser }) => (
  <div className="table-responsive">
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Email</th>
          <th>Entreprise</th>
          <th>Localisation</th>
          <th>Inscrit le</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.company_name || 'N/A'}</td>
            <td>{user.location || 'N/A'}</td>
            <td>{new Date(user.created_at).toLocaleDateString()}</td>
            <td>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => onDeleteUser(user.id)}
                title="Supprimer"
              >
                <i className="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Composant pour la table des projets
const ProjectsTable = ({ projects, onDeleteProject }) => (
  <div className="table-responsive">
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Titre</th>
          <th>Utilisateur</th>
          <th>Localisation</th>
          <th>Statut</th>
          <th>Créé le</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map(project => (
          <tr key={project.id}>
            <td>{project.id}</td>
            <td>{project.title}</td>
            <td>User #{project.user_id}</td>
            <td>{project.location}</td>
            <td>
              <span className={`badge ${
                project.status === 'completed' ? 'bg-success' :
                project.status === 'in_progress' ? 'bg-warning' : 'bg-secondary'
              }`}>
                {project.status}
              </span>
            </td>
            <td>{new Date(project.created_at).toLocaleDateString()}</td>
            <td>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => onDeleteProject(project.id)}
                title="Supprimer"
              >
                <i className="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Composant principal AdminPanel
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useContext(AuthContext);

  // Formulaire produit
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'service',
    image_url: ''
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      switch (activeTab) {
        case 'users':
          const usersData = await getAdminUsers();
          setUsers(usersData);
          break;
        case 'projects':
          const projectsData = await getAdminProjects();
          setProjects(projectsData);
          break;
        case 'products':
          const productsData = await getAdminProducts();
          setProducts(productsData);
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductFormChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = await addProduct({
        ...productForm,
        price: parseFloat(productForm.price)
      });
      
      setProducts([newProduct, ...products]);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'service',
        image_url: ''
      });
      setShowProductForm(false);
      setError('');
    } catch (err) {
      setError('Erreur lors de l\'ajout du produit');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url || ''
    });
    setShowProductForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = await updateProduct(editingProduct.id, {
        ...productForm,
        price: parseFloat(productForm.price)
      });
      
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'service',
        image_url: ''
      });
      setShowProductForm(false);
      setError('');
    } catch (err) {
      setError('Erreur lors de la modification du produit');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await deleteProject(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  if (!user) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          Vous devez être connecté pour accéder à l'administration.
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="admin-header">
        <h1>Administration</h1>
        <p>Gestion de la base de données MetreSurMesure</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs ({users.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projets ({projects.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Services ({products.length})
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <UsersTable users={users} onDeleteUser={handleDeleteUser} />
            )}
            
            {activeTab === 'projects' && (
              <ProjectsTable projects={projects} onDeleteProject={handleDeleteProject} />
            )}
            
            {activeTab === 'products' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3>Gestion des Services</h3>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowProductForm(!showProductForm)}
                  >
                    {showProductForm ? 'Annuler' : 'Ajouter un Service'}
                  </button>
                </div>

                {showProductForm && (
                  <ProductForm 
                    formData={productForm}
                    onChange={handleProductFormChange}
                    onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                    isEditing={!!editingProduct}
                    onCancel={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        description: '',
                        price: '',
                        category: 'service',
                        image_url: ''
                      });
                    }}
                  />
                )}

                <ProductsTable 
                  products={products} 
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;