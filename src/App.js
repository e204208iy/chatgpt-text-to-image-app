import './App.css';
import ImageGenApp from './component/gptGenApp';
import Header from './component/header';
function App() {
  return (
    <div className="App">
      <div className='haeder-container'>
        <Header />
      </div>
      <div>
        <ImageGenApp />
      </div>
    </div>
  );
}

export default App;
