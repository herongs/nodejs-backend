
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { getAuth,signInWithEmailAndPassword, getIdToken } = require('firebase/auth');
const express = require('express');
const cors = require('cors');

const firebaseConfig  = require('../firebaseConfig.js');
const userRoutes = require('./api/routes/user.route.js');
const quadrosRoutes = require('./api/routes/quadros.route.js');
const listasRoutes = require('./api/routes/listas.route.js');
const cartoesRoutes = require('./api/routes/cartoes.route.js');

// Inicializa o Firebase
const firebasenegocio = initializeApp(firebaseConfig);
const db = getFirestore(firebasenegocio);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebasenegocio);

const app = express();

app.use(express.json());
app.use(cors());

// Use as rotas exportadas
userRoutes(app);
quadrosRoutes(app);
listasRoutes(app);
cartoesRoutes(app);

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Usuário autenticado com sucesso
        const user = userCredential.user;

        // Obtenha o token de autenticação do usuário
        const token = await getIdToken(user);

        // Retorne o token e as informações do usuário
        res.send({ token });
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        // Lide com o erro de autenticação aqui
        res.status(500).send(`Erro ao autenticar usuário: ${errorCode} - ${errorMessage}`);
    }
});
  

app.get("/profile", async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        const clientes = [];
        querySnapshot.forEach((doc) => {
            clientes.push(doc.data());
        });
        res.send(clientes);
    } catch (err) {
        res.status(500).send('Erro ao obter clientes: ' + err);
    }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
