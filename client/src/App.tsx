import Main from './components/layout/Main';
import Header from './components/layout/Header';
import LeftMenu from './components/layout/LeftMenu';
import Footer from './components/layout/Footer';
import './App.scss'

// TODO:
// redux store
// styles
// all api requests
// profile
// responsive design

function App() {
  return (
    <div className='page-container'>
      <Header />
      <div className='main'>
        <LeftMenu />
        <Main />
      </div>
      <Footer />
    </div>
  );
}

export default App;
