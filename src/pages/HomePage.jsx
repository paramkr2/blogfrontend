import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Button, Card, CardContent, CardMedia } from '@mui/material';
import './styles/HomePage.css';
import tradingImage  from './trading_default.jpg'

export default function HomePage() {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts?type=published&pagno=1`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setRecentPosts(response.data.results || []);
      })
      .catch((error) => {
        console.error('Error fetching published posts:', error);
      });
  }, []);

  return (
    <div className="home">
      {/* First Section */}
      <div className="section section1">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left column - Brief about the site */}
            <Grid item xs={12} md={6} >
              <Typography variant="h2" component="h1" gutterBottom className="fade-in-text">
                <span className="word">Welcome</span> <span className="word">to</span> <span className="word">GullCapital</span> 
              </Typography>
              <Typography variant="h5" paragraph>
                From indicators to algos, Unbiased Trading unlocks the benefits of coding in your trading, without needing to learn it. Access the best retail backtesting and algorithmic developers that are powering the biggest retail traders and achieve your trading goals, faster. 
              </Typography>
              
            </Grid>
            {/* Right column - Transparent image */}
            <Grid item xs={12} md={6}>
              <img
                src="https://cdn.prod.website-files.com/65609fbba58b94d045220b6e/65782e339367bc55febf5551_Trade%2001-p-500.png" // Update with your image path
                alt="Site overview"
                style={{ width: '100%', maxWidth: '500px', objectFit: 'contain' }}
              />
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* Second Section - Recent Posts */}
      <div className="section section2">
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom>
            Recent Posts
          </Typography>
          <Grid container spacing={4}>
            {recentPosts.map((post) => (
              <Grid item xs={12} sm={6} md={3} key={post.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={post.imageUrl || tradingImage } // Replace with post image or a default one
                    alt={post.title}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {post.excerpt || post.content.slice(0, 100)}...
                    </Typography>
                    <Button variant="contained" size="small" href={`/blog/${post.id}`}>
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>

      {/* Third Section - About Us */}
      <div className="section section3">
        <Container maxWidth="lg" sx={{ textAlign: 'center', paddingTop: 10 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" paragraph>
            Learn more about what we do and how we are committed to delivering quality content.
          </Typography>
        </Container>
      </div>
    </div>
  );
}
