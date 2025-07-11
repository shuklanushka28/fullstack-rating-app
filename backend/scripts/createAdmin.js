const bcrypt = require("bcrypt");
const { User, sequelize } = require("../models");

const createAdmin = async () => {
  try {
    await sequelize.sync();

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.create({
      name: "Super Admin",
      email: "Anushkavshukla28@gmail.com",
      password: myname,
      address: "Admin HQ",
      role: "admin"
    });

    console.log(" Admin created:", admin.email);
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    await sequelize.close();
  }
};

createAdmin();
