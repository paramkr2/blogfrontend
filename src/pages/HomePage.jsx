import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Button, Card, CardContent, CardMedia,Box } from '@mui/material';
import './styles/HomePage.css';
import tradingImage  from './trading_default.jpg';
import services from './services.png';
import strategy from './strategy.png';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import ContactForm from '../components/ContactForm.jsx'

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
                <Typography
                  variant="h3"
                  component="h3"
                  gutterBottom
                  className="fade-in-text"
                >
                  <span className="word">The industry’s</span>
                  <span className="word">best tactical asset allocation</span>
                  <span className="word">strategies, in one place.</span>
                </Typography>
                
                <Typography variant="h5" component="div" paragraph sx={{ paddingTop: '10px' }}>
                  
                    <Typography variant="h4" component="h1" gutterBottom sx={{ marginBottom: '0px' }}>
                      What we do
                    </Typography>

                    <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                      Build bots to trade crypto, stocks, and futures
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        style={{ display: 'inline-block', marginLeft: '10px' }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            border: '2px solid transparent',
                            color: 'rgba(0, 0, 0, 0.7)', // Transparent color
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              color: 'black', // On hover becomes blacker
                              borderColor: 'black',
                            },
                          }}
                        >
                          Learn More
                        </Button>
                      </motion.span>
                    </Typography>

                  
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
                initial={{ opacity: 0.1, filter: 'blur(10px)' }}
                animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              >
                <Typography variant="h3" component="h3" gutterBottom className="fade-in-text">
                  <span className="word">About</span> <span className="word">Us</span> 
                </Typography>
                <Typography variant="h6" paragraph>
                  <p>
                    Cryptogull builds bots to trade crypto, stocks, and futures. We utilize tech, data, and economic intuition to find trends and automate profits.
                  </p>
                </Typography>
                <Box
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent white
                    padding: '20px',
                    borderRadius: '8px', // Rounded corners
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Light shadow for depth
                    maxWidth: '600px', // Optional max width for a cleaner layout
                    margin: '0 auto', // Centering the box
                  }}
                >
                  <Typography variant="h6" paragraph>
                    <h2 style={{ textAlign: 'center' }}>Our Team</h2>
                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                      <li style={{ fontSize: '1rem' }}>
                        <span>Gull</span> — Trader and Quant.
                      </li>
                      <li style={{ fontSize: '1rem' }}>
                        <span>Narender</span> — Algorithmic Trading Software Developer
                      </li>
                      <li style={{ fontSize: '1rem' }}>
                        <span>Vivek</span> — Full Stack Developer
                      </li>
                    </ul>
                  </Typography>
                </Box>
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
              <motion.div
                initial={{ opacity: 0.1, filter: 'blur(10px)' }}
                animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              >
                <Typography variant="h3" component="h3" gutterBottom className="fade-in-text">
                  <span className="word">Contact</span> <span className="word">Us</span> 
                </Typography>
                <Typography variant="h5" paragraph>
                  
                    
                  <p>
                  Email: <a href="mailto:gull@cryptogull.io">gull@cryptogull.io</a><br />
                  Twitter: <a href="https://twitter.com/cryptogull_io">@cryptogull_io</a>
                </p>
                </Typography>
              </motion.div>
              
            </Grid>
            {/* Right column - Transparent image */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0.1, filter: 'blur(10px)' }}
                animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              >
               <ContactForm />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </div>

    </div>
  );
}
