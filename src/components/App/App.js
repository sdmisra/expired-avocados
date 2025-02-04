import './App.css';
import React, {Component} from 'react';
import Header from '../Header/Header';
import MoviesContainer from '../MoviesContainer/MoviesContainer';
import Error from '../../Error/Error';
import FilterForm from '../FilterForm/FilterForm'
import MovieDetails from '../MovieDetails/MovieDetails';
import {fetchAllMovies} from '../../apiCalls';
import {Switch, Route, Redirect} from "react-router-dom";

class App extends Component {
  constructor() {
    super();
    this.state = {
      allMovies: [],
      displayedMovies: [],
      errorMessage: ''
    };
  }

  componentDidMount() {
    fetchAllMovies()
      .then(data => this.setState({allMovies: data.movies, displayedMovies: data.movies}))
      .catch(() => {
        this.setState({errorMessage: 'Network Error'})
      })
  }

  filterMovies = (filters) => {
    let output = this.state.allMovies;
    if(filters.title) {
      output = output.filter(movie => movie.title.includes(filters.title));
    }
    if(filters.ripeness[0] > 0 || filters.ripeness[1] < 10) {
      output = output.filter(movie => movie.average_rating >= filters.ripeness[0] && movie.average_rating <= filters.ripeness[1]);
    } 
    this.setState({displayedMovies: output});
  }
  
  render() {
    return (
      <main className="App">
        <Header />
        <Switch>
          <Route path="/movies/:movieID" render={({match}) => {
            return <MovieDetails selectMovie={this.selectMovie} selectedMovieId={match.params.movieID}/>
          }}/>
          <Route path='/error'>
            <Error errorMessage="Network Errors are the Pits!"/>
          </Route>
          <Route exact path="/">
            {this.state.errorMessage ? <Redirect to='/error'/> :
            <>
              <MoviesContainer movies={this.state.displayedMovies} selectMovie={this.selectMovie}/> 
              <FilterForm filterMovies={this.filterMovies}/>
            </>}
          </Route>
          <Route>
            <Redirect to='/error'/>
          </Route>
        </Switch>
      </main>
    );
  }
}

export default App;
