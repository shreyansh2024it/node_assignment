const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
app.use(express.json());
let blogsData;

app.get('/api/blog-stats', async (req, res) => {
    try {
      const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
        headers: {
          'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        }
      });
      console.log(response.data.blogs)
      const blogs=response.data.blogs;
       blogsData=response.data.blogs;
      // Blogs Length
      console.log(blogs.length)
      const bloglength=blogs.length;
      // 

      const longestBlog = _.maxBy(blogs, 'title.length');
      console.log(longestBlog)
      const privacyBlogs = blogs.filter(blog => blog.title.toLowerCase().includes('privacy'));
      console.log(privacyBlogs)
      const uniqueBlogTitles = _.uniqBy(blogs, 'title');
      console.log(uniqueBlogTitles.length)

      res.status(200).json({message:"okay got it",bloglength,longestBlog,privacyBlogs,uniqueBlogTitles});
      
  
      // Data Analysis and Response will be implemented next.
    } catch (error) {
      // Handle API request error
      console.error('Error fetching data:', error); 
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/api/blog-search', (req, res) => {
    const query = req.query.query.toLowerCase();
    console.log(query)
    if(blogsData)
    {
        console.log(blogsData)
    const matchingBlogs = blogsData.filter(blog => blog.title.toLowerCase().includes(query));
    res.json(matchingBlogs);
    }
    else
    {
        console.log("not working")
    }
    
  });
//   app.get('/api/blog-search', (req, res) => {
//     try {
//       const query = req.query.query.toLowerCase();
//       const matchingBlogs = blogs.filter(blog => blog.title.toLowerCase().includes(query));
//       res.json(matchingBlogs);
//     } catch (error) {
//       console.error('Error searching blogs:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
//   const memoizedStats = _.memoize(() => {
//     // Your data analysis code here
//   }, () => 'statsCacheKey'); // Use a constant key for caching
  
//   app.get('/api/blog-stats', async (req, res) => {
//     try {
//       const stats = memoizedStats();
//       res.json(stats);
//     } catch (error) {
//       console.error('Error fetching or caching data:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
            