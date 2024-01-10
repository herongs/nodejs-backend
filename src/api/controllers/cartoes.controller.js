const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = require("../../../firebaseConfig.js");

// Inicializa o Firebase
const firebasenegocio = initializeApp(firebaseConfig);
const db = getFirestore(firebasenegocio);

const createCartao = async (req, res) => {
    const { uid_lista, titulo, descricao } = req.body;
    const criado_em = new Date();

    try {
        const cartao = {
            uid_lista,
            titulo,
            descricao,
            criado_em,
            updated_at: null, // Initially set as null
        };
    
        // Add logic to save the column in the "cartaos" collection
        await addDoc(collection(db, "cartoes"), cartao)

        res.status(201).send("cartao criada com sucesso.");
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Erro ao criar cartao: ${errorCode} - ${errorMessage}`);
        
        // Handle the column creation error here
        res
            .status(500)
            .send(`Erro ao criar cartao: ${errorCode} - ${errorMessage}`);
    }
};

module.exports = {
    create: createCartao
};

