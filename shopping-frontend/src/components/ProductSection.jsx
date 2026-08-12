import Card from "./Card";
import "../App"
export default function ProductSection({title, category, products }) {


    

  return (
    <>

      <div className="section-wrapper">
     <h1>{title}</h1>

    <div className="product-section">

     

      <div className="card-row">

      {
        products.filter(product => product.category === category).slice(0, 5).map(product => 
          (
            <Card  key={product._id} productId={product._id} id={product.id} name={product.name} price={product.price} />
          ))
      }

      

      </div>


      </div>


      </div>
    </>
  )
}