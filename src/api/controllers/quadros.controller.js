const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDoc, doc, query, where, getDocs } = require("firebase/firestore");

const firebaseConfig = require("../../../firebaseConfig.js");

// Inicializa o Firebase
const firebasenegocio = initializeApp(firebaseConfig);
const db = getFirestore(firebasenegocio);

const createQuadro = async (req, res) => {
    const { nome, descricao } = req.body;
    const created_at = new Date();

    try {
        const quadro = {
            nome,
            descricao,
            created_at,
            updated_at: null, // Inicialmente definido como null
        };
    
        // Adicione lógica para salvar o usuário na tabela de usuários
        const docRef = await addDoc(collection(db, "quadros"), quadro)

        res.status(201).send("Quadro criado com sucesso.");
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Erro ao criar quadro: ${errorCode} - ${errorMessage}`);
        
        // Lide com o erro de criação do usuário aqui
        res
            .status(500)
            .send(`Erro ao criar quadro: ${errorCode} - ${errorMessage}`);
    }
}

const oneQuadro = async (req, res) => {
    const { uid } = req.params;

    try {
        const quadroRef = doc(db, "quadros", uid);
        const quadroDoc = await getDoc(quadroRef);

        if (quadroDoc.exists()) {
            const quadroData = quadroDoc.data();

            const listaQuery = query(collection(db, "listas"), where("uid_quadro", "==", uid));
            const listaSnapshot = await getDocs(listaQuery);
            const listas = [];

            for (const listaDoc of listaSnapshot.docs) {
                const listaData = listaDoc.data();
                const cartaoQuery = query(collection(db, "cartoes"), where("uid_lista", "==", listaDoc.id));
                const cartaoSnapshot = await getDocs(cartaoQuery);
                const cartoes = cartaoSnapshot.docs.map((doc) => doc.data());

                // Sort the cartoes by cartao.ordem
                cartoes.sort((a, b) => a.ordem - b.ordem);

                const listaWithCartoes = {
                    uid: listaDoc.id, // Add the UID of the list
                    ...listaData,
                    cartoes
                };

                listas.push(listaWithCartoes);
            }

            // Sort the listas by lista.ordem
            listas.sort((a, b) => a.ordem - b.ordem);

            const quadroWithListas = {
                ...quadroData,
                listas
            };

            res.status(200).send(quadroWithListas);
        } else {
            res.status(404).send("Quadro não encontrado.");
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Erro ao obter quadro: ${errorCode} - ${errorMessage}`);
        
        // Lide com o erro de obtenção do usuário aqui
        res
            .status(500)
            .send(`Erro ao obter quadro: ${errorCode} - ${errorMessage}`);
    }
}

const allQuadros = async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'quadros'));
        const quadros = [];
        querySnapshot.forEach((doc) => {
            const quadro = {
                uid: doc.id,
                ...doc.data()
            };
            quadros.push(quadro);
        });
        res.send(quadros);
    } catch (err) {
        res.status(500).send('Erro ao obter quadros: ' + err);
    }
}

module.exports = {
    create: createQuadro,
    one : oneQuadro,
    all : allQuadros
};

