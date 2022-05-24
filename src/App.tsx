import axios from 'axios';
import { useEffect, useState } from 'react';
import { Spinner } from './components/Spinner';
import './select.css';

interface Brand {
  codigo: string;
  nome: string;
}

interface Car {
  codigo: string;
  nome: string;
}

interface Year {
  codigo: string;
  nome: string;
}

interface ValueData {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
}

function App() {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // brand
  const [brands, setBrands] = useState<Brand[] | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('select');
  // car model
  const [cars, setCars] = useState<Car[] | null>(null);
  const [selectedCar, setSelectedCar] = useState<string>('select');
  // model year
  const [years, setYears] = useState<Year[] | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('select');
  // final data
  const [valueData, setValueData] = useState<ValueData | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas');        
        setBrands(response.data);
      } catch(err) {
       console.log('fetchBrands', err); 
      }
      setIsLoading(false);
    };

    fetchBrands();
  }, []);

  async function fetchCars(brandCode: string) {    
    try {
      const response = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandCode}/modelos`);
      const { modelos } = response.data;
      return modelos;
    } catch(err) {
      console.log('fetchCars', err);
    }
  }

  async function fetchYears(brandCode: string, carCode: string) {
    try {
      const response = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandCode}/modelos/${carCode}/anos`);            
      return response.data;
    } catch(err) {
      console.log('fetchYears', err);
    }
  }

  async function fetchValue(brandCode: string, carCode: string, yearCode: string) {    
    try {
      const response = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandCode}/modelos/${carCode}/anos/${yearCode}`);            
      return response.data;
    } catch(err) {
      console.log('fetchYears', err);
    }
  }

  function handleBrandChange(event: any) {
    const brandCode = event.target.value;

    setCars(null);
    setSelectedCar('select');

    setSelectedBrand(brandCode);

    if(brandCode === 'select') return;

    setIsLoading(true);
    fetchCars(brandCode).then(modelos => setCars(modelos)).finally(() => setIsLoading(false));
  }

  function handleCarChange(event: any) {
    const carCode = event.target.value; 

    setYears(null);
    setSelectedYear('select');

    setSelectedCar(carCode);

    if(selectedBrand === 'select' || carCode === 'select') return;

    setIsLoading(true);
    fetchYears(selectedBrand, carCode).then(years => setYears(years)).finally(() => setIsLoading(false));
  }

  function handleYearChange(event: any) {
    const yearCode = event.target.value;

    setValueData(null);
    setSelectedYear(yearCode);

    if(selectedBrand === 'select' || selectedCar === 'select' || yearCode === 'select') return;

    setIsLoading(true);
    fetchValue(selectedBrand, selectedCar, yearCode).then(value => setValueData(value)).finally(() => setIsLoading(false));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className='box'>
          <select name="brands" id="brands" onChange={e => handleBrandChange(e)} value={selectedBrand}>
          <option value="select" disabled={true}>Marca</option>
          {
            brands && (
              brands.map(item => <option key={item.codigo} value={item.codigo}>{item.nome}</option>)
            )
          }
          </select>
        </div>

      {
        selectedBrand !== 'select' && (
          <div className='box'>
            <select name="cars" id="cars" onChange={e => handleCarChange(e)} value={selectedCar}>
            <option value="select" disabled={true}>Modelo</option>
            {
              cars && (
                cars.map(item => <option key={item.codigo} value={item.codigo}>{item.nome}</option>)
              )
            }
            </select>
          </div>
        )
      }

      {
        selectedBrand !== 'select' && selectedCar !== 'select' && (
          <div className='box'>            
            <select name="years" id="years" onChange={e => handleYearChange(e)} value={selectedYear}>
            <option value="select" disabled={true}>Ano</option>
            {
              years && (
                years.map(item => <option key={item.codigo} value={item.codigo}>{item.nome}</option>)
              )
            }
            </select>
          </div>
        )
      }

      {
        isLoading ? (
          <Spinner />
        ) : (
          selectedBrand !== 'select' && selectedCar !== 'select' && selectedYear !== 'select' && valueData && (
            <div style={{ marginTop: 40 }}>            
              <span style={{ fontSize: 32, color: 'white' }}>
              {valueData.Valor}
              </span>
              <footer style={{ color: 'gray' }}>
                Referência: {valueData.MesReferencia}
              </footer>
            </div>
          ) 
        )        
      }
    </div>
  )
}

export default App
