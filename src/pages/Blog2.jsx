import React, { useEffect, useState } from 'react';
import './styles/Blog2.css';
import tradingImage from  './trading_default.jpg'
import axios from 'axios';
import {getDayYear} from '../utils/formatISODate.js';
import { parse } from 'node-html-parser';
import { Twitter, Instagram, Facebook } from '@mui/icons-material';
import {Link} from 'react-router-dom'

const Blog2 = ()=>{
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true); // Track loading state


	const removeTags = (content) => {
	  const parsedContent = parse(content);
	  
	  // Get text content without HTML tags
	  const cleanText = parsedContent.text;

	  return cleanText;
	};



	const fetchBlogPosts = async (page = 1) => {
	    setLoading(true); // Set loading to true while fetching
	    

	    try {
	      const response = await axios.get(
	        `${import.meta.env.VITE_API_URL}/api/posts/?type=published&pageno=${page}`,
	        
	      );
	      setPosts(response.data.results);
	      setLoading(false); // Set loading to false once data is fetched
	      console.log('posts published in blog mange page', response.data)
	    } catch (err) {
	      setPosts(postList);
	      setLoading(false);
	    }
	    console.log(posts);
	  };

	useEffect( ()=>{
		fetchBlogPosts(1);
		setLoading(false);
	},[])

	const postList= [
		{ 
			'id':1,
			'title':'First',
			'truncated_content':'content of the first blog post in the and more and more and more so that it beomes more than one lineand more and more  list ',
			'created_at':'Sept 4'
		},
		{	'id':2,
			'title':'Lemon and Life ',
			'truncated_content':'When Life gives you lemons you make a lemonade',
			'created_at':'Sept 5'
		},
		{	'id':3,
			'title':'A long title that takes more than three lines to view how overflow is handled  ',
			'truncated_content':'When Life gives you lemons you make a lemonade',
			'created_at':'Sept 5'
		},
		{	'id':4,
			'title':'Lemon and Life ',
			'truncated_content':'When Life gives you lemons you make a lemonade',
			'created_at':'Sept 5'
		}

	];

	return(

		<div className="blog2-columns"> 
			<div className="blog2-list">
				{posts.map( (post)=>(
					<Link to={`/blog/${post.id}`} style={{ textDecoration: 'none' }} key={post.id}>
						<div className="post-wrapper" >
							<div className="post-main">
								<div className="post-text">
									<div className="post-title-body">
										<div className="title" > {post.title} </div>
										<div className="body"> {removeTags(post.truncated_content)} </div> 
									</div>
									<div className="post-image">
										<img src={post.image || tradingImage} />
									</div> 
								</div>
								<div className="post-footer">
									<div className="date">{getDayYear(post.created_at)} </div>
									<div>
										<button> <Twitter /> </button>
										<button> <Instagram /> </button>
										<button> <Facebook /> </button>
									</div>
								</div>
								
							</div>
						</div>
					</Link>
				))}
			</div>
			<div className="blog2-side-list">	
				{postList.map( (post)=>(
					<div key={post.id} >
						<div> {post.title} </div>
						<div> {post.content} </div> 
					</div>
				))}

			</div>
		</div>

	);
}

export default Blog2 ;