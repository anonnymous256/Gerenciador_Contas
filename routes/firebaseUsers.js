var express = require("express");
var router = express.Router();
const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Rota para listar usuários
router.get("/", async (req, res) => {
    try {
      const listUsersResult = await admin.auth().listUsers();
      res.json(listUsersResult.users); 
    } catch (error) {
      console.error("Erro ao buscar usuários:", error); 
      res.status(500).json({ error: error.message }); 
    }
  });
  
async function verifyUserAuth(req, res, next) {
  const { uid, targetUid } = req.body;
  
  if (!uid || !targetUid) {
      return res.status(400).json({ error: "UID do usuário não informado!" });
  }

  try {
      const userRecord = await admin.auth().getUser(uid);

      if (!userRecord) {
          return res.status(403).json({ error: "Usuário não autorizado!" });
      }

      next(); 
  } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      res.status(403).json({ error: "Usuário não autenticado!" });
  }
}

// Rota para ativar ou desativar o usuário
router.post("/toggle", verifyUserAuth, async (req, res) => {
  const { uid, targetUid, disable } = req.body;

  try {
      if (uid !== "op95kJpDUiQsLw2qULC1EUbsA4t2") {
          return res.status(403).json({ error: "Você não tem permissão para alterar o status de outro usuário." });
      }

      await admin.auth().updateUser(targetUid, { disabled: disable });
      res.json({ message: `Usuário ${disable ? "desativado" : "ativado"} com sucesso!` });
  } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ error: error.message });
  }
});


module.exports = router;
