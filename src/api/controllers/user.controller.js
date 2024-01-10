const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = require("../../../firebaseConfig.js");

// Inicializa o Firebase
const firebasenegocio = initializeApp(firebaseConfig);
const db = getFirestore(firebasenegocio);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebasenegocio);

const createUser = async (req, res) => {
    const { email, senha, nome, telefone } = req.body;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
  
      // Usuário criado com sucesso
      const user = userCredential.user;
      console.log("Usuário criado com ID: ", user.uid);
  
      // Salvar informações do usuário na tabela de usuários
      const usuario = {
        nome,
        email,
        telefone,
        uid: user.uid, // Vincule o usuário da tabela de usuários ao usuário de autenticação
      };
  
      // Adicione lógica para salvar o usuário na tabela de usuários
      await addDoc(collection(db, "usuarios"), usuario);
  
      // Adicione lógica adicional, se necessário
      res.status(201).send("Usuário criado com sucesso.");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Erro ao criar usuário: ${errorCode} - ${errorMessage}`);
  
      // Lide com o erro de criação do usuário aqui
      res
        .status(500)
        .send(`Erro ao criar usuário: ${errorCode} - ${errorMessage}`);
    }
};

module.exports = {
    create: createUser
};
