const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, articles) => {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })

  .post((req, res) => {
    const articleTitle = req.body.title;
    const articleContent = req.body.content;

    const article = new Article({
      title: articleTitle,
      content: articleContent,
    });

    article.save((err) => {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully removed all articles.");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, article) => {
      if (article) {
        res.send(article);
      } else {
        res.send("No matching article found.");
      }
    });
  })

  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch((req, res) => {
    Article.updateOne({ title: req.params.articleTitle }, req.body, (err) => {
      if (!err) {
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("Successfully deleted article.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
