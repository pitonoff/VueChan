const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/posts', (req, res) => {
  try {
    const post = {
      id: new Date().getTime(),
      topic: req.body.topic,
      text: req.body.text
    };

    if (!post.topic || !post.text) {
      res.status(400).send('Topic and text are required.');
      return;
    }

    const posts = JSON.parse(fs.readFileSync('posts.json', 'utf-8'));
    posts.push(post);
    fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
    res.json(post);
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/posts', (req, res) => {
  try {
    const posts = JSON.parse(fs.readFileSync('posts.json', 'utf-8'));
    res.json(posts);
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
