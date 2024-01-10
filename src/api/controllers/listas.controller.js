const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = require("../../../firebaseConfig.js");

// Inicializa o Firebase
const firebasenegocio = initializeApp(firebaseConfig);
const db = getFirestore(firebasenegocio);

const createLista = async (req, res) => {
    const { uid_quadro, nome, ordem } = req.body;
    const criado_em = new Date();

    try {
        const lista = {
            uid_quadro,
            nome,
            ordem,
            criado_em,
            updated_at: null, // Initially set as null
        };
    
        // Add logic to save the column in the "listas" collection
        await addDoc(collection(db, "listas"), lista)

        res.status(201).send("lista criada com sucesso.");
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Erro ao criar lista: ${errorCode} - ${errorMessage}`);
        
        // Handle the column creation error here
        res
            .status(500)
            .send(`Erro ao criar lista: ${errorCode} - ${errorMessage}`);
    }
};

module.exports = {
    create: createLista
};

