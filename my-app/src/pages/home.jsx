import React from 'react'
import FilterInput from '../components/FilterInput';
import LimitSelector from '../components/LimitSelector';
import SortSelector from '../components/SortSelector';
import CoinCard from '../components/CoinCard'

const HomePage = ({coins,loading,error,filter,setFilter,limit,setLimit,sortBy,setSortBy}) => {


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
    

  return (
     <div>
    <h1>Crypto Pulse</h1>

    {loading && <Spinner color='white' />}

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

export default HomePage