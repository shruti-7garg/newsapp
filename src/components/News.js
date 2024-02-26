import React,{ useEffect,useState } from 'react';
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';

const News =(props)=> {
const[articles,setArticles] = useState([])
const[loading,setLoading] = useState(true)
const[page,setPage] = useState(1)
const[totalResults,setTotalResults] = useState(0)

    
    const updateNews = async ()=> {
        props.setProgress(10);
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        console.log(parsedData);
        props.setProgress(50);

        // in place of setState use these set
        setArticles(parsedData.articles);
        setLoading(false)
        setTotalResults(parsedData.totalResults)

        props.setProgress(100);
    }

    // on the place of  ComponentDidMount use useEffect
    useEffect(() =>{
        document.title = `${props.category}- NewsCat`
        updateNews();
    }, [])
   
    // const handlePreClick = async () => {
    //     updateNews();
    //     setPage(page-1)
    // }

    // const handleNexClick = async () => {
    //     // if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / props.pageSize))) 
    //     updateNews();
    //     setPage(page+1)
    // }

    const fetchMoreData = async () => {
        
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1)  // takes some time to load new  page
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
    };


        return (
            <>
                <h1 className='text-center' style={{ margin: '35px 0px',marginTop:'90px' }}>NewsCat - Top {props.category} headlines</h1>
                {loading && <Spinner />}

                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner />} >

                    <div className="container">

                        <div className="row my-4">
                           
                            {articles.map((element) => {
                                return <div className="col-md-4" key={element.url}>
                                    <NewsItem title={element.title ? element.title : ""}
                                        description={element.description ? element.description.slice(0, 88) : ""}
                                        imageUrl={element.urlToImage}
                                        newsUrl={element.url}
                                        author={element.author}
                                        date={element.publishedAt}
                                        source={element.source.name} />
                                </div>
                            })}
                        </div>
                        {/* <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePreClick}>&larr; Previous</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNexClick}>Next &rarr;</button>
                </div> */}
                    </div>
                </InfiniteScroll>
            </>
        )
    }


News.defaultProps = {
    country: 'in',
    pageSize: 6,
    category: 'general'
}

 News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}


export default News
