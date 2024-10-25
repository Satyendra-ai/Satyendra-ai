require("dotenv").config();
const express = require("express");
const { query, validationResult } = require("express-validator");
const http = require("http");

const app = express();
const router = express.Router();

app.use(express.json());

router.get("/", (req, res) => {
    return res.send({ message: "Node sample API is running" });
});

router.get('/users', [
    query('userId').optional().isInt().withMessage('UserId must be an integer'),
    query('salary').optional().isInt().withMessage('Salary must be an integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { userId, salary } = req.query;

        let user_data = [
            { userId: 1, salary: 5000 },
            { userId: 2, salary: 6000 },
            { userId: 3, salary: 7000 },
            { userId: 4, salary: 8000 },
            { userId: 5, salary: 9000 }
        ];

        const userIdInt = userId ? parseInt(userId, 10) : null;
        const salaryInt = salary ? parseInt(salary, 10) : null;

        if (userIdInt || salaryInt) {
            user_data = user_data.filter(item => item.userId === userIdInt || item.salary === salaryInt);
        }

        return res.status(200).send({ status: 200, message: "Records fetched successfully", data: user_data });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: 500, message: "Internal server error" });
    }
});

// Use the router in the app
app.use('/', router);

const httpServer = http.createServer(app);

/* Socket server listen */
httpServer.listen(process.env.PORT, async () => {
    console.log("Server is running on PORT:", process.env.PORT);
});
