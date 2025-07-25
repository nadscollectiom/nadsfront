import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import { Contacts, Item, Main, Order, Shop } from './components/route'
import Layout from './Layout'
import { CartProvider } from './context/CartContext'
import NotFound from './NotFound'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route 
      path='/' 
      element={<Layout />}>
        <Route 
          path='' 
          element={<Main />} 
        />
        <Route 
          path='shop' 
          element={<Shop />} 
        />
        <Route 
          path='contacts' 
          element={<Contacts />} 
        />
        <Route 
          path='order' 
          element={<Order />} 
        />
        <Route 
          path='item/:id' 
          element={<Item />} 
        />
        <Route 
          path='collection/:id' 
          element={<Item />} 
        />
              <Route path="*" element={<NotFound />} />
    </Route>
  )
)

function App() {
  return (
    <>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </>
  )
}

export default App