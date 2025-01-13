import { BrowserRouter,Routes,Route } from "react-router-dom"
import Register from "./components/Register"
import Login from "./components/Login"
import VerifyEmail from "./components/Verifyemail"
import Nav from "./components/Nav"
import BuyerProfile from "./components/Buyerprofile"
import SellerProfile from "./components/Sellerprofile"
import AddProduct from "./components/Addproducts"
import HomePage from "./components/Home"
import ForSalePage from "./components/Foresale"
import EditProductPage from "./components/Editproduct"
import ChangePassword from "./components/Passchange"
import ProductPage from "./components/Product"
import Wishlistdisplay from "./components/Wishlist"
import CartPage from "./components/Cart"
import Orderspage from "./components/Orders"
import Success from "./components/Success"
import SellerOrders from "./components/Sellerorder"


function App() {


  return (
    <>
    <BrowserRouter>
    <Nav></Nav>
    <Routes>
    <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/changepass" element={<ChangePassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/bprofile" element={<BuyerProfile />} />
      <Route path="/sprofile" element={<SellerProfile/>} />
      <Route path="/addproduct" element={<AddProduct/>} />
      <Route path="/forsale/:id" element={<ForSalePage/>} />
      <Route path="/editproduct/:id" element={<EditProductPage/>} />
      <Route path="/product/:id" element={<ProductPage/>} />
      <Route path="/wishlist" element={<Wishlistdisplay/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/orders" element={<Orderspage/>} />
      <Route path="/success" element={<Success/>} />
      <Route path="/sellerorders" element={<SellerOrders/>} />












    </Routes>
    </BrowserRouter>
    </>
     
  )
}

export default App
