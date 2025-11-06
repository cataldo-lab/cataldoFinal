

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <img 
        src="/styloLogo.svg" 
        alt="Stylo Logo" 
        className="w-120 h-auto"
      />

      <div iv className="flex flex-col items-center mt-8">
      <div>
      <h1 className="text-4xl font-bold mx-4">Bienvenido a Funiture App</h1>
      </div>
        
      <div>
        <p className="mt-4 text-lg">Tu solución para muebles a medida.</p>
      </div>
    </div>
    </div>
    
  )
}

export default Home