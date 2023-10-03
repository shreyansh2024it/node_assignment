const express = require("express");
const axios = require("axios");
const _ = require("lodash");

const app = express();
app.use(express.json());

//config
require('dotenv').config();

//  **Data Retrieval**:

app.get("/api/blog-stats", async (req, res) => {
  try {
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      }
    );
    // Getting Blogs Out from the response
    const blogs = response.data.blogs;

    // Usning Lodash to perform the following analytics:
    // **Data Analysis**:

    // 1. Calculating the total number of blogs

    const totalNumberOfBlogs = _.size(blogs);

    // 2. Finding the blog with longest title

    const longestBlog = _.maxBy(blogs, "title.length");

    // 3. Determine the number of blogs with title containing the word "privacy"
    const privacyBlogs = _.filter(blogs, (blog) => _.includes(blog.title.toLowerCase(), "privacy"));

    // 4. Creating the array of unique blog title
    const uniqueBlogTitles = _.uniqBy(blogs, "title");

    // **Response**:
    res.status(200).json({
      totalNumberOfBlogs,
      longestBlog,
      privacyBlogs,
      uniqueBlogTitles,
    });
  } catch (error) {
    // Handle API request error
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// **Blog Search Endpoint**

app.get("/api/blog-search", async (req, res) => {
  const query = req.query.query.toLowerCase();
  console.log(query);
  try {
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      }
    );
    const blogsData = response.data.blogs; //fetching blogs and storing 
    if (blogsData) {
      //implemented the loadash filter functionalty
      const filteredBlogs = _.filter(blogsData, (blog) => _.includes(blog.title.toLowerCase(), query.toLowerCase()));
      console.log(filteredBlogs)
      res.status(200).json({ message: "Fetched Succesfully", filteredBlogs });
    } else {
      console.log("not working");
      res.status(200).json({ message: "Error In Fetching Blogs" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went wrong" });
  }
});

// **Bonus Challenge**
async function fetchAndAnalyzeBlogs() {
  try {
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret": "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      }
    );

    const blogs = response.data.blogs;

    const totalNumberOfBlogs = _.size(blogs);
    const longestBlog = _.maxBy(blogs, "title.length");
    const privacyBlogs = _.filter(blogs, (blog) => _.includes(blog.title.toLowerCase(), "privacy"));
    const uniqueBlogTitles = _.uniqBy(blogs, "title");

    return {
      totalNumberOfBlogs,
      longestBlog,
      privacyBlogs,
      uniqueBlogTitles,
    };
  } catch (error) {
    throw error;
  }
}
const cachingPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
const memoizedFetchAndAnalyzeBlogs = _.memoize(fetchAndAnalyzeBlogs, undefined, cachingPeriod);

app.get('/api/blog-stats', async (req, res) => {
  try {
    const analyzedData = await memoizedFetchAndAnalyzeBlogs();
    res.status(200).json(analyzedData);
  } catch (error) {
    console.error('Error fetching or caching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Listenign on the Port Number 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
