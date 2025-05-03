const router = require("express").Router();
const auth = require("../middlewares/auth");
const todosController = require("../controllers/todos.controller");

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management and operations
 */

/**
 * @swagger
 * /api/todos/{userId}:
 *   post:
 *     summary: Create a new todo for a user
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *               description:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 todo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: string
 *                     userId:
 *                       type: integer
 *                     completedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error or bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/todos/{todoId}:
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: todoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - status
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *               description:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               status:
 *                 type: string
 *               userId:
 *                 type: integer
 *               completedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       400:
 *         description: Validation error or bad request
 *       404:
 *         description: Todo or user not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/todos/{todoId}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: todoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       400:
 *         description: Todo ID is required
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/todos/{todoId}/status:
 *   patch:
 *     summary: Update the status of a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: todoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       200:
 *         description: Todo status updated successfully
 *       400:
 *         description: Validation error or bad request
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/todos/{todoId}/complete:
 *   patch:
 *     summary: Mark a todo as complete
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: todoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: Todo marked as complete
 *       400:
 *         description: Todo ID is required
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/todos/search:
 *   get:
 *     summary: Search todos by title and userId
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Title to search for
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to filter todos
 *     responses:
 *       200:
 *         description: List of todos matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *                   userId:
 *                     type: integer
 *                   completedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Title and userId query parameters are required
 *       404:
 *         description: No todos found
 *       500:
 *         description: Internal server error
 */

router.post("/:userId", auth, todosController.createTodo);
router.put("/:todoId", auth, todosController.updateTodo);
router.delete("/:todoId", auth, todosController.deleteTodo);
router.patch("/:todoId/status", auth, todosController.updateStatus);
router.patch("/:todoId/complete", auth, todosController.markAsComplete);
router.get("/search", auth, todosController.searchTodo);

module.exports = router;
