// Backend/utils/mapService.js
// Service pour les opérations liées à la cartographie

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Formule de Haversine pour calculer la distance entre deux points
  const R = 6371; // Rayon de la Terre en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance en km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

const findNearbyProjects = async (userLat, userLon, radiusKm) => {
  // Cette fonction trouverait les projets dans un rayon donné
  // Pour l'instant, nous retournons une simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Projet près de vous', distance: 2.5 },
        { id: 2, title: 'Autre projet', distance: 5.1 }
      ]);
    }, 500);
  });
};

module.exports = {
  calculateDistance,
  findNearbyProjects
};