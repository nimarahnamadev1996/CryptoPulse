import React, { useEffect, useState } from 'react'
import CoinCard from './components/CoinCard'
import FilterInput from './components/FilterInput'
import LimitSelector from './components/LimitSelector'
import SortSelector from './components/SortSelector'


const API_URL = import.meta.env.VITE_API_URL

const App = () => {

  const [coins,setCoins] = useState([])
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState(null)
  const [limit,setLimit] = useState(10)
  const [filter,setFilter] = useState("")
  const [sortBy,setSortBy] = useState("market_cap_desc")



  const filteredCoins = coins.filter((coin) => {
    const name = coin?.name?.toLowerCase() || '';
    const symbol = coin?.symbol?.toLowerCase() || '';
    const search = filter?.toLowerCase() || '';

    return name.includes(search) || symbol.includes(search)
  })
  .slice()
  .sort((a, b) => {
    switch (sortBy) {
      case "market_cap_desc":
        return (b.market_cap || 0) - (a.market_cap || 0);
      case "market_cap_asc":
        return (a.market_cap || 0) - (b.market_cap || 0);
      case "price_desc":
        return (b.current_price || 0) - (a.current_price || 0);
      case "price_asc":
        return (a.current_price || 0) - (b.current_price || 0);
      case "change_desc":
        return (
          (b.price_change_percentage_24h || 0) -
          (a.price_change_percentage_24h || 0)
        );
      case "change_asc":
        return (
          (a.price_change_percentage_24h || 0) -
          (b.price_change_percentage_24h || 0)
        );
      default:
        return 0;
    }
  });


  const fetchCoins = async() => {

    try{

      const res = await fetch(`${API_URL}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`)
      
      if(!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()  
      setCoins(data)

    }catch(err){
     setError(err.message)
    }finally{
      setLoading(false)
    }
  }


  useEffect(() => {
      fetchCoins()
  },[limit])




  return (
   <div>
    <h1>Crypto Pulse</h1>

    {loading && <div>Loading...</div>}

    {error && <div className='error'>{error}</div>}

    <div className='top-controls'>
      <FilterInput   filter={filter} onFilterChange={setFilter}/>
      <LimitSelector limit={limit} onLimitChange={setLimit}/>
      <SortSelector sortBy={sortBy} onSortChange={setSortBy} />
    </div>

    {
      !loading  && !error &&  (
        <main className='grid'>
           {
            filteredCoins?.map((coin) => (
              <CoinCard coin={coin} key={coin.id} />
            ))
           }
        </main>
      )
    }


   </div>
  )
}

export default App