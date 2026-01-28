import React from 'react'
import ItemCard from '../components/itemcard'
import CTA from '../components/CTA'


const CTAproducts = () => {
  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      name: 'Earthen Water Cooler (Gurgulet)',
      price: 850,
      originalPrice: 1200,
      image: 'https://media.istockphoto.com/id/1457410717/photo/traditional-water-cooler.webp?a=1&b=1&s=612x612&w=0&k=20&c=4eTSgGYokqUg6OmdDLPo3itf-x6b1fmhmyu_wTpKe50='
    },
    {
      id: 2,
      name: 'Coconut Shell Ladle Set',
      price: 450,
      originalPrice: 650,
      image: 'https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/64a28a75c9b39ab9059f522e/02_0011_038a9627-1-1-.jpg'
    },
    {
      id: 3,
      name: 'Bamboo Winnowing Fan (Sup)',
      price: 250,
      originalPrice: 400,
      image: 'https://media.istockphoto.com/id/1334671137/photo/black-beans-in-a-bamboo-winnowing-fan-on-a-black-table-grains-top-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=5UvcGumjjaDZzkVZUaucoewovC62avLOonFXVAUuLUc='
    },
    {
      id: 4,
      name: 'Handwoven Kunbi Saree',
      price: 550,
      originalPrice: 899,
      image: 'https://lh3.googleusercontent.com/p/AF1QipPAsHb00Nd9ZsBEVViZAHrJhpAZYsCmiIw__1qL=w244-h306-n-k-no-nu'
    },
    {
      id: 5,
      name: 'Traditional Coconut Scraper',
      price: 950,
      originalPrice: 1450,
      image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRJi43yDg8u6Na1YuTXGEmGpaWDZ0dRNwDSdwkORJ1Wjt6BZksUcbmwxfjfUxr12xSoTIxAdTjKxIojpZR9QSQsWezfXJVVrEGLwgAv4hKA1dcSxiuaAOKZOQ'
    }
  ]

  // Just arrived products data
  const justArrivedProducts = [
    {
      id: 6,
      name: 'Areca Leaf Plates (Set of 20)',
      price: 299,
      originalPrice: 499,
      image: 'https://images.jdmagicbox.com/v2/comp/def_content/ncat_id/leaf-plate-jz2xgt0-250.jpg'
    },
    {
      id: 7,
      name: 'Terracotta Curd Setter',
      price: 350,
      originalPrice: 550,
      image: 'https://i0.wp.com/craftlipi.com/wp-content/uploads/2022/06/UW-CRDS-W3-b-scaled-e1655106264160.webp?fit=1772%2C1555&ssl=1'
    },
    {
      id: 8,
      name: 'Goan Spice Box (Wooden)',
      price: 899,
      originalPrice: 1499,
      image: 'https://images.pexels.com/photos/29172138/pexels-photo-29172138.jpeg'
    },
    {
      id: 9,
      name: 'Natural face scrub (50g)',
      price: 150,
      originalPrice: 250,
      image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRqA3BnZBMTZc98g0s2VYOhBMIIvn-6EDQKvciYVCnQEtCLZ_Yq8Ibj_pPlKmanDTyYq-gwNOCmK8g0owpAbv84RAFnq4djP0laPKVJSlSYke9EJtXq1Qr5GcDC'
    },
    {
      id: 10,
      name: 'Natural Dhoop and Loban set',
      price: 499,
      originalPrice: 799,
      image: 'https://www.shahfragrances.com/wp-content/uploads/2020/02/1200x800-Loban.jpg'
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Featured Products Section */}
      <section className="py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Featured product
            </h2>
          </div>

          {/* Products Grid - Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max lg:min-w-full lg:grid lg:grid-cols-5">
              {featuredProducts.map((product) => (
                <div key={product.id} className="w-48 lg:w-auto flex-shrink-0 lg:flex-shrink">
                  <ItemCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-8">
        <CTA />
      </section>

      {/* Just Arrived Section */}
      <section className="py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Just arrived
            </h2>
          </div>

          {/* Products Grid - Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max lg:min-w-full lg:grid lg:grid-cols-5">
              {justArrivedProducts.map((product) => (
                <div key={product.id} className="w-48 lg:w-auto flex-shrink-0 lg:flex-shrink">
                  <ItemCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CTAproducts
