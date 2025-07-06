// Exemple d'utilisation de l'API depuis le frontend
class ApiClient {
  constructor(baseUrl = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
  }

  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur API');
    }

    return data;
  }

  // Authentification
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', this.token);
    }
    
    return response;
  }

  async login(email, password, rememberMe = false) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', this.token);
      
      // Si rememberMe, sauvegarder aussi le token remember me
      if (rememberMe) {
        localStorage.setItem('rememberToken', this.token);
      }
    }
    
    return response;
  }

  async verifyToken() {
    try {
      return await this.request('/auth/verify');
    } catch (error) {
      // Si le token normal échoue, essayer avec le token remember me
      const rememberToken = localStorage.getItem('rememberToken');
      if (rememberToken) {
        this.token = rememberToken;
        try {
          const response = await this.request('/auth/remember-me');
          // Mettre à jour avec le nouveau token
          this.token = response.token;
          localStorage.setItem('authToken', this.token);
          return response;
        } catch (rememberError) {
          this.logout();
          throw rememberError;
        }
      }
      throw error;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberToken');
  }

  // Gestion des utilisateurs
  async getProfile() {
    return await this.request('/users/me');
  }

  async updateProfile(userData) {
    return await this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getAllUsers() {
    return await this.request('/users');
  }

  async getUserById(id) {
    return await this.request(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return await this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return await this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Vérification de l'état de santé de l'API
  async healthCheck() {
    return await this.request('/health');
  }
}

// Exemple d'utilisation
async function exempleUtilisation() {
  const api = new ApiClient();

  try {
    // Vérifier la santé de l'API
    const health = await api.healthCheck();
    console.log('API Status:', health);

    // Inscription d'un nouvel utilisateur
    const newUser = {
      nom: 'Martin',
      prenom: 'Alice',
      pseudo: 'alicemartin',
      email: 'alice.martin@example.com',
      password: 'motdepasse123',
      icone: 'https://example.com/alice-avatar.jpg'
    };

    const registerResponse = await api.register(newUser);
    console.log('Inscription réussie:', registerResponse);

    // Connexion avec rememberMe
    const loginResponse = await api.login('alice.martin@example.com', 'motdepasse123', true);
    console.log('Connexion réussie:', loginResponse);

    // Récupération du profil
    const profile = await api.getProfile();
    console.log('Profil utilisateur:', profile);

    // Mise à jour du profil
    const updatedProfile = await api.updateProfile({
      nom: 'Martin-Durand',
      icone: 'https://example.com/alice-new-avatar.jpg'
    });
    console.log('Profil mis à jour:', updatedProfile);

    // Récupération de tous les utilisateurs
    const allUsers = await api.getAllUsers();
    console.log('Tous les utilisateurs:', allUsers);

  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

// Classe pour gérer l'authentification automatique
class AuthManager {
  constructor() {
    this.api = new ApiClient();
  }

  async initializeAuth() {
    try {
      // Vérifier si l'utilisateur est déjà connecté
      const profile = await this.api.verifyToken();
      console.log('Utilisateur connecté:', profile.user);
      return profile.user;
    } catch (error) {
      console.log('Utilisateur non connecté');
      return null;
    }
  }

  async handleLogin(email, password, rememberMe = false) {
    try {
      const response = await this.api.login(email, password, rememberMe);
      console.log('Connexion réussie');
      return response.user;
    } catch (error) {
      console.error('Erreur de connexion:', error.message);
      throw error;
    }
  }

  async handleRegister(userData) {
    try {
      const response = await this.api.register(userData);
      console.log('Inscription réussie');
      return response.user;
    } catch (error) {
      console.error('Erreur d\'inscription:', error.message);
      throw error;
    }
  }

  handleLogout() {
    this.api.logout();
    console.log('Déconnexion réussie');
  }
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ApiClient, AuthManager };
}

// Exemple d'utilisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
  const authManager = new AuthManager();
  
  // Initialiser l'authentification
  const user = await authManager.initializeAuth();
  
  if (user) {
    console.log('Utilisateur connecté:', user.pseudo);
    // Rediriger vers la page d'accueil ou afficher l'interface utilisateur
  } else {
    console.log('Afficher le formulaire de connexion');
    // Afficher le formulaire de connexion
  }
});