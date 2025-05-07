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
      return res
        .status(500)
        .json({ message: `Internal server error: ${error}` });
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
        order: [[{ model: TodoModel, as: "todos" }, "createdAt", "DESC"]],
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Internal server error: ${error}` });
    }
  }
  async deleteUser(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    try {
      const user = await UsersModel.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Internal server error: ${error}` });
    }
  }

  async updateUser(req, res) {
    const { id } = req.params;
    const { username, email, password } = req.body;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    try {
      const user = await UsersModel.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Update fields if provided
      if (username !== undefined) user.username = username;
      if (email !== undefined) user.email = email;
      if (password !== undefined) user.password = password;
      await user.save();
      // Exclude password in response
      const { password: _, ...userData } = user.toJSON();
      return res
        .status(200)
        .json({ message: "User updated successfully", user: userData });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Internal server error: ${error}` });
    }
  }

  async getUserProfile(req, res) {
    try {
      const userId = req.params.id;
      if (!userId)
        return res.status(400).send({ message: "User ID is required" });

      const userExists = await UsersModel.findOne({
        where: { id: userId },
        attributes: { exclude: ["password"] },
      });
      if (!userExists)
        return res.status(404).send({ message: "User not found" });

      res
        .status(200)
        .send({ message: "User fetched successfully", user: userExists });
    } catch (error) {
      res.status(500).send({ message: "Internal server error", error });
    }
  }
}

module.exports = new UsersController();
