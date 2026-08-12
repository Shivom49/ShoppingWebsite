import ProductSection from "./ProductSection";
import RecommendedProducts from "./RecommendataionSection";
import TrendingProducts from "./TrendingProducts";
export default function ProductList({ products, recommendProducts, trendingProducts }) {

   

    return (
        <>


        <div className="product-list">


       


<RecommendedProducts
    title="For You"
    recommendProducts={recommendProducts}
/>

<TrendingProducts
    title="Trending Products"
    trendingProducts={trendingProducts}
/>

<ProductSection
    title="Smartphones"
    category="smartphone"
    products={products}
/>

<ProductSection
    title="Laptops"
    category="laptop"
    products={products}
/>

<ProductSection
    title="Audio"
    category="audio"
    products={products}
/>

<ProductSection
    title="Smartwatches"
    category="smartwatch"
    products={products}
/>

<ProductSection
    title="Accessories"
    category="accessory"
    products={products}
/>

            </div>
        </>
    );
}