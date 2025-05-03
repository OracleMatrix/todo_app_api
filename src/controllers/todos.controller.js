const Joi = require("joi");
const db = require("../models");
const UserModel = db.users;
const TodosModel = db.todos;
const { Op } = require("sequelize");

class TodosController {
  async createTodo(req, res) {
    const schema = Joi.object({
      title: Joi.string().min(3).max(20).required(),
      description: Joi.string().min(3).max(255).required(),
      status: Joi.string().valid('pending', 'in-progress', 'completed').required(),
      completedAt: Joi.date(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const userId = req.params.userId;
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    // check user exists
    const user = await UserModel.findOne({
      where: { id: userId },
    }).catch((error) => {
      return res.status(400).send({ message: "Error on finding user", error });
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    try {
      const { title, description, status, completedAt } = req.body;

      const createTodo = await TodosModel.create({
        title,
        description,
        status,
        userId,
        completedAt,
      }).catch((error) => {
        return res
          .status(400)
          .send({ message: "Error on creating todo", error });
      });

      const todo = await TodosModel.findOne({
        where: { id: createTodo.id },
        include: {
          model: UserModel,
          attributes: { exclude: ["password"] },
        },
      });

      return res
        .status(201)
        .send({ message: "TODO created successfully", todo });
    } catch (error) {
      return res.status(500).send({ message: "internal server error", error });
    }
  }

  async updateTodo(req, res) {
    const schema = Joi.object({
      title: Joi.string().min(3).max(20).required(),
      description: Joi.string().min(3).max(255).required(),
      status: Joi.string()
        .valid("pending", "in-progress", "completed")
        .required(),
      userId: Joi.number().required(),
      completedAt: Joi.date(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const todoId = req.params.todoId;
    if (!todoId)
      return res.status(400).json({ message: "TODO ID is required" });

    // check user exists
    const todo = await TodosModel.findOne({
      where: { id: todoId },
    }).catch((error) => {
      return res.status(400).send({ message: "Error on finding todo", error });
    });

    if (!todo) return res.status(404).json({ message: "TODO not found" });

    try {
      const { title, description, status, userId, completedAt } = req.body;

      const userExists = await UserModel.findOne({
        where: { id: userId },
      }).catch((error) => {
        return res
          .status(400)
          .send({ message: "Error on finding user", error });
      });

      if (!userExists)
        return res.status(404).json({ message: "User not found" });

      await TodosModel.update(req.body, {
        where: { id: todoId },
      }).catch((error) => {
        return res
          .status(400)
          .send({ message: "Error on updating todo", error });
      });

      return res.status(200).send({ message: "TODO updated successfully" });
    } catch (error) {
      return res.status(500).send({ message: "internal server error", error });
    }
  }
  async deleteTodo(req, res) {
    const todoId = req.params.todoId;
    if (!todoId)
      return res.status(400).json({ message: "TODO ID is required" });

    try {
      const todo = await TodosModel.findOne({ where: { id: todoId } });
      if (!todo) return res.status(404).json({ message: "TODO not found" });

      await TodosModel.destroy({ where: { id: todoId } });
      return res.status(200).json({ message: "TODO deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "internal server error", error });
    }
  }

  async updateStatus(req, res) {
    const schema = Joi.object({
      status: Joi.string()
        .valid("pending", "in-progress", "completed")
        .required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const todoId = req.params.todoId;
    if (!todoId)
      return res.status(400).json({ message: "TODO ID is required" });

    try {
      const todo = await TodosModel.findOne({ where: { id: todoId } });
      if (!todo) return res.status(404).json({ message: "TODO not found" });

      await TodosModel.update(
        { status: req.body.status },
        { where: { id: todoId } }
      );

      return res
        .status(200)
        .json({ message: "TODO status updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "internal server error", error });
    }
  }

  async markAsComplete(req, res) {
    const todoId = req.params.todoId;
    if (!todoId)
      return res.status(400).json({ message: "TODO ID is required" });

    try {
      const todo = await TodosModel.findOne({ where: { id: todoId } });
      if (!todo) return res.status(404).json({ message: "TODO not found" });

      await TodosModel.update(
        { status: "completed", completedAt: new Date() },
        { where: { id: todoId } }
      );

      return res.status(200).json({ message: "TODO marked as complete" });
    } catch (error) {
      return res.status(500).json({ message: "internal server error", error });
    }
  }

  async searchTodo(req, res) {
    try {
      const { title, userId } = req.query;

      if (!title) {
        return res
          .status(400)
          .send({ message: "Title query parameter is required" });
      }
      if (!userId) {
        return res
          .status(400)
          .send({ message: "User ID query parameter is required" });
      }

      const todos = await TodosModel.findAll({
        where: {
          title: {
            [Op.like]: `%${title}%`,
          },
          userId,
        },
      });

      if (!todos.length) {
        return res.status(404).send({ message: "No todos found" });
      }

      res.status(200).send(todos);
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }
}

module.exports = new TodosController();
