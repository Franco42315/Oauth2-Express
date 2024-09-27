const express = require('express');
const session = require('express-session');
const axios = require('axios');  // Importa axios para hacer la solicitud
require('dotenv').config();

const router = express.Router();

// Configurar OAuth2
const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

// Definir el redirect URL de Google
const authorizationUri = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=profile%20email&state=random_string_to_prevent_csrf`;

// Ruta para iniciar el flujo de autenticación
router.get('/auth', (req, res) => {
  res.redirect(authorizationUri);
});

// Ruta para el callback de Google
router.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const tokenParams = {
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: 'authorization_code',
  };

  try {
    // Realiza la solicitud POST para obtener el token
    const response = await axios.post(tokenUrl, new URLSearchParams(tokenParams), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = response.data.access_token;

    // Guardar el token en la sesión
    req.session.token = accessToken;

    res.redirect('/');
  } catch (error) {
    console.error('Access Token Error', error.message);
    res.status(500).json('Authentication failed');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
