import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Button, Card, CardContent, CardMedia } from '@mui/material';
import './styles/HomePage.css';
import tradingImage  from './trading_default.jpg';
import services from './services.png';
import strategy from './strategy.png';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function HomePage() {
  const [recentPosts, setRecentPosts] = useState([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' }); // Trigger once when it's about to be in view


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
      <div className="section section1" id="welcome-section" >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left column - Brief about the site */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0.1, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }} 
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            >
              <Typography variant="h3" component="h3" gutterBottom 
                className="fade-in-text"
                >
                <span className="word">The industry’s</span> 
                <span className="word">best tactical asset allocation</span> 
                <span className="word">strategies, in one place.</span>
              </Typography>
              <Typography variant="h5" paragraph>
                  
                <div>
                  <h1>What we do</h1>
                </div>
                <div>
                  <div>Build bots to trade crypto, stocks, and futures</div>
                  <div>
                    <motion.button
                      onClick={(e) => {}}
                      whileHover={{ scale: 1.1 }}
                      style={{ padding: '10px 20px', cursor: 'pointer' }}
                    >
                      Learn more
                    </motion.button>
                  </div>
                </div>
              </Typography>
            </motion.div>
          </Grid>

          {/* Right column - Transparent image */}
          <Grid item xs={12} md={6}>
            <motion.img
              src="https://cdn.prod.website-files.com/65609fbba58b94d045220b6e/65782e339367bc55febf5551_Trade%2001-p-500.png"
              alt="Site overview"
              style={{ width: '100%', maxWidth: '500px', objectFit: 'contain' }}
              initial={{ opacity: 0.1, filter: 'blur(10px)' }}
              animate={ { opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }} // Adjusted delay for the image
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
            {recentPosts.slice(0,4).map((post) => (
              <Grid item xs={12} sm={6} md={3} key={post.id}>
                <Card style={{ height: '350px', display: 'flex', flexDirection: 'column' }}> {/* Fixed card height */}
                  <CardMedia
                    component="img"
                    height="140"
                    image={post.image || tradingImage} // Replace with post image or a default one
                    alt={post.title}
                  />
                  <CardContent style={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography 
                      variant="h6" 
                      component="h3"
                      style={{
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap', // No line limit, but truncate if too long
                      }}
                    >
                      {post.title}
                    </Typography>
                    
                    <div
                      style={{
                        position: 'relative',
                        height: '200px', // Adjust the height to match the text area
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: post.truncated_content }}
                        style={{
                          height: '100%',
                          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0) 100%)', // Thicker fade effect
                maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0) 100%)',
                        }}
                      />
                    </div>

                  </CardContent>
                  <Button 
                    variant="contained" 
                    size="small" 
                    href={`/blog/${post.id}`} 
                    style={{ marginTop: 'auto' }} // Aligns button to the bottom
                  >
                    Read More
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>


       <div className="section section3" id="aboutus" ref={ref}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left column - Brief about the site */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }} // Delay for all text
              >
                <Typography variant="h3" component="h3" gutterBottom className="fade-in-text">
                  <span className="word">About</span> <span className="word">us</span> 
                </Typography>
                <Typography variant="h5" paragraph sx={{ fontSize: '0.9rem' }}>
                  <p>
                    Cryptogull builds bots to trade crypto, stocks, and futures. We utilize tech, data, and economic intuition to find trends and automate profits.
                  </p>
                  <h2 style={{ textAlign: 'left' }}>Team</h2>
                  <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    <li style={{ fontSize: '0.8rem' }}>
                      <span >Gull</span> — Trader and Quant.
                    </li>
                    <li style={{ fontSize: '0.8rem' }}>
                      <span >Narender</span> — Algorithmic Trading Software Developer
                    </li>
                    <li style={{ fontSize: '0.8rem' }}>
                      <span >Vivek</span> — Full Stack Developer
                    </li>
                  </ul>
                </Typography>
              </motion.div>
            </Grid>

          {/* Right column - Transparent image */}
          <Grid item xs={12} md={6}>
            <motion.img
              src={services}  // Update with your image path
              alt="Site overview"
              style={{ width: '100%', maxWidth: '500px', objectFit: 'contain' }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }} // Delay for image
            />
          </Grid>
        </Grid>
      </Container>
    </div>

      <div className="section section4" id="contact">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left column - Brief about the site */}
            <Grid item xs={12} md={6} >
              <Typography variant="h3" component="h3" gutterBottom className="fade-in-text">
                <span className="word">Contact</span> <span className="word">Us</span> 
              </Typography>
              <Typography variant="h5" paragraph>
                
                  <p>
                    We'd love to hear from you. Please use the form below to email us, and we will respond within 24 hours.
                  </p>
                <p>
                Email: <a href="mailto:gull@cryptogull.io">gull@cryptogull.io</a><br />
                Twitter: <a href="https://twitter.com/cryptogull_io">@cryptogull_io</a>
              </p>
              </Typography>
              
            </Grid>
            {/* Right column - Transparent image */}
            <Grid item xs={12} md={6}>
              <img
                src={services} // Update with your image path
                alt="Site overview"
                style={{ width: '100%', maxWidth: '500px', objectFit: 'contain' }}
              />
            </Grid>
          </Grid>
        </Container>
      </div>

    </div>
  );
}
