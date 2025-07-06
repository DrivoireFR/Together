#!/bin/bash

# Script de test pour l'API REST
API_URL="http://localhost:3000/api"

echo "=== Test de l'API REST ==="
echo ""

# Test de la route de santé
echo "1. Test de la route de santé:"
curl -s "$API_URL/health" | jq '.'
echo ""

# Test d'inscription
echo "2. Test d'inscription:"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "pseudo": "jeandupont",
    "email": "jean.dupont@example.com",
    "password": "motdepasse123",
    "icone": "https://example.com/avatar.jpg"
  }')

echo "$REGISTER_RESPONSE" | jq '.'
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
echo ""

# Test de connexion
echo "3. Test de connexion:"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "motdepasse123",
    "rememberMe": true
  }')

echo "$LOGIN_RESPONSE" | jq '.'
REMEMBER_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo ""

# Test de vérification du token
echo "4. Test de vérification du token:"
curl -s -X GET "$API_URL/auth/verify" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test de vérification du token remember me
echo "5. Test de vérification du token remember me:"
curl -s -X GET "$API_URL/auth/remember-me" \
  -H "Authorization: Bearer $REMEMBER_TOKEN" | jq '.'
echo ""

# Test de récupération du profil
echo "6. Test de récupération du profil:"
curl -s -X GET "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test de mise à jour du profil
echo "7. Test de mise à jour du profil:"
curl -s -X PUT "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont-Martin",
    "icone": "https://example.com/new-avatar.jpg"
  }' | jq '.'
echo ""

# Test de récupération de tous les utilisateurs
echo "8. Test de récupération de tous les utilisateurs:"
curl -s -X GET "$API_URL/users" | jq '.'
echo ""

echo "=== Tests terminés ==="