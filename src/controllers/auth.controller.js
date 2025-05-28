const Joi = require("joi");
const jwt = require("jsonwebtoken");
const db = require("../models");
const UsersModel = db.users;
const _ = require("lodash");
const {Op} = require("sequelize");

class AuthController {
    async register(req, res) {
        const schema = Joi.object({
            username: Joi.string().min(3).max(20).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(255).required(),
        });

        const {error} = schema.validate(req.body);
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }

        const {username, email, password} = req.body;

        // Check if the username or email already exists
        const existingUser = await UsersModel.findOne({
            where: {
                [Op.or]: [{username}, {email}],
            },
        });
        if (existingUser) {
            return res.status(400).json({
                message: "Username or email already exists",
            });
        }

        try {
            const user = await UsersModel.create({
                username,
                email,
                password,
            });

            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            return res.status(201).json({
                message: "User registered successfully",
                user: _.pick(user, ["id", "username", "email"]),
                token,
            });
        } catch (err) {
            return res.status(500).json({message: `Internal server ${err}`});
        }
    }

    async login(req, res) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(255).required(),
        });

        const {error} = schema.validate(req.body);
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }

        const {email, password} = req.body;

        try {
            const user = await UsersModel.findOne({where: {email}});
            if (!user) {
                return res.status(401).json({message: "Invalid credentials"});
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({message: "Invalid credentials"});
            }

            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            return res.status(200).json({
                message: "Login successful",
                user: _.pick(user, ["id", "username", "email"]),
                token,
            });
        } catch (err) {
            return res.status(500).json({message: `Internal server ${err}`});
        }
    }

    async newToken(req, res) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
        });
        const {error} = schema.validate(req.params);
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }

        try {
            const userExists = await UsersModel.findByPk(req.params.userId);
            if (!userExists) {
                return res.status(404).json({message: "User does not exist"});
            }

            const newToken = await jwt.sign({id: userExists.id}, process.env.JWT_SECRET, {expiresIn: "7d"});
            return res.status(200).json({
                message: "Token created",
                user: _.pick(userExists, ["id", "username", "email"]),
                token: newToken,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            })
        }
    }
}

module.exports = new AuthController();
