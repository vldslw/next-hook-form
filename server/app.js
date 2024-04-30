const express = require("express");
const cors = require("cors");
const { celebrate, Joi, errors } = require("celebrate");
const jwt = require("jsonwebtoken");
const app = express();

const testEmail = "test@gmail.com";
const testPassword = "password1234";

app.use(cors());
app.use(express.json());

app.post(
  "/signin",
  celebrate({
    body: Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  (req, res, next) => {
    const { email, password } = req.body;
    if (email === testEmail && password === testPassword) {
      const token = jwt.sign({ email }, "dev-secret", { expiresIn: "7d" });
      res.send({ token });
    } else {
      next({ statusCode: 401, message: "Неправильная почта или пароль" });
    }
  }
);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
});

app.listen(4000, () => {
  console.log(`Listening on port 4000.`);
});
