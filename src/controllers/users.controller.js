const db = require("../models");
const UsersModel = db.users;
const TodoModel = db.todos;
const Joi = require("joi");

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
    try {
      const { id } = req.params;
      const schema = Joi.object({
        username: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(255).required(),
      });
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const { username, email, password } = req.body;
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await UsersModel.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await UsersModel.update(req.body, {
        where: { id },
      });

      return res
        .status(200)
        .send({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: `Internal server ${error}` });
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
