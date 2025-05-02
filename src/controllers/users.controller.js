const db = require("../models");
const UsersModel = db.users;
const TodoModel = db.todos;

class UsersController {
  async getAllUsers(req, res) {
    try {
      const users = await UsersModel.findAll({
        attributes: { exclude: ["password"] },
        include: [
          {
            model: TodoModel,
            as: "todos",
            attributes: ["id", "title", "description", "status"],
          },
        ],
      });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: `Internal server error: ${error}` });
    }
  }

  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await UsersModel.findOne({
        where: { id },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: TodoModel,
            as: "todos",
          },
        ],
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: `Internal server error: ${error}` });
    }
  }
  async deleteUser(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    try {
      const user = await UsersModel.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: `Internal server error: ${error}` });
    }
  }
}

module.exports = new UsersController();
