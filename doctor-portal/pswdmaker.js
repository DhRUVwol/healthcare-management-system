const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashed);
}

hashPassword("aaa"); // Change this to your desired admin password